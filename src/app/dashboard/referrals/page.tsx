import type { Metadata } from 'next';
import MemberReferralsClient from './MemberReferralsClient';
export const metadata: Metadata = { title: 'Referral & Penghasilan' };
export default function Page() { return <MemberReferralsClient />; }
