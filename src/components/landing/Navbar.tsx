'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Globe2, Menu, Trees, X } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

export default function Navbar() {
  const { t, locale, setLocale } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: t.nav.home, href: '/#home' },
    { label: t.nav.about, href: '/#about' },
    { label: t.nav.services, href: '/#services' },
    { label: t.nav.trips, href: '/#trips' },
    { label: t.nav.articles, href: '/articles' },
    { label: t.nav.contact, href: '/#contact' },
  ];

  return (
    <nav
      aria-label={locale === 'id' ? 'Navigasi utama' : 'Main navigation'}
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        isScrolled
          ? 'border-white/10 bg-brand-950/95 shadow-[0_12px_40px_rgba(6,18,14,.18)] backdrop-blur-xl'
          : 'border-white/5 bg-brand-950'
      }`}
    >
      <div className="container-main flex h-[72px] items-center justify-between">
        <Link href="/" className="group flex items-center gap-3" aria-label="Rider Horse Banyuwangi">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-accent-400/35 bg-accent-400/10 text-accent-300 transition-transform group-hover:rotate-6">
            <Trees className="h-[18px] w-[18px]" strokeWidth={1.7} />
          </span>
          <span className="leading-none">
            <span className="block font-display text-[1.05rem] font-bold text-white">Rider Horse</span>
            <span className="mt-1 block text-[0.58rem] font-bold uppercase tracking-[0.22em] text-accent-300">Banyuwangi</span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-xs font-semibold text-white/70 transition-colors hover:text-accent-300">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center rounded-full border border-white/15 p-1 sm:flex">
            <Globe2 className="ml-1.5 h-3.5 w-3.5 text-white/55" strokeWidth={1.8} />
            {(['id', 'en'] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setLocale(item)}
                className={`rounded-full px-2.5 py-1 text-[0.62rem] font-extrabold uppercase transition-colors ${
                  locale === item ? 'bg-white text-brand-950' : 'text-white/55 hover:text-white'
                }`}
                aria-pressed={locale === item}
              >
                {item}
              </button>
            ))}
          </div>

          <Link href="/dashboard/trips" className="btn-primary btn-sm hidden md:inline-flex">
            {t.nav.bookTrip}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          <Link href="/login" className="hidden text-xs font-bold text-white/65 transition-colors hover:text-accent-300 lg:inline-flex">
            {t.nav.signIn}
          </Link>

          <button
            type="button"
            onClick={() => setIsMobileOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white lg:hidden"
            aria-expanded={isMobileOpen}
            aria-controls="mobile-navigation"
            aria-label={isMobileOpen ? (locale === 'id' ? 'Tutup menu' : 'Close menu') : (locale === 'id' ? 'Buka menu' : 'Open menu')}
          >
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-navigation"
        className={`overflow-hidden border-t border-white/10 bg-brand-950 transition-[max-height,opacity] duration-300 lg:hidden ${
          isMobileOpen ? 'max-h-[560px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="container-main space-y-1 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm font-semibold text-white/75 hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 pt-4 sm:hidden">
            <div className="flex gap-1">
              {(['id', 'en'] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setLocale(item)}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase ${locale === item ? 'bg-white text-brand-950' : 'text-white/55'}`}
                >
                  {item}
                </button>
              ))}
            </div>
            <Link href="/login" onClick={() => setIsMobileOpen(false)} className="text-xs font-bold text-accent-300">
              {t.nav.signIn} →
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
