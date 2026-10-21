'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, Eye, EyeOff, Lock, Mail, Phone, Trees, UserRound } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/context';
import { createClient } from '@/lib/supabase/client';
import { findPreviewAccount, previewAccounts, PREVIEW_AUTH_COOKIE, PREVIEW_AUTH_STORAGE, type PreviewRole } from '@/lib/preview-auth';

export type AuthMode = 'login' | 'signup' | 'reset';

export default function LoginClient({ initialMode = 'login' }: { initialMode?: AuthMode }) {
  const { t, locale, setLocale } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedPath = searchParams.get('next');
  const safeNextPath = requestedPath?.startsWith('/dashboard') ? requestedPath : '/dashboard';
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const previewMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const copy = {
    login: {
      title: t.login.title,
      subtitle: t.login.subtitle,
      button: t.login.submitBtn,
    },
    signup: {
      title: locale === 'id' ? 'Buat Akun Rider' : 'Create Rider Account',
      subtitle: locale === 'id' ? 'Simpan perjalanan dan kelola reservasi kamu.' : 'Save trips and manage your reservations.',
      button: locale === 'id' ? 'Daftar' : 'Create account',
    },
    reset: {
      title: locale === 'id' ? 'Atur Ulang Password' : 'Reset Password',
      subtitle: locale === 'id' ? 'Kami akan mengirim tautan pemulihan ke email kamu.' : 'We will email you a secure recovery link.',
      button: locale === 'id' ? 'Kirim Tautan' : 'Send recovery link',
    },
  }[mode];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    const normalizedEmail = email.trim().toLowerCase().normalize('NFKC');
    setEmail(normalizedEmail);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setMessage({ type: 'error', text: locale === 'id' ? 'Masukkan alamat email yang valid.' : 'Enter a valid email address.' });
      return;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      if (mode !== 'login') {
        setMessage({
          type: 'error',
          text: locale === 'id'
            ? 'Registrasi membutuhkan Supabase. Gunakan salah satu akun demo untuk mengecek aplikasi.'
            : 'Registration requires Supabase. Use a demo account to preview the app.',
        });
        return;
      }

      const account = findPreviewAccount(normalizedEmail, password);
      if (!account) {
        setMessage({ type: 'error', text: locale === 'id' ? 'Email atau password demo tidak sesuai.' : 'Invalid demo email or password.' });
        return;
      }

      window.localStorage.setItem(PREVIEW_AUTH_STORAGE, account.role);
      document.cookie = `${PREVIEW_AUTH_COOKIE}=${account.role}; Path=/; Max-Age=86400; SameSite=Lax`;
      router.push(account.role === 'admin' ? '/admin' : safeNextPath);
      router.refresh();
      return;
    }

    setIsLoading(true);
    const supabase = createClient();

    if (mode === 'reset') {
      const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: `${window.location.origin}/login`,
      });
      setIsLoading(false);
      setMessage(error
        ? { type: 'error', text: error.message }
        : { type: 'success', text: locale === 'id' ? 'Tautan pemulihan sudah dikirim. Periksa inbox kamu.' : 'Recovery link sent. Please check your inbox.' });
      return;
    }

    if (password.length < 8) {
      setIsLoading(false);
      setMessage({ type: 'error', text: locale === 'id' ? 'Password minimal 8 karakter.' : 'Password must be at least 8 characters.' });
      return;
    }

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone_number: phone.trim(),
          },
        },
      });
      setIsLoading(false);
      if (error) {
        const rateLimited = error.message.toLowerCase().includes('rate limit');
        const invalidEmail = error.code === 'email_address_invalid' || error.message.toLowerCase().includes('email address') && error.message.toLowerCase().includes('invalid');
        setMessage({
          type: 'error',
          text: rateLimited
            ? (locale === 'id' ? 'Terlalu banyak percobaan pendaftaran. Tunggu beberapa saat lalu coba lagi.' : 'Too many registration attempts. Wait a moment and try again.')
            : invalidEmail
              ? (locale === 'id' ? 'Alamat email ini tidak dapat digunakan. Pastikan alamatnya aktif dan benar, atau gunakan email pribadi lain.' : 'This email address cannot be used. Make sure it is active and correct, or use another personal email address.')
              : error.message,
        });
        return;
      }
      if (data.session) {
        setMessage({ type: 'success', text: locale === 'id' ? 'Akun berhasil dibuat. Membuka dashboard…' : 'Account created. Opening your dashboard…' });
        router.replace('/dashboard');
        router.refresh();
        return;
      }
      setMessage({ type: 'success', text: locale === 'id' ? 'Akun berhasil dibuat. Silakan masuk dengan akun barumu.' : 'Account created. You can now sign in with your new account.' });
      setMode('login');
      return;
    }

    const { data: signInData, error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });
    setIsLoading(false);
    if (error) {
      const emailNotConfirmed = error.message.toLowerCase().includes('email not confirmed');
      setMessage({
        type: 'error',
        text: emailNotConfirmed
          ? (locale === 'id' ? 'Akun lama ini belum aktif. Hubungi admin agar akun dapat diaktifkan.' : 'This older account is not active yet. Contact the admin to activate it.')
          : error.message,
      });
      return;
    }
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', signInData.user.id).maybeSingle();
    router.push(profile?.role === 'admin' ? '/admin' : safeNextPath);
    router.refresh();
  }

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setMessage(null);
    setPassword('');
  }

  function fillPreviewAccount(role: PreviewRole) {
    const account = previewAccounts[role];
    setMode('login');
    setEmail(account.email);
    setPassword(account.password);
    setMessage(null);
  }

  return (
    <main className="min-h-screen bg-neutral-50 lg:grid lg:grid-cols-2">
      <div className="relative hidden min-h-screen overflow-hidden bg-brand-950 lg:block">
        <Image src="/images/hero-banner.png" alt={locale === 'id' ? 'Pengalaman berkuda di Banyuwangi' : 'Horse riding experience in Banyuwangi'} fill priority sizes="50vw" className="object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(10,26,20,.88),rgba(10,26,20,.12)_65%)]" />
        <Link href="/" className="absolute left-9 top-9 flex items-center gap-3 text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur"><Trees className="h-[18px] w-[18px] text-accent-300" strokeWidth={1.7} /></span>
          <span className="font-display text-lg font-bold">Rider Horse</span>
        </Link>
        <div className="absolute bottom-12 left-10 right-10 max-w-lg text-white">
          <p className="text-[0.64rem] font-extrabold uppercase tracking-[0.18em] text-accent-300">Banyuwangi Equestrian Experience</p>
          <p className="mt-4 font-display text-4xl font-bold leading-tight">
            {locale === 'id' ? 'Perjalanan hebat dimulai dari kepercayaan.' : 'A great journey begins with trust.'}
          </p>
        </div>
      </div>

      <div className="flex min-h-screen items-center justify-center p-5 sm:p-9">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-brand-700">
              <ArrowLeft className="h-4 w-4" />
              {t.login.backHome}
            </Link>
            <div className="flex rounded-full border border-brand-900/10 p-1">
              {(['id', 'en'] as const).map((item) => (
                <button key={item} type="button" onClick={() => setLocale(item)} className={`rounded-full px-3 py-1 text-[0.65rem] font-extrabold uppercase ${locale === item ? 'bg-brand-900 text-white' : 'text-neutral-500'}`}>
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <p className="mb-3 text-[0.63rem] font-extrabold uppercase tracking-[0.17em] text-brand-600">Rider Member</p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-brand-950">{copy.title}</h1>
            <p className="mt-3 text-sm leading-6 text-neutral-500">{copy.subtitle}</p>
          </div>

          {message && (
            <div role="status" className={`mb-5 rounded-xl border p-3.5 text-xs leading-5 ${message.type === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-brand-200 bg-brand-50 text-brand-700'}`}>
              <p>{message.text}</p>
            </div>
          )}

          {previewMode && mode === 'login' && (
            <div className="mb-5 rounded-2xl border border-accent-500/25 bg-accent-100/55 p-4">
              <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.15em] text-brand-700">{locale === 'id' ? 'Akun demo lokal' : 'Local demo accounts'}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {(['admin', 'member'] as const).map((role) => (
                  <button key={role} type="button" onClick={() => fillPreviewAccount(role)} className="rounded-xl border border-brand-900/10 bg-white p-3 text-left transition-colors hover:border-brand-600">
                    <span className="block text-xs font-extrabold capitalize text-brand-900">{role}</span>
                    <span className="mt-1 block truncate text-[0.64rem] text-neutral-500">{previewAccounts[role].email}</span>
                    <span className="mt-1 block text-[0.64rem] font-semibold text-brand-600">{locale === 'id' ? 'Klik untuk isi otomatis' : 'Click to autofill'}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="signup-name" className="form-label">{locale === 'id' ? 'Nama lengkap' : 'Full name'}</label>
                  <div className="relative">
                    <UserRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" strokeWidth={1.7} />
                    <input id="signup-name" name="fullName" className="form-input pl-10" placeholder={locale === 'id' ? 'Nama kamu' : 'Your name'} value={fullName} onChange={(event) => setFullName(event.target.value)} required autoComplete="name" />
                  </div>
                </div>
                <div>
                  <label htmlFor="signup-phone" className="form-label">WhatsApp</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" strokeWidth={1.7} />
                    <input id="signup-phone" name="phone" type="tel" className="form-input pl-10" placeholder="08xxxxxxxxxx" value={phone} onChange={(event) => setPhone(event.target.value)} required autoComplete="tel" />
                  </div>
                </div>
              </div>
            )}
            <div>
              <label htmlFor="login-email" className="form-label">{t.login.emailLabel}</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" strokeWidth={1.7} />
                <input id="login-email" name="email" type="email" inputMode="email" autoCapitalize="none" spellCheck={false} className="form-input pl-10" placeholder={t.login.emailPlaceholder} value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" />
              </div>
            </div>

            {mode !== 'reset' && (
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label htmlFor="login-password" className="form-label !mb-0">{t.login.passwordLabel}</label>
                  {mode === 'login' && <button type="button" onClick={() => switchMode('reset')} className="text-[0.68rem] font-bold text-brand-600 hover:underline">{t.login.forgotPassword}</button>}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" strokeWidth={1.7} />
                  <input id="login-password" name="password" type={showPassword ? 'text' : 'password'} className="form-input pl-10 pr-10" placeholder={t.login.passwordPlaceholder} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} />
                  <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-brand-700" aria-label={showPassword ? (locale === 'id' ? 'Sembunyikan password' : 'Hide password') : (locale === 'id' ? 'Tampilkan password' : 'Show password')}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            <button type="submit" className="btn-primary w-full" disabled={isLoading}>
              {isLoading ? t.login.loadingBtn : copy.button}
              {!isLoading && <ArrowUpRight className="h-4 w-4" />}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-neutral-500">
            {mode === 'login' ? (
              <>{t.login.noAccount}{' '}<button type="button" onClick={() => switchMode('signup')} className="font-extrabold text-brand-700 hover:underline">{t.login.register}</button></>
            ) : (
              <button type="button" onClick={() => switchMode('login')} className="font-extrabold text-brand-700 hover:underline">← {locale === 'id' ? 'Kembali ke halaman masuk' : 'Back to sign in'}</button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
