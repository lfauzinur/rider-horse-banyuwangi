'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarCheck2, Clock3, Plus, QrCode, Trash2, UsersRound, WalletCards } from 'lucide-react';
import MemberAreaShell from '@/components/app/MemberAreaShell';
import { useAuth } from '@/lib/use-auth';
import { createClient } from '@/lib/supabase/client';
import { readLocalBookings } from '@/lib/member-bookings';
import { cancelMemberBookingRecord, expireStaleBookingRecords } from '@/lib/operations';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/context';
import { localizeTrip } from '@/lib/localized-content';
import type { Booking } from '@/types';

const statuses = ['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const;

export default function MemberBookingsClient() {
  const { configured, user } = useAuth('member');
  const { locale } = useLanguage();
  const l = (id: string, en: string) => locale === 'id' ? id : en;
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [status, setStatus] = useState<(typeof statuses)[number]>('all');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    try {
      await expireStaleBookingRecords();
    } catch {
      // The scheduled database job remains the source of truth if this refresh fails.
    }
    if (!configured) return setBookings(readLocalBookings());
    if (!user) return;
    const { data } = await createClient().from('bookings').select('*, trip:trips(*)').eq('user_id', user.id).order('created_at', { ascending: false });
    if (data) setBookings(data as Booking[]);
  }, [configured, user]);

  async function cancelBooking(booking: Booking) {
    if (!window.confirm(l('Batalkan booking ini? Tindakan ini tidak dapat dibatalkan.', 'Cancel this booking? This action cannot be undone.'))) return;
    setBusyId(booking.id);
    setNotice('');
    try {
      await cancelMemberBookingRecord(booking.id);
      await load();
      setNotice(l('Booking berhasil dibatalkan.', 'Booking cancelled successfully.'));
      setStatus('cancelled');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : l('Booking gagal dibatalkan.', 'Could not cancel the booking.'));
    } finally {
      setBusyId(null);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    window.addEventListener('rider-bookings-updated', load);
    window.addEventListener('rider-operations-updated', load);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('rider-bookings-updated', load);
      window.removeEventListener('rider-operations-updated', load);
    };
  }, [load]);

  const visible = useMemo(() => status === 'all' ? bookings : bookings.filter((booking) => booking.status === status), [bookings, status]);
  const statusLabel = (value: string) => ({
    all: l('Semua', 'All'), pending: l('Menunggu', 'Pending'), confirmed: l('Dikonfirmasi', 'Confirmed'), completed: l('Selesai', 'Completed'), cancelled: l('Dibatalkan', 'Cancelled'),
  }[value] || value);

  return (
    <MemberAreaShell>
      <section className="flex flex-col gap-5 rounded-[1.75rem] bg-brand-950 p-6 text-white sm:p-8 lg:flex-row lg:items-end lg:justify-between">
        <div><p className="text-[.62rem] font-extrabold uppercase tracking-[.17em] text-accent-300">Your reservations</p><h1 className="mt-3 font-display text-3xl font-bold sm:text-5xl">{l('Booking saya.', 'My bookings.')}</h1><p className="mt-3 max-w-xl text-sm leading-7 text-white/55">{l('Pantau status, pembayaran, jadwal, dan tiket digital.', 'Track status, payments, schedules, and digital tickets.')}</p></div>
        <Link href="/dashboard/trips" className="btn-primary shrink-0">{l('Booking baru', 'New booking')} <Plus className="h-4 w-4" /></Link>
      </section>
      <div className="mt-5 flex gap-2 overflow-x-auto pb-2">{statuses.map((item) => <button key={item} onClick={() => setStatus(item)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold capitalize ${status === item ? 'bg-accent-400 text-brand-950' : 'border border-brand-900/10 bg-white text-brand-700'}`}>{statusLabel(item)}</button>)}</div>
      {notice && <div role="status" className="mt-3 rounded-xl border border-brand-900/10 bg-white px-4 py-3 text-xs font-bold text-brand-800">{notice}</div>}
      <section className="mt-5 space-y-4">
        {visible.map((booking) => {
          const trip = booking.trip ? localizeTrip(booking.trip, locale) : undefined;
          return <article key={booking.id} className="overflow-hidden rounded-[1.5rem] border border-brand-900/8 bg-white sm:grid sm:grid-cols-[220px_1fr]">
            <div className="relative min-h-48"><Image src={trip?.cover_image_url || '/images/hero-banner.png'} alt={trip?.title || 'Riding trip'} fill sizes="(max-width:640px) 100vw, 220px" className="object-cover" /></div>
            <div className="p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-[.58rem] font-extrabold uppercase tracking-wider text-brand-600">{booking.qr_code_token || booking.id.slice(0, 8)}</p><h2 className="mt-1 font-display text-2xl font-bold">{trip?.title || 'Riding Trip'}</h2></div><span className={`rounded-full px-3 py-1.5 text-[.6rem] font-extrabold uppercase ${booking.status === 'cancelled' ? 'bg-red-50 text-red-600' : 'bg-brand-100 text-brand-700'}`}>{statusLabel(booking.status)}</span></div>
              <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4"><Meta icon={CalendarCheck2} label={l('Tanggal', 'Date')} value={formatDate(booking.booking_date, locale)} compact /><Meta icon={Clock3} label={l('Waktu', 'Time')} value={`${booking.time_slot} WIB`} /><Meta icon={UsersRound} label="Rider" value={`${booking.pax_count} ${l('orang', 'people')}`} /><Meta icon={WalletCards} label={l('Sisa', 'Balance')} value={formatCurrency(booking.outstanding_amount || 0)} /></div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">{booking.special_requests ? <p className="rounded-xl bg-neutral-100 p-3 text-xs text-neutral-500">{l('Catatan', 'Notes')}: {booking.special_requests}</p> : <span />}<div className="flex flex-wrap gap-2">{booking.status === 'pending' && <button type="button" disabled={busyId === booking.id} onClick={() => void cancelBooking(booking)} className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-700 disabled:opacity-50"><Trash2 className="h-4 w-4" />{busyId === booking.id ? l('Membatalkan…', 'Cancelling…') : l('Batalkan', 'Cancel')}</button>}<Link href={`/dashboard/tickets/${booking.id}`} className="inline-flex items-center gap-2 rounded-full bg-brand-950 px-4 py-2.5 text-xs font-bold text-white"><QrCode className="h-4 w-4" />{l('Lihat Tiket', 'View Ticket')}</Link></div></div>
              {booking.status === 'pending' && <p className="mt-3 text-[.66rem] leading-5 text-neutral-400">{l('Booking akan dibatalkan otomatis jika belum dikonfirmasi admin dalam 24 jam.', 'This booking will be cancelled automatically if the admin has not confirmed it within 24 hours.')}</p>}
            </div>
          </article>;
        })}
        {!visible.length && <div className="rounded-3xl bg-white p-10 text-center"><CalendarCheck2 className="mx-auto h-8 w-8 text-brand-500" /><h2 className="mt-4 font-display text-2xl font-bold">{l('Belum ada booking.', 'No bookings yet.')}</h2><Link href="/dashboard/trips" className="btn-primary mt-6">{l('Pilih trip', 'Choose a trip')}</Link></div>}
      </section>
    </MemberAreaShell>
  );
}

function Meta({ icon: Icon, label, value, compact = false }: { icon: typeof CalendarCheck2; label: string; value: string; compact?: boolean }) {
  return <div className="min-w-0 rounded-xl bg-[#f5f3ec] p-3"><Icon className="h-4 w-4 text-brand-600" /><p className="mt-2 text-[.55rem] font-bold uppercase tracking-wider text-neutral-400">{label}</p><p className={`mt-1 font-extrabold leading-5 text-brand-900 ${compact ? 'text-[.62rem] xl:whitespace-nowrap' : 'text-[.68rem]'}`}>{value}</p></div>;
}
