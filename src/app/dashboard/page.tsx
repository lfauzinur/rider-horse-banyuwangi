import type { Metadata } from 'next';
import MemberDashboardClient from './MemberDashboardClient';

export const metadata: Metadata = {
  title: 'Dashboard Member',
  description: 'Kelola booking dan perjalanan berkuda Rider Horse Banyuwangi.',
};

export default function MemberDashboardPage() {
  return <MemberDashboardClient />;
}
