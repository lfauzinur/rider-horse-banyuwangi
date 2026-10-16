'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, ArrowLeft, Mail, Lock } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';

export default function LoginClient() {
  const { t, locale, setLocale } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    // TODO: Supabase auth integration
    await new Promise((r) => setTimeout(r, 1200));
    setIsLoading(false);
    // Placeholder – show error for demo
    setError(
      locale === 'id'
        ? 'Kredensial Supabase belum dikonfigurasi. Isi .env.local terlebih dahulu.'
        : 'Supabase credentials not configured. Please fill .env.local first.'
    );
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#f8f6f0' }}>
      {/* Left Panel – Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="/images/hero-banner.png"
          alt="Horse riding Banyuwangi"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-900/40 to-neutral-900/20" />

        {/* Logo overlay */}
        <div className="absolute top-8 left-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-base">Rider Horse</p>
              <p className="text-white/70 text-xs">Banyuwangi</p>
            </div>
          </Link>
        </div>

        {/* Quote overlay */}
        <div className="absolute bottom-12 left-8 right-8">
          <p
            className="text-white mb-2"
            style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, lineHeight: 1.2 }}
          >
            {locale === 'id' ? 'Selamat Datang Kembali,' : 'Welcome Back,'}
            <br />
            <span style={{ color: '#facc15' }}>{locale === 'id' ? 'Rider!' : 'Rider!'}</span>
          </p>
          <p className="text-white/70 text-sm">
            {locale === 'id'
              ? 'Kelola booking dan perjalanan berkudamu dengan mudah.'
              : 'Manage your bookings and riding journey with ease.'}
          </p>
        </div>
      </div>

      {/* Right Panel – Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Back + Language */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-brand-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t.login.backHome}
            </Link>
            {/* Language toggle */}
            <div className="flex items-center gap-1 border border-neutral-200 rounded-md px-1 py-0.5">
              <button
                onClick={() => setLocale('id')}
                className={`px-2 py-0.5 rounded text-xs font-semibold transition-all ${
                  locale === 'id' ? 'bg-brand-700 text-white' : 'text-neutral-500 hover:text-neutral-800'
                }`}
                style={locale === 'id' ? { background: '#2e5f1e' } : {}}
              >
                ID
              </button>
              <button
                onClick={() => setLocale('en')}
                className={`px-2 py-0.5 rounded text-xs font-semibold transition-all ${
                  locale === 'en' ? 'bg-brand-700 text-white' : 'text-neutral-500 hover:text-neutral-800'
                }`}
                style={locale === 'en' ? { background: '#2e5f1e' } : {}}
              >
                EN
              </button>
            </div>
          </div>

          {/* Logo (mobile only) */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#2e5f1e' }}>
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-base font-bold text-neutral-900">Rider Horse</p>
              <p className="text-xs font-medium" style={{ color: '#2e5f1e' }}>Banyuwangi</p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2rem',
                fontWeight: 900,
                lineHeight: 1.1,
                color: '#1a1a14',
                marginBottom: '0.5rem',
              }}
            >
              {t.login.title}
            </h1>
            <p className="text-neutral-500 text-sm">{t.login.subtitle}</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 rounded-lg border text-sm" style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="form-label">{t.login.emailLabel}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  id="login-email"
                  type="email"
                  className="form-input pl-10"
                  placeholder={t.login.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="form-label mb-0">{t.login.passwordLabel}</label>
                <a href="#" className="text-xs font-medium hover:underline" style={{ color: '#2e5f1e' }}>
                  {t.login.forgotPassword}
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input pl-10 pr-10"
                  placeholder={t.login.passwordPlaceholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="login-submit"
              className="btn-primary w-full justify-center"
              disabled={isLoading}
              style={{ opacity: isLoading ? 0.8 : 1 }}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {t.login.loadingBtn}
                </span>
              ) : (
                t.login.submitBtn
              )}
            </button>
          </form>

          {/* Register link */}
          <p className="mt-6 text-center text-sm text-neutral-500">
            {t.login.noAccount}{' '}
            <a href="#" className="font-semibold hover:underline" style={{ color: '#2e5f1e' }}>
              {t.login.register}
            </a>
          </p>

          {/* Divider */}
          <div className="mt-8 pt-8 border-t border-neutral-200 text-center">
            <p className="text-xs text-neutral-400">
              © 2025 Rider Horse Banyuwangi. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
