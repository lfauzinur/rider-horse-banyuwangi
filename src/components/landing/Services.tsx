'use client';

import Image from 'next/image';
import { ArrowUpRight, Camera, GraduationCap, Sparkles, UsersRound } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/context';
import { useCatalog } from '@/lib/catalog-context';

const serviceIcons = [GraduationCap, UsersRound, Sparkles, Camera];

export default function Services() {
  const { t, locale, siteContent } = useLanguage();
  const { services } = useCatalog();

  if (siteContent['global.show_services'] === 'false') return null;

  return (
    <section id="services" className="section-shell bg-[#eceae1]">
      <div className="container-main">
        <div className="mb-12 grid items-end gap-6 lg:grid-cols-[1fr_420px] lg:gap-12">
          <div>
            <span className="section-kicker">{t.services.badge}</span>
            <h2 className="section-title">{t.services.headline}</h2>
          </div>
          <div className="lg:pb-1">
            <p className="section-copy">{t.services.description}</p>
            <a href="#trips" className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.13em] text-brand-700 hover:text-brand-500">
              {t.services.joinProgram}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service, index) => {
            const title = locale === 'id' ? service.titleId : service.title;
            const description = locale === 'id' ? service.descriptionId : service.description;
            const features = locale === 'id' ? service.featuresId : service.features;
            const Icon = serviceIcons[index % serviceIcons.length];

            return (
              <article key={service.title} className="group relative min-h-[460px] overflow-hidden rounded-[1.5rem] bg-brand-950">
                <Image
                  src={service.image_url}
                  alt={title}
                  fill
                  sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,20,15,.08)_10%,rgba(8,23,17,.92)_76%)]" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <span className="icon-chip">
                      <Icon className="h-[18px] w-[18px]" strokeWidth={1.7} />
                    </span>
                    <span className="rounded-full border border-white/15 bg-black/15 px-3 py-1.5 text-[0.64rem] font-bold text-white/75 backdrop-blur-md">
                      {formatCurrency(service.price)}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white">{title}</h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/60">{description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {features.slice(0, 2).map((feature) => (
                      <span key={feature} className="rounded-full border border-white/12 px-2.5 py-1 text-[0.58rem] font-semibold text-white/65">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <a href="#trips" className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-accent-300">
                    {t.services.seeDetails}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
