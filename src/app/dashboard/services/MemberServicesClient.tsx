'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, Sparkles } from 'lucide-react';
import MemberAreaShell from '@/components/app/MemberAreaShell';
import { useCatalog } from '@/lib/catalog-context';
import { formatCurrency } from '@/lib/utils';

export default function MemberServicesClient() {
  const { services, isLoading } = useCatalog();
  return (
    <MemberAreaShell>
      <section className="rounded-[1.75rem] bg-accent-300 p-6 text-brand-950 sm:p-8"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-950 text-accent-300"><Sparkles className="h-5 w-5" /></div><p className="mt-6 text-[0.62rem] font-extrabold uppercase tracking-[0.17em] text-brand-700">Riding programs</p><h1 className="mt-2 max-w-3xl font-display text-3xl font-bold sm:text-5xl">Pilih layanan yang mendukung perjalananmu.</h1><p className="mt-4 max-w-2xl text-sm leading-7 text-brand-900/65">Bandingkan program, fasilitas, dan harga langsung dari aplikasi. Setelah memilih, lanjutkan ke katalog trip untuk menentukan jadwal.</p></section>
      {isLoading ? <div className="mt-6 h-96 animate-pulse rounded-3xl bg-white" /> : <section className="mt-6 grid gap-5 lg:grid-cols-2">{services.filter((item) => item.is_active).map((service) => <article key={service.id} className="overflow-hidden rounded-[1.5rem] border border-brand-900/8 bg-white sm:grid sm:grid-cols-[210px_1fr]"><div className="relative min-h-56"><Image src={service.image_url} alt={service.titleId} fill sizes="(max-width: 640px) 100vw, 210px" className="object-cover" /></div><div className="flex flex-col p-5"><p className="text-[0.58rem] font-extrabold uppercase tracking-wider text-brand-600">Program berkuda</p><h2 className="mt-2 font-display text-2xl font-bold">{service.titleId}</h2><p className="mt-2 line-clamp-3 text-xs leading-6 text-neutral-500">{service.descriptionId}</p><div className="mt-4 space-y-2">{service.featuresId.slice(0, 3).map((feature) => <p key={feature} className="flex items-center gap-2 text-xs font-semibold text-brand-800"><CheckCircle2 className="h-3.5 w-3.5 text-accent-600" />{feature}</p>)}</div><div className="mt-auto flex items-end justify-between gap-3 pt-5"><div><p className="text-[0.56rem] font-bold uppercase text-neutral-400">Mulai dari</p><p className="font-display text-xl font-bold text-brand-800">{formatCurrency(service.price)}</p></div><Link href="/dashboard/trips" onClick={() => window.localStorage.setItem('rider-horse-selected-service', JSON.stringify({ id: service.id, title: service.titleId, price: service.price }))} className="btn-primary btn-sm">Pilih program <ArrowUpRight className="h-3.5 w-3.5" /></Link></div></div></article>)}</section>}
    </MemberAreaShell>
  );
}
