import type { Metadata } from 'next';
import { Suspense } from 'react';
import LoginClient from '@/app/login/LoginClient';

export const metadata: Metadata = {
  title: 'Daftar Member – Rider Horse Banyuwangi',
  description: 'Buat akun member Rider Horse Banyuwangi untuk melakukan dan mengelola booking dari aplikasi.',
};

export default function RegisterPage() {
  return <Suspense fallback={<div className="min-h-screen animate-pulse bg-neutral-100" />}><LoginClient initialMode="signup" /></Suspense>;
}
