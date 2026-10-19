'use client';

import { useMemo, useState } from 'react';
import {
  BookOpenText,
  BriefcaseBusiness,
  Check,
  ContactRound,
  Eye,
  FileText,
  ImageIcon,
  LayoutTemplate,
  MessageSquareQuote,
  Navigation,
  Save,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import CloudinaryUpload from '@/components/admin/CloudinaryUpload';

type ContentMap = Record<string, string>;

interface LandingContentManagerProps {
  content: ContentMap;
  setContent: (next: ContentMap) => void;
  onSave: (keys: string[]) => Promise<void>;
}

interface SectionDefinition {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  prefixes?: string[];
  globals?: string[];
  visibilityKey?: string;
}

const sections: SectionDefinition[] = [
  { id: 'navigation', label: 'Navigasi & footer', description: 'Menu, tombol masuk, informasi footer, dan tautan legal.', icon: Navigation, prefixes: ['id.nav.', 'en.nav.', 'id.footer.', 'en.footer.'] },
  { id: 'hero', label: 'Hero utama', description: 'Judul utama, CTA, jadwal, statistik, dan visual pembuka.', icon: LayoutTemplate, prefixes: ['id.hero.', 'en.hero.'], globals: ['global.hero_image_url'] },
  { id: 'about', label: 'Tentang kami', description: 'Narasi brand, keamanan, CTA, statistik, dan seluruh gambar bagian tentang.', icon: FileText, prefixes: ['id.about.', 'en.about.'], globals: ['global.about_primary_image_url', 'global.about_secondary_image_url', 'global.about_tertiary_image_url'], visibilityKey: 'global.show_about' },
  { id: 'services', label: 'Bagian layanan', description: 'Heading dan microcopy bagian layanan. Item layanan dikelola lewat tab Layanan.', icon: BriefcaseBusiness, prefixes: ['id.services.', 'en.services.'], visibilityKey: 'global.show_services' },
  { id: 'trips', label: 'Bagian trip', description: 'Heading, filter, CTA, dan label katalog. Paket trip dikelola lewat tab Trip.', icon: ImageIcon, prefixes: ['id.trips.', 'en.trips.'], visibilityKey: 'global.show_trips' },
  { id: 'testimonials', label: 'Bagian testimoni', description: 'Heading dan visual social proof. Cerita rider dikelola lewat tab Testimoni.', icon: MessageSquareQuote, prefixes: ['id.testimonials.', 'en.testimonials.'], globals: ['global.testimonials_image_url'], visibilityKey: 'global.show_testimonials' },
  { id: 'articles', label: 'Bagian artikel', description: 'Heading artikel pada landing page. Artikel lengkap dikelola lewat tab Artikel.', icon: BookOpenText, prefixes: ['id.articles.', 'en.articles.'], visibilityKey: 'global.show_articles' },
  { id: 'contact', label: 'Kontak & formulir', description: 'Seluruh label formulir, CTA WhatsApp, serta informasi bisnis.', icon: ContactRound, prefixes: ['id.contact.', 'en.contact.'], globals: ['global.contact_phone', 'global.contact_email', 'global.contact_address', 'global.contact_address_en', 'global.operating_hours', 'global.operating_hours_en', 'global.whatsapp_number'], visibilityKey: 'global.show_contact' },
];

const friendlyLabels: Record<string, string> = {
  badge: 'Label kecil', headline: 'Judul utama', subheadline: 'Deskripsi utama', description: 'Deskripsi',
  cta: 'Teks tombol', cta1: 'Tombol utama', cta2: 'Tombol kedua', scheduleInfo: 'Jadwal operasional',
  riders: 'Statistik rider', hours: 'Jam latihan / operasional', success: 'Tingkat kepuasan', value: 'Nilai', label: 'Label',
  safetyItems: 'Daftar keamanan', phone: 'Teks tombol telepon', suitableFor: 'Cocok untuk', whatLearn: 'Yang dipelajari',
  joinProgram: 'CTA program', seeDetails: 'CTA detail', startFrom: 'Label harga mulai', filterAll: 'Filter semua',
  viewAll: 'CTA lihat semua', bookNow: 'CTA pesan', perPax: 'Satuan harga', maxCapacity: 'Kapasitas maksimum',
  pax: 'Satuan peserta', noTrips: 'Pesan data kosong', seeAll: 'CTA lihat testimoni', infoTitle: 'Judul informasi kontak',
  formTitle: 'Judul formulir', nameLabel: 'Label nama', namePlaceholder: 'Placeholder nama', emailLabel: 'Label email',
  emailPlaceholder: 'Placeholder email', phoneLabel: 'Label telepon', phonePlaceholder: 'Placeholder telepon',
  messageLabel: 'Label pesan', messagePlaceholder: 'Placeholder pesan', submitBtn: 'Tombol kirim', submittedBtn: 'Tombol selesai',
  whatsappBtn: 'Tombol WhatsApp', mapLink: 'Tautan peta', explore: 'Judul eksplorasi', ourTrips: 'Judul trip',
  legal: 'Legal', privacy: 'Kebijakan privasi', terms: 'Syarat layanan', cancellation: 'Kebijakan pembatalan',
  copyright: 'Hak cipta', madeWith: 'Teks dibuat dengan', inBanyuwangi: 'Teks lokasi', home: 'Menu beranda', about: 'Menu tentang',
  services: 'Menu layanan', trips: 'Menu trip', articles: 'Menu artikel', contact: 'Menu kontak', signIn: 'Tombol masuk',
  bookTrip: 'Tombol pesan trip', contact_phone: 'Nomor telepon', contact_email: 'Email bisnis', contact_address: 'Alamat',
  contact_address_en: 'Alamat (Inggris)', operating_hours: 'Jam operasional', operating_hours_en: 'Jam operasional (Inggris)', whatsapp_number: 'Nomor WhatsApp', hero_image_url: 'Gambar hero',
  about_primary_image_url: 'Gambar utama', about_secondary_image_url: 'Gambar pendamping 1', about_tertiary_image_url: 'Gambar pendamping 2',
  testimonials_image_url: 'Gambar testimoni',
};

function toFriendlyLabel(key: string) {
  const parts = key.split('.');
  const last = parts.at(-1) || key;
  const parent = parts.at(-2);
  const base = friendlyLabels[last] || last.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
  if (['value', 'label'].includes(last) && parent) return `${friendlyLabels[parent] || parent} — ${base}`;
  return base;
}

function isListField(key: string) {
  return key.endsWith('.scheduleInfo') || key.endsWith('.safetyItems');
}

function listValue(raw: string) {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.join('\n') : raw;
  } catch {
    return raw;
  }
}

function serializeList(value: string) {
  return JSON.stringify(value.split('\n').map((item) => item.trim()).filter(Boolean));
}

export default function LandingContentManager({ content, setContent, onSave }: LandingContentManagerProps) {
  const [activeSection, setActiveSection] = useState(sections[0].id);
  const [savedSection, setSavedSection] = useState('');
  const section = sections.find((item) => item.id === activeSection) || sections[0];
  const keys = useMemo(() => Object.keys(content).filter((key) =>
    section.prefixes?.some((prefix) => key.startsWith(prefix)) || section.globals?.includes(key)
  ), [content, section]);

  const languageGroups = [
    { id: 'id', label: 'Bahasa Indonesia', keys: keys.filter((key) => key.startsWith('id.')) },
    { id: 'en', label: 'English', keys: keys.filter((key) => key.startsWith('en.')) },
    { id: 'global', label: 'Media & informasi global', keys: keys.filter((key) => key.startsWith('global.')) },
  ].filter((group) => group.keys.length > 0);

  async function saveSection() {
    const saveKeys = section.visibilityKey ? [...keys, section.visibilityKey] : keys;
    await onSave(saveKeys);
    setSavedSection(section.id);
    window.setTimeout(() => setSavedSection(''), 2200);
  }

  function update(key: string, value: string) {
    setContent({ ...content, [key]: isListField(key) ? serializeList(value) : value });
  }

  return (
    <section className="mt-7 overflow-hidden rounded-[1.5rem] border border-brand-900/8 bg-white">
      <div className="border-b border-brand-900/8 p-5 sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.15em] text-brand-600">Landing page CMS</p>
            <h1 className="mt-2 font-display text-3xl font-bold">Kelola seluruh konten per bagian</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">Teks dua bahasa, gambar, informasi bisnis, dan visibilitas setiap bagian kini dapat diubah tanpa mencari key teknis.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-[0.6rem] font-extrabold uppercase tracking-wider"><span className="rounded-full bg-brand-100 px-3 py-2 text-brand-700">Edit teks & media</span><span className="rounded-full bg-accent-100 px-3 py-2 text-brand-800">Atur visibilitas</span></div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr]">
        <nav className="flex gap-2 overflow-x-auto border-b border-brand-900/8 bg-[#f7f5ee] p-3 lg:block lg:space-y-1 lg:border-b-0 lg:border-r lg:p-4" aria-label="Bagian landing page">
          {sections.map(({ id, label, icon: Icon }) => (
            <button key={id} type="button" onClick={() => setActiveSection(id)} className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-left text-xs font-bold transition-colors lg:w-full ${activeSection === id ? 'bg-brand-950 text-white' : 'text-brand-700 hover:bg-white'}`}>
              <Icon className="h-4 w-4" strokeWidth={1.7} />{label}
            </button>
          ))}
        </nav>

        <div className="min-w-0 p-5 sm:p-7">
          <div className="flex flex-col gap-4 border-b border-brand-900/8 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold">{section.label}</h2>
              <p className="mt-1 text-xs leading-5 text-neutral-500">{section.description}</p>
            </div>
            {section.visibilityKey && (
              <label className="flex shrink-0 items-center gap-3 rounded-full border border-brand-900/10 bg-neutral-50 px-4 py-2.5 text-xs font-bold">
                <Eye className="h-4 w-4 text-brand-600" />
                Tampilkan bagian
                <input type="checkbox" className="h-4 w-4 accent-[#d7b51f]" checked={content[section.visibilityKey] !== 'false'} onChange={(event) => setContent({ ...content, [section.visibilityKey!]: event.target.checked ? 'true' : 'false' })} />
              </label>
            )}
          </div>

          <div className="mt-6 space-y-8">
            {languageGroups.map((group) => (
              <div key={group.id}>
                <div className="mb-3 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-accent-400" /><h3 className="text-xs font-extrabold uppercase tracking-[0.12em] text-brand-700">{group.label}</h3></div>
                <div className="grid gap-4 xl:grid-cols-2">
                  {group.keys.map((key) => {
                    const raw = content[key] || '';
                    const isMedia = key.endsWith('_image_url');
                    const multiline = !isMedia && (isListField(key) || raw.length > 72 || key.includes('description') || key.includes('headline'));
                    return (
                      <label key={key} className={multiline ? 'xl:col-span-2' : ''}>
                        <span className="form-label">{toFriendlyLabel(key)}</span>
                        {multiline ? (
                          <textarea rows={isListField(key) ? 4 : 3} className="form-input resize-y" value={isListField(key) ? listValue(raw) : raw} onChange={(event) => update(key, event.target.value)} />
                        ) : (
                          <><input className="form-input" value={raw} onChange={(event) => update(key, event.target.value)} />{isMedia && <CloudinaryUpload folder="rider-horse/landing" value={raw} onUpload={(url) => update(key, url)} />}</>
                        )}
                        {isListField(key) && <span className="mt-1 block text-[0.62rem] text-neutral-400">Tulis satu item per baris.</span>}
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="sticky bottom-3 mt-8 flex justify-end">
            <button type="button" onClick={() => void saveSection()} className="btn-primary shadow-xl">
              {savedSection === section.id ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              {savedSection === section.id ? 'Tersimpan' : `Simpan ${section.label}`}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
