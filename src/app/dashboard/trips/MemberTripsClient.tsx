'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, Clock3, Search, SlidersHorizontal, UsersRound, X } from 'lucide-react';
import MemberAreaShell from '@/components/app/MemberAreaShell';
import { useCatalog } from '@/lib/catalog-context';
import { formatCurrency, getCategoryLabel } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/context';
import { localizeTrip } from '@/lib/localized-content';

const filters = ['all', 'Easy', 'Moderate', 'Challenging'] as const;

export default function MemberTripsClient() {
  const { trips, isLoading } = useCatalog();
  const { locale } = useLanguage();
  const l = (id: string, en: string) => locale === 'id' ? id : en;
  const [filter, setFilter] = useState<(typeof filters)[number]>('all');
  const [query, setQuery] = useState('');
  const [selectedService, setSelectedService] = useState<{ id: string; title: string; price: number } | null>(null);
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem('rider-horse-selected-service');
        if (stored) setSelectedService(JSON.parse(stored));
      } catch { /* Keep the trip catalog usable if stored data is invalid. */ }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);
  const visible = useMemo(() => trips.map((trip) => localizeTrip(trip, locale)).filter((trip) =>
    (filter === 'all' || trip.difficulty_level === filter) &&
    `${trip.title} ${trip.short_description || ''}`.toLowerCase().includes(query.toLowerCase())
  ), [filter, locale, query, trips]);

  return (
    <MemberAreaShell>
      <section className="rounded-[1.75rem] bg-brand-950 p-6 text-white sm:p-8">
        <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.17em] text-accent-300">Member trip catalog</p>
        <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div><h1 className="font-display text-3xl font-bold sm:text-5xl">{l('Pilih petualanganmu.', 'Choose your adventure.')}</h1><p className="mt-3 max-w-xl text-sm leading-7 text-white/55">{l('Lihat detail, tentukan trip, lalu pilih tanggal dan jadwal tanpa meninggalkan aplikasi member.', 'Review each trip, then choose a date and time without leaving the member app.')}</p></div>
          <div className="relative w-full max-w-md"><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full rounded-full border border-white/15 bg-white/8 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/35" placeholder={l('Cari trip...', 'Search trips...')} /></div>
        </div>
      </section>

      {selectedService && <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-brand-900/8 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-brand-600" /><div><p className="text-[0.58rem] font-extrabold uppercase tracking-wider text-neutral-400">{l('Layanan terpilih', 'Selected service')}</p><p className="mt-1 text-sm font-bold text-brand-900">{selectedService.title} · +{formatCurrency(selectedService.price)}</p></div></div><button type="button" onClick={() => { window.localStorage.removeItem('rider-horse-selected-service'); setSelectedService(null); }} className="flex items-center gap-2 text-xs font-bold text-neutral-500"><X className="h-3.5 w-3.5" />{l('Hapus pilihan', 'Remove selection')}</button></div>}

      <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-2"><SlidersHorizontal className="mr-1 h-4 w-4 shrink-0 text-brand-600" />{filters.map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold ${filter === item ? 'bg-accent-400 text-brand-950' : 'border border-brand-900/10 bg-white text-brand-700'}`}>{item === 'all' ? l('Semua', 'All') : item}</button>)}</div>

      {isLoading ? <div className="mt-6 h-96 animate-pulse rounded-3xl bg-white" /> : (
        <section className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((trip) => (
            <article key={trip.id} className="group overflow-hidden rounded-[1.5rem] border border-brand-900/8 bg-white">
              <Link href={`/dashboard/trips/${trip.slug}`} className="relative block h-56 overflow-hidden"><Image src={trip.cover_image_url || '/images/hero-banner.png'} alt={trip.title} fill sizes="(max-width: 767px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-brand-950/65 to-transparent" /><span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[0.6rem] font-extrabold uppercase text-brand-800">{getCategoryLabel(trip.category)}</span><p className="absolute bottom-4 left-4 font-display text-2xl font-bold text-white">{trip.title}</p></Link>
              <div className="p-5"><p className="line-clamp-2 text-xs leading-6 text-neutral-500">{trip.short_description}</p><div className="mt-4 flex gap-4 border-y border-brand-900/8 py-3 text-[0.68rem] font-semibold text-neutral-500"><span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5 text-brand-600" />{trip.duration_minutes} {l('menit', 'minutes')}</span><span className="flex items-center gap-1.5"><UsersRound className="h-3.5 w-3.5 text-brand-600" />{l('Maks.', 'Max.')} {trip.max_capacity}</span></div><div className="mt-5 flex items-end justify-between"><div><p className="text-[0.58rem] font-bold uppercase tracking-wider text-neutral-400">{l('Mulai dari', 'Starting from')}</p><p className="mt-1 font-display text-xl font-bold text-brand-800">{formatCurrency(trip.price)}</p></div><Link href={`/dashboard/trips/${trip.slug}`} className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-950 text-white" aria-label={`${l('Lihat', 'View')} ${trip.title}`}><ArrowUpRight className="h-4 w-4" /></Link></div></div>
            </article>
          ))}
          {visible.length === 0 && <p className="rounded-2xl bg-white p-8 text-sm text-neutral-500 md:col-span-2 xl:col-span-3">{l('Trip yang dicari belum tersedia.', 'The requested trip is not available yet.')}</p>}
        </section>
      )}
    </MemberAreaShell>
  );
}
