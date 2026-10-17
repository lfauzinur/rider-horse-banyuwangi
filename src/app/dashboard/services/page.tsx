import type { Metadata } from 'next';
import MemberServicesClient from './MemberServicesClient';

export const metadata: Metadata = { title: 'Layanan Berkuda | Member Rider Horse', description: 'Pilih program dan layanan berkuda dari aplikasi member.' };
export default function MemberServicesPage() { return <MemberServicesClient />; }
