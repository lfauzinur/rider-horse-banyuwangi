'use client';

import { mockTrips } from '@/lib/mock-data';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import type { Booking, MemberFeedback, OperationalMember, PaymentTransaction, ReferralRecord, Trip } from '@/types';

export const OPERATIONS_EVENT = 'rider-operations-updated';
const KEYS = {
  members: 'rider-horse-members', bookings: 'rider-horse-member-bookings', payments: 'rider-horse-payments',
  referrals: 'rider-horse-referrals', feedback: 'rider-horse-feedback', profile: 'rider-horse-preview-profile',
};

export const previewMembers: OperationalMember[] = [
  { id: 'preview-member', auth_user_id: 'preview-member', email: 'member@riderhorse.id', full_name: 'Demo Rider', phone_number: '0812 3456 7890', address: 'Banyuwangi', riding_level: 'Beginner', helmet_size: 'M', boot_size: '40', emergency_contact_name: 'Keluarga Demo', emergency_contact_phone: '0812 0000 1111', referral_code: 'RIDERDEMO', referral_balance: 125000, status: 'active', created_at: '2026-10-15T08:00:00+07:00' },
  { id: 'member-nadia', email: 'nadia@example.com', full_name: 'Nadia Putri', phone_number: '0813 2200 7841', address: 'Genteng, Banyuwangi', riding_level: 'Intermediate', referral_code: 'NADIAHORSE', referral_balance: 75000, status: 'active', created_at: '2026-10-16T10:30:00+07:00' },
  { id: 'member-bima', email: 'bima@example.com', full_name: 'Bima Pradana', phone_number: '0852 9100 3387', address: 'Rogojampi, Banyuwangi', riding_level: 'Advanced', referral_code: 'BIMARIDE', referral_balance: 0, status: 'active', created_at: '2026-10-17T07:15:00+07:00' },
];

const baseBooking: Booking = {
  id: 'preview-booking', user_id: 'preview-member', member_id: 'preview-member', trip_id: mockTrips[0].id,
  booking_date: '2026-11-22', time_slot: '16:00', pax_count: 2, total_price: 1500000,
  status: 'confirmed', qr_code_token: 'RH-PREVIEW', special_requests: null, created_at: '2026-10-17T09:00:00+07:00',
  trip: mockTrips[0], customer_name: 'Demo Rider', customer_email: 'member@riderhorse.id', customer_phone: '0812 3456 7890',
  payment_plan: 'dp', payment_status: 'dp_paid', dp_amount: 450000, paid_amount: 450000, outstanding_amount: 1050000,
  payment_method: 'Transfer Bank', created_by: 'member', referral_code: null,
};

export const previewOperationalBookings: Booking[] = [baseBooking];
export const previewPayments: PaymentTransaction[] = [{ id: 'payment-preview', booking_id: baseBooking.id, member_id: 'preview-member', member_name: 'Demo Rider', type: 'dp', amount: 450000, method: 'Transfer Bank', status: 'paid', paid_at: '2026-10-17T09:05:00+07:00', created_by: 'member' }];
export const previewReferrals: ReferralRecord[] = [{ id: 'ref-preview', referrer_member_id: 'preview-member', referrer_name: 'Demo Rider', code: 'RIDERDEMO', referred_name: 'Nadia Putri', booking_id: null, commission_amount: 125000, status: 'approved', created_at: '2026-10-16T11:00:00+07:00' }];
export const previewFeedback: MemberFeedback[] = [{ id: 'feedback-preview', member_id: 'member-nadia', member_name: 'Nadia Putri', type: 'testimonial', rating: 5, message: 'Pemandunya sabar dan jalur sunset sangat berkesan.', status: 'pending', created_at: '2026-10-17T08:45:00+07:00' }];

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try { const raw = window.localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; }
}
function write<T>(key: string, value: T) { window.localStorage.setItem(key, JSON.stringify(value)); window.dispatchEvent(new Event(OPERATIONS_EVENT)); }

export const readMembers = () => read(KEYS.members, previewMembers);
export const readBookings = () => read(KEYS.bookings, previewOperationalBookings);
export const readPayments = () => read(KEYS.payments, previewPayments);
export const readReferrals = () => read(KEYS.referrals, previewReferrals);
export const readFeedback = () => read(KEYS.feedback, previewFeedback);

export function addMember(input: Omit<OperationalMember, 'id' | 'created_at' | 'referral_balance' | 'status' | 'referral_code'> & { referral_code?: string }) {
  const member: OperationalMember = { ...input, id: crypto.randomUUID(), referral_code: input.referral_code || `${input.full_name.replace(/[^a-z0-9]/gi, '').slice(0, 6).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`, referral_balance: 0, status: 'active', created_at: new Date().toISOString() };
  write(KEYS.members, [member, ...readMembers()]); return member;
}
export function updateMember(id: string, values: Partial<OperationalMember>) { const next = readMembers().map((item) => item.id === id ? { ...item, ...values } : item); write(KEYS.members, next); return next.find((item) => item.id === id); }

export function addOperationalBooking(trip: Trip, member: OperationalMember, input: Pick<Booking, 'booking_date' | 'time_slot' | 'pax_count' | 'total_price' | 'special_requests'> & Partial<Booking>) {
  const plan = input.payment_plan || 'dp'; const paid = Number(input.paid_amount || 0); const total = input.total_price;
  const booking: Booking = { id: crypto.randomUUID(), user_id: member.auth_user_id || member.id, member_id: member.id, trip_id: trip.id, status: 'pending', qr_code_token: `RH-${crypto.randomUUID().slice(0, 8).toUpperCase()}`, created_at: new Date().toISOString(), trip, customer_name: member.full_name, customer_email: member.email, customer_phone: member.phone_number, payment_plan: plan, payment_status: paid >= total ? 'paid' : paid > 0 ? 'dp_paid' : 'unpaid', dp_amount: plan === 'dp' ? Math.round(total * .3) : total, paid_amount: paid, outstanding_amount: Math.max(0, total - paid), payment_method: input.payment_method || null, created_by: input.created_by || 'member', referral_code: input.referral_code || null, ...input };
  write(KEYS.bookings, [booking, ...readBookings()]);
  if (paid > 0) addPayment({ booking_id: booking.id, member_id: member.id, member_name: member.full_name, type: paid >= total ? 'full' : 'dp', amount: paid, method: booking.payment_method || 'Transfer Bank', status: 'paid', created_by: booking.created_by || 'member' });
  if (booking.referral_code) { const referrer = readMembers().find((item) => item.referral_code === booking.referral_code); if (referrer) addReferral({ referrer_member_id: referrer.id, referrer_name: referrer.full_name, code: referrer.referral_code, referred_name: member.full_name, booking_id: booking.id, commission_amount: Math.round(total * .05), status: 'pending' }); }
  return booking;
}
export function updateOperationalBooking(id: string, values: Partial<Booking>) { const next = readBookings().map((item) => item.id === id ? { ...item, ...values } : item); write(KEYS.bookings, next); }

export function addPayment(input: Omit<PaymentTransaction, 'id' | 'paid_at'>) {
  const payment: PaymentTransaction = { ...input, id: crypto.randomUUID(), paid_at: new Date().toISOString() }; write(KEYS.payments, [payment, ...readPayments()]);
  const booking = readBookings().find((item) => item.id === input.booking_id); if (booking && input.status === 'paid') { const paid = Math.min(booking.total_price, Number(booking.paid_amount || 0) + input.amount); updateOperationalBooking(booking.id, { paid_amount: paid, outstanding_amount: Math.max(0, booking.total_price - paid), payment_status: paid >= booking.total_price ? 'paid' : 'dp_paid' }); }
  return payment;
}
export function addReferral(input: Omit<ReferralRecord, 'id' | 'created_at'>) { const item: ReferralRecord = { ...input, id: crypto.randomUUID(), created_at: new Date().toISOString() }; write(KEYS.referrals, [item, ...readReferrals()]); return item; }
export function updateReferral(id: string, status: ReferralRecord['status']) { const next = readReferrals().map((item) => item.id === id ? { ...item, status } : item); write(KEYS.referrals, next); }
export function addFeedback(input: Omit<MemberFeedback, 'id' | 'created_at' | 'status'>) { const item: MemberFeedback = { ...input, id: crypto.randomUUID(), created_at: new Date().toISOString(), status: 'pending' }; write(KEYS.feedback, [item, ...readFeedback()]); return item; }
export function updateFeedback(id: string, status: MemberFeedback['status']) { const next = readFeedback().map((item) => item.id === id ? { ...item, status } : item); write(KEYS.feedback, next); }
export const readPreviewProfile = () => read<Partial<OperationalMember>>(KEYS.profile, {});
export function savePreviewProfile(values: Partial<OperationalMember>) { window.localStorage.setItem(KEYS.profile, JSON.stringify(values)); updateMember('preview-member', values); window.dispatchEvent(new Event('rider-profile-updated')); }

export function exportCsv(filename: string, rows: Record<string, string | number | null | undefined>[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]); const quote = (value: unknown) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  const csv = [headers.map(quote).join(','), ...rows.map((row) => headers.map((key) => quote(row[key])).join(','))].join('\n');
  const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' })); const link = document.createElement('a'); link.href = url; link.download = filename; link.click(); URL.revokeObjectURL(url);
}

export interface OperationsSnapshot {
  members: OperationalMember[];
  bookings: Booking[];
  payments: PaymentTransaction[];
  referrals: ReferralRecord[];
  feedback: MemberFeedback[];
}

export async function loadOperationsData(): Promise<OperationsSnapshot> {
  if (!isSupabaseConfigured()) return { members: readMembers(), bookings: readBookings(), payments: readPayments(), referrals: readReferrals(), feedback: readFeedback() };
  const supabase = createClient();
  const [members, bookings, payments, referrals, feedback] = await Promise.all([
    supabase.from('member_directory').select('*').order('created_at', { ascending: false }),
    supabase.from('bookings').select('*, trip:trips(*)').order('created_at', { ascending: false }),
    supabase.from('booking_payments').select('*').order('paid_at', { ascending: false }),
    supabase.from('referrals').select('*').order('created_at', { ascending: false }),
    supabase.from('member_feedback').select('*').order('created_at', { ascending: false }),
  ]);
  const error = members.error || bookings.error || payments.error || referrals.error || feedback.error;
  if (error) throw error;
  return { members: (members.data || []) as OperationalMember[], bookings: (bookings.data || []) as Booking[], payments: (payments.data || []) as PaymentTransaction[], referrals: (referrals.data || []) as ReferralRecord[], feedback: (feedback.data || []) as MemberFeedback[] };
}

export async function createMemberRecord(input: Omit<OperationalMember, 'id' | 'created_at' | 'referral_balance' | 'status' | 'referral_code'> & { referral_code?: string }) {
  if (!isSupabaseConfigured()) return addMember(input);
  const referralCode = input.referral_code || `${input.full_name.replace(/[^a-z0-9]/gi, '').slice(0, 6).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`;
  const { data, error } = await createClient().from('member_directory').insert({ ...input, referral_code: referralCode }).select().single();
  if (error) throw error; return data as OperationalMember;
}

export async function createBookingRecord(trip: Trip, member: OperationalMember, input: Pick<Booking, 'booking_date' | 'time_slot' | 'pax_count' | 'total_price' | 'special_requests'> & Partial<Booking>) {
  if (!isSupabaseConfigured()) return addOperationalBooking(trip, member, input);
  const supabase = createClient(); const initialPayment = Number(input.paid_amount || 0);
  const { data, error } = await supabase.from('bookings').insert({ user_id: member.auth_user_id || null, member_id: member.id, customer_name: member.full_name, customer_email: member.email, customer_phone: member.phone_number, trip_id: trip.id, booking_date: input.booking_date, time_slot: input.time_slot, pax_count: input.pax_count, special_requests: input.special_requests, service_id: input.service_id || null, service_name: input.service_name || null, payment_plan: input.payment_plan || 'dp', paid_amount: 0, payment_method: input.payment_method || null, created_by: input.created_by || 'admin', referral_code: input.referral_code || null, status: 'pending' }).select('*, trip:trips(*)').single();
  if (error) throw error;
  if (initialPayment > 0) { const { error: paymentError } = await supabase.from('booking_payments').insert({ booking_id: data.id, member_id: member.id, member_name: member.full_name, type: initialPayment >= data.total_price ? 'full' : 'dp', amount: initialPayment, method: input.payment_method || 'Transfer Bank', status: 'paid', created_by: input.created_by || 'admin' }); if (paymentError) throw paymentError; }
  return data as Booking;
}

export async function changeBookingRecord(id: string, values: Partial<Booking>) {
  if (!isSupabaseConfigured()) return updateOperationalBooking(id, values);
  const { error } = await createClient().from('bookings').update(values).eq('id', id); if (error) throw error;
}

export async function createPaymentRecord(input: Omit<PaymentTransaction, 'id' | 'paid_at'>) {
  if (!isSupabaseConfigured()) return addPayment(input);
  const { data, error } = await createClient().from('booking_payments').insert(input).select().single(); if (error) throw error; return data as PaymentTransaction;
}

export async function changeReferralRecord(id: string, status: ReferralRecord['status']) {
  if (!isSupabaseConfigured()) return updateReferral(id, status);
  const { error } = await createClient().from('referrals').update({ status }).eq('id', id); if (error) throw error;
}

export async function submitFeedbackRecord(input: Omit<MemberFeedback, 'id' | 'created_at' | 'status'> & { auth_user_id?: string | null }) {
  if (!isSupabaseConfigured()) return addFeedback(input);
  const { data, error } = await createClient().from('member_feedback').insert(input).select().single(); if (error) throw error; return data as MemberFeedback;
}

export async function changeFeedbackRecord(id: string, status: MemberFeedback['status']) {
  if (!isSupabaseConfigured()) return updateFeedback(id, status);
  const { error } = await createClient().from('member_feedback').update({ status }).eq('id', id); if (error) throw error;
}
