import type { Locale } from '@/lib/i18n/translations';
import type { Article } from '@/types';

export function localizeArticle(article: Article, locale: Locale): Article {
  if (locale !== 'en') return article;

  return {
    ...article,
    title: article.title_en?.trim() || article.title,
    excerpt: article.excerpt_en?.trim() || article.excerpt,
    content: article.content_en?.trim() || article.content,
  };
}
