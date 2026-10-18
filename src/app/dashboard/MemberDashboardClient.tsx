'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, CalendarCheck2, CheckCircle2, Clock3, CloudOff, Compass, Download, MapPin, ReceiptText, Smartphone, Sparkles, Wifi } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import DashboardShell from '@/components/app/DashboardShell';
import { useAuth } from '@/lib/use-auth';
import { useCatalog } from '@/lib/catalog-context';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency, formatDate } from '@/lib/utils';
import { previewBookings, readLocalBookings } from '@/lib/member-bookings';
import type { Booking } from '@/types';

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function MemberDashboardClient() {
  const { configured, user, profile, loading } = useAuth('member');
  const { trips } = useCatalog();
  const [bookings, setBookings] = useState<Booking[]>(configured ? [] : previewBookings);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [online, setOnline] = useState(true);
  const [installHelp, setInstallHelp] = useState('');

  const loadBookings = useCallback(async () => {
    if (!configured || !user) return;
    const { data } = await createClient().from('bookings').select('*, trip:trips(*)').eq('user_id', user.id).order('booking_date', { ascending: false });
    if (data) setBookings(data as Booking[]);
  }, [configured, user]);

  useEffect(() => {
    const load = () => configured ? void loadBookings() : setBookings(readLocalBookings());
    const timeout = window.setTimeout(load, 0);
    window.addEventListener('rider-bookings-updated', load);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener('rider-bookings-updated', load);
    };
  }, [configured, loadBookings]);

  useEffect(() => {
    const capturePrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', capturePrompt);
    const markInstalled = () => { setInstalled(true); setInstallPrompt(null); setInstallHelp(''); };
    const updateConnection = () => setOnline(navigator.onLine);
    const updatePwaStatus = (event: Event) => {
      const detail = (event as CustomEvent<{ offlineReady?: boolean }>).detail;
      if (detail?.offlineReady) setOfflineReady(true);
    };
    const timeout = window.setTimeout(() => {
      setOnline(navigator.onLine);
      setInstalled(window.matchMedia('(display-mode: standalone)').matches || Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
      if ('serviceWorker' in navigator) {
        setOfflineReady(Boolean(navigator.serviceWorker.controller));
        void navigator.serviceWorker.ready.then(() => setOfflineReady(true));
      }
    }, 0);
    window.addEventListener('appinstalled', markInstalled);
    window.addEventListener('online', updateConnection);
    window.addEventListener('offline', updateConnection);
    window.addEventListener('rider-pwa-status', updatePwaStatus);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener('beforeinstallprompt', capturePrompt);
      window.removeEventListener('appinstalled', markInstalled);
      window.removeEventListener('online', updateConnection);
      window.removeEventListener('offline', updateConnection);
      window.removeEventListener('rider-pwa-status', updatePwaStatus);
    };
  }, []);

  async function installApp() {
    if (installPrompt) {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === 'accepted') setInstalled(true);
      setInstallPrompt(null);
      return;
    }
    setInstallHelp('Gunakan menu browser lalu pilih “Install app” atau “Tambahkan ke Layar Utama”.');
  }

  const upcoming = useMemo(() => bookings.filter((booking) => ['pending', 'confirmed'].includes(booking.status)), [bookings]);
  const totalSpent = bookings.filter((booking) => booking.status !== 'cancelled').reduce((sum, booking) => sum + booking.total_price, 0);

  if (loading) return <div className="min-h-screen animate-pulse bg-[#f2f0e8]" />;

  const displayName = profile?.full_name || 'Demo Rider';
  const displayEmail = profile?.email || 'preview@riderhorse.id';

  return (
    <DashboardShell role="member" userName={displayName} userEmail={displayEmail}>
      {!configured && (
        <div className="mb-6 rounded-2xl border border-accent-500/30 bg-accent-100/55 p-4 text-xs leading-6 text-brand-800">
          <strong>Mode preview:</strong> hubungkan Supabase untuk mengaktifkan akun, sinkronisasi booking, dan akses lintas perangkat.
        </div>
      )}

      <section className="relative overflow-hidden rounded-[1.75rem] bg-brand-950 p-6 text-white sm:p-8">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent-400/10 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.17em] text-accent-300">Member experience</p>
            <h1 className="mt-3 max-w-xl font-display text-3xl font-bold leading-tight sm:text-5xl">Petualangan berikutnya menantimu.</h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/55">Pilih trip, pesan jadwal, dan pantau seluruh perjalananmu langsung dari satu aplikasi.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/trips" className="btn-primary">Pilih Trip <ArrowUpRight className="h-4 w-4" /></Link>
            <button type="button" onClick={() => void installApp()} disabled={installed} className="btn-outline !border-white/20 !text-white hover:!bg-white hover:!text-brand-950 disabled:cursor-default disabled:opacity-65">
              {installed ? <CheckCircle2 className="h-4 w-4" /> : <Download className="h-4 w-4" />} {installed ? 'App Terpasang' : 'Install App'}
            </button>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-[1.5rem] border border-brand-900/8 bg-white p-5 sm:p-6" aria-label="Status PWA">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-brand-700"><Smartphone className="h-5 w-5" /></span>
            <div><p className="font-display text-xl font-bold">Rider Horse PWA</p><p className="mt-1 text-xs leading-5 text-neutral-500">Dapat dipasang seperti aplikasi dan membuka halaman yang sudah tersimpan saat koneksi terputus.</p></div>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:min-w-[420px]">
            <PwaStatus icon={installed ? CheckCircle2 : Smartphone} label="Instalasi" value={installed ? 'Terpasang' : 'Siap install'} active={installed || Boolean(installPrompt)} />
            <PwaStatus icon={CheckCircle2} label="Offline cache" value={offlineReady ? 'Aktif' : 'Menyiapkan'} active={offlineReady} />
            <PwaStatus icon={online ? Wifi : CloudOff} label="Koneksi" value={online ? 'Online' : 'Offline'} active={online} />
          </div>
        </div>
        {installHelp && <p role="status" className="mt-4 rounded-xl bg-accent-100 px-4 py-3 text-xs font-semibold text-brand-800">{installHelp}</p>}
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Booking aktif', value: upcoming.length, icon: CalendarCheck2 },
          { label: 'Total perjalanan', value: bookings.length, icon: Compass },
          { label: 'Level rider', value: profile?.riding_level || 'Beginner', icon: Sparkles },
          { label: 'Total transaksi', value: formatCurrency(totalSpent), icon: ReceiptText },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-2xl border border-brand-900/8 bg-white p-5">
            <Icon className="h-5 w-5 text-brand-600" strokeWidth={1.7} />
            <p className="mt-5 text-2xl font-bold text-brand-950">{value}</p>
            <p className="mt-1 text-xs text-neutral-500">{label}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
        <div className="rounded-[1.5rem] border border-brand-900/8 bg-white p-5 sm:p-7">
          <div className="flex items-end justify-between gap-4">
            <div><p className="text-[0.62rem] font-extrabold uppercase tracking-[0.15em] text-brand-600">Your schedule</p><h2 className="mt-2 font-display text-2xl font-bold">Booking terbaru</h2></div>
            <Link href="/dashboard/trips" className="text-xs font-bold text-brand-600">Tambah booking →</Link>
          </div>
          <div className="mt-6 space-y-3">
            {bookings.length === 0 && <p className="rounded-xl bg-neutral-100 p-5 text-sm text-neutral-500">Belum ada booking. Pilih trip pertama kamu untuk memulai.</p>}
            {bookings.map((booking) => {
              const trip = booking.trip || trips.find((item) => item.id === booking.trip_id);
              return (
                <article key={booking.id} className="flex flex-col gap-4 rounded-2xl border border-brand-900/8 p-4 sm:flex-row sm:items-center">
                  <div className="relative h-24 w-full overflow-hidden rounded-xl sm:w-28">
                    <Image src={trip?.cover_image_url || '/images/hero-banner.png'} alt={trip?.title || 'Trip'} fill sizes="112px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2"><h3 className="font-display text-lg font-bold">{trip?.title || 'Riding Trip'}</h3><span className="rounded-full bg-brand-100 px-2.5 py-1 text-[0.58rem] font-extrabold uppercase text-brand-700">{booking.status}</span></div>
                    <div className="mt-2 flex flex-wrap gap-4 text-xs text-neutral-500"><span className="flex items-center gap-1.5"><CalendarCheck2 className="h-3.5 w-3.5" />{formatDate(booking.booking_date)}</span><span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />{booking.time_slot} WIB</span></div>
                  </div>
                  <p className="font-display text-lg font-bold text-brand-800">{formatCurrency(booking.total_price)}</p>
                </article>
              );
            })}
          </div>
        </div>

        <aside className="overflow-hidden rounded-[1.5rem] bg-brand-900 text-white">
          <div className="relative h-48"><Image src="/images/forest-trail.jpg" alt="Forest trail recommendation" fill sizes="(max-width: 1279px) 100vw, 35vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-brand-900 to-transparent" /></div>
          <div className="p-6"><div className="flex items-center gap-2 text-[0.62rem] font-extrabold uppercase tracking-[0.15em] text-accent-300"><MapPin className="h-3.5 w-3.5" /> Recommended</div><h2 className="mt-3 font-display text-2xl font-bold">Forest Mountain Trail</h2><p className="mt-3 text-xs leading-6 text-white/55">Naikkan levelmu dengan jalur hutan tropis dan panorama pegunungan Banyuwangi.</p><Link href="/dashboard/trips/forest-mountain-trail" className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-accent-300">Lihat trip <ArrowUpRight className="h-3.5 w-3.5" /></Link></div>
        </aside>
      </section>
    </DashboardShell>
  );
}

function PwaStatus({ icon: Icon, label, value, active }: { icon: LucideIcon; label: string; value: string; active: boolean }) {
  return <div className="rounded-xl bg-[#f5f3ec] p-3"><Icon className={`h-4 w-4 ${active ? 'text-brand-600' : 'text-neutral-400'}`} /><p className="mt-3 text-[0.56rem] font-extrabold uppercase tracking-[0.1em] text-neutral-400">{label}</p><p className="mt-1 text-[0.68rem] font-bold text-brand-900">{value}</p></div>;
}
