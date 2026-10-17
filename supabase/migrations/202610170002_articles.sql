begin;

create table if not exists public.articles (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  content text not null default '',
  cover_image_url text,
  author text not null default 'Tim Rider Horse',
  published_at date not null default current_date,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists articles_publication_idx
  on public.articles(is_published, published_at desc);

drop trigger if exists set_articles_updated_at on public.articles;
create trigger set_articles_updated_at
before update on public.articles
for each row execute function public.set_updated_at();

alter table public.articles enable row level security;

create policy "Public can view published articles"
on public.articles for select
using (is_published or public.is_admin());

create policy "Admins manage articles"
on public.articles for all
using (public.is_admin())
with check (public.is_admin());

insert into public.articles (id, title, slug, excerpt, content, cover_image_url, author, published_at, is_published)
values
  (
    'article-1',
    'Panduan Berkuda Pertama untuk Pemula',
    'panduan-berkuda-pertama-untuk-pemula',
    'Persiapan sederhana agar pengalaman berkuda pertamamu terasa aman, nyaman, dan menyenangkan.',
    E'Berkuda untuk pertama kali tidak harus terasa menegangkan. Datanglah 20–30 menit lebih awal agar kamu punya cukup waktu untuk mengenal instruktur, perlengkapan, dan kuda yang akan menjadi partner perjalananmu.\n\nGunakan celana panjang yang lentur, sepatu tertutup dengan hak rendah, dan hindari aksesori yang mudah tersangkut. Helm berkuda wajib dipakai selama sesi, bahkan ketika kamu hanya berlatih di arena.\n\nHal terpenting adalah tetap tenang dan mengikuti arahan instruktur. Kuda sangat peka terhadap bahasa tubuh. Napas yang teratur, gerakan lembut, dan komunikasi yang konsisten akan membantu membangun rasa percaya sejak awal.',
    '/images/private-lesson.jpg',
    'Tim Rider Horse',
    '2026-10-12',
    true
  ),
  (
    'article-2',
    'Menyiapkan Diri untuk Sunset Beach Ride',
    'menyiapkan-diri-untuk-sunset-beach-ride',
    'Checklist perlengkapan dan waktu terbaik untuk menikmati perjalanan berkuda di pesisir Banyuwangi.',
    E'Sunset Beach Ride menggabungkan pengalaman berkuda dengan perubahan cahaya yang cepat di pesisir. Pilih pakaian berwarna netral, gunakan tabir surya, dan bawa lapisan luar yang ringan karena angin pantai dapat terasa lebih sejuk menjelang malam.\n\nSimpan barang pribadi di tas kecil yang aman. Ponsel sebaiknya menggunakan tali pengaman dan hanya digunakan ketika instruktur menyatakan kondisi aman untuk mengambil foto.\n\nTim kami memantau cuaca, kondisi pasang, dan karakter setiap kuda sebelum keberangkatan. Karena itu, jadwal dapat disesuaikan demi keselamatan dan kualitas pengalaman seluruh rider.',
    '/images/beach-ride.jpg',
    'Tim Trail Rider Horse',
    '2026-10-08',
    true
  ),
  (
    'article-3',
    'Cara Membangun Kepercayaan dengan Kuda',
    'cara-membangun-kepercayaan-dengan-kuda',
    'Mengenali bahasa tubuh kuda dan menciptakan komunikasi yang tenang sebelum naik ke pelana.',
    E'Hubungan yang baik dengan kuda dimulai sebelum kamu berada di atas pelana. Dekati kuda dari arah yang dapat dilihatnya, biarkan ia mengenali kehadiranmu, lalu ikuti arahan handler untuk menyentuh bagian leher atau bahunya.\n\nPerhatikan posisi telinga, kepala, dan ketegangan tubuh. Telinga yang bergerak aktif biasanya menandakan kuda sedang memperhatikan lingkungan, sementara tubuh yang rileks menunjukkan ia merasa aman.\n\nKonsistensi adalah kunci. Gunakan instruksi yang jelas, berikan jeda agar kuda dapat merespons, dan hindari gerakan mendadak. Kepercayaan dibangun melalui interaksi kecil yang positif dan berulang.',
    '/images/group-class.jpg',
    'Coach Rider Horse',
    '2026-10-02',
    true
  )
on conflict (id) do nothing;

commit;
