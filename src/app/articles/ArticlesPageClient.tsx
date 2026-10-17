'use client';

import ArticleCard from '@/components/articles/ArticleCard';
import Footer from '@/components/landing/Footer';
import Navbar from '@/components/landing/Navbar';
import { useCatalog } from '@/lib/catalog-context';

export default function ArticlesPageClient() {
  const { articles } = useCatalog();
  const published = articles.filter((article) => article.is_published);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-neutral-50">
        <header className="bg-brand-950 py-20 text-white sm:py-28">
          <div className="container-main">
            <span className="section-kicker !text-accent-300">Rider Journal</span>
            <h1 className="mt-5 max-w-3xl font-display text-5xl font-bold leading-[1.02] sm:text-7xl">Belajar, bertumbuh, dan berkuda lebih percaya diri.</h1>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/55">Panduan praktis, cerita perjalanan, serta pengetahuan tentang kuda dari instruktur dan tim lapangan kami.</p>
          </div>
        </header>

        <section className="section-shell">
          <div className="container-main">
            {published.length === 0 ? (
              <p className="rounded-2xl bg-white p-8 text-center text-sm text-neutral-500">Belum ada artikel yang diterbitkan.</p>
            ) : (
              <>
                <ArticleCard article={published[0]} featured />
                <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {published.slice(1).map((article) => <ArticleCard key={article.id} article={article} />)}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
