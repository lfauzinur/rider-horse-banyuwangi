import type { Metadata } from 'next';
import MemberBookingClient from './MemberBookingClient';

export const instant = false;
export const metadata: Metadata = { title: 'Booking Online | Member Rider Horse', description: 'Pilih tanggal dan jadwal trip melalui aplikasi member.' };
export default async function MemberBookingPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; return <MemberBookingClient slug={slug} />; }
