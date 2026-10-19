'use client';

import Link from 'next/link';
import { Mail, MessageCircle, Phone, Trees } from 'lucide-react';
import { defaultSiteContent } from '@/lib/mock-data';
import { useLanguage } from '@/lib/i18n/context';
import { useCatalog } from '@/lib/catalog-context';
import { localizeTrip } from '@/lib/localized-content';

export default function Footer() {
  const { t, locale, siteContent } = useLanguage();
  const { trips } = useCatalog();
  const content = (key: string) => siteContent[`global.${key}`] || defaultSiteContent[key];
  const phone = content('contact_phone');
  const email = content('contact_email');
  const address = locale === 'en' ? content('contact_address_en') : content('contact_address');
  const exploreLinks = [
    { label: t.nav.home, href: '/#home' },
    { label: t.nav.about, href: '/#about' },
    { label: t.nav.services, href: '/#services' },
    { label: t.nav.articles, href: '/articles' },
    { label: t.nav.contact, href: '/#contact' },
  ];

  return (
    <footer className="border-t border-white/8 bg-[#0d1a16] text-white">
      <div className="container-main py-14">
        <div className="grid gap-10 border-b border-white/10 pb-10 md:grid-cols-2 lg:grid-cols-[1.3fr_.7fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-accent-400/30 text-accent-300"><Trees className="h-[18px] w-[18px]" strokeWidth={1.7} /></span>
              <span className="leading-none">
                <span className="block font-display text-lg font-bold">Rider Horse</span>
                <span className="mt-1 block text-[0.58rem] font-bold uppercase tracking-[0.22em] text-accent-300">Banyuwangi</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-xs leading-6 text-white/48">{t.footer.description}</p>
            <div className="mt-5 flex gap-2">
              {[
                { Icon: MessageCircle, href: `https://wa.me/${content('whatsapp_number')}`, label: 'WhatsApp' },
                { Icon: Mail, href: `mailto:${email}`, label: 'Email' },
                { Icon: Phone, href: `tel:${phone.replace(/\s/g, '')}`, label: locale === 'id' ? 'Telepon' : 'Phone' },
              ].map(({ Icon, href, label }) => (
                <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined} aria-label={label} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/55 transition-colors hover:border-accent-300/50 hover:text-accent-300">
                  <Icon className="h-4 w-4" strokeWidth={1.7} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[0.64rem] font-extrabold uppercase tracking-[0.17em] text-white/35">{t.footer.explore}</h3>
            <ul className="mt-5 space-y-3">
              {exploreLinks.map((link) => <li key={link.href}><Link href={link.href} className="text-xs text-white/62 transition-colors hover:text-accent-300">{link.label}</Link></li>)}
            </ul>
          </div>

          <div>
            <h3 className="text-[0.64rem] font-extrabold uppercase tracking-[0.17em] text-white/35">{t.footer.ourTrips}</h3>
            <ul className="mt-5 space-y-3">
              {trips.slice(0, 4).map((trip) => <li key={trip.id}><Link href={`/trips/${trip.slug}`} className="text-xs text-white/62 transition-colors hover:text-accent-300">{localizeTrip(trip, locale).title}</Link></li>)}
            </ul>
          </div>

          <div>
            <h3 className="text-[0.64rem] font-extrabold uppercase tracking-[0.17em] text-white/35">{t.footer.contact}</h3>
            <address className="mt-5 space-y-3 text-xs not-italic leading-6 text-white/62">
              <p>{address}</p>
              <a href={`tel:${phone.replace(/\s/g, '')}`} className="block hover:text-accent-300">{phone}</a>
              <a href={`mailto:${email}`} className="block break-all hover:text-accent-300">{email}</a>
            </address>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-white/30 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Rider Horse Banyuwangi</p>
          <p>{locale === 'id' ? 'Berkuda dengan aman • Menjelajah dengan sadar' : 'Ride safely • Explore consciously'}</p>
        </div>
      </div>
    </footer>
  );
}
