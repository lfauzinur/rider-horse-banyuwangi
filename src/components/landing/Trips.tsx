'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Clock3, MapPinned, UsersRound } from 'lucide-react';
import { formatCurrency, getCategoryLabel } from '@/lib/utils';
import type { Trip } from '@/types';
import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/context';
import { useCatalog } from '@/lib/catalog-context';
import { localizeTrip } from '@/lib/localized-content';

const categoryKeys = ['all', 'beach_ride', 'forest_trail', 'sunset_ride', 'mountain_trail', 'private_lesson', 'group_class'] as const;

const categoryLabels = {
  id: { all: 'Semua', beach_ride: 'Pantai', forest_trail: 'Hutan', sunset_ride: 'Sunset', mountain_trail: 'Gunung', private_lesson: 'Privat', group_class: 'Kelompok' },
  en: { all: 'All', beach_ride: 'Beach', forest_trail: 'Forest', sunset_ride: 'Sunset', mountain_trail: 'Mountain', private_lesson: 'Private', group_class: 'Group' },
};

function TripCard({ trip, featured = false }: { trip: Trip; featured?: boolean }) {
  const { t, locale } = useLanguage();
  const localizedTrip = localizeTrip(trip, locale);
  const duration = trip.duration_minutes >= 60
    ? `${Math.floor(trip.duration_minutes / 60)} ${locale === 'id' ? 'jam' : 'hr'}${trip.duration_minutes % 60 ? ` ${trip.duration_minutes % 60}m` : ''}`
    : `${trip.duration_minutes}m`;

  return (
    <article className={`card group flex h-full flex-col bg-neutral-50 ${featured ? 'md:col-span-2 lg:col-span-1' : ''}`}>
      <Link href={`/trips/${trip.slug}`} className="relative block h-60 overflow-hidden sm:h-64">
        <Image
          src={trip.cover_image_url || '/images/hero-banner.png'}
          alt={localizedTrip.title}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="img-overlay" />
        <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-2">
          <span className="rounded-full border border-white/20 bg-brand-950/55 px-3 py-1.5 text-[0.62rem] font-bold uppercase tracking-[0.08em] text-white backdrop-blur-md">
            {getCategoryLabel(trip.category)}
          </span>
          <span className="badge badge-easy">{trip.difficulty_level}</span>
        </div>
        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-[0.66rem] font-semibold text-white/75">
          <MapPinned className="h-3.5 w-3.5 text-accent-300" strokeWidth={1.7} />
          Banyuwangi, East Java
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-display text-[1.45rem] font-bold leading-tight text-brand-950">
          <Link href={`/trips/${trip.slug}`} className="transition-colors hover:text-brand-600">{localizedTrip.title}</Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-neutral-500">{localizedTrip.short_description}</p>

        <div className="mt-5 flex items-center gap-4 border-y border-brand-900/8 py-3 text-[0.68rem] font-semibold text-neutral-500">
          <span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5 text-brand-600" />{duration}</span>
          <span className="flex items-center gap-1.5"><UsersRound className="h-3.5 w-3.5 text-brand-600" />{trip.max_capacity} {t.trips.pax}</span>
        </div>

        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.1em] text-neutral-400">{t.trips.startFrom}</p>
            <p className="mt-1 font-display text-xl font-bold text-brand-800">{formatCurrency(trip.price)}</p>
          </div>
          <Link href={`/trips/${trip.slug}`} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-900 text-white transition-transform hover:-translate-y-1" aria-label={`${t.trips.bookNow}: ${localizedTrip.title}`}>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function Trips() {
  const { t, locale, siteContent } = useLanguage();
  const { trips } = useCatalog();
  const [activeCategory, setActiveCategory] = useState<(typeof categoryKeys)[number]>('all');
  const filteredTrips = activeCategory === 'all' ? trips : trips.filter((trip) => trip.category === activeCategory);

  if (siteContent['global.show_trips'] === 'false') return null;

  return (
    <section id="trips" className="section-shell bg-neutral-50">
      <div className="container-main">
        <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <span className="section-kicker">{t.trips.badge}</span>
            <h2 className="section-title">{t.trips.headline}</h2>
            <p className="section-copy mt-5 max-w-2xl">{t.trips.description}</p>
          </div>

          <div className="flex max-w-full gap-2 overflow-x-auto pb-2 lg:max-w-[570px]" aria-label={locale === 'id' ? 'Filter trip' : 'Trip filters'}>
            {categoryKeys.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                aria-pressed={activeCategory === category}
                className={`shrink-0 rounded-full border px-3.5 py-2 text-[0.68rem] font-bold transition-colors ${
                  activeCategory === category
                    ? 'border-brand-900 bg-brand-900 text-white'
                    : 'border-brand-900/15 bg-transparent text-brand-700 hover:border-brand-700'
                }`}
              >
                {categoryLabels[locale][category]}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredTrips.map((trip, index) => <TripCard key={trip.id} trip={trip} featured={index === 0} />)}
        </div>
      </div>
    </section>
  );
}
