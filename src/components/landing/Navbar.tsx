'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Phone, Mail, Globe } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';
import { defaultSiteContent } from '@/lib/mock-data';

export default function Navbar() {
  const { t, locale, setLocale } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: t.nav.home, href: '#home' },
    { label: t.nav.about, href: '#about' },
    { label: t.nav.services, href: '#services' },
    { label: t.nav.trips, href: '#trips' },
    { label: t.nav.contact, href: '#contact' },
  ];

  return (
    <>
      {/* Top Contact Bar */}
      <div className="top-bar hidden md:block">
        <div className="container-main flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a
              href={`tel:${defaultSiteContent.contact_phone}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3" />
              <span>{defaultSiteContent.contact_phone}</span>
            </a>
            <a
              href={`mailto:${defaultSiteContent.contact_email}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Mail className="w-3 h-3" />
              <span>{defaultSiteContent.contact_email}</span>
            </a>
          </div>
          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-white/10 rounded px-1 py-0.5">
            <Globe className="w-3 h-3 mr-1" />
            <button
              onClick={() => setLocale('id')}
              className={`px-2 py-0.5 rounded text-xs font-semibold transition-all ${
                locale === 'id' ? 'bg-white text-brand-700' : 'hover:text-white'
              }`}
            >
              ID
            </button>
            <span className="text-white/40">|</span>
            <button
              onClick={() => setLocale('en')}
              className={`px-2 py-0.5 rounded text-xs font-semibold transition-all ${
                locale === 'en' ? 'bg-white text-brand-700' : 'hover:text-white'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-200'
            : 'bg-white border-b border-neutral-200'
        }`}
      >
        <div className="container-main flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-9 h-9 rounded-lg bg-brand-700 flex items-center justify-center group-hover:bg-brand-600 transition-colors">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="leading-none">
              <p className="text-base font-bold text-neutral-900 tracking-tight">Rider Horse</p>
              <p className="text-xs text-brand-600 font-medium">Banyuwangi</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-brand-700 rounded-md hover:bg-brand-50 transition-all duration-150"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* Language toggle on mobile */}
            <div className="flex lg:hidden items-center gap-1 border border-neutral-200 rounded-md px-1 py-0.5">
              <button
                onClick={() => setLocale('id')}
                className={`px-1.5 py-0.5 rounded text-xs font-semibold transition-all ${
                  locale === 'id' ? 'bg-brand-700 text-white' : 'text-neutral-500'
                }`}
              >
                ID
              </button>
              <button
                onClick={() => setLocale('en')}
                className={`px-1.5 py-0.5 rounded text-xs font-semibold transition-all ${
                  locale === 'en' ? 'bg-brand-700 text-white' : 'text-neutral-500'
                }`}
              >
                EN
              </button>
            </div>

            <Link
              href="/login"
              className="hidden lg:inline-flex px-3 py-1.5 text-sm font-medium text-neutral-600 hover:text-brand-700 transition-colors"
            >
              {t.nav.signIn}
            </Link>
            <Link href="#trips" className="hidden sm:inline-flex btn-primary btn-sm">
              {t.nav.bookTrip}
            </Link>

            {/* Mobile Menu Button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-neutral-100 transition-colors text-neutral-600"
              aria-label="Toggle menu"
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-300 overflow-hidden border-t border-neutral-100 ${
            isMobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="container-main py-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-neutral-700 hover:text-brand-700 hover:bg-brand-50 rounded-md transition-all"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-neutral-100 flex flex-col gap-2">
              <Link
                href="/login"
                className="btn-outline btn-sm text-center"
                onClick={() => setIsMobileOpen(false)}
              >
                {t.nav.signIn}
              </Link>
              <Link
                href="#trips"
                className="btn-primary btn-sm text-center"
                onClick={() => setIsMobileOpen(false)}
              >
                {t.nav.bookTrip}
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
