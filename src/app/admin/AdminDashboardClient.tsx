'use client';

import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { BookOpenText, CalendarCheck2, CircleDollarSign, FilePenLine, Gauge, HandCoins, LayoutGrid, MessageSquareQuote, Newspaper, Plus, Settings2, Trash2, UserRoundPlus, UsersRound, WalletCards, X } from 'lucide-react';
import DashboardShell from '@/components/app/DashboardShell';
import LandingContentManager from '@/components/admin/LandingContentManager';
import AdminOperations from '@/components/admin/AdminOperations';
import CloudinaryUpload from '@/components/admin/CloudinaryUpload';
import { useAuth } from '@/lib/use-auth';
import { useCatalog, seededServices, seededTestimonials, type ManagedService, type ManagedTestimonial } from '@/lib/catalog-context';
import { getEditableContentDefaults } from '@/lib/content-defaults';
import { createClient } from '@/lib/supabase/client';
import { mockTrips } from '@/lib/mock-data';
import { seededArticles } from '@/lib/article-data';
import { formatCurrency, formatDate } from '@/lib/utils';
import { readBookings, readMembers } from '@/lib/operations';
import type { Article, Booking, Trip } from '@/types';

type AdminTab = 'overview' | 'content' | 'trips' | 'services' | 'testimonials' | 'articles' | 'members' | 'bookings' | 'finance' | 'referrals' | 'feedback';

const emptyTrip: Trip = {
  id: '', title: '', title_en: '', slug: '', description: '', description_en: '', short_description: '', short_description_en: '', duration_minutes: 60,
  price: 0, difficulty_level: 'Easy', max_capacity: 1, cover_image_url: '/images/hero-banner.png',
  gallery_images: [], category: 'beach_ride', highlights: [], highlights_en: [], is_active: true, created_at: '',
};

const emptyService: ManagedService = {
  id: '', icon: 'sparkles', title: '', titleId: '', description: '', descriptionId: '', features: [],
  featuresId: [], price: 0, suitableFor: [], suitableForId: [], image_url: '/images/hero-banner.png',
  is_active: true, sort_order: 0,
};

const emptyTestimonial: ManagedTestimonial = {
  id: '', name: '', location: '', avatar: null, rating: 5, text: '', textEn: '', trip: '', is_active: true, sort_order: 0,
};

const emptyArticle: Article = {
  id: '', title: '', title_en: '', slug: '', excerpt: '', excerpt_en: '', content: '', content_en: '', cover_image_url: '/images/hero-banner.png',
  author: 'Tim Rider Horse', published_at: '', is_published: true, created_at: '',
};

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="form-label">{label}</span>{children}</label>;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <section className="mt-7 min-h-[calc(100vh-12rem)] w-full rounded-[1.5rem] border border-brand-900/8 bg-white p-5 sm:p-7 lg:p-9">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-7 flex items-center justify-between gap-4 border-b border-brand-900/8 pb-5"><div><p className="text-[.6rem] font-extrabold uppercase tracking-[.16em] text-brand-600">Admin editor</p><h1 className="mt-2 font-display text-3xl font-bold">{title}</h1></div><button type="button" onClick={onClose} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand-900/10 bg-neutral-100" aria-label="Kembali ke daftar"><X className="h-5 w-5" /></button></div>
        {children}
      </div>
    </section>
  );
}

export default function AdminDashboardClient() {
  const { configured, profile, loading } = useAuth('admin');
  const catalog = useCatalog();
  const [tab, setTab] = useState<AdminTab>('overview');
  const [trips, setTrips] = useState<Trip[]>(catalog.trips);
  const [services, setServices] = useState<ManagedService[]>(catalog.services);
  const [testimonials, setTestimonials] = useState<ManagedTestimonial[]>(catalog.testimonials);
  const [articles, setArticles] = useState<Article[]>(catalog.articles);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [memberCount, setMemberCount] = useState(0);
  const [content, setContent] = useState<Record<string, string>>(getEditableContentDefaults());
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [editingService, setEditingService] = useState<ManagedService | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<ManagedTestimonial | null>(null);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    async function load() {
      if (!configured) {
        try {
          const localCatalog = window.localStorage.getItem('rider-horse-catalog');
          const localContent = window.localStorage.getItem('rider-horse-content');
          if (localCatalog) {
            const parsed = JSON.parse(localCatalog);
            setTrips(parsed.trips || mockTrips);
            setServices(parsed.services || seededServices);
            setTestimonials(parsed.testimonials || seededTestimonials);
            setArticles(parsed.articles || seededArticles);
          }
          if (localContent) setContent({ ...getEditableContentDefaults(), ...JSON.parse(localContent) });
          setBookings(readBookings());
          setMemberCount(readMembers().length);
        } catch {
          // Bundled defaults remain available.
        }
        return;
      }

      const supabase = createClient();
      const [tripRows, serviceRows, testimonialRows, articleRows, bookingRows, contentRows, memberRows] = await Promise.all([
        supabase.from('trips').select('*').order('created_at'),
        supabase.from('services').select('*').order('sort_order'),
        supabase.from('testimonials').select('*').order('sort_order'),
        supabase.from('articles').select('*').order('published_at', { ascending: false }),
        supabase.from('bookings').select('*, trip:trips(*)').order('created_at', { ascending: false }),
        supabase.from('site_content').select('*'),
        supabase.from('member_directory').select('id', { count: 'exact', head: true }),
      ]);
      if (tripRows.data?.length) setTrips(tripRows.data as Trip[]);
      if (serviceRows.data?.length) setServices(serviceRows.data.map(mapServiceRow));
      if (testimonialRows.data?.length) setTestimonials(testimonialRows.data.map(mapTestimonialRow));
      if (articleRows.data?.length) setArticles(articleRows.data as Article[]);
      if (bookingRows.data) setBookings(bookingRows.data as Booking[]);
      if (contentRows.data) setContent({ ...getEditableContentDefaults(), ...Object.fromEntries(contentRows.data.map((item) => [item.key, item.value])) });
      if (memberRows.count !== null) setMemberCount(memberRows.count);
    }
    void load();
  }, [configured]);

  function persistLocalCatalog(nextTrips = trips, nextServices = services, nextTestimonials = testimonials, nextArticles = articles) {
    window.localStorage.setItem('rider-horse-catalog', JSON.stringify({ trips: nextTrips, services: nextServices, testimonials: nextTestimonials, articles: nextArticles }));
    window.dispatchEvent(new Event('rider-catalog-updated'));
  }

  function showNotice(text: string) {
    setNotice(text);
    window.setTimeout(() => setNotice(''), 2400);
  }

  async function saveContent(keys: string[]) {
    if (configured) {
      const rows = keys.map((key) => ({ key, value: content[key], updated_at: new Date().toISOString() }));
      const { error } = await createClient().from('site_content').upsert(rows);
      if (error) return showNotice(error.message);
    } else {
      window.localStorage.setItem('rider-horse-content', JSON.stringify(content));
      window.dispatchEvent(new Event('rider-content-updated'));
    }
    showNotice('Konten berhasil disimpan.');
  }

  async function saveTrip(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingTrip) return;
    const payload = { ...editingTrip, id: editingTrip.id || crypto.randomUUID(), created_at: editingTrip.created_at || new Date().toISOString() };
    if (configured) {
      const { error } = await createClient().from('trips').upsert(payload);
      if (error) return showNotice(error.message);
    }
    const next = trips.some((item) => item.id === payload.id) ? trips.map((item) => item.id === payload.id ? payload : item) : [...trips, payload];
    setTrips(next);
    if (!configured) persistLocalCatalog(next, services, testimonials);
    setEditingTrip(null);
    showNotice('Trip berhasil disimpan.');
  }

  async function deleteTrip(id: string) {
    if (!window.confirm('Hapus trip ini? Booking yang sudah ada akan tetap dilindungi oleh database.')) return;
    if (configured) {
      const { error } = await createClient().from('trips').delete().eq('id', id);
      if (error) return showNotice(error.message);
    }
    const next = trips.filter((item) => item.id !== id);
    setTrips(next);
    if (!configured) persistLocalCatalog(next, services, testimonials);
    showNotice('Trip dihapus.');
  }

  async function saveService(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingService) return;
    const payload = { ...editingService, id: editingService.id || crypto.randomUUID() };
    if (configured) {
      const { error } = await createClient().from('services').upsert(serviceToRow(payload));
      if (error) return showNotice(error.message);
    }
    const next = services.some((item) => item.id === payload.id) ? services.map((item) => item.id === payload.id ? payload : item) : [...services, payload];
    setServices(next);
    if (!configured) persistLocalCatalog(trips, next, testimonials);
    setEditingService(null);
    showNotice('Layanan berhasil disimpan.');
  }

  async function deleteService(id: string) {
    if (!window.confirm('Hapus layanan ini dari landing page?')) return;
    if (configured) {
      const { error } = await createClient().from('services').delete().eq('id', id);
      if (error) return showNotice(error.message);
    }
    const next = services.filter((item) => item.id !== id);
    setServices(next);
    if (!configured) persistLocalCatalog(trips, next, testimonials);
  }

  async function saveTestimonial(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingTestimonial) return;
    const payload = { ...editingTestimonial, id: editingTestimonial.id || crypto.randomUUID() };
    if (configured) {
      const { error } = await createClient().from('testimonials').upsert(testimonialToRow(payload));
      if (error) return showNotice(error.message);
    }
    const next = testimonials.some((item) => item.id === payload.id) ? testimonials.map((item) => item.id === payload.id ? payload : item) : [...testimonials, payload];
    setTestimonials(next);
    if (!configured) persistLocalCatalog(trips, services, next);
    setEditingTestimonial(null);
    showNotice('Testimoni berhasil disimpan.');
  }

  async function deleteTestimonial(id: string) {
    if (!window.confirm('Hapus testimoni ini?')) return;
    if (configured) {
      const { error } = await createClient().from('testimonials').delete().eq('id', id);
      if (error) return showNotice(error.message);
    }
    const next = testimonials.filter((item) => item.id !== id);
    setTestimonials(next);
    if (!configured) persistLocalCatalog(trips, services, next);
  }

  async function saveArticle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingArticle) return;
    const payload: Article = {
      ...editingArticle,
      id: editingArticle.id || crypto.randomUUID(),
      published_at: editingArticle.published_at || new Date().toISOString().slice(0, 10),
      created_at: editingArticle.created_at || new Date().toISOString(),
    };
    if (configured) {
      const { error } = await createClient().from('articles').upsert(payload);
      if (error) return showNotice(error.message);
    }
    const next = articles.some((item) => item.id === payload.id)
      ? articles.map((item) => item.id === payload.id ? payload : item)
      : [payload, ...articles];
    setArticles(next);
    if (!configured) persistLocalCatalog(trips, services, testimonials, next);
    else window.dispatchEvent(new Event('rider-catalog-updated'));
    setEditingArticle(null);
    showNotice('Artikel berhasil disimpan.');
  }

  async function deleteArticle(id: string) {
    if (!window.confirm('Hapus artikel ini?')) return;
    if (configured) {
      const { error } = await createClient().from('articles').delete().eq('id', id);
      if (error) return showNotice(error.message);
    }
    const next = articles.filter((item) => item.id !== id);
    setArticles(next);
    if (!configured) persistLocalCatalog(trips, services, testimonials, next);
    else window.dispatchEvent(new Event('rider-catalog-updated'));
    showNotice('Artikel dihapus.');
  }

  if (loading) return <div className="min-h-screen animate-pulse bg-[#f2f0e8]" />;

  const revenue = bookings.filter((booking) => booking.status !== 'cancelled').reduce((sum, booking) => sum + Number(booking.paid_amount || 0), 0);
  const tabs: { key: AdminTab; label: string; icon: typeof Gauge }[] = [
    { key: 'overview', label: 'Ringkasan', icon: Gauge }, { key: 'content', label: 'Konten', icon: BookOpenText },
    { key: 'trips', label: 'Trip', icon: LayoutGrid }, { key: 'services', label: 'Layanan', icon: Settings2 },
    { key: 'testimonials', label: 'Testimoni', icon: MessageSquareQuote }, { key: 'articles', label: 'Artikel', icon: Newspaper },
    { key: 'members', label: 'Member', icon: UserRoundPlus }, { key: 'bookings', label: 'Booking', icon: CalendarCheck2 },
    { key: 'finance', label: 'Transaksi & Laporan', icon: WalletCards }, { key: 'referrals', label: 'Referral', icon: HandCoins },
    { key: 'feedback', label: 'Saran Member', icon: MessageSquareQuote },
  ];
  const editorOpen = Boolean(editingTrip || editingService || editingTestimonial || editingArticle);

  return (
    <DashboardShell
      role="admin"
      userName={profile?.full_name || 'Admin Preview'}
      userEmail={profile?.email || 'admin@riderhorse.id'}
      adminSections={tabs}
      activeAdminSection={tab}
      onAdminSectionChange={(section) => setTab(section as AdminTab)}
    >
      {notice && <div role="status" className="fixed right-5 top-20 z-[120] rounded-xl bg-brand-950 px-4 py-3 text-xs font-bold text-white shadow-xl">{notice}</div>}

      {!editorOpen && tab === 'overview' && <Overview memberCount={memberCount} articles={articles} bookings={bookings} revenue={revenue} onNavigate={setTab} />}

      {!editorOpen && tab === 'content' && <LandingContentManager content={content} setContent={setContent} onSave={saveContent} />}

      {!editorOpen && tab === 'trips' && <ResourceSection title="Katalog Trip" subtitle="Kelola seluruh paket, harga, kapasitas, dan status publik." onAdd={() => setEditingTrip({ ...emptyTrip })}>{trips.map((trip) => <ResourceCard key={trip.id} title={trip.title} meta={`${formatCurrency(trip.price)} • ${trip.duration_minutes} menit • Maks ${trip.max_capacity}`} active={trip.is_active} onEdit={() => setEditingTrip({ ...trip })} onDelete={() => void deleteTrip(trip.id)} />)}</ResourceSection>}
      {!editorOpen && tab === 'services' && <ResourceSection title="Program & Layanan" subtitle="Konten layanan yang tampil pada landing page." onAdd={() => setEditingService({ ...emptyService })}>{services.map((service) => <ResourceCard key={service.id} title={service.titleId} meta={`${formatCurrency(service.price)} • Urutan ${service.sort_order + 1}`} active={service.is_active} onEdit={() => setEditingService({ ...service })} onDelete={() => void deleteService(service.id)} />)}</ResourceSection>}
      {!editorOpen && tab === 'testimonials' && <ResourceSection title="Testimoni Rider" subtitle="Kelola social proof dan rating yang tampil di website." onAdd={() => setEditingTestimonial({ ...emptyTestimonial })}>{testimonials.map((item) => <ResourceCard key={item.id} title={item.name} meta={`${item.location} • ${item.rating}/5 • ${item.trip}`} active={item.is_active} onEdit={() => setEditingTestimonial({ ...item })} onDelete={() => void deleteTestimonial(item.id)} />)}</ResourceSection>}
      {!editorOpen && tab === 'articles' && <ResourceSection title="Artikel & Rider Journal" subtitle="Tulis, simpan sebagai draft, dan publikasikan artikel untuk visitor serta member." onAdd={() => setEditingArticle({ ...emptyArticle })}>{articles.map((article) => <ResourceCard key={article.id} title={article.title} meta={`${article.author} • ${article.published_at || 'Belum dijadwalkan'}`} active={article.is_published} onEdit={() => setEditingArticle({ ...article })} onDelete={() => void deleteArticle(article.id)} />)}</ResourceSection>}

      {!editorOpen && (['members', 'bookings', 'finance', 'referrals', 'feedback'] as AdminTab[]).includes(tab) && <AdminOperations view={tab as 'members' | 'bookings' | 'finance' | 'referrals' | 'feedback'} trips={trips} services={services} onBookingsChange={setBookings} onMembersChange={setMemberCount} />}

      {editingTrip && <TripModal trip={editingTrip} setTrip={setEditingTrip} onClose={() => setEditingTrip(null)} onSave={saveTrip} />}
      {editingService && <ServiceModal service={editingService} setService={setEditingService} onClose={() => setEditingService(null)} onSave={saveService} />}
      {editingTestimonial && <TestimonialModal item={editingTestimonial} setItem={setEditingTestimonial} onClose={() => setEditingTestimonial(null)} onSave={saveTestimonial} />}
      {editingArticle && <ArticleModal article={editingArticle} setArticle={setEditingArticle} onClose={() => setEditingArticle(null)} onSave={saveArticle} />}
    </DashboardShell>
  );
}

function Overview({ memberCount, articles, bookings, revenue, onNavigate }: { memberCount: number; articles: Article[]; bookings: Booking[]; revenue: number; onNavigate: (tab: AdminTab) => void }) {
  const pendingBookings = bookings.filter((item) => item.status === 'pending').length;
  const publishedArticles = articles.filter((item) => item.is_published).length;
  const stats = [
    { label: 'Total member', value: memberCount, detail: 'Member terdaftar', icon: UsersRound },
    { label: 'Total booking', value: bookings.length, detail: `${pendingBookings} menunggu konfirmasi`, icon: CalendarCheck2 },
    { label: 'Total artikel', value: articles.length, detail: `${publishedArticles} sudah terbit`, icon: Newspaper },
    { label: 'Pendapatan diterima', value: formatCurrency(revenue), detail: 'DP dan pelunasan tercatat', icon: CircleDollarSign },
  ];
  const recentBookings = bookings.slice(0, 5);

  return (
    <>
      <section className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-brand-600">Admin overview</p>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Ringkasan bisnis hari ini.</h1>
          <p className="mt-2 text-sm text-neutral-500">Pantau data utama Rider Horse tanpa masuk ke aplikasi member.</p>
        </div>
        <button type="button" onClick={() => onNavigate('finance')} className="btn-outline btn-sm">Lihat laporan transaksi</button>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, detail, icon: Icon }) => (
          <article key={label} className="rounded-2xl border border-brand-900/8 bg-white p-5 shadow-[0_14px_40px_rgba(10,38,28,0.04)]">
            <div className="flex items-start justify-between gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-700"><Icon className="h-5 w-5" strokeWidth={1.8} /></span>
              <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[0.56rem] font-extrabold uppercase tracking-wider text-neutral-500">Live</span>
            </div>
            <p className="mt-5 text-2xl font-bold text-brand-950">{value}</p>
            <p className="mt-1 text-sm font-semibold text-brand-900">{label}</p>
            <p className="mt-1 text-[0.68rem] text-neutral-400">{detail}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-5 xl:grid-cols-[1.55fr_.65fr]">
        <div className="overflow-hidden rounded-2xl border border-brand-900/8 bg-white">
          <div className="flex items-center justify-between gap-4 border-b border-neutral-100 p-5 sm:p-6">
            <div><h2 className="font-display text-xl font-bold">Booking terbaru</h2><p className="mt-1 text-xs text-neutral-500">Reservasi terbaru dari member dan admin.</p></div>
            <button type="button" onClick={() => onNavigate('bookings')} className="text-xs font-extrabold text-brand-700">Lihat semua →</button>
          </div>
          {recentBookings.length === 0 ? (
            <div className="p-8 text-center text-sm text-neutral-500">Belum ada booking. Data reservasi baru akan tampil di sini.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-neutral-100 text-[0.58rem] font-extrabold uppercase tracking-wider text-neutral-500"><tr><th className="px-6 py-4">Member</th><th className="px-6 py-4">Trip</th><th className="px-6 py-4">Jadwal</th><th className="px-6 py-4">Total</th><th className="px-6 py-4">Status</th></tr></thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="border-t border-neutral-100">
                      <td className="px-6 py-4"><strong className="block text-brand-950">{booking.customer_name || booking.user?.full_name || 'Member'}</strong><span className="mt-1 block text-[0.65rem] text-neutral-400">{booking.qr_code_token || booking.id.slice(0, 8)}</span></td>
                      <td className="px-6 py-4 font-semibold">{booking.trip?.title || booking.trip_id}</td>
                      <td className="px-6 py-4 text-neutral-500">{formatDate(booking.booking_date)}<span className="block text-xs">{booking.time_slot} WIB</span></td>
                      <td className="px-6 py-4 font-bold">{formatCurrency(booking.total_price)}</td>
                      <td className="px-6 py-4"><span className={`rounded-full px-2.5 py-1 text-[0.58rem] font-extrabold uppercase ${booking.status === 'confirmed' || booking.status === 'completed' ? 'bg-brand-100 text-brand-700' : booking.status === 'cancelled' ? 'bg-red-50 text-red-600' : 'bg-accent-100 text-brand-800'}`}>{booking.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <aside className="rounded-2xl bg-brand-950 p-6 text-white">
          <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.16em] text-accent-300">Akses cepat</p>
          <h2 className="mt-3 font-display text-2xl font-bold">Kelola data utama.</h2>
          <p className="mt-3 text-xs leading-6 text-white/52">Semua pengelolaan tetap berada di Admin Console, terpisah dari pengalaman member.</p>
          <div className="mt-6 grid gap-2">
            <button type="button" onClick={() => onNavigate('members')} className="flex items-center justify-between rounded-xl bg-white/8 px-4 py-3 text-left text-xs font-bold hover:bg-white/12"><span>Data member</span><span>{memberCount}</span></button>
            <button type="button" onClick={() => onNavigate('bookings')} className="flex items-center justify-between rounded-xl bg-white/8 px-4 py-3 text-left text-xs font-bold hover:bg-white/12"><span>Booking menunggu</span><span>{pendingBookings}</span></button>
            <button type="button" onClick={() => onNavigate('articles')} className="flex items-center justify-between rounded-xl bg-white/8 px-4 py-3 text-left text-xs font-bold hover:bg-white/12"><span>Artikel terbit</span><span>{publishedArticles}</span></button>
          </div>
        </aside>
      </section>
    </>
  );
}

function ResourceSection({ title, subtitle, onAdd, children }: { title: string; subtitle: string; onAdd: () => void; children: ReactNode }) {
  return <section className="mt-7 rounded-[1.5rem] border border-brand-900/8 bg-white p-5 sm:p-7"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div className="min-w-0"><h1 className="font-display text-3xl font-bold">{title}</h1><p className="mt-2 text-sm text-neutral-500">{subtitle}</p></div><button type="button" onClick={onAdd} className="btn-primary btn-sm self-start sm:self-auto"><Plus className="h-4 w-4" />Tambah</button></div><div className="mt-7 grid grid-cols-1 gap-3">{children}</div></section>;
}

function ResourceCard({ title, meta, active, onEdit, onDelete }: { title: string; meta: string; active: boolean; onEdit: () => void; onDelete: () => void }) {
  return <article className="flex flex-col gap-4 rounded-xl border border-brand-900/8 p-4 sm:flex-row sm:items-center"><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="truncate font-bold">{title}</h2><span className={`rounded-full px-2 py-1 text-[0.56rem] font-extrabold uppercase ${active ? 'bg-brand-100 text-brand-700' : 'bg-neutral-100 text-neutral-500'}`}>{active ? 'Aktif' : 'Draft'}</span></div><p className="mt-1 text-xs text-neutral-500">{meta}</p></div><div className="flex gap-2"><button type="button" onClick={onEdit} className="flex h-9 items-center gap-2 rounded-full border border-brand-900/10 px-3 text-xs font-bold"><FilePenLine className="h-3.5 w-3.5" />Edit</button><button type="button" onClick={onDelete} className="flex h-9 w-9 items-center justify-center rounded-full border border-red-200 text-red-600" aria-label={`Hapus ${title}`}><Trash2 className="h-3.5 w-3.5" /></button></div></article>;
}

function TripModal({ trip, setTrip, onClose, onSave }: { trip: Trip; setTrip: (trip: Trip) => void; onClose: () => void; onSave: (event: FormEvent<HTMLFormElement>) => void }) {
  return <Modal title={trip.id ? 'Edit Trip' : 'Tambah Trip'} onClose={onClose}><form onSubmit={onSave} className="grid gap-4 sm:grid-cols-2"><Field label="Nama trip Indonesia"><input className="form-input" value={trip.title} onChange={(e) => setTrip({ ...trip, title: e.target.value })} required /></Field><Field label="Nama trip Inggris"><input className="form-input" value={trip.title_en || ''} onChange={(e) => setTrip({ ...trip, title_en: e.target.value })} required /></Field><Field label="Slug"><input className="form-input" value={trip.slug} onChange={(e) => setTrip({ ...trip, slug: e.target.value })} required /></Field><div className="sm:col-span-2 grid gap-4 sm:grid-cols-2"><Field label="Deskripsi singkat Indonesia"><textarea className="form-input" rows={3} value={trip.short_description || ''} onChange={(e) => setTrip({ ...trip, short_description: e.target.value })} required /></Field><Field label="Deskripsi singkat Inggris"><textarea className="form-input" rows={3} value={trip.short_description_en || ''} onChange={(e) => setTrip({ ...trip, short_description_en: e.target.value })} required /></Field></div><div className="sm:col-span-2 grid gap-4 sm:grid-cols-2"><Field label="Deskripsi lengkap Indonesia"><textarea className="form-input" rows={5} value={trip.description || ''} onChange={(e) => setTrip({ ...trip, description: e.target.value })} required /></Field><Field label="Deskripsi lengkap Inggris"><textarea className="form-input" rows={5} value={trip.description_en || ''} onChange={(e) => setTrip({ ...trip, description_en: e.target.value })} required /></Field></div><Field label="Harga"><input type="number" className="form-input" value={trip.price} onChange={(e) => setTrip({ ...trip, price: Number(e.target.value) })} required /></Field><Field label="Durasi (menit)"><input type="number" className="form-input" value={trip.duration_minutes} onChange={(e) => setTrip({ ...trip, duration_minutes: Number(e.target.value) })} required /></Field><Field label="Kapasitas"><input type="number" className="form-input" value={trip.max_capacity} onChange={(e) => setTrip({ ...trip, max_capacity: Number(e.target.value) })} required /></Field><Field label="Tingkat"><select className="form-select" value={trip.difficulty_level} onChange={(e) => setTrip({ ...trip, difficulty_level: e.target.value as Trip['difficulty_level'] })}><option>Easy</option><option>Moderate</option><option>Challenging</option></select></Field><Field label="Kategori"><select className="form-select" value={trip.category} onChange={(e) => setTrip({ ...trip, category: e.target.value as Trip['category'] })}><option value="beach_ride">Beach ride</option><option value="forest_trail">Forest trail</option><option value="sunset_ride">Sunset ride</option><option value="mountain_trail">Mountain trail</option><option value="private_lesson">Private lesson</option><option value="group_class">Group class</option></select></Field><div><Field label="URL gambar"><input className="form-input" value={trip.cover_image_url || ''} onChange={(e) => setTrip({ ...trip, cover_image_url: e.target.value })} /></Field><CloudinaryUpload folder="rider-horse/trips" value={trip.cover_image_url} onUpload={(url) => setTrip({ ...trip, cover_image_url: url })} /></div><Field label="Highlights Indonesia (satu per baris)"><textarea className="form-input" rows={4} value={(trip.highlights || []).join('\n')} onChange={(e) => setTrip({ ...trip, highlights: e.target.value.split('\n').filter(Boolean) })} required /></Field><Field label="Highlights Inggris (satu per baris)"><textarea className="form-input" rows={4} value={(trip.highlights_en || []).join('\n')} onChange={(e) => setTrip({ ...trip, highlights_en: e.target.value.split('\n').filter(Boolean) })} required /></Field><label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={trip.is_active} onChange={(e) => setTrip({ ...trip, is_active: e.target.checked })} /> Tampilkan di website</label><div className="flex justify-end gap-2 sm:col-span-2"><button type="button" onClick={onClose} className="btn-outline">Batal</button><button type="submit" className="btn-primary">Simpan Trip</button></div></form></Modal>;
}

function ServiceModal({ service, setService, onClose, onSave }: { service: ManagedService; setService: (service: ManagedService) => void; onClose: () => void; onSave: (event: FormEvent<HTMLFormElement>) => void }) {
  return <Modal title={service.id ? 'Edit Layanan' : 'Tambah Layanan'} onClose={onClose}><form onSubmit={onSave} className="grid gap-4 sm:grid-cols-2"><Field label="Judul Indonesia"><input className="form-input" value={service.titleId} onChange={(e) => setService({ ...service, titleId: e.target.value })} required /></Field><Field label="Judul Inggris"><input className="form-input" value={service.title} onChange={(e) => setService({ ...service, title: e.target.value })} required /></Field><div className="sm:col-span-2"><Field label="Deskripsi Indonesia"><textarea className="form-input" rows={3} value={service.descriptionId} onChange={(e) => setService({ ...service, descriptionId: e.target.value })} /></Field></div><div className="sm:col-span-2"><Field label="Deskripsi Inggris"><textarea className="form-input" rows={3} value={service.description} onChange={(e) => setService({ ...service, description: e.target.value })} /></Field></div><Field label="Harga"><input type="number" className="form-input" value={service.price} onChange={(e) => setService({ ...service, price: Number(e.target.value) })} /></Field><Field label="Urutan"><input type="number" className="form-input" value={service.sort_order} onChange={(e) => setService({ ...service, sort_order: Number(e.target.value) })} /></Field><div className="sm:col-span-2"><Field label="URL gambar"><input className="form-input" value={service.image_url} onChange={(e) => setService({ ...service, image_url: e.target.value })} /></Field><CloudinaryUpload folder="rider-horse/services" value={service.image_url} onUpload={(url) => setService({ ...service, image_url: url })} /></div><Field label="Fitur Indonesia"><textarea className="form-input" rows={4} value={service.featuresId.join('\n')} onChange={(e) => setService({ ...service, featuresId: e.target.value.split('\n').filter(Boolean) })} /></Field><Field label="Fitur Inggris"><textarea className="form-input" rows={4} value={service.features.join('\n')} onChange={(e) => setService({ ...service, features: e.target.value.split('\n').filter(Boolean) })} /></Field><label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={service.is_active} onChange={(e) => setService({ ...service, is_active: e.target.checked })} /> Aktif</label><div className="flex justify-end gap-2 sm:col-span-2"><button type="button" onClick={onClose} className="btn-outline">Batal</button><button type="submit" className="btn-primary">Simpan Layanan</button></div></form></Modal>;
}

function TestimonialModal({ item, setItem, onClose, onSave }: { item: ManagedTestimonial; setItem: (item: ManagedTestimonial) => void; onClose: () => void; onSave: (event: FormEvent<HTMLFormElement>) => void }) {
  return <Modal title={item.id ? 'Edit Testimoni' : 'Tambah Testimoni'} onClose={onClose}><form onSubmit={onSave} className="grid gap-4 sm:grid-cols-2"><Field label="Nama"><input className="form-input" value={item.name} onChange={(e) => setItem({ ...item, name: e.target.value })} required /></Field><Field label="Lokasi"><input className="form-input" value={item.location} onChange={(e) => setItem({ ...item, location: e.target.value })} /></Field><Field label="Nama trip"><input className="form-input" value={item.trip} onChange={(e) => setItem({ ...item, trip: e.target.value })} /></Field><Field label="Rating"><input type="number" min="1" max="5" className="form-input" value={item.rating} onChange={(e) => setItem({ ...item, rating: Number(e.target.value) })} /></Field><div className="sm:col-span-2"><Field label="Testimoni Indonesia"><textarea className="form-input" rows={4} value={item.text} onChange={(e) => setItem({ ...item, text: e.target.value })} required /></Field></div><div className="sm:col-span-2"><Field label="Testimoni Inggris"><textarea className="form-input" rows={4} value={item.textEn} onChange={(e) => setItem({ ...item, textEn: e.target.value })} /></Field></div><label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={item.is_active} onChange={(e) => setItem({ ...item, is_active: e.target.checked })} /> Tampilkan</label><div className="flex justify-end gap-2 sm:col-span-2"><button type="button" onClick={onClose} className="btn-outline">Batal</button><button type="submit" className="btn-primary">Simpan Testimoni</button></div></form></Modal>;
}

function ArticleModal({ article, setArticle, onClose, onSave }: { article: Article; setArticle: (article: Article) => void; onClose: () => void; onSave: (event: FormEvent<HTMLFormElement>) => void }) {
  return <Modal title={article.id ? 'Edit Artikel' : 'Tambah Artikel'} onClose={onClose}><form onSubmit={onSave} className="grid gap-4 sm:grid-cols-2"><Field label="Judul Indonesia"><input className="form-input" value={article.title} onChange={(e) => setArticle({ ...article, title: e.target.value })} required /></Field><Field label="Judul Inggris"><input className="form-input" value={article.title_en || ''} onChange={(e) => setArticle({ ...article, title_en: e.target.value })} required /></Field><Field label="Slug URL"><input className="form-input" value={article.slug} onChange={(e) => setArticle({ ...article, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') })} required /></Field><Field label="Penulis"><input className="form-input" value={article.author} onChange={(e) => setArticle({ ...article, author: e.target.value })} required /></Field><Field label="Ringkasan Indonesia"><textarea className="form-input" rows={4} value={article.excerpt} onChange={(e) => setArticle({ ...article, excerpt: e.target.value })} required /></Field><Field label="Ringkasan Inggris"><textarea className="form-input" rows={4} value={article.excerpt_en || ''} onChange={(e) => setArticle({ ...article, excerpt_en: e.target.value })} required /></Field><Field label="Isi Indonesia (pisahkan paragraf dengan satu baris kosong)"><textarea className="form-input" rows={12} value={article.content} onChange={(e) => setArticle({ ...article, content: e.target.value })} required /></Field><Field label="Isi Inggris (pisahkan paragraf dengan satu baris kosong)"><textarea className="form-input" rows={12} value={article.content_en || ''} onChange={(e) => setArticle({ ...article, content_en: e.target.value })} required /></Field><Field label="Tanggal terbit"><input type="date" className="form-input" value={article.published_at.slice(0, 10)} onChange={(e) => setArticle({ ...article, published_at: e.target.value })} required /></Field><div><Field label="URL gambar sampul"><input className="form-input" value={article.cover_image_url || ''} onChange={(e) => setArticle({ ...article, cover_image_url: e.target.value })} /></Field><CloudinaryUpload folder="rider-horse/articles" value={article.cover_image_url} onUpload={(url) => setArticle({ ...article, cover_image_url: url })} /></div><label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={article.is_published} onChange={(e) => setArticle({ ...article, is_published: e.target.checked })} /> Publikasikan untuk visitor & member</label><div className="flex justify-end gap-2 sm:col-span-2"><button type="button" onClick={onClose} className="btn-outline">Batal</button><button type="submit" className="btn-primary">Simpan Artikel</button></div></form></Modal>;
}

function mapServiceRow(row: Record<string, unknown>): ManagedService {
  return { id: String(row.id), icon: String(row.icon || 'sparkles'), title: String(row.title || ''), titleId: String(row.title_id || ''), description: String(row.description || ''), descriptionId: String(row.description_id || ''), features: Array.isArray(row.features) ? row.features.map(String) : [], featuresId: Array.isArray(row.features_id) ? row.features_id.map(String) : [], price: Number(row.price || 0), suitableFor: Array.isArray(row.suitable_for) ? row.suitable_for.map(String) : [], suitableForId: Array.isArray(row.suitable_for_id) ? row.suitable_for_id.map(String) : [], image_url: String(row.image_url || '/images/hero-banner.png'), is_active: Boolean(row.is_active), sort_order: Number(row.sort_order || 0) };
}

function serviceToRow(item: ManagedService) {
  return { id: item.id, icon: item.icon, title: item.title, title_id: item.titleId, description: item.description, description_id: item.descriptionId, features: item.features, features_id: item.featuresId, price: item.price, suitable_for: item.suitableFor, suitable_for_id: item.suitableForId, image_url: item.image_url, is_active: item.is_active, sort_order: item.sort_order };
}

function mapTestimonialRow(row: Record<string, unknown>): ManagedTestimonial {
  return { id: String(row.id), name: String(row.name || ''), location: String(row.location || ''), avatar: row.avatar_url ? String(row.avatar_url) : null, rating: Number(row.rating || 5), text: String(row.text || ''), textEn: String(row.text_en || ''), trip: String(row.trip || ''), is_active: Boolean(row.is_active), sort_order: Number(row.sort_order || 0) };
}

function testimonialToRow(item: ManagedTestimonial) {
  return { id: item.id, name: item.name, location: item.location, avatar_url: item.avatar, rating: item.rating, text: item.text, text_en: item.textEn, trip: item.trip, is_active: item.is_active, sort_order: item.sort_order };
}
