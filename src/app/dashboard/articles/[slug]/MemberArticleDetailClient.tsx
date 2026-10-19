'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, CalendarDays, UserRound } from 'lucide-react';
import MemberAreaShell from '@/components/app/MemberAreaShell';
import { useCatalog } from '@/lib/catalog-context';
import { useLanguage } from '@/lib/i18n/context';
import { localizeArticle } from '@/lib/localized-content';

function displayDate(value: string, locale: 'id' | 'en') { return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' }).format(new Date(value)); }

export default function MemberArticleDetailClient({ slug }: { slug: string }) {
  const { articles, isLoading } = useCatalog();
  const { locale } = useLanguage();
  const article = articles.find((item) => item.slug === slug && item.is_published);
  const localizedArticle = article ? localizeArticle(article, locale) : null;
  return <MemberAreaShell>{isLoading ? <div className="h-[70vh] animate-pulse rounded-3xl bg-white" /> : !localizedArticle ? <div className="rounded-3xl bg-white p-10 text-center"><h1 className="font-display text-3xl font-bold">{locale === 'id' ? 'Artikel tidak ditemukan.' : 'Article not found.'}</h1><Link href="/dashboard/articles" className="btn-primary mt-6">{locale === 'id' ? 'Kembali ke artikel' : 'Back to articles'}</Link></div> : <article className="overflow-hidden rounded-[1.75rem] border border-brand-900/8 bg-white"><header className="bg-brand-950 p-6 text-white sm:p-10"><Link href="/dashboard/articles" className="inline-flex items-center gap-2 text-xs font-bold text-white/55"><ArrowLeft className="h-4 w-4" />{locale === 'id' ? 'Semua artikel' : 'All articles'}</Link><p className="mt-9 text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-accent-300">Rider Journal</p><h1 className="mt-4 max-w-4xl font-display text-4xl font-bold leading-tight sm:text-6xl">{localizedArticle.title}</h1><p className="mt-5 max-w-2xl text-sm leading-7 text-white/58">{localizedArticle.excerpt}</p><div className="mt-6 flex flex-wrap gap-5 text-xs text-white/45"><span className="flex items-center gap-2"><UserRound className="h-4 w-4 text-accent-300" />{localizedArticle.author}</span><span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-accent-300" />{displayDate(localizedArticle.published_at, locale)}</span></div></header><div className="relative aspect-[16/8]"><Image src={localizedArticle.cover_image_url || '/images/hero-banner.png'} alt={localizedArticle.title} fill priority sizes="100vw" className="object-cover" /></div><div className="mx-auto max-w-3xl p-6 sm:p-10"><div className="space-y-6 font-serif text-[1.04rem] leading-9 text-neutral-700">{localizedArticle.content.split(/\n\n+/).map((paragraph) => <p key={paragraph.slice(0, 48)}>{paragraph}</p>)}</div><div className="mt-10 rounded-2xl bg-accent-300 p-6"><h2 className="font-display text-2xl font-bold">{locale === 'id' ? 'Siap mempraktikkannya?' : 'Ready to put it into practice?'}</h2><p className="mt-2 text-sm text-brand-900/65">{locale === 'id' ? 'Pilih trip sesuai level dan atur jadwal langsung dari aplikasi.' : 'Choose a trip that matches your level and schedule it in the app.'}</p><Link href="/dashboard/trips" className="btn-secondary mt-5">{locale === 'id' ? 'Pilih trip' : 'Choose a trip'} <ArrowUpRight className="h-4 w-4" /></Link></div></div></article>}</MemberAreaShell>;
}
