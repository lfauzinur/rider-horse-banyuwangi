import { mockTrips } from '@/lib/mock-data';
import type { Metadata } from 'next';
import TripDetailClient from './TripDetailClient';
import { createClient } from '@supabase/supabase-js';

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
  let trip = mockTrips.find((t) => t.slug === slug) || null;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      { auth: { persistSession: false } }
    );
    const { data } = await supabase.from('trips').select('*').eq('slug', slug).eq('is_active', true).maybeSingle();
    if (data) trip = data;
  }

  return <TripDetailClient trip={trip} />;
}
