'use client';

import Image from 'next/image';
import { Play, Phone } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';
import { defaultSiteContent } from '@/lib/mock-data';

export default function About() {
  const { t } = useLanguage();
  const lines = t.about.headline.split('\n');

  return (
    <section id="about" className="py-20 lg:py-28 bg-white">
      <div className="container-main">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left – Image with play button */}
          <div className="relative">
            {/* Section badge for mobile */}
            <div className="lg:hidden mb-6">
              <span className="section-badge">{t.about.badge}</span>
            </div>

            <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-neutral-100">
              <Image
                src="/images/private-lesson.jpg"
                alt="Professional riding instruction at Rider Horse Banyuwangi"
                fill
                className="object-cover"
              />
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  className="w-16 h-16 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                  style={{ background: '#c9a227', boxShadow: '0 0 0 8px rgba(201,162,39,0.25)' }}
                  aria-label="Play video"
                >
                  <Play className="w-6 h-6 text-neutral-900 ml-1" fill="currentColor" />
                </button>
              </div>
            </div>

            {/* Stats below image */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {Object.entries(t.about.stats).map(([key, stat]) => (
                <div
                  key={key}
                  className="text-center p-4 bg-brand-700 rounded-lg"
                >
                  <p className="text-2xl font-black text-white" style={{ fontFamily: 'var(--font-display)' }}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-white/70 mt-0.5 font-medium leading-tight">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right – Text */}
          <div>
            <span className="section-badge hidden lg:inline-flex">{t.about.badge}</span>
            <h2
              className="mt-4 mb-6"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                fontWeight: 900,
                lineHeight: 1.15,
                color: '#1a1a14',
              }}
            >
              {lines[0]}
              <br />
              <span style={{ color: '#2e5f1e' }}>{lines[1]}</span>
            </h2>

            <p className="text-neutral-600 leading-relaxed mb-6 text-base">
              {t.about.description}
            </p>

            {/* Safety pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {t.about.safetyItems.map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full"
                  style={{
                    background: '#f0f5ec',
                    color: '#2e5f1e',
                    border: '1px solid #b4d4a0',
                  }}
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </span>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3">
              <a href="#trips" className="btn-primary">
                {t.about.cta}
              </a>
              <a
                href={`tel:${defaultSiteContent.contact_phone}`}
                className="btn-outline flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                {defaultSiteContent.contact_phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
