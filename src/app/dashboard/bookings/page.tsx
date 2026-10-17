import type { Metadata } from 'next';
import MemberBookingsClient from './MemberBookingsClient';

export const metadata: Metadata = { title: 'Booking Saya | Member Rider Horse', description: 'Pantau seluruh booking berkuda dari aplikasi member.' };
export default function MemberBookingsPage() { return <MemberBookingsClient />; }
