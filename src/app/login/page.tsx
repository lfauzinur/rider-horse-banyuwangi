import type { Metadata } from 'next';
import { Suspense } from 'react';
import LoginClient from './LoginClient';

export const metadata: Metadata = {
  title: 'Masuk – Rider Horse Banyuwangi',
  description: 'Masuk ke akun Rider Horse Banyuwangi kamu untuk mengelola booking dan profil.',
};

export default function LoginPage() {
  return <Suspense fallback={<div className="min-h-screen animate-pulse bg-neutral-100" />}><LoginClient /></Suspense>;
}
