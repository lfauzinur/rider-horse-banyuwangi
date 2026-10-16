'use client';

import Image from 'next/image';
import { services } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/context';

// Map image per service
const serviceImages: Record<string, string> = {
  'graduation-cap': '/images/private-lesson.jpg',
  users: '/images/group-class.jpg',
  sparkles: '/images/mountain-trail.jpg',
  camera: '/images/sunset-ride.jpg',
};

export default function Services() {
  const { t, locale } = useLanguage();

  return (
    <section id="services" className="py-20 lg:py-28" style={{ background: 'var(--surface-alt, #f4f3ef)' }}>
      <div className="container-main">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="section-badge justify-center">{t.services.badge}</span>
          <h2
            className="mt-4 mb-4"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              fontWeight: 900,
              lineHeight: 1.15,
              color: '#1a1a14',
            }}
          >
            {t.services.headline}
          </h2>
          <p className="text-neutral-500 text-base max-w-xl mx-auto leading-relaxed">
            {t.services.description}
          </p>
        </div>

        {/* Programs list – alternating layout like reference */}
        <div className="space-y-8">
          {services.map((service, index) => {
            const isEven = index % 2 === 0;
            const title = locale === 'id' ? service.titleId : service.title;
            const description = locale === 'id' ? service.descriptionId : service.description;
            const features = locale === 'id' ? service.featuresId : service.features;
            const suitableFor = locale === 'id' ? service.suitableForId : service.suitableFor;
            const imgSrc = serviceImages[service.icon] || '/images/hero-banner.png';

            return (
              <div
                key={service.title}
                className={`grid md:grid-cols-2 gap-0 rounded-xl overflow-hidden bg-white border border-neutral-200 ${
                  !isEven ? 'md:[&>div:first-child]:order-2' : ''
                }`}
              >
                {/* Image */}
                <div className="relative h-64 md:h-auto min-h-[260px]">
                  <Image
                    src={imgSrc}
                    alt={title}
                    fill
                    className="object-cover"
                  />
                  {/* Price badge */}
                  <div
                    className="absolute top-4 left-4 px-4 py-2 rounded-lg"
                    style={{ background: '#c9a227' }}
                  >
                    <p className="text-xs font-semibold text-neutral-900 uppercase tracking-wide">
                      {t.services.startFrom}
                    </p>
                    <p className="text-lg font-black text-neutral-900" style={{ fontFamily: 'var(--font-display)' }}>
                      {formatCurrency(service.price)}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col justify-center">
                  <h3
                    className="mb-4"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: '#1a1a14',
                    }}
                  >
                    {title}
                  </h3>
                  <p className="text-neutral-500 text-sm leading-relaxed mb-6">{description}</p>

                  {/* Suitable for */}
                  <div className="mb-4">
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">
                      {t.services.suitableFor}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {suitableFor.map((item) => (
                        <span
                          key={item}
                          className="flex items-center gap-1.5 text-xs text-neutral-600"
                        >
                          <svg className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* What you'll learn */}
                  <div className="mb-6">
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2">
                      {t.services.whatLearn}
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {features.map((feature) => (
                        <div key={feature} className="flex items-center gap-1.5 text-xs text-neutral-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-600 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="flex gap-3">
                    <a href="#trips" className="btn-primary btn-sm">
                      {t.services.joinProgram}
                    </a>
                    <a href={`/trips`} className="btn-outline btn-sm">
                      {t.services.seeDetails}
                    </a>
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
