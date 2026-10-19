'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, CalendarCheck2, CheckCircle2, Clock3, ShieldCheck, UsersRound } from 'lucide-react';
import MemberAreaShell from '@/components/app/MemberAreaShell';
import { useCatalog } from '@/lib/catalog-context';
import { formatCurrency, getCategoryLabel } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/context';
import { localizeTrip } from '@/lib/localized-content';

export default function MemberTripDetailClient({ slug }: { slug: string }) {
  const { trips, isLoading } = useCatalog();
  const { locale } = useLanguage();
  const l = (id: string, en: string) => locale === 'id' ? id : en;
  const sourceTrip = trips.find((item) => item.slug === slug && item.is_active);
  const trip = sourceTrip ? localizeTrip(sourceTrip, locale) : undefined;

  return (
    <MemberAreaShell>
      {isLoading ? <div className="h-[70vh] animate-pulse rounded-3xl bg-white" /> : !trip ? (
        <div className="rounded-3xl bg-white p-10 text-center"><h1 className="font-display text-3xl font-bold">{l('Trip tidak ditemukan.', 'Trip not found.')}</h1><Link href="/dashboard/trips" className="btn-primary mt-6">{l('Kembali ke katalog', 'Back to catalogue')}</Link></div>
      ) : (
        <>
          <Link href="/dashboard/trips" className="mb-5 inline-flex items-center gap-2 text-xs font-bold text-brand-600"><ArrowLeft className="h-4 w-4" />{l('Semua trip', 'All trips')}</Link>
          <div className="overflow-hidden rounded-[1.75rem] border border-brand-900/8 bg-white">
            <div className="relative min-h-[330px] sm:min-h-[460px]"><Image src={trip.cover_image_url || '/images/hero-banner.png'} alt={trip.title} fill priority sizes="100vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/20 to-transparent" /><div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-9"><span className="rounded-full border border-white/20 bg-brand-950/55 px-3 py-1.5 text-[0.62rem] font-bold uppercase backdrop-blur">{getCategoryLabel(trip.category)}</span><h1 className="mt-4 max-w-3xl font-display text-4xl font-bold sm:text-6xl">{trip.title}</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">{trip.short_description}</p></div></div>
            <div className="grid gap-8 p-6 lg:grid-cols-[1fr_340px] lg:p-9">
              <div><div className="grid grid-cols-3 gap-3">{[[Clock3, l('Durasi', 'Duration'), `${trip.duration_minutes} ${l('menit', 'minutes')}`], [UsersRound, l('Kapasitas', 'Capacity'), `${trip.max_capacity} rider`], [ShieldCheck, 'Level', trip.difficulty_level]].map(([Icon, label, value]) => { const ItemIcon = Icon as typeof Clock3; return <div key={String(label)} className="rounded-2xl bg-[#f5f3ec] p-4"><ItemIcon className="h-4 w-4 text-brand-600" /><p className="mt-3 text-[0.58rem] font-bold uppercase tracking-wider text-neutral-400">{String(label)}</p><p className="mt-1 text-xs font-extrabold text-brand-900">{String(value)}</p></div>; })}</div><h2 className="mt-8 font-display text-2xl font-bold">{l('Tentang perjalanan', 'About this journey')}</h2><p className="mt-4 text-sm leading-7 text-neutral-600">{trip.description}</p>{trip.highlights && <div className="mt-8 grid gap-3 sm:grid-cols-2">{trip.highlights.map((item) => <div key={item} className="flex items-center gap-3 text-sm font-semibold text-brand-800"><CheckCircle2 className="h-4 w-4 shrink-0 text-accent-600" />{item}</div>)}</div>}</div>
              <aside className="h-fit rounded-2xl bg-brand-950 p-6 text-white lg:sticky lg:top-24"><p className="text-[0.6rem] font-extrabold uppercase tracking-wider text-white/45">{l('Mulai dari', 'Starting from')}</p><p className="mt-2 font-display text-3xl font-bold text-accent-300">{formatCurrency(trip.price)}</p><p className="mt-1 text-xs text-white/45">per rider</p><Link href={`/dashboard/book/${trip.slug}`} className="btn-primary mt-6 w-full justify-center">{l('Pilih jadwal', 'Choose a schedule')} <CalendarCheck2 className="h-4 w-4" /></Link><p className="mt-4 text-center text-[0.62rem] leading-5 text-white/40">{l('Booking dibuat dan dipantau sepenuhnya dari akun member Anda.', 'Your booking is created and tracked entirely from your member account.')}</p></aside>
            </div>
          </div>
        </>
      )}
    </MemberAreaShell>
  );
}
