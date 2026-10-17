import type { Metadata } from 'next';
import ArticlesPageClient from './ArticlesPageClient';

export const metadata: Metadata = {
  title: 'Artikel Berkuda',
  description: 'Panduan, cerita, dan wawasan berkuda dari tim Rider Horse Banyuwangi.',
};

export default function ArticlesPage() {
  return <ArticlesPageClient />;
}
