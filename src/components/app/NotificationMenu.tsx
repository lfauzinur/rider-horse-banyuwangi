'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Bell, CalendarCheck2, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  href: string;
  confirmed: boolean;
}

export default function NotificationMenu({ role }: { role: 'member' | 'admin' }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [seen, setSeen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;

    async function loadNotifications() {
      if (!isSupabaseConfigured()) {
        if (active && role === 'member') {
          setItems([{ id: 'welcome', title: 'Selamat datang di Rider Horse', description: 'Pilih trip dan jadwalkan pengalaman berkudamu.', href: '/dashboard/trips', confirmed: true }]);
        }
        return;
      }

      const supabase = createClient();
      if (role === 'admin') {
        const { data } = await supabase.from('bookings').select('id,status,customer_name,created_at').in('status', ['pending', 'confirmed']).order('created_at', { ascending: false }).limit(6);
        if (!active || !data) return;
        setItems(data.map((booking) => ({
          id: booking.id,
          title: booking.status === 'pending' ? 'Booking perlu dikonfirmasi' : 'Booking sudah dikonfirmasi',
          description: `${booking.customer_name || 'Member'} • periksa detail reservasi`,
          href: '/admin?section=bookings',
          confirmed: booking.status === 'confirmed',
        })));
        return;
      }

      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) return;
      const { data } = await supabase.from('bookings').select('id,status,booking_date,trip:trips(title)').eq('user_id', authData.user.id).in('status', ['pending', 'confirmed']).order('created_at', { ascending: false }).limit(6);
      if (!active || !data) return;
      setItems(data.map((booking) => {
        const joinedTrip = Array.isArray(booking.trip) ? booking.trip[0] : booking.trip;
        return {
          id: booking.id,
          title: booking.status === 'confirmed' ? 'Booking telah dikonfirmasi' : 'Booking menunggu konfirmasi',
          description: `${joinedTrip?.title || 'Riding trip'} • ${booking.booking_date}`,
          href: '/dashboard/bookings',
          confirmed: booking.status === 'confirmed',
        };
      }));
    }

    void loadNotifications();
    return () => { active = false; };
  }, [role]);

  useEffect(() => {
    function closeWhenClickingOutside(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('pointerdown', closeWhenClickingOutside);
    return () => document.removeEventListener('pointerdown', closeWhenClickingOutside);
  }, []);

  function toggleMenu() {
    setOpen((current) => !current);
    setSeen(true);
  }

  return (
    <div ref={containerRef} className="relative">
      <button type="button" onClick={toggleMenu} className="relative flex h-10 w-10 items-center justify-center rounded-full border border-brand-900/10 bg-white text-brand-700 transition-colors hover:border-brand-600/40 hover:bg-brand-50" aria-label="Buka notifikasi" aria-expanded={open} aria-controls="dashboard-notifications">
        <Bell className="h-4 w-4" />
        {!seen && items.length > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-white bg-accent-500" />}
      </button>

      {open && (
        <div id="dashboard-notifications" className="absolute right-0 top-12 z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-brand-900/10 bg-white shadow-[0_22px_60px_rgba(16,36,28,.18)]">
          <div className="flex items-center justify-between border-b border-brand-900/8 px-5 py-4">
            <div><p className="font-display text-lg font-bold">Notifikasi</p><p className="mt-0.5 text-[0.66rem] text-neutral-500">Pembaruan aktivitas terbaru</p></div>
            <span className="rounded-full bg-brand-100 px-2.5 py-1 text-[0.58rem] font-extrabold text-brand-700">{items.length}</span>
          </div>
          <div className="max-h-80 overflow-y-auto p-2">
            {items.length === 0 ? (
              <div className="px-4 py-8 text-center"><Bell className="mx-auto h-6 w-6 text-brand-400" /><p className="mt-3 text-sm font-bold text-brand-900">Belum ada notifikasi</p><p className="mt-1 text-xs text-neutral-500">Pembaruan booking akan tampil di sini.</p></div>
            ) : items.map((item) => (
              <Link key={item.id} href={item.href} onClick={() => setOpen(false)} className="flex gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-brand-50">
                <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${item.confirmed ? 'bg-brand-100 text-brand-700' : 'bg-accent-100 text-accent-700'}`}>
                  {item.confirmed ? <CheckCircle2 className="h-4 w-4" /> : <CalendarCheck2 className="h-4 w-4" />}
                </span>
                <span className="min-w-0"><span className="block text-xs font-extrabold text-brand-950">{item.title}</span><span className="mt-1 block truncate text-[0.68rem] text-neutral-500">{item.description}</span></span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
