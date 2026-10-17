'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { mockTrips, services as defaultServices, testimonials as defaultTestimonials } from '@/lib/mock-data';
import type { Article, ServiceItem, Trip } from '@/types';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { seededArticles } from '@/lib/article-data';

export interface ManagedService extends ServiceItem {
  id: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
}

export interface ManagedTestimonial {
  id: string;
  name: string;
  location: string;
  avatar: string | null;
  rating: number;
  text: string;
  textEn: string;
  trip: string;
  is_active: boolean;
  sort_order: number;
}

const serviceImages = ['/images/private-lesson.jpg', '/images/group-class.jpg', '/images/mountain-trail.jpg', '/images/sunset-ride.jpg'];

export const seededServices: ManagedService[] = defaultServices.map((service, index) => ({
  ...service,
  id: `service-${index + 1}`,
  image_url: serviceImages[index],
  is_active: true,
  sort_order: index,
}));

export const seededTestimonials: ManagedTestimonial[] = defaultTestimonials.map((item, index) => ({
  ...item,
  is_active: true,
  sort_order: index,
}));

interface CatalogContextValue {
  trips: Trip[];
  services: ManagedService[];
  testimonials: ManagedTestimonial[];
  articles: Article[];
  isLoading: boolean;
  refreshCatalog: () => Promise<void>;
}

const CatalogContext = createContext<CatalogContextValue>({
  trips: mockTrips,
  services: seededServices,
  testimonials: seededTestimonials,
  articles: seededArticles,
  isLoading: false,
  refreshCatalog: async () => {},
});

function mapService(row: Record<string, unknown>): ManagedService {
  return {
    id: String(row.id),
    icon: String(row.icon || 'sparkles'),
    title: String(row.title || ''),
    titleId: String(row.title_id || ''),
    description: String(row.description || ''),
    descriptionId: String(row.description_id || ''),
    features: Array.isArray(row.features) ? row.features.map(String) : [],
    featuresId: Array.isArray(row.features_id) ? row.features_id.map(String) : [],
    price: Number(row.price || 0),
    suitableFor: Array.isArray(row.suitable_for) ? row.suitable_for.map(String) : [],
    suitableForId: Array.isArray(row.suitable_for_id) ? row.suitable_for_id.map(String) : [],
    image_url: String(row.image_url || '/images/hero-banner.png'),
    is_active: Boolean(row.is_active),
    sort_order: Number(row.sort_order || 0),
  };
}

function mapTestimonial(row: Record<string, unknown>): ManagedTestimonial {
  return {
    id: String(row.id),
    name: String(row.name || ''),
    location: String(row.location || ''),
    avatar: row.avatar_url ? String(row.avatar_url) : null,
    rating: Number(row.rating || 5),
    text: String(row.text || ''),
    textEn: String(row.text_en || ''),
    trip: String(row.trip || ''),
    is_active: Boolean(row.is_active),
    sort_order: Number(row.sort_order || 0),
  };
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [trips, setTrips] = useState<Trip[]>(mockTrips);
  const [services, setServices] = useState<ManagedService[]>(seededServices);
  const [testimonials, setTestimonials] = useState<ManagedTestimonial[]>(seededTestimonials);
  const [articles, setArticles] = useState<Article[]>(seededArticles);
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured());

  const refreshCatalog = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      try {
        const local = window.localStorage.getItem('rider-horse-catalog');
        if (local) {
          const parsed = JSON.parse(local);
          if (parsed.trips) setTrips(parsed.trips);
          if (parsed.services) setServices(parsed.services);
          if (parsed.testimonials) setTestimonials(parsed.testimonials);
          if (parsed.articles) setArticles(parsed.articles);
        }
      } catch {
        // Keep bundled seed data for the local preview.
      }
      return;
    }
    setIsLoading(true);
    const supabase = createClient();
    const [tripResult, serviceResult, testimonialResult, articleResult] = await Promise.all([
      supabase.from('trips').select('*').eq('is_active', true).order('created_at'),
      supabase.from('services').select('*').eq('is_active', true).order('sort_order'),
      supabase.from('testimonials').select('*').eq('is_active', true).order('sort_order'),
      supabase.from('articles').select('*').eq('is_published', true).order('published_at', { ascending: false }),
    ]);

    if (tripResult.data?.length) setTrips(tripResult.data as Trip[]);
    if (serviceResult.data?.length) setServices(serviceResult.data.map((row) => mapService(row)));
    if (testimonialResult.data?.length) setTestimonials(testimonialResult.data.map((row) => mapTestimonial(row)));
    if (articleResult.data?.length) setArticles(articleResult.data as Article[]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => void refreshCatalog(), 0);
    const handleUpdate = () => void refreshCatalog();
    window.addEventListener('rider-catalog-updated', handleUpdate);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener('rider-catalog-updated', handleUpdate);
    };
  }, [refreshCatalog]);

  const value = useMemo(() => ({ trips, services, testimonials, articles, isLoading, refreshCatalog }), [trips, services, testimonials, articles, isLoading, refreshCatalog]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  return useContext(CatalogContext);
}
