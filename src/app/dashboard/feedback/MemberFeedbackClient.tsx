'use client';

import { type FormEvent, useCallback, useEffect, useState } from 'react';
import { CheckCircle2, MessageSquareText, Pencil, Star, Trash2, X } from 'lucide-react';
import MemberAreaShell from '@/components/app/MemberAreaShell';
import { deleteMemberFeedbackRecord, editMemberFeedbackRecord, loadOperationsData, readMembers, submitFeedbackRecord } from '@/lib/operations';
import { useAuth } from '@/lib/use-auth';
import type { MemberFeedback } from '@/types';
import { useLanguage } from '@/lib/i18n/context';
import { formatDate } from '@/lib/utils';

export default function MemberFeedbackClient() {
  const { locale } = useLanguage();
  const l = (id: string, en: string) => locale === 'id' ? id : en;
  const { configured, user, profile } = useAuth('member');
  const [type, setType] = useState<'testimonial' | 'suggestion'>('testimonial');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [items, setItems] = useState<MemberFeedback[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmUndoId, setConfirmUndoId] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const snapshot = await loadOperationsData();
    setItems(snapshot.feedback.filter((item) => configured ? item.auth_user_id === user?.id : item.member_id === 'preview-member'));
  }, [configured, user]);

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  function resetForm() {
    setEditingId(null);
    setType('testimonial');
    setRating(5);
    setMessage('');
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setNotice('');
    try {
      if (editingId) {
        await editMemberFeedbackRecord(editingId, { type, rating, message: message.trim() });
        setNotice(l('Review berhasil diperbarui.', 'Review updated successfully.'));
      } else {
        const member = readMembers().find((item) => item.id === 'preview-member') || readMembers()[0];
        if (!configured && !member) throw new Error(l('Data member demo tidak ditemukan.', 'Demo member data was not found.'));
        await submitFeedbackRecord({
          member_id: configured ? null : member?.id || null,
          auth_user_id: user?.id || null,
          member_name: profile?.full_name || member?.full_name || user?.email || l('Member', 'Member'),
          type,
          rating,
          message: message.trim(),
        });
        setNotice(l('Terkirim ke admin.', 'Sent to the admin.'));
      }
      resetForm();
      await load();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : l('Gagal menyimpan review.', 'Could not save the review.'));
    } finally {
      setBusy(false);
    }
  }

  function beginEdit(item: MemberFeedback) {
    setEditingId(item.id);
    setType(item.type);
    setRating(item.rating);
    setMessage(item.message);
    setNotice('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function undo(item: MemberFeedback) {
    setBusy(true);
    try {
      await deleteMemberFeedbackRecord(item.id);
      if (editingId === item.id) resetForm();
      setConfirmUndoId(null);
      setNotice(l('Kiriman berhasil dibatalkan.', 'Submission cancelled.'));
      await load();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : l('Gagal membatalkan kiriman.', 'Could not cancel the submission.'));
    } finally {
      setBusy(false);
    }
  }

  const statusLabel = (status: MemberFeedback['status']) => ({
    pending: l('Menunggu', 'Pending'),
    published: l('Dipublikasikan', 'Published'),
    archived: l('Diarsipkan', 'Archived'),
  }[status]);

  return (
    <MemberAreaShell>
      <section className="rounded-[1.75rem] bg-brand-950 p-6 text-white sm:p-8">
        <MessageSquareText className="h-7 w-7 text-accent-300" />
        <p className="mt-5 text-[.62rem] font-extrabold uppercase tracking-[.17em] text-accent-300">Your voice matters</p>
        <h1 className="mt-2 font-display text-4xl font-bold">{l('Testimoni & saran.', 'Reviews & feedback.')}</h1>
        <p className="mt-3 max-w-xl text-sm leading-7 text-white/55">{l('Ceritakan pengalamanmu atau kirim saran langsung kepada tim operasional.', 'Share your experience or send feedback directly to our operations team.')}</p>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
        <form onSubmit={submit} className="h-fit rounded-[1.5rem] border border-brand-900/8 bg-white p-5 sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-2xl font-bold">{editingId ? l('Edit review', 'Edit review') : l('Kirim feedback', 'Send feedback')}</h2>
            {editingId && <button type="button" onClick={resetForm} className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100" aria-label={l('Batal edit', 'Cancel editing')}><X className="h-4 w-4" /></button>}
          </div>
          {notice && <div role="status" className="mt-4 flex items-center gap-2 rounded-xl bg-brand-100 p-3 text-xs font-bold text-brand-800"><CheckCircle2 className="h-4 w-4" />{notice}</div>}
          <label className="mt-5 block"><span className="form-label">{l('Jenis', 'Type')}</span><select className="form-select" value={type} onChange={(event) => setType(event.target.value as typeof type)}><option value="testimonial">{l('Testimoni', 'Review')}</option><option value="suggestion">{l('Saran', 'Suggestion')}</option></select></label>
          <div className="mt-4"><span className="form-label">Rating</span><div className="flex gap-2">{[1, 2, 3, 4, 5].map((number) => <button key={number} type="button" onClick={() => setRating(number)} aria-label={`${number} ${l('bintang', 'stars')}`} aria-pressed={number <= rating}><Star className={`h-7 w-7 transition-colors ${number <= rating ? 'fill-accent-400 text-accent-400' : 'text-neutral-300'}`} /></button>)}</div><p className="mt-2 text-[.66rem] font-semibold text-neutral-400">{rating}/5 {l('bintang', 'stars')}</p></div>
          <label className="mt-4 block"><span className="form-label">{l('Pesan', 'Message')}</span><textarea required minLength={10} rows={6} className="form-input" value={message} onChange={(event) => setMessage(event.target.value)} /></label>
          <button disabled={busy} className="btn-primary mt-5 disabled:opacity-50">{busy ? l('Menyimpan…', 'Saving…') : editingId ? l('Simpan perubahan', 'Save changes') : l('Kirim ke Admin', 'Send to Admin')}</button>
        </form>

        <section className="rounded-[1.5rem] border border-brand-900/8 bg-white p-5 sm:p-7">
          <h2 className="font-display text-2xl font-bold">{l('Kiriman saya', 'My submissions')}</h2>
          <p className="mt-2 text-xs leading-5 text-neutral-500">{l('Review yang masih menunggu dapat diedit atau dibatalkan.', 'Pending reviews can be edited or cancelled.')}</p>
          <div className="mt-5 space-y-3">
            {items.map((item) => (
              <article key={item.id} className="rounded-2xl bg-[#f5f3ec] p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <strong className="capitalize">{item.type === 'testimonial' ? l('Testimoni', 'Review') : l('Saran', 'Suggestion')}</strong>
                    <div className="mt-2 flex items-center gap-1" aria-label={`${item.rating} ${l('dari 5 bintang', 'out of 5 stars')}`}>
                      {[1, 2, 3, 4, 5].map((number) => <Star key={number} className={`h-4 w-4 ${number <= item.rating ? 'fill-accent-400 text-accent-400' : 'text-neutral-300'}`} />)}
                      <span className="ml-1 text-[.65rem] font-bold text-neutral-500">{item.rating}/5</span>
                    </div>
                  </div>
                  <div className="text-right"><span className="rounded-full bg-white px-2.5 py-1 text-[.58rem] font-extrabold uppercase text-neutral-500">{statusLabel(item.status)}</span><p className="mt-2 text-[.6rem] text-neutral-400">{formatDate(item.created_at, locale)}</p></div>
                </div>
                <p className="mt-4 text-sm leading-6 text-neutral-600">{item.message}</p>
                {item.status === 'pending' && (
                  <div className="mt-4 border-t border-brand-900/8 pt-4">
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => beginEdit(item)} disabled={busy} className="inline-flex items-center gap-2 rounded-full border border-brand-900/12 bg-white px-3.5 py-2 text-xs font-bold text-brand-800"><Pencil className="h-3.5 w-3.5" />{l('Edit', 'Edit')}</button>
                      <button type="button" onClick={() => setConfirmUndoId(item.id)} disabled={busy} className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-bold text-red-700"><Trash2 className="h-3.5 w-3.5" />{l('Batalkan kiriman', 'Undo submission')}</button>
                    </div>
                    {confirmUndoId === item.id && (
                      <div role="alert" className="mt-3 rounded-xl border border-red-200 bg-white p-3">
                        <p className="text-xs font-semibold text-red-800">{l('Kiriman akan dihapus dari daftar. Lanjutkan?', 'This submission will be removed from your list. Continue?')}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button type="button" onClick={() => setConfirmUndoId(null)} className="rounded-full border border-brand-900/12 px-3 py-1.5 text-[.68rem] font-bold text-brand-800">{l('Tetap simpan', 'Keep it')}</button>
                          <button type="button" onClick={() => void undo(item)} disabled={busy} className="rounded-full bg-red-700 px-3 py-1.5 text-[.68rem] font-bold text-white disabled:opacity-50">{busy ? l('Menghapus…', 'Removing…') : l('Ya, batalkan', 'Yes, undo')}</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </article>
            ))}
            {!items.length && <p className="text-sm text-neutral-500">{l('Belum ada feedback.', 'No feedback yet.')}</p>}
          </div>
        </section>
      </div>
    </MemberAreaShell>
  );
}
