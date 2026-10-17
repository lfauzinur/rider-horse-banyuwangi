'use client';

import { type FormEvent, useEffect, useMemo, useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, Minus, Plus, ShieldCheck, UsersRound } from 'lucide-react';
import DashboardShell from '@/components/app/DashboardShell';
import { useAuth } from '@/lib/use-auth';
import { useCatalog } from '@/lib/catalog-context';
import { createClient } from '@/lib/supabase/client';
import { addLocalBooking } from '@/lib/member-bookings';
import { formatCurrency } from '@/lib/utils';

export default function MemberBookingClient({ slug }: { slug: string }) {
  const router = useRouter(); const { configured, user, profile, loading } = useAuth('member'); const { trips } = useCatalog();
  const trip = useMemo(() => trips.find((item) => item.slug === slug && item.is_active), [trips, slug]);
  const [date, setDate] = useState(''); const [time, setTime] = useState('08:00'); const [pax, setPax] = useState(1); const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false); const [error, setError] = useState(''); const [minimumDate, setMinimumDate] = useState('');
  const [selectedService, setSelectedService] = useState<{ id: string; title: string; price: number } | null>(null);
  const [paymentPlan, setPaymentPlan] = useState<'dp' | 'full'>('dp'); const [paymentMethod, setPaymentMethod] = useState('Transfer Bank'); const [referralCode, setReferralCode] = useState('');
  useEffect(() => { const timer = window.setTimeout(() => { const tomorrow = new Date(Date.now() + 86_400_000); setMinimumDate(new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit' }).format(tomorrow)); try { const stored = window.localStorage.getItem('rider-horse-selected-service'); if (stored) setSelectedService(JSON.parse(stored)); } catch { /* keep empty */ } }, 0); return () => window.clearTimeout(timer); }, []);
  if (loading) return <div className="min-h-screen animate-pulse bg-[#f2f0e8]" />;
  const total = (trip?.price || 0) * pax + (selectedService?.price || 0); const payNow = paymentPlan === 'dp' ? Math.round(total * .3) : total;

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!trip) return; setSubmitting(true); setError('');
    const payload = { booking_date: date, time_slot: time, pax_count: pax, total_price: total, special_requests: [selectedService ? `Layanan: ${selectedService.title}` : '', notes].filter(Boolean).join(' — ') || null, service_id: selectedService?.id || null, service_name: selectedService?.title || null, payment_plan: paymentPlan, paid_amount: payNow, dp_amount: Math.round(total * .3), outstanding_amount: total - payNow, payment_status: paymentPlan === 'full' ? 'paid' as const : 'dp_paid' as const, payment_method: paymentMethod, created_by: 'member' as const, referral_code: referralCode.trim().toUpperCase() || null };
    if (!configured) { addLocalBooking(trip, payload); router.push('/dashboard/bookings?created=1'); return; }
    if (!user) { setSubmitting(false); setError('Sesi member tidak ditemukan. Silakan masuk kembali.'); return; }
    const supabase = createClient();
    const { data: created, error: insertError } = await supabase.from('bookings').insert({ ...payload, paid_amount: 0, outstanding_amount: total, payment_status: 'unpaid', user_id: user.id, trip_id: trip.id, status: 'pending', qr_code_token: `RH-${crypto.randomUUID().slice(0, 8).toUpperCase()}` }).select('id,member_id,total_price').single();
    if (!insertError && created) { const { error: paymentError } = await supabase.from('booking_payments').insert({ booking_id: created.id, member_id: created.member_id, member_name: profile?.full_name || 'Member', type: paymentPlan === 'full' ? 'full' : 'dp', amount: payNow, method: paymentMethod, status: 'paid', created_by: 'member' }); if (paymentError) { setSubmitting(false); return setError(paymentError.message); } }
    setSubmitting(false); if (insertError) return setError(insertError.message); router.push('/dashboard/bookings?created=1'); router.refresh();
  }

  return <DashboardShell role="member" userName={profile?.full_name || 'Demo Rider'} userEmail={profile?.email || 'preview@riderhorse.id'} canAccessAdmin={profile?.role === 'admin'}>
    {!trip ? <div className="rounded-3xl bg-white p-10 text-center"><h1 className="font-display text-3xl font-bold">Trip tidak ditemukan.</h1><Link href="/dashboard/trips" className="btn-primary mt-6">Kembali ke katalog</Link></div> : <>
      <Link href={`/dashboard/trips/${slug}`} className="mb-5 inline-flex items-center gap-2 text-xs font-bold text-brand-600"><ArrowLeft className="h-4 w-4" />Kembali ke detail trip</Link>
      <div className="grid overflow-hidden rounded-[1.75rem] border border-brand-900/8 bg-white xl:grid-cols-[.82fr_1.18fr]">
        <section className="relative min-h-[340px] bg-brand-950 xl:min-h-[760px]"><Image src={trip.cover_image_url || '/images/hero-banner.png'} alt={trip.title} fill priority sizes="(max-width:1279px) 100vw, 40vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/15 to-transparent" /><div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8"><p className="text-[.62rem] font-extrabold uppercase tracking-[.16em] text-accent-300">Booking member</p><h1 className="mt-3 font-display text-4xl font-bold">{trip.title}</h1><p className="mt-3 text-sm leading-6 text-white/60">{trip.short_description}</p><div className="mt-5 flex gap-4 text-xs text-white/70"><span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-accent-300" />{trip.duration_minutes} menit</span><span className="flex items-center gap-2"><UsersRound className="h-4 w-4 text-accent-300" />Maks. {trip.max_capacity}</span></div></div></section>
        <section className="p-6 sm:p-9 xl:p-11"><p className="text-[.62rem] font-extrabold uppercase tracking-[.16em] text-brand-600">Secure reservation</p><h2 className="mt-2 font-display text-3xl font-bold">Tentukan jadwal online</h2><p className="mt-3 text-sm leading-6 text-neutral-500">Jadwal, pembayaran, dan tiket tersimpan di akun member.</p>{error && <div className="mt-5 rounded-xl bg-red-50 p-4 text-xs text-red-700">{error}</div>}
          <form onSubmit={submitBooking} className="mt-7 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2"><Field label="Tanggal"><div className="relative"><CalendarDays className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" /><input type="date" className="form-input pl-10" min={minimumDate} value={date} onChange={e => setDate(e.target.value)} required /></div></Field><Field label="Waktu"><select className="form-select" value={time} onChange={e => setTime(e.target.value)}><option>08:00</option><option>10:00</option><option>14:00</option><option>16:00</option></select></Field></div>
            <div><span className="form-label">Jumlah rider</span><div className="flex items-center justify-between rounded-xl border border-neutral-200 p-2"><button type="button" onClick={() => setPax(v => Math.max(1, v - 1))} className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100" aria-label="Kurangi rider"><Minus className="h-4 w-4" /></button><span className="font-display text-2xl font-bold">{pax}</span><button type="button" onClick={() => setPax(v => Math.min(trip.max_capacity, v + 1))} className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-900 text-white" aria-label="Tambah rider"><Plus className="h-4 w-4" /></button></div></div>
            <Field label="Permintaan khusus"><textarea rows={3} className="form-input resize-none" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Contoh: rider pemula..." /></Field>
            {selectedService && <div className="rounded-2xl border border-brand-900/8 bg-brand-50 p-4"><div className="flex justify-between"><strong>{selectedService.title}</strong><strong>+{formatCurrency(selectedService.price)}</strong></div></div>}
            <div className="rounded-2xl bg-neutral-100 p-5"><div className="flex justify-between text-sm text-neutral-500"><span>{formatCurrency(trip.price)} × {pax}</span><span>{formatCurrency(trip.price * pax)}</span></div><div className="mt-4 flex justify-between border-t border-neutral-200 pt-4"><strong>Total</strong><strong className="font-display text-2xl text-brand-800">{formatCurrency(total)}</strong></div></div>
            <div className="grid gap-4 sm:grid-cols-2"><Field label="Pembayaran"><select className="form-select" value={paymentPlan} onChange={e => setPaymentPlan(e.target.value as 'dp'|'full')}><option value="dp">DP 30%</option><option value="full">Bayar penuh</option></select></Field><Field label="Metode"><select className="form-select" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}><option>Transfer Bank</option><option>QRIS</option><option>Kartu</option></select></Field></div>
            <Field label="Kode referral (opsional)"><input className="form-input uppercase" value={referralCode} onChange={e => setReferralCode(e.target.value)} placeholder="RIDERDEMO" /></Field>
            <div className="rounded-2xl border border-accent-400/30 bg-accent-100 p-4"><div className="flex justify-between"><span className="text-xs font-bold">Dibayar sekarang</span><strong className="font-display text-xl">{formatCurrency(payNow)}</strong></div>{paymentPlan === 'dp' && <p className="mt-2 text-xs text-brand-700">Sisa {formatCurrency(total - payNow)} dicatat di tiket booking.</p>}</div>
            <button disabled={submitting} className="btn-primary w-full disabled:opacity-50">{submitting ? 'Menyimpan...' : 'Konfirmasi Booking'} <CheckCircle2 className="h-4 w-4" /></button><p className="flex items-center justify-center gap-2 text-[.64rem] text-neutral-400"><ShieldCheck className="h-3.5 w-3.5" />Khusus member yang sudah masuk.</p>
          </form>
        </section>
      </div>
    </>}
  </DashboardShell>;
}

function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="block"><span className="form-label">{label}</span>{children}</label>; }
