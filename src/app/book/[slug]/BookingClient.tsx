'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, Minus, Plus, ShieldCheck, UsersRound } from 'lucide-react';
import { useAuth } from '@/lib/use-auth';
import { useCatalog } from '@/lib/catalog-context';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency } from '@/lib/utils';

export default function BookingClient({ slug }: { slug: string }) {
  const router = useRouter();
  const { configured, user, loading } = useAuth('member');
  const { trips } = useCatalog();
  const trip = useMemo(() => trips.find((item) => item.slug === slug), [trips, slug]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('08:00');
  const [pax, setPax] = useState(1);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [minimumDate, setMinimumDate] = useState('');

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const tomorrow = new Date(Date.now() + 86_400_000);
      setMinimumDate(new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(tomorrow));
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  if (loading) return <div className="min-h-screen animate-pulse bg-neutral-100" />;
  if (!trip) return <main className="flex min-h-screen items-center justify-center bg-neutral-50 p-6"><div className="text-center"><h1 className="font-display text-3xl font-bold">Trip tidak ditemukan</h1><Link href="/#trips" className="btn-primary mt-6">Kembali ke trip</Link></div></main>;

  const total = trip.price * pax;
  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured || !user || !trip) {
      setError('Hubungkan Supabase dan masuk sebagai member untuk membuat booking.');
      return;
    }

    setSubmitting(true);
    setError('');
    const qrToken = `RH-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const { error: insertError } = await createClient().from('bookings').insert({
      user_id: user.id,
      trip_id: trip.id,
      booking_date: date,
      time_slot: time,
      pax_count: pax,
      total_price: total,
      status: 'pending',
      qr_code_token: qrToken,
      special_requests: notes || null,
    });
    setSubmitting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#f2f0e8] p-4 sm:p-7 lg:p-10">
      <div className="mx-auto max-w-6xl">
        <Link href={`/trips/${slug}`} className="inline-flex items-center gap-2 text-xs font-bold text-brand-600"><ArrowLeft className="h-4 w-4" /> Kembali ke detail trip</Link>
        <div className="mt-7 grid overflow-hidden rounded-[1.75rem] border border-brand-900/10 bg-white shadow-[0_24px_80px_rgba(22,38,31,.1)] lg:grid-cols-[.85fr_1.15fr]">
          <section className="relative min-h-[360px] bg-brand-950 lg:min-h-[720px]">
            <Image src={trip.cover_image_url || '/images/hero-banner.png'} alt={trip.title} fill priority sizes="(max-width: 1023px) 100vw, 42vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
              <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-accent-300">Booking member</p>
              <h1 className="mt-3 font-display text-4xl font-bold">{trip.title}</h1>
              <p className="mt-3 text-sm leading-6 text-white/60">{trip.short_description}</p>
              <div className="mt-6 flex flex-wrap gap-4 text-xs text-white/70"><span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-accent-300" />{trip.duration_minutes} menit</span><span className="flex items-center gap-2"><UsersRound className="h-4 w-4 text-accent-300" />Maks. {trip.max_capacity} orang</span></div>
            </div>
          </section>

          <section className="p-6 sm:p-9 lg:p-12">
            <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-brand-600">Secure reservation</p>
            <h2 className="mt-2 font-display text-3xl font-bold">Atur jadwal berkudamu</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-500">Booking tercatat di akun member dan akan dikonfirmasi oleh tim operasional.</p>

            {!configured && <div className="mt-6 rounded-xl border border-accent-500/30 bg-accent-100/60 p-4 text-xs leading-5 text-brand-800">Mode preview aktif. Konfigurasikan Supabase untuk mengaktifkan pemesanan.</div>}
            {error && <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">{error}</div>}

            <form onSubmit={submitBooking} className="mt-8 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label htmlFor="booking-date" className="form-label">Tanggal</label><div className="relative"><CalendarDays className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" /><input id="booking-date" type="date" className="form-input pl-10" min={minimumDate} value={date} onChange={(event) => setDate(event.target.value)} required /></div></div>
                <div><label htmlFor="booking-time" className="form-label">Waktu</label><select id="booking-time" className="form-select" value={time} onChange={(event) => setTime(event.target.value)}><option value="08:00">08:00 WIB</option><option value="10:00">10:00 WIB</option><option value="14:00">14:00 WIB</option><option value="16:00">16:00 WIB</option></select></div>
              </div>
              <div><label className="form-label">Jumlah rider</label><div className="flex items-center justify-between rounded-xl border border-neutral-200 p-2"><button type="button" onClick={() => setPax((value) => Math.max(1, value - 1))} className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100" aria-label="Kurangi rider"><Minus className="h-4 w-4" /></button><span className="font-display text-2xl font-bold">{pax}</span><button type="button" onClick={() => setPax((value) => Math.min(trip.max_capacity, value + 1))} className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-900 text-white" aria-label="Tambah rider"><Plus className="h-4 w-4" /></button></div></div>
              <div><label htmlFor="booking-notes" className="form-label">Permintaan khusus</label><textarea id="booking-notes" rows={3} className="form-input resize-none" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Contoh: rider pemula, perayaan ulang tahun..." /></div>

              <div className="rounded-2xl bg-neutral-100 p-5"><div className="flex items-center justify-between text-sm text-neutral-500"><span>{formatCurrency(trip.price)} × {pax} rider</span><span>{formatCurrency(total)}</span></div><div className="mt-4 flex items-end justify-between border-t border-neutral-200 pt-4"><span className="text-sm font-bold">Total</span><span className="font-display text-2xl font-bold text-brand-800">{formatCurrency(total)}</span></div></div>

              <button type="submit" disabled={submitting || !configured} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50">{submitting ? 'Menyimpan booking...' : 'Konfirmasi Booking'} <CheckCircle2 className="h-4 w-4" /></button>
              <p className="flex items-center justify-center gap-2 text-[0.64rem] text-neutral-400"><ShieldCheck className="h-3.5 w-3.5" /> Hanya akun member terverifikasi yang dapat melakukan booking.</p>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
