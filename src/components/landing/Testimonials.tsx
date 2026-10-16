'use client';

import { Star, Quote } from 'lucide-react';
import { testimonials } from '@/lib/mock-data';
import { useLanguage } from '@/lib/i18n/context';

export default function Testimonials() {
  const { t, locale } = useLanguage();

  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-brand-950" style={{ background: '#1a3512' }}>
      <div className="container-main">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div>
            <span className="section-badge" style={{ color: '#c9a227' }}>{t.testimonials.badge}</span>
            <h2
              className="mt-4"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                fontWeight: 900,
                lineHeight: 1.15,
                color: '#ffffff',
              }}
            >
              {t.testimonials.headline.split('\n').map((line, i) => (
                <span key={i}>
                  {i === 0 ? <span style={{ color: '#c9a227' }}>{line}</span> : line}
                  {i === 0 && <br />}
                </span>
              ))}
            </h2>
          </div>
          <div className="flex-shrink-0">
            <p className="text-sm text-white/60 max-w-xs lg:text-right leading-relaxed">
              {t.testimonials.description}
            </p>
            <a
              href="#contact"
              className="mt-4 inline-flex btn-primary btn-sm"
            >
              {t.testimonials.seeAll}
            </a>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((item, i) => {
            const text = locale === 'id' ? item.text : item.textEn;
            return (
              <div
                key={item.id}
                className={`rounded-xl p-7 flex flex-col ${
                  i === 1
                    ? 'bg-white'
                    : 'border border-white/10'
                }`}
                style={i !== 1 ? { background: 'rgba(255,255,255,0.05)' } : {}}
              >
                {/* Quote icon */}
                <Quote
                  className="w-8 h-8 mb-4"
                  style={{ color: i === 1 ? '#c9a227' : 'rgba(201,162,39,0.5)' }}
                />

                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: item.rating }).map((_, si) => (
                    <Star
                      key={si}
                      className="w-4 h-4"
                      fill="#c9a227"
                      style={{ color: '#c9a227' }}
                    />
                  ))}
                </div>

                {/* Text */}
                <p
                  className="text-sm leading-relaxed flex-1 mb-6"
                  style={{ color: i === 1 ? '#3e3e36' : 'rgba(255,255,255,0.8)' }}
                >
                  &ldquo;{text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t"
                  style={{ borderColor: i === 1 ? '#e8e7e1' : 'rgba(255,255,255,0.1)' }}>
                  {/* Avatar circle */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={{
                      background: i === 1 ? '#1a3512' : '#c9a227',
                      color: '#ffffff',
                    }}
                  >
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: i === 1 ? '#1a1a14' : '#ffffff' }}
                    >
                      {item.name}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: i === 1 ? '#7a7970' : 'rgba(255,255,255,0.5)' }}
                    >
                      {item.location} · {item.trip}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
