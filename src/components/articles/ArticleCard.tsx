'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, CalendarDays } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';
import { localizeArticle } from '@/lib/localized-content';
import type { Article } from '@/types';

function articleDate(value: string, locale: 'id' | 'en') {
  return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(new Date(value));
}

export default function ArticleCard({ article, featured = false, basePath = '/articles' }: { article: Article; featured?: boolean; basePath?: string }) {
  const { locale } = useLanguage();
  const localizedArticle = localizeArticle(article, locale);
  const href = `${basePath}/${article.slug}`;
  return (
    <article className={`group overflow-hidden rounded-[1.5rem] border border-brand-900/10 bg-white ${featured ? 'lg:grid lg:grid-cols-[1.08fr_.92fr]' : ''}`}>
      <Link href={href} className={`relative block overflow-hidden ${featured ? 'min-h-72 lg:min-h-[420px]' : 'h-56'}`}>
        <Image
          src={article.cover_image_url || '/images/hero-banner.png'}
          alt={localizedArticle.title}
          fill
          loading={featured ? 'eager' : 'lazy'}
          sizes={featured ? '(max-width: 1024px) 100vw, 55vw' : '(max-width: 768px) 100vw, 33vw'}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.035]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/35 to-transparent" />
      </Link>
      <div className={`flex flex-col ${featured ? 'justify-center p-7 sm:p-10' : 'p-5'}`}>
        <div className="flex flex-wrap items-center gap-3 text-[0.64rem] font-bold uppercase tracking-[0.12em] text-neutral-500">
          <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-brand-600" />{articleDate(article.published_at, locale)}</span>
          <span>{article.author}</span>
        </div>
        <h3 className={`mt-4 font-display font-bold leading-tight text-brand-950 ${featured ? 'text-3xl sm:text-4xl' : 'text-2xl'}`}>
          <Link href={href} className="transition-colors hover:text-brand-600">{localizedArticle.title}</Link>
        </h3>
        <p className="mt-4 text-sm leading-7 text-neutral-500">{localizedArticle.excerpt}</p>
        <Link href={href} className="mt-6 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.1em] text-brand-700">
          {locale === 'id' ? 'Baca artikel' : 'Read article'} <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
