# Rider Horse Banyuwangi

Website pemasaran, aplikasi booking member berbasis PWA, dan dashboard admin untuk Rider Horse Banyuwangi. Semua booking dibuat dari akun member; admin mengelola katalog, konten landing page, testimoni, dan status booking.

## Menjalankan proyek

```bash
npm install
cp .env.example .env.local
npm run dev
```

Buka `http://localhost:3000`.

Tanpa konfigurasi Supabase, landing page serta dashboard dapat dibuka dalam **mode preview**. Registrasi dan booking transaksi sengaja dinonaktifkan sampai backend terhubung.

### Akun demo lokal

| Peran | Email | Password |
| --- | --- | --- |
| Admin | `admin@riderhorse.local` | `AdminRider#2026` |
| Member | `member@riderhorse.local` | `MemberRider#2026` |

Akun ini hanya aktif ketika Supabase belum dikonfigurasi. Keduanya tidak boleh digunakan sebagai kredensial produksi.

## Menyiapkan Supabase

1. Buat project Supabase, lalu isi URL dan anon key pada `.env.local`.
2. Jalankan seluruh migration di folder [`supabase/migrations`](supabase/migrations) secara berurutan melalui Supabase CLI atau SQL Editor.
3. Daftarkan akun pertama dari `/register`.
4. Promosikan akun tersebut sekali melalui SQL Editor:

```sql
update public.profiles
set role = 'admin'
where email = 'email-admin-anda@example.com';
```

5. Masuk kembali dan buka `/admin`.

Migration mencakup tabel, seed katalog, trigger profil member, kalkulasi harga booking di server, validasi kapasitas, dan Row Level Security. Jangan pernah menaruh service-role key di environment publik.

## Cloudinary

Upload gambar dari dashboard admin menggunakan signed upload melalui endpoint server `/api/cloudinary/sign`. Isi tiga environment berikut hanya di `.env.local` dan Vercel:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

`CLOUDINARY_API_SECRET` tidak pernah dikirim ke browser dan tidak boleh diawali `NEXT_PUBLIC_`.

## Deploy ke Vercel

1. Hubungkan repository GitHub ke Vercel.
2. Tambahkan seluruh variable dari `.env.example` pada Environment Variables untuk Production, Preview, dan Development.
3. Jalankan migration Supabase secara berurutan sebelum deployment produksi pertama.
4. Setelah mendapat domain Vercel, ubah `NEXT_PUBLIC_APP_URL` ke URL produksi lalu lakukan redeploy.
5. Pada Supabase Authentication → URL Configuration, isi Site URL dengan domain produksi dan tambahkan `https://domain-anda.vercel.app/**` sebagai redirect URL.

Vercel menjalankan `npm run build`. Aplikasi hanya menggunakan mode produksi Supabase apabila URL dan anon key tersedia; akun demo lokal tidak aktif pada konfigurasi tersebut.

## Halaman utama

- `/` — landing page bilingual dan responsif
- `/register` — pendaftaran member
- `/login` — login/reset password
- `/dashboard` — aplikasi member/PWA
- `/articles` — artikel publik untuk visitor dan member
- `/articles/[slug]` — detail artikel
- `/book/[slug]` — alur booking member
- `/admin` — CMS dan operasional admin

## Verifikasi

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Build menggunakan Webpack untuk kompatibilitas dengan lingkungan pengembangan proyek ini.
