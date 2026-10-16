'use client';

import Image from 'next/image';
import { ArrowRight, Clock } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

export default function Hero() {
  const { t } = useLanguage();

  const lines = t.hero.headline.split('\n');

  return (
    <section id="home" className="relative overflow-hidden bg-neutral-900" style={{ minHeight: '90vh' }}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-banner.png"
          alt="Horse riding in Banyuwangi"
          fill
          className="object-cover opacity-60"
          priority
          quality={85}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-neutral-900/60 to-neutral-900/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-main flex flex-col justify-center" style={{ minHeight: '90vh', paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6 animate-fade-in-up">
            <div className="w-2 h-2 rounded-full bg-accent-400" />
            <span className="text-xs font-semibold text-accent-300 uppercase tracking-widest">
              {t.hero.badge}
            </span>
          </div>

          {/* Headline */}
          <h1 className="mb-6 animate-fade-in-up animation-delay-100" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.8rem, 7vw, 5rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.02em', color: '#ffffff' }}>
            {lines[0]}
            <br />
            <span style={{ color: '#facc15' }}>{lines[1]}</span>
          </h1>

          {/* Subheadline */}
          <p className="text-neutral-300 text-base sm:text-lg leading-relaxed mb-8 max-w-xl animate-fade-in-up animation-delay-200" style={{ fontWeight: 300 }}>
            {t.hero.subheadline}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 mb-10 animate-fade-in-up animation-delay-300">
            <a href="#trips" className="btn-primary btn-lg flex items-center gap-2">
              {t.hero.cta1}
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#about"
              className="btn-lg flex items-center gap-2 font-semibold transition-all duration-200"
              style={{ color: '#ffffff', border: '2px solid rgba(255,255,255,0.4)', borderRadius: '0.375rem', padding: '1rem 2rem', background: 'transparent', fontSize: '0.875rem' }}
              onMouseEnter={e => {
                (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.1)';
              }}
              onMouseLeave={e => {
                (e.target as HTMLElement).style.background = 'transparent';
              }}
            >
              {t.hero.cta2}
            </a>
          </div>

          {/* Schedule */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 animate-fade-in-up animation-delay-400">
            {t.hero.scheduleInfo.map((info, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-neutral-400">
                <Clock className="w-3.5 h-3.5 text-accent-400 flex-shrink-0" />
                <span>{info}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="container-main">
          <div className="inline-flex bg-white/10 backdrop-blur-sm border border-white/10 rounded-t-xl overflow-hidden">
            {Object.entries(t.hero.stats).map(([key, stat], i, arr) => (
              <div
                key={key}
                className={`px-8 py-5 text-center ${i < arr.length - 1 ? 'border-r border-white/10' : ''}`}
              >
                <p className="text-2xl font-black text-white" style={{ fontFamily: 'var(--font-display)' }}>
                  {stat.value}
                </p>
                <p className="text-xs text-neutral-300 mt-0.5 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
