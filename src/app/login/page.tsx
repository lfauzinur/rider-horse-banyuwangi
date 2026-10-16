import type { Metadata } from 'next';
import LoginClient from './LoginClient';

export const metadata: Metadata = {
  title: 'Masuk – Rider Horse Banyuwangi',
  description: 'Masuk ke akun Rider Horse Banyuwangi kamu untuk mengelola booking dan profil.',
};

export default function LoginPage() {
  return <LoginClient />;
}
