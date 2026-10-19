'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BookOpenText, BriefcaseBusiness, CalendarCheck2, CloudOff, HandCoins, LayoutDashboard, LogOut, Menu, MessageSquareText, Settings2, ShieldCheck, Trees, UserRound, Wifi, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import NotificationMenu from '@/components/app/NotificationMenu';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { PREVIEW_AUTH_COOKIE, PREVIEW_AUTH_STORAGE } from '@/lib/preview-auth';

interface DashboardShellProps {
  children: ReactNode;
  role: 'member' | 'admin';
  userName: string;
  userEmail: string;
  adminSections?: { key: string; label: string; icon: LucideIcon }[];
  activeAdminSection?: string;
  onAdminSectionChange?: (key: string) => void;
}

export default function DashboardShell({ children, role, userName, userEmail, adminSections = [], activeAdminSection, onAdminSectionChange }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setOnline(navigator.onLine), 0);
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const items = role === 'admin'
    ? [
        { href: '/admin', label: 'Admin Dashboard', icon: ShieldCheck },
      ]
    : [
        { href: '/dashboard', label: 'Beranda', icon: LayoutDashboard },
        { href: '/dashboard/trips', label: 'Pilih Trip', icon: Trees },
        { href: '/dashboard/services', label: 'Pilih Layanan', icon: BriefcaseBusiness },
        { href: '/dashboard/bookings', label: 'Booking Saya', icon: CalendarCheck2 },
        { href: '/dashboard/articles', label: 'Baca Artikel', icon: BookOpenText },
        { href: '/dashboard/referrals', label: 'Referral & Penghasilan', icon: HandCoins },
        { href: '/dashboard/feedback', label: 'Testimoni & Saran', icon: MessageSquareText },
        { href: '/dashboard/profile', label: 'Profil & Keamanan', icon: UserRound },
      ];

  async function signOut() {
    if (isSupabaseConfigured()) {
      await createClient().auth.signOut();
    } else {
      window.localStorage.removeItem(PREVIEW_AUTH_STORAGE);
      document.cookie = `${PREVIEW_AUTH_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
    }
    router.replace('/login');
    router.refresh();
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <Link href={role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center gap-3 px-2 py-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-accent-400/35 bg-accent-400/10 text-accent-300"><Trees className="h-[18px] w-[18px]" /></span>
        <span>
          <span className="block font-display text-base font-bold text-white">Rider Horse</span>
          <span className="block text-[0.56rem] font-bold uppercase tracking-[0.18em] text-accent-300">{role === 'admin' ? 'Admin Console' : 'Member App'}</span>
        </span>
      </Link>

      <nav className="mt-6 min-h-0 flex-1 space-y-1 overflow-y-auto pr-1" aria-label="Dashboard navigation">
        {items.map(({ href, label, icon: Icon }) => {
          const active = role === 'admin' && adminSections.length > 0
            ? false
            : href === '/dashboard' ? pathname === href : pathname.startsWith(href);
          return (
            <Link key={href} href={href} prefetch={role === 'member' ? false : undefined} onClick={() => setMenuOpen(false)} className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-colors ${active ? 'bg-accent-400 text-brand-950' : 'text-white/62 hover:bg-white/5 hover:text-white'}`}>
              <Icon className="h-4 w-4" strokeWidth={1.7} />
              {label}
            </Link>
          );
        })}

        {role === 'admin' && adminSections.length > 0 && (
          <div className="mt-2 space-y-1 border-t border-white/10 pt-3">
            {adminSections.map(({ key, label, icon: Icon }) => {
              const active = activeAdminSection === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    onAdminSectionChange?.(key);
                    setMenuOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold transition-colors ${active ? 'bg-accent-400 text-brand-950' : 'text-white/62 hover:bg-white/5 hover:text-white'}`}
                >
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={1.7} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        )}
      </nav>

      <div className="mt-5 shrink-0 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-2 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-white/45">
          {online ? <Wifi className="h-3.5 w-3.5 text-accent-300" /> : <CloudOff className="h-3.5 w-3.5 text-orange-300" />}
          {online ? 'Online & tersinkron' : 'Mode offline'}
        </div>
        <p className="mt-4 truncate text-sm font-bold text-white">{userName}</p>
        <p className="truncate text-[0.68rem] text-white/42">{userEmail}</p>
        <button type="button" onClick={signOut} className="mt-4 flex items-center gap-2 text-xs font-bold text-white/55 hover:text-white">
          <LogOut className="h-3.5 w-3.5" /> Keluar
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f2f0e8] text-brand-950">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 bg-brand-950 p-5 lg:block">{sidebar}</aside>
      {menuOpen && <button type="button" aria-label="Tutup menu" className="fixed inset-0 z-40 bg-black/45 lg:hidden" onClick={() => setMenuOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[86%] max-w-72 bg-brand-950 p-5 transition-transform lg:hidden ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>{sidebar}</aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-brand-900/10 bg-[#f8f6ef]/90 px-4 backdrop-blur-xl sm:px-7">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setMenuOpen((open) => !open)} className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-900/10 lg:hidden" aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}>
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div>
              <p className="text-[0.6rem] font-extrabold uppercase tracking-[0.16em] text-brand-600">{role === 'admin' ? 'Operational workspace' : 'Your riding journey'}</p>
              <p className="font-display text-lg font-bold">Halo, {userName.split(' ')[0]}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <NotificationMenu role={role} />
            {role === 'member' && <Link href="/dashboard/profile" className="hidden h-10 w-10 items-center justify-center rounded-full border border-brand-900/10 bg-white text-brand-700 sm:flex" aria-label="Pengaturan profil"><Settings2 className="h-4 w-4" /></Link>}
          </div>
        </header>
        <main className="p-4 pb-24 sm:p-7 sm:pb-24 lg:p-9">{children}</main>
      </div>

      {role === 'member' && (
        <nav className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-4 rounded-2xl border border-white/10 bg-brand-950/95 p-1.5 shadow-2xl backdrop-blur-xl lg:hidden" aria-label="Navigasi aplikasi member">
          {[
            { href: '/dashboard', label: 'Beranda', icon: LayoutDashboard },
            { href: '/dashboard/trips', label: 'Trip', icon: Trees },
            { href: '/dashboard/bookings', label: 'Booking', icon: CalendarCheck2 },
            { href: '/dashboard/profile', label: 'Profil', icon: UserRound },
          ].map(({ href, label, icon: Icon }) => {
            const active = href === '/dashboard' ? pathname === href : pathname.startsWith(href);
            return <Link key={href} href={href} prefetch={false} className={`flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[0.56rem] font-bold ${active ? 'bg-accent-400 text-brand-950' : 'text-white/58'}`}><Icon className="h-4 w-4" /><span className="max-w-full truncate">{label}</span></Link>;
          })}
        </nav>
      )}
    </div>
  );
}
