import type { Metadata } from 'next';
import MemberProfileClient from './MemberProfileClient';
export const metadata: Metadata = { title: 'Profil & Keamanan' };
export default function Page() { return <MemberProfileClient />; }
