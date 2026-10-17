import type { Metadata } from 'next';
import MemberTripsClient from './MemberTripsClient';

export const metadata: Metadata = { title: 'Pilih Trip | Member Rider Horse', description: 'Pilih trip berkuda dan lanjutkan booking dari aplikasi member.' };

export default function MemberTripsPage() { return <MemberTripsClient />; }
