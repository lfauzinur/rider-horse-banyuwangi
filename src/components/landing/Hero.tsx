'use client';

import Image from 'next/image';
import { ArrowDownRight, CalendarDays, MapPin, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

export default function Hero() {
  const { t, locale, siteContent } = useLanguage();
  const lines = t.hero.headline.split('\n');

  return (
    <section id="home" className="relative isolate min-h-[calc(100svh-72px)] overflow-hidden bg-brand-950 text-white">
      <Image
        src={siteContent['global.hero_image_url'] || '/images/hero-banner.png'}
        alt={locale === 'id' ? 'Rider menikmati pengalaman berkuda di alam Banyuwangi' : 'A rider enjoying a horseback experience in Banyuwangi'}
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-[58%_42%]"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(9,24,18,.94)_0%,rgba(12,29,23,.73)_47%,rgba(10,24,19,.16)_82%),linear-gradient(0deg,rgba(7,18,14,.78)_0%,transparent_45%)]" />
      <div className="absolute -right-24 top-16 -z-10 h-96 w-96 rounded-full bg-accent-400/10 blur-3xl" />

      <div className="container-main flex min-h-[calc(100svh-72px)] flex-col justify-between pb-7 pt-16 sm:pb-9 sm:pt-24 lg:pt-28">
        <div className="grid items-end gap-12 lg:grid-cols-[1fr_330px]">
          <div className="max-w-[760px]">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-[0.65rem] font-bold uppercase tracking-[0.17em] text-accent-300 backdrop-blur-md animate-fade-in-up">
              <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
              Banyuwangi, East Java
            </div>

            <h1 className="max-w-[12ch] font-display text-[clamp(3.15rem,8vw,7.2rem)] font-bold leading-[0.91] tracking-[-0.055em] text-white animate-fade-in-up animation-delay-100">
              {lines[0]}
              <span className="block italic text-accent-300">{lines[1]}</span>
            </h1>

            <div className="mt-8 flex max-w-2xl flex-col gap-6 border-l border-accent-300/60 pl-5 sm:flex-row sm:items-end sm:justify-between animate-fade-in-up animation-delay-200">
              <p className="max-w-xl text-sm leading-7 text-white/72 sm:text-base">
                {t.hero.subheadline}
              </p>
              <a href="#trips" className="btn-primary btn-lg shrink-0 self-start sm:self-auto">
                {t.hero.cta1}
                <ArrowDownRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <aside className="hidden rounded-[1.5rem] border border-white/15 bg-white/[0.07] p-6 backdrop-blur-xl lg:block animate-fade-in-up animation-delay-300">
            <div className="flex items-center justify-between">
              <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-white/50">
                {locale === 'id' ? 'Jadwal hari ini' : 'Today’s schedule'}
              </span>
              <CalendarDays className="h-4 w-4 text-accent-300" strokeWidth={1.7} />
            </div>
            <p className="mt-7 font-display text-2xl leading-tight text-white">
              {locale === 'id' ? 'Temukan waktu terbaik untuk berkuda.' : 'Find your best time to ride.'}
            </p>
            <div className="mt-6 space-y-3 border-t border-white/10 pt-5">
              {t.hero.scheduleInfo.map((info) => (
                <div key={info} className="flex items-start gap-2.5 text-xs leading-5 text-white/64">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-300" />
                  {info}
                </div>
              ))}
            </div>
          </aside>
        </div>

        <div className="mt-14 grid overflow-hidden rounded-[1.25rem] border border-white/10 bg-brand-950/55 backdrop-blur-lg sm:grid-cols-3">
          {Object.entries(t.hero.stats).map(([key, stat]) => (
            <div key={key} className="flex items-center gap-4 border-b border-white/10 px-5 py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 sm:px-7">
              <ShieldCheck className="h-5 w-5 shrink-0 text-accent-300" strokeWidth={1.5} />
              <div>
                <p className="font-display text-2xl font-bold leading-none text-white">{stat.value}</p>
                <p className="mt-1 text-[0.64rem] font-bold uppercase tracking-[0.12em] text-white/48">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
