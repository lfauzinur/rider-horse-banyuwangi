import type { Booking, Trip } from '@/types';
import { addOperationalBooking, previewOperationalBookings, readBookings, readMembers } from '@/lib/operations';

export const MEMBER_BOOKINGS_STORAGE = 'rider-horse-member-bookings';

export const previewBookings: Booking[] = previewOperationalBookings;

export function readLocalBookings(): Booking[] { return readBookings(); }

export function addLocalBooking(trip: Trip, input: Pick<Booking, 'booking_date' | 'time_slot' | 'pax_count' | 'total_price' | 'special_requests'> & Partial<Booking>) {
  const member = readMembers().find((item) => item.id === 'preview-member') || readMembers()[0];
  const booking = addOperationalBooking(trip, member, input);
  window.dispatchEvent(new Event('rider-bookings-updated'));
  return booking;
}
