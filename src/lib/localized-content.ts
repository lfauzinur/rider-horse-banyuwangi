import type { Locale } from '@/lib/i18n/translations';
import type { Article, Trip } from '@/types';

export function localizeArticle(article: Article, locale: Locale): Article {
  if (locale !== 'en') return article;

  return {
    ...article,
    title: article.title_en?.trim() || article.title,
    excerpt: article.excerpt_en?.trim() || article.excerpt,
    content: article.content_en?.trim() || article.content,
    author: article.author.replace(/^Tim\b/i, 'Team'),
  };
}

export function localizeTrip(trip: Trip, locale: Locale): Trip {
  if (locale !== 'en') return trip;

  return {
    ...trip,
    title: trip.title_en?.trim() || trip.title,
    description: trip.description_en?.trim() || trip.description,
    short_description: trip.short_description_en?.trim() || trip.short_description,
    highlights: trip.highlights_en?.filter(Boolean).length ? trip.highlights_en : trip.highlights,
  };
}
