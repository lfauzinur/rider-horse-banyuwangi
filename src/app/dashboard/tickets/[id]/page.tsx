import type { Metadata } from 'next';
import MemberTicketClient from './MemberTicketClient';
export const metadata: Metadata = { title: 'Tiket Booking' };
export const instant = false;
export default async function Page({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <MemberTicketClient id={id} />; }
