'use client';

import ArticleCard from '@/components/articles/ArticleCard';
import MemberAreaShell from '@/components/app/MemberAreaShell';
import { useCatalog } from '@/lib/catalog-context';
import { useLanguage } from '@/lib/i18n/context';

export default function MemberArticlesClient() {
  const { articles, isLoading } = useCatalog();
  const { locale } = useLanguage();
  const published = articles.filter((article) => article.is_published);
  return <MemberAreaShell><section className="rounded-[1.75rem] bg-brand-950 p-6 text-white sm:p-8"><p className="text-[0.62rem] font-extrabold uppercase tracking-[0.17em] text-accent-300">Rider Journal</p><h1 className="mt-3 max-w-3xl font-display text-3xl font-bold sm:text-5xl">{locale === 'id' ? 'Pengetahuan untuk rider yang lebih percaya diri.' : 'Knowledge for a more confident rider.'}</h1><p className="mt-4 max-w-2xl text-sm leading-7 text-white/55">{locale === 'id' ? 'Panduan keselamatan, teknik berkuda, dan inspirasi perjalanan—tersedia langsung di aplikasi member.' : 'Safety guides, riding techniques, and trail inspiration—available directly in the member app.'}</p></section>{isLoading ? <div className="mt-6 h-96 animate-pulse rounded-3xl bg-white" /> : published.length === 0 ? <p className="mt-6 rounded-2xl bg-white p-8 text-center text-sm text-neutral-500">{locale === 'id' ? 'Belum ada artikel yang diterbitkan.' : 'No articles have been published yet.'}</p> : <section className="mt-6"><ArticleCard article={published[0]} featured basePath="/dashboard/articles" /><div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{published.slice(1).map((article) => <ArticleCard key={article.id} article={article} basePath="/dashboard/articles" />)}</div></section>}</MemberAreaShell>;
}
