'use client';

import { useRef, useState } from 'react';
import { CheckCircle2, ImageUp, LoaderCircle } from 'lucide-react';

interface CloudinaryUploadProps {
  folder: string;
  value?: string | null;
  onUpload: (url: string) => void;
}

export default function CloudinaryUpload({ folder, value, onUpload }: CloudinaryUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function upload(file?: File) {
    if (!file) return;
    if (!file.type.startsWith('image/')) return setError('Pilih file gambar.');
    if (file.size > 10 * 1024 * 1024) return setError('Ukuran gambar maksimal 10 MB.');
    setUploading(true); setError('');
    try {
      const signResponse = await fetch('/api/cloudinary/sign', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ folder }) });
      const signed = await signResponse.json();
      if (!signResponse.ok) throw new Error(signed.error || 'Gagal menyiapkan upload.');
      const form = new FormData();
      form.append('file', file); form.append('api_key', signed.apiKey); form.append('timestamp', String(signed.timestamp)); form.append('folder', signed.folder); form.append('signature', signed.signature);
      const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${signed.cloudName}/image/upload`, { method: 'POST', body: form });
      const result = await uploadResponse.json();
      if (!uploadResponse.ok || !result.secure_url) throw new Error(result.error?.message || 'Upload Cloudinary gagal.');
      onUpload(result.secure_url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Upload gagal.');
    } finally { setUploading(false); if (inputRef.current) inputRef.current.value = ''; }
  }

  return <div className="mt-2"><input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={(event) => void upload(event.target.files?.[0])} /><button type="button" disabled={uploading} onClick={() => inputRef.current?.click()} className="inline-flex items-center gap-2 rounded-full border border-brand-900/10 bg-white px-3 py-2 text-xs font-bold text-brand-700 disabled:opacity-50">{uploading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : value?.includes('res.cloudinary.com') ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <ImageUp className="h-4 w-4" />}{uploading ? 'Mengunggah...' : value?.includes('res.cloudinary.com') ? 'Ganti gambar Cloudinary' : 'Upload ke Cloudinary'}</button>{error && <p className="mt-2 text-xs font-semibold text-red-600">{error}</p>}</div>;
}
