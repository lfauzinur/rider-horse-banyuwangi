'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import ArticleCard from '@/components/articles/ArticleCard';
import { useCatalog } from '@/lib/catalog-context';
import { useLanguage } from '@/lib/i18n/context';

export default function Articles() {
  const { articles } = useCatalog();
  const { t, siteContent } = useLanguage();
  const visibleArticles = articles.filter((article) => article.is_published).slice(0, 3);

  if (visibleArticles.length === 0 || siteContent['global.show_articles'] === 'false') return null;

  return (
    <section id="articles" className="section-shell bg-neutral-50">
      <div className="container-main">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="section-kicker">{t.articles.badge}</span>
            <h2 className="section-title">{t.articles.headline}</h2>
          </div>
          <Link href="/articles" className="btn-secondary shrink-0">
            {t.articles.viewAll} <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {visibleArticles.map((article) => <ArticleCard key={article.id} article={article} />)}
        </div>
      </div>
    </section>
  );
}
