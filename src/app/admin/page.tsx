import type { Metadata } from 'next';
import AdminDashboardClient from './AdminDashboardClient';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Kelola konten, katalog, testimoni, dan booking Rider Horse Banyuwangi.',
};

export default function AdminDashboardPage() {
  return <AdminDashboardClient />;
}
