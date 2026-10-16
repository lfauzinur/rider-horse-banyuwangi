'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Clock, Users, ArrowRight } from 'lucide-react';
import { mockTrips } from '@/lib/mock-data';
import { formatCurrency, getDifficultyColor, getCategoryLabel } from '@/lib/utils';
import type { Trip } from '@/types';
import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/context';

const categoryKeys = [
  'all',
  'beach_ride',
  'forest_trail',
  'sunset_ride',
  'mountain_trail',
  'private_lesson',
  'group_class',
] as const;

const categoryLabelsId: Record<string, string> = {
  all: 'Semua Trip',
  beach_ride: 'Pantai',
  forest_trail: 'Hutan',
  sunset_ride: 'Sunset',
  mountain_trail: 'Gunung',
  private_lesson: 'Privat',
  group_class: 'Kelompok',
};

const categoryLabelsEn: Record<string, string> = {
  all: 'All Trips',
  beach_ride: 'Beach',
  forest_trail: 'Forest',
  sunset_ride: 'Sunset',
  mountain_trail: 'Mountain',
  private_lesson: 'Private',
  group_class: 'Group',
};

function TripCard({ trip }: { trip: Trip }) {
  const { t, locale } = useLanguage();

  const difficultyClass =
    trip.difficulty_level === 'Easy'
      ? 'badge-easy'
      : trip.difficulty_level === 'Moderate'
      ? 'badge-moderate'
      : 'badge-challenging';

  const durationLabel =
    trip.duration_minutes >= 60
      ? `${Math.floor(trip.duration_minutes / 60)}h${trip.duration_minutes % 60 > 0 ? ` ${trip.duration_minutes % 60}m` : ''}`
      : `${trip.duration_minutes}m`;

  return (
    <div className="card group flex flex-col bg-white">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={trip.cover_image_url || '/images/hero-banner.png'}
          alt={trip.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="img-overlay" />

        {/* Category label */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 text-xs font-semibold text-white rounded"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
            {getCategoryLabel(trip.category)}
          </span>
        </div>

        {/* Difficulty */}
        <div className="absolute top-3 right-3">
          <span className={`badge ${difficultyClass}`}>{trip.difficulty_level}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-bold text-neutral-900 mb-2 group-hover:text-brand-700 transition-colors leading-snug">
          {trip.title}
        </h3>
        <p className="text-xs text-neutral-500 leading-relaxed mb-3 flex-1 line-clamp-2">
          {trip.short_description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-neutral-500 mb-4 pb-4 border-b border-neutral-100">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            {durationLabel}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-neutral-400" />
            {t.trips.maxCapacity} {trip.max_capacity} {t.trips.pax}
          </span>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-neutral-400 mb-0.5">{t.trips.startFrom}</p>
            <p className="text-lg font-black text-brand-700" style={{ fontFamily: 'var(--font-display)' }}>
              {formatCurrency(trip.price)}
              <span className="text-xs font-normal text-neutral-400">{t.trips.perPax}</span>
            </p>
          </div>
          <Link
            href={`/trips/${trip.slug}`}
            className="btn-primary btn-sm flex items-center gap-1.5"
          >
            {t.trips.bookNow}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Trips() {
  const { t, locale } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');

  const categoryLabels = locale === 'id' ? categoryLabelsId : categoryLabelsEn;

  const filteredTrips =
    activeCategory === 'all' ? mockTrips : mockTrips.filter((trip) => trip.category === activeCategory);

  return (
    <section id="trips" className="py-20 lg:py-28 bg-white">
      <div className="container-main">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="section-badge justify-center">{t.trips.badge}</span>
          <h2
            className="mt-4 mb-4"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              fontWeight: 900,
              lineHeight: 1.15,
              color: '#1a1a14',
            }}
          >
            {t.trips.headline}
          </h2>
          <p className="text-neutral-500 text-base max-w-xl mx-auto leading-relaxed">
            {t.trips.description}
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categoryKeys.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-brand-700 text-white border-brand-700'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:border-brand-400 hover:text-brand-700'
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>

        {filteredTrips.length === 0 && (
          <div className="text-center py-16">
            <p className="text-neutral-500">{t.trips.noTrips}</p>
          </div>
        )}

        {filteredTrips.length > 0 && (
          <div className="text-center mt-12">
            <Link href="/trips" className="btn-outline-brand inline-flex items-center gap-2">
              {t.trips.viewAll}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
