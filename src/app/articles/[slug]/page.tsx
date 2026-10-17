import type { Metadata } from 'next';
import { seededArticles } from '@/lib/article-data';
import ArticleDetailClient from './ArticleDetailClient';

export const instant = false;

export function generateStaticParams() {
  return seededArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = seededArticles.find((item) => item.slug === slug);
  return {
    title: article?.title || 'Artikel Rider Horse',
    description: article?.excerpt || 'Artikel dan wawasan berkuda dari Rider Horse Banyuwangi.',
  };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ArticleDetailClient slug={slug} />;
}
