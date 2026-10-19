'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Clock,
  Users,
  BarChart2,
  LogIn,
  CheckCircle,
  Calendar,
} from 'lucide-react';
import type { Trip } from '@/types';
import { formatCurrency, getCategoryLabel } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/context';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import { localizeTrip } from '@/lib/localized-content';

interface Props {
  trip: Trip | null;
}

export default function TripDetailClient({ trip }: Props) {
  const { t, locale } = useLanguage();

  if (!trip) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center" style={{ background: '#f8f6f0' }}>
          <div className="text-center">
            <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: '#f0f5ec' }}>
              <Calendar className="w-9 h-9" style={{ color: '#2e5f1e' }} />
            </div>
            <h1
              className="mb-3"
              style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: '#1a1a14' }}
            >
              {t.tripDetail.notFound}
            </h1>
            <p className="text-neutral-500 mb-6 text-sm">{locale === 'id' ? 'Trip yang kamu cari tidak tersedia.' : 'The trip you are looking for is unavailable.'}</p>
            <Link href="/#trips" className="btn-primary">
              {t.tripDetail.backBtn}
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const localizedTrip = localizeTrip(trip, locale);

  const difficultyClass =
    trip.difficulty_level === 'Easy'
      ? 'badge-easy'
      : trip.difficulty_level === 'Moderate'
      ? 'badge-moderate'
      : 'badge-challenging';

  const durationLabel =
    trip.duration_minutes >= 60
      ? `${Math.floor(trip.duration_minutes / 60)} ${t.tripDetail.hours}${
          trip.duration_minutes % 60 > 0 ? ` ${trip.duration_minutes % 60}m` : ''
        }`
      : `${trip.duration_minutes} ${t.tripDetail.minutes}`;

  const metaItems = [
    { icon: Clock, label: t.tripDetail.duration, value: durationLabel },
    { icon: Users, label: t.tripDetail.capacity, value: `${trip.max_capacity} ${t.tripDetail.pax}` },
    { icon: BarChart2, label: t.tripDetail.difficulty, value: trip.difficulty_level },
  ];

  return (
    <>
      <Navbar />
      <main style={{ background: '#f8f6f0' }}>
        {/* Hero image */}
        <div className="relative h-72 sm:h-96 lg:h-[480px] bg-neutral-200">
          <Image
            src={trip.cover_image_url || '/images/hero-banner.png'}
            alt={localizedTrip.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-neutral-900/30 to-transparent" />

          {/* Back button */}
          <div className="absolute top-6 left-0 right-0 container-main">
            <Link
              href="/#trips"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white transition-colors"
              style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)', borderRadius: '0.375rem', padding: '0.5rem 1rem' }}
            >
              <ArrowLeft className="w-4 h-4" />
              {t.tripDetail.back}
            </Link>
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-8 left-0 right-0 container-main">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`badge ${difficultyClass}`}>{trip.difficulty_level}</span>
              <span className="px-2 py-0.5 text-xs font-semibold text-white rounded" style={{ background: 'rgba(0,0,0,0.4)' }}>
                {getCategoryLabel(trip.category)}
              </span>
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1.1,
              }}
            >
              {localizedTrip.title}
            </h1>
          </div>
        </div>

        {/* Content */}
        <div className="container-main py-10">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Meta strip */}
              <div className="grid grid-cols-3 gap-4">
                {metaItems.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="card-flat p-4 text-center bg-white">
                    <Icon className="w-5 h-5 mx-auto mb-2" style={{ color: '#2e5f1e' }} />
                    <p className="text-xs text-neutral-400 mb-0.5 font-medium">{label}</p>
                    <p className="text-sm font-bold text-neutral-800">{value}</p>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl p-7 border border-neutral-200">
                <h2
                  className="mb-4"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#1a1a14',
                  }}
                >
                  {localizedTrip.title}
                </h2>
                <p className="text-neutral-600 leading-relaxed text-sm whitespace-pre-line">
                  {localizedTrip.description}
                </p>
              </div>

              {/* Highlights */}
              {localizedTrip.highlights && localizedTrip.highlights.length > 0 && (
                <div className="bg-white rounded-xl p-7 border border-neutral-200">
                  <h3
                    className="mb-5"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      color: '#1a1a14',
                    }}
                  >
                    {t.tripDetail.highlights}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {localizedTrip.highlights.map((h) => (
                      <div key={h} className="flex items-start gap-3">
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#2e5f1e' }} />
                        <span className="text-sm text-neutral-700">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Booking card */}
            <div className="lg:col-span-1">
              <div className="card-flat bg-white border border-neutral-200 p-7 sticky top-24">
                {/* Price */}
                <div className="mb-6 pb-6 border-b border-neutral-100">
                  <p className="text-xs text-neutral-400 font-medium mb-1">{t.tripDetail.startFrom}</p>
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '2rem',
                      fontWeight: 900,
                      color: '#2e5f1e',
                      lineHeight: 1,
                    }}
                  >
                    {formatCurrency(trip.price)}
                  </p>
                  <p className="text-xs text-neutral-400 mt-0.5">{t.tripDetail.perPax}</p>
                </div>

                {/* Quick info */}
                <div className="space-y-3 mb-6">
                  {metaItems.map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-neutral-500">
                        <Icon className="w-4 h-4" style={{ color: '#5a5950' }} />
                        {label}
                      </div>
                      <span className="font-semibold text-neutral-800">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Book CTA */}
                <div className="space-y-3">
                  <Link
                    href={`/dashboard/book/${trip.slug}`}
                    className="btn-primary w-full justify-center"
                    id="book-trip-btn"
                  >
                    {t.tripDetail.bookNow}
                  </Link>
                  <Link
                    href="/login"
                    className="btn-outline w-full justify-center flex items-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    {locale === 'id' ? 'Masuk sebagai Member' : 'Member Sign In'}
                  </Link>
                </div>

                <p className="text-xs text-neutral-400 text-center mt-4">
                  {locale === 'id' ? 'Booking hanya tersedia melalui akun member.' : 'Bookings are only available through a member account.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
