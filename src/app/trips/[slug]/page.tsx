import { mockTrips, defaultSiteContent } from '@/lib/mock-data';
import type { Metadata } from 'next';
import TripDetailClient from './TripDetailClient';

export const instant = false;

export async function generateStaticParams() {
  return mockTrips.map((trip) => ({ slug: trip.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const trip = mockTrips.find((t) => t.slug === slug);

  if (!trip) {
    return {
      title: 'Trip Tidak Ditemukan',
    };
  }

  return {
    title: trip.title,
    description: trip.short_description || trip.description || '',
  };
}

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trip = mockTrips.find((t) => t.slug === slug) || null;

  return <TripDetailClient trip={trip} whatsapp={defaultSiteContent.whatsapp_number} />;
}
