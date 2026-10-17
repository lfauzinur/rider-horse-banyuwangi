'use client';

import Image from 'next/image';
import { Quote, Star } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';
import { useCatalog } from '@/lib/catalog-context';

export default function Testimonials() {
  const { t, locale, siteContent } = useLanguage();
  const { testimonials } = useCatalog();

  if (siteContent['global.show_testimonials'] === 'false') return null;

  return (
    <section id="testimonials" className="section-shell bg-[#eceae1]">
      <div className="container-main grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
        <div>
          <span className="section-kicker">{t.testimonials.badge}</span>
          <h2 className="section-title">
            {t.testimonials.headline.split('\n').map((line, index) => (
              <span key={line} className={index === 1 ? 'block italic text-brand-600' : 'block'}>{line}</span>
            ))}
          </h2>
          <p className="section-copy mt-6 max-w-md">{t.testimonials.description}</p>

          <div className="relative mt-9 h-[360px] overflow-hidden rounded-[1.75rem] sm:h-[430px]">
            <Image src={siteContent['global.testimonials_image_url'] || '/images/beach-ride.jpg'} alt="Rider menikmati perjalanan berkuda di Banyuwangi" fill sizes="(max-width: 1023px) 100vw, 40vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/65 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/20 bg-brand-950/45 p-4 text-white backdrop-blur-md">
              <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.17em] text-accent-300">Google Reviews</p>
              <div className="mt-2 flex items-center gap-3">
                <span className="font-display text-3xl font-bold">4.9</span>
                <div className="flex gap-1" aria-label="4.9 dari 5 bintang">
                  {Array.from({ length: 5 }).map((_, index) => <Star key={index} className="h-3.5 w-3.5 fill-accent-300 text-accent-300" />)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-end gap-4">
          {testimonials.map((item, index) => (
            <article key={item.id} className={`rounded-[1.4rem] border p-6 sm:p-7 ${index === 1 ? 'border-brand-900 bg-brand-900 text-white lg:ml-10' : 'border-brand-900/10 bg-neutral-50 text-brand-950'}`}>
              <div className="flex items-start gap-4">
                <Quote className={`mt-1 h-6 w-6 shrink-0 ${index === 1 ? 'text-accent-300' : 'text-accent-500'}`} strokeWidth={1.5} />
                <div>
                  <p className={`font-display text-lg leading-8 ${index === 1 ? 'text-white' : 'text-brand-950'}`}>
                    “{locale === 'id' ? item.text : item.textEn}”
                  </p>
                  <div className={`mt-5 flex flex-wrap items-end justify-between gap-3 border-t pt-4 ${index === 1 ? 'border-white/10' : 'border-brand-900/10'}`}>
                    <div>
                      <p className="text-sm font-extrabold">{item.name}</p>
                      <p className={`mt-0.5 text-[0.68rem] ${index === 1 ? 'text-white/50' : 'text-neutral-500'}`}>{item.location}</p>
                    </div>
                    <p className={`text-[0.62rem] font-bold uppercase tracking-[0.1em] ${index === 1 ? 'text-accent-300' : 'text-brand-600'}`}>{item.trip}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
