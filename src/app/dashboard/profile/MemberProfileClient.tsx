'use client';

import { type FormEvent, useEffect, useState } from 'react';
import { CheckCircle2, KeyRound, Save, ShieldCheck, UserRound } from 'lucide-react';
import MemberAreaShell from '@/components/app/MemberAreaShell';
import { readMembers, readPreviewProfile, savePreviewProfile } from '@/lib/operations';
import { useAuth } from '@/lib/use-auth';
import { createClient } from '@/lib/supabase/client';
import { useLanguage } from '@/lib/i18n/context';

interface ProfileForm {
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
}

const emptyProfile: ProfileForm = { full_name: '', email: '', phone_number: '', address: '' };

export default function MemberProfileClient() {
  const { locale } = useLanguage();
  const l = (id: string, en: string) => locale === 'id' ? id : en;
  const { configured, user, profile } = useAuth('member');
  const [notice, setNotice] = useState('');
  const [password, setPassword] = useState('');
  const [form, setForm] = useState<ProfileForm>(emptyProfile);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const local = readMembers().find((member) => member.id === 'preview-member');
      const saved = readPreviewProfile();
      setForm({
        full_name: profile?.full_name || saved.full_name || local?.full_name || '',
        email: profile?.email || saved.email || local?.email || '',
        phone_number: profile?.phone_number || saved.phone_number || local?.phone_number || '',
        address: saved.address || local?.address || '',
      });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [profile]);

  async function save(event: FormEvent) {
    event.preventDefault();
    const editableProfile = { full_name: form.full_name, phone_number: form.phone_number, address: form.address };
    if (configured && user) {
      const { error } = await createClient().from('profiles').update(editableProfile).eq('id', user.id);
      if (error) return setNotice(error.message);
    } else {
      savePreviewProfile({ ...editableProfile, email: form.email });
    }
    setNotice(l('Profil berhasil diperbarui.', 'Profile updated successfully.'));
  }

  async function changePassword(event: FormEvent) {
    event.preventDefault();
    if (password.length < 8) return setNotice(l('Password minimal 8 karakter.', 'Password must be at least 8 characters.'));
    if (configured) {
      const { error } = await createClient().auth.updateUser({ password });
      if (error) return setNotice(error.message);
    } else {
      window.localStorage.setItem('rider-horse-preview-password-updated', new Date().toISOString());
    }
    setPassword('');
    setNotice(l('Password berhasil diperbarui.', 'Password updated successfully.'));
  }

  return (
    <MemberAreaShell>
      {notice && <div role="status" className="mb-5 flex items-center gap-2 rounded-2xl bg-brand-100 p-4 text-xs font-bold text-brand-800"><CheckCircle2 className="h-4 w-4" />{notice}</div>}
      <section className="rounded-[1.75rem] bg-brand-950 p-6 text-white sm:p-8">
        <UserRound className="h-7 w-7 text-accent-300" />
        <p className="mt-5 text-[.62rem] font-extrabold uppercase tracking-[.17em] text-accent-300">Account center</p>
        <h1 className="mt-2 font-display text-4xl font-bold">{l('Profil & keamanan.', 'Profile & security.')}</h1>
        <p className="mt-3 max-w-xl text-sm leading-7 text-white/55">{l('Perbarui nama, nomor WhatsApp, alamat, dan password akunmu.', 'Update your name, WhatsApp number, address, and account password.')}</p>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
        <form onSubmit={save} className="rounded-[1.5rem] border border-brand-900/8 bg-white p-5 sm:p-7">
          <h2 className="font-display text-2xl font-bold">{l('Data pribadi', 'Personal details')}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label><span className="form-label">{l('Nama lengkap', 'Full name')}</span><input className="form-input" value={form.full_name} onChange={(event) => setForm({ ...form, full_name: event.target.value })} /></label>
            <label><span className="form-label">Email</span><input type="email" className="form-input cursor-not-allowed bg-neutral-100 text-neutral-500" value={form.email} disabled /></label>
            <label><span className="form-label">{l('No. HP / WhatsApp', 'Phone / WhatsApp')}</span><input type="tel" className="form-input" value={form.phone_number} onChange={(event) => setForm({ ...form, phone_number: event.target.value })} /></label>
            <label><span className="form-label">{l('Alamat', 'Address')}</span><input className="form-input" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} /></label>
          </div>
          <button className="btn-primary mt-6"><Save className="h-4 w-4" />{l('Simpan Profil', 'Save Profile')}</button>
        </form>

        <form onSubmit={changePassword} className="h-fit rounded-[1.5rem] border border-brand-900/8 bg-white p-5 sm:p-7">
          <KeyRound className="h-6 w-6 text-brand-600" />
          <h2 className="mt-5 font-display text-2xl font-bold">{l('Ubah password', 'Change password')}</h2>
          <p className="mt-2 text-xs leading-5 text-neutral-500">{l('Gunakan minimal 8 karakter dan jangan gunakan password yang sama dengan layanan lain.', 'Use at least 8 characters and do not reuse a password from another service.')}</p>
          <label className="mt-5 block"><span className="form-label">{l('Password baru', 'New password')}</span><input type="password" minLength={8} required className="form-input" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          <button className="btn-outline mt-5 w-full"><ShieldCheck className="h-4 w-4" />{l('Perbarui Password', 'Update Password')}</button>
        </form>
      </div>
    </MemberAreaShell>
  );
}
