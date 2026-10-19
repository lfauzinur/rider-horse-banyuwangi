'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, CalendarDays, UserRound } from 'lucide-react';
import ArticleCard from '@/components/articles/ArticleCard';
import Footer from '@/components/landing/Footer';
import Navbar from '@/components/landing/Navbar';
import { useCatalog } from '@/lib/catalog-context';
import { useLanguage } from '@/lib/i18n/context';
import { localizeArticle } from '@/lib/localized-content';

function displayDate(value: string, locale: 'id' | 'en') {
  return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' }).format(new Date(value));
}

export default function ArticleDetailClient({ slug }: { slug: string }) {
  const { articles, isLoading } = useCatalog();
  const { locale } = useLanguage();
  const article = articles.find((item) => item.slug === slug && item.is_published);

  if (isLoading) return <><Navbar /><main className="min-h-[75vh] animate-pulse bg-neutral-100" /></>;

  if (!article) {
    return <><Navbar /><main className="flex min-h-[70vh] items-center justify-center bg-neutral-50 p-6 text-center"><div><p className="section-kicker">Rider Journal</p><h1 className="mt-4 font-display text-4xl font-bold">{locale === 'id' ? 'Artikel tidak ditemukan.' : 'Article not found.'}</h1><Link href="/articles" className="btn-primary mt-7">{locale === 'id' ? 'Lihat semua artikel' : 'View all articles'}</Link></div></main><Footer /></>;
  }

  const localizedArticle = localizeArticle(article, locale);
  const related = articles.filter((item) => item.is_published && item.id !== article.id).slice(0, 2);

  return (
    <>
      <Navbar />
      <main className="bg-neutral-50">
        <article>
          <header className="bg-brand-950 pb-20 pt-12 text-white sm:pb-28 sm:pt-20">
            <div className="container-main max-w-5xl">
              <Link href="/articles" className="inline-flex items-center gap-2 text-xs font-bold text-white/55 hover:text-accent-300"><ArrowLeft className="h-4 w-4" />{locale === 'id' ? 'Kembali ke artikel' : 'Back to articles'}</Link>
              <p className="mt-10 text-[0.64rem] font-extrabold uppercase tracking-[0.16em] text-accent-300">Rider Journal</p>
              <h1 className="mt-4 max-w-4xl font-display text-4xl font-bold leading-[1.06] sm:text-6xl">{localizedArticle.title}</h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/58">{localizedArticle.excerpt}</p>
              <div className="mt-7 flex flex-wrap gap-5 text-xs text-white/48"><span className="flex items-center gap-2"><UserRound className="h-4 w-4 text-accent-300" />{article.author}</span><span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-accent-300" />{displayDate(article.published_at, locale)}</span></div>
            </div>
          </header>

          <div className="container-main max-w-5xl -translate-y-10 sm:-translate-y-14">
            <div className="relative aspect-[16/8] overflow-hidden rounded-[1.5rem] shadow-2xl sm:rounded-[2rem]"><Image src={article.cover_image_url || '/images/hero-banner.png'} alt={localizedArticle.title} fill priority sizes="(max-width: 1024px) 100vw, 1000px" className="object-cover" /></div>
          </div>

          <div className="container-main max-w-3xl pb-20">
            <div className="space-y-6 font-serif text-[1.08rem] leading-9 text-neutral-700">
              {localizedArticle.content.split(/\n\n+/).map((paragraph) => <p key={paragraph.slice(0, 48)}>{paragraph}</p>)}
            </div>
            <div className="mt-12 rounded-2xl bg-accent-300 p-6 sm:flex sm:items-center sm:justify-between sm:gap-8"><div><p className="font-display text-2xl font-bold text-brand-950">{locale === 'id' ? 'Siap mempraktikkannya?' : 'Ready to put it into practice?'}</p><p className="mt-2 text-sm text-brand-900/65">{locale === 'id' ? 'Pilih program atau trip yang sesuai dengan levelmu.' : 'Choose a programme or trip that matches your level.'}</p></div><Link href="/#trips" className="btn-secondary mt-5 shrink-0 sm:mt-0">{locale === 'id' ? 'Lihat trip' : 'View trips'} <ArrowUpRight className="h-4 w-4" /></Link></div>
          </div>
        </article>

        {related.length > 0 && <section className="border-t border-brand-900/8 py-16"><div className="container-main"><div className="flex items-end justify-between"><div><span className="section-kicker">{locale === 'id' ? 'Bacaan selanjutnya' : 'Read next'}</span><h2 className="mt-4 font-display text-3xl font-bold">{locale === 'id' ? 'Artikel terkait' : 'Related articles'}</h2></div><Link href="/articles" className="hidden text-xs font-bold text-brand-700 sm:block">{locale === 'id' ? 'Semua artikel' : 'All articles'} →</Link></div><div className="mt-8 grid gap-5 md:grid-cols-2">{related.map((item) => <ArticleCard key={item.id} article={item} />)}</div></div></section>}
      </main>
      <Footer />
    </>
  );
}
