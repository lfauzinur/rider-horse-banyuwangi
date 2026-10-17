import { createHash } from 'node:crypto';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { PREVIEW_AUTH_COOKIE } from '@/lib/preview-auth';

function sanitizeFolder(value: unknown) {
  const folder = typeof value === 'string' ? value : 'rider-horse/uploads';
  return folder.replace(/[^a-zA-Z0-9/_-]/g, '').slice(0, 120) || 'rider-horse/uploads';
}

async function isAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return (await cookies()).get(PREVIEW_AUTH_COOKIE)?.value === 'admin';
  }
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
  return data?.role === 'admin';
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: 'Akses admin diperlukan.' }, { status: 403 });
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return Response.json({ error: 'Cloudinary belum dikonfigurasi.' }, { status: 503 });
  }

  const body = await request.json().catch(() => ({}));
  const folder = sanitizeFolder(body.folder);
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createHash('sha1').update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`).digest('hex');
  return Response.json({ cloudName, apiKey, folder, timestamp, signature });
}
