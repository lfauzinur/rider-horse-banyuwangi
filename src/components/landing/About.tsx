'use client';

import Image from 'next/image';
import { ArrowUpRight, Check, PhoneCall, Quote } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';
import { defaultSiteContent } from '@/lib/mock-data';

export default function About() {
  const { t, locale, siteContent } = useLanguage();
  const lines = t.about.headline.split('\n');
  const phone = siteContent['global.contact_phone'] || defaultSiteContent.contact_phone;
  if (siteContent['global.show_about'] === 'false') return null;

  return (
    <section id="about" className="section-shell overflow-hidden bg-neutral-50">
      <div className="container-main grid items-center gap-14 lg:grid-cols-[1.06fr_.94fr] lg:gap-20">
        <div className="relative grid h-[430px] grid-cols-[1.18fr_.82fr] grid-rows-2 gap-3 sm:h-[570px] sm:gap-4">
          <div className="relative row-span-2 overflow-hidden rounded-[1.75rem]">
            <Image src={siteContent['global.about_primary_image_url'] || '/images/private-lesson.jpg'} alt={locale === 'id' ? 'Instruktur mendampingi sesi berkuda' : 'An instructor assisting a riding session'} fill sizes="(max-width: 1024px) 60vw, 34vw" className="object-cover" />
          </div>
          <div className="relative overflow-hidden rounded-[1.75rem]">
            <Image src={siteContent['global.about_secondary_image_url'] || '/images/group-class.jpg'} alt={locale === 'id' ? 'Kelas berkuda yang ramah untuk pemula' : 'A beginner-friendly riding class'} fill sizes="(max-width: 1024px) 40vw, 20vw" className="object-cover" />
          </div>
          <div className="relative overflow-hidden rounded-[1.75rem]">
            <Image src={siteContent['global.about_tertiary_image_url'] || '/images/forest-trail.jpg'} alt={locale === 'id' ? 'Petualangan berkuda di jalur hijau' : 'A horseback adventure along a green trail'} fill sizes="(max-width: 1024px) 40vw, 20vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/70 to-transparent" />
          </div>

          <div className="absolute -bottom-5 left-5 rounded-2xl border border-white/50 bg-brand-950 px-5 py-4 text-white shadow-2xl sm:left-auto sm:right-[-22px] sm:top-1/2 sm:-translate-y-1/2">
            <p className="font-display text-3xl font-bold text-accent-300">25+</p>
            <p className="mt-1 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-white/60">
              {locale === 'id' ? 'Tahun pengalaman' : 'Years of experience'}
            </p>
          </div>
        </div>

        <div>
          <span className="section-kicker">{t.about.badge}</span>
          <h2 className="section-title">
            {lines[0]} <span className="italic text-brand-600">{lines[1]}</span>
          </h2>
          <p className="section-copy mt-7">{t.about.description}</p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {t.about.safetyItems.slice(0, 4).map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm font-semibold text-brand-800">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                  <Check className="h-3.5 w-3.5" strokeWidth={2.2} />
                </span>
                {item}
              </div>
            ))}
          </div>

          <blockquote className="mt-8 flex gap-4 border-y border-brand-800/10 py-5">
            <Quote className="mt-1 h-5 w-5 shrink-0 text-accent-500" strokeWidth={1.6} />
            <p className="font-display text-base italic leading-7 text-brand-800">
              {locale === 'id'
                ? 'Kami tidak sekadar mengajarkan cara berkuda, tetapi membangun rasa percaya antara rider, kuda, dan alam.'
                : 'We do not simply teach riding—we build trust between rider, horse, and nature.'}
            </p>
          </blockquote>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#trips" className="btn-primary">
              {t.about.cta}
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a href={`tel:${phone.replace(/\s/g, '')}`} className="btn-secondary">
              <PhoneCall className="h-4 w-4" />
              {t.about.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
