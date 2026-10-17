begin;

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default 'Rider',
  phone_number text,
  role text not null default 'member' check (role in ('member', 'admin')),
  riding_level text not null default 'Beginner' check (riding_level in ('Beginner', 'Intermediate', 'Advanced')),
  helmet_size text,
  boot_size text,
  emergency_contact_name text,
  emergency_contact_phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.trips (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  slug text not null unique,
  description text,
  short_description text,
  duration_minutes integer not null default 60 check (duration_minutes > 0),
  price bigint not null default 0 check (price >= 0),
  difficulty_level text not null default 'Easy' check (difficulty_level in ('Easy', 'Moderate', 'Challenging')),
  max_capacity integer not null default 1 check (max_capacity > 0),
  cover_image_url text,
  gallery_images text[] not null default '{}',
  category text not null default 'beach_ride' check (category in ('beach_ride', 'forest_trail', 'sunset_ride', 'mountain_trail', 'private_lesson', 'group_class')),
  highlights text[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id text primary key default gen_random_uuid()::text,
  icon text not null default 'sparkles',
  title text not null,
  title_id text not null,
  description text not null default '',
  description_id text not null default '',
  features text[] not null default '{}',
  features_id text[] not null default '{}',
  price bigint not null default 0 check (price >= 0),
  suitable_for text[] not null default '{}',
  suitable_for_id text[] not null default '{}',
  image_url text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  location text not null default '',
  avatar_url text,
  rating integer not null default 5 check (rating between 1 and 5),
  text text not null,
  text_en text not null default '',
  trip text not null default '',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_content (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete restrict,
  trip_id text not null references public.trips(id) on delete restrict,
  booking_date date not null,
  time_slot time not null,
  pax_count integer not null default 1 check (pax_count > 0),
  total_price bigint not null default 0 check (total_price >= 0),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  qr_code_token text unique,
  special_requests text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bookings_user_id_idx on public.bookings(user_id);
create index if not exists bookings_trip_schedule_idx on public.bookings(trip_id, booking_date, time_slot);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, phone_number, role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), split_part(coalesce(new.email, 'Rider'), '@', 1)),
    nullif(new.raw_user_meta_data ->> 'phone_number', ''),
    'member'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.prepare_booking()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  selected_trip public.trips%rowtype;
  reserved_pax integer;
begin
  select * into selected_trip from public.trips where id = new.trip_id and is_active = true;
  if not found then raise exception 'Trip tidak tersedia'; end if;
  if new.booking_date < current_date then raise exception 'Tanggal booking tidak valid'; end if;

  select coalesce(sum(pax_count), 0) into reserved_pax
  from public.bookings
  where trip_id = new.trip_id
    and booking_date = new.booking_date
    and time_slot = new.time_slot
    and status in ('pending', 'confirmed');

  if reserved_pax + new.pax_count > selected_trip.max_capacity then
    raise exception 'Kapasitas pada jadwal ini tidak mencukupi';
  end if;

  new.user_id = auth.uid();
  new.total_price = selected_trip.price * new.pax_count;
  new.status = 'pending';
  new.qr_code_token = coalesce(new.qr_code_token, 'RH-' || upper(substr(gen_random_uuid()::text, 1, 8)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

drop trigger if exists prepare_booking_before_insert on public.bookings;
create trigger prepare_booking_before_insert before insert on public.bookings
for each row execute function public.prepare_booking();

do $$
declare table_name text;
begin
  foreach table_name in array array['profiles', 'trips', 'services', 'testimonials', 'site_content', 'bookings']
  loop
    execute format('drop trigger if exists set_%I_updated_at on public.%I', table_name, table_name);
    execute format('create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name, table_name);
  end loop;
end $$;

alter table public.profiles enable row level security;
alter table public.trips enable row level security;
alter table public.services enable row level security;
alter table public.testimonials enable row level security;
alter table public.site_content enable row level security;
alter table public.bookings enable row level security;

create policy "Public can view active trips" on public.trips for select using (is_active or public.is_admin());
create policy "Public can view active services" on public.services for select using (is_active or public.is_admin());
create policy "Public can view active testimonials" on public.testimonials for select using (is_active or public.is_admin());
create policy "Public can view site content" on public.site_content for select using (true);

create policy "Admins manage trips" on public.trips for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage services" on public.services for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage testimonials" on public.testimonials for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage site content" on public.site_content for all using (public.is_admin()) with check (public.is_admin());

create policy "Members view own profile" on public.profiles for select using (auth.uid() = id or public.is_admin());
create policy "Members update own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "Admins manage profiles" on public.profiles for all using (public.is_admin()) with check (public.is_admin());

create policy "Members create own bookings" on public.bookings for insert with check (auth.uid() = user_id);
create policy "Members view own bookings" on public.bookings for select using (auth.uid() = user_id or public.is_admin());
create policy "Admins manage bookings" on public.bookings for all using (public.is_admin()) with check (public.is_admin());

revoke update on public.profiles from authenticated;
grant update (full_name, phone_number, riding_level, helmet_size, boot_size, emergency_contact_name, emergency_contact_phone, avatar_url) on public.profiles to authenticated;

insert into public.trips (id, title, slug, description, short_description, duration_minutes, price, difficulty_level, max_capacity, cover_image_url, category, highlights)
values
  ('1', 'Sunset Beach Ride', 'sunset-beach-ride', 'Rasakan keajaiban berkuda di sepanjang pesisir pantai Banyuwangi yang masih asri saat matahari melukis langit dengan warna keemasan.', 'Berkuda di tepi pantai Banyuwangi saat matahari terbenam nan memukau.', 90, 750000, 'Easy', 6, '/images/beach-ride.jpg', 'beach_ride', array['Jalur pantai 5km','Foto profesional termasuk','Snack ringan','Briefing keamanan']),
  ('2', 'Forest Mountain Trail', 'forest-mountain-trail', 'Petualangan ke dalam hutan tropis Banyuwangi dan jalur pegunungan dengan pemandangan spektakuler.', 'Jelajahi hutan lebat dan jalur pegunungan Banyuwangi yang indah.', 150, 1200000, 'Challenging', 4, '/images/forest-trail.jpg', 'forest_trail', array['Pemandangan pegunungan','Penyeberangan sungai','Flora & fauna tropis','Makan siang termasuk']),
  ('3', 'Golden Hour Sunset Ride', 'golden-hour-sunset-ride', 'Berkuda melalui padang rumput terbuka saat golden hour menerangi Banyuwangi dengan cahaya hangat.', 'Berkuda di padang rumput Banyuwangi saat cahaya golden hour.', 120, 950000, 'Moderate', 4, '/images/sunset-ride.jpg', 'sunset_ride', array['Toast champagne','Gallop di padang rumput','Drone footage profesional','Suasana romantis']),
  ('4', 'Private Riding Lesson', 'private-riding-lesson', 'Instruksi satu-ke-satu dengan instruktur berkuda bersertifikat, disesuaikan dengan level dan tujuanmu.', 'Instruksi privat dengan instruktur berkuda bersertifikat kami.', 60, 500000, 'Easy', 1, '/images/private-lesson.jpg', 'private_lesson', array['Instruktur bersertifikat','Semua perlengkapan disediakan','Kurikulum personal','Analisis video']),
  ('5', 'Group Riding Class', 'group-riding-class', 'Kelas grup yang menggabungkan pembelajaran berkuda, perawatan kuda, dan pengalaman sosial.', 'Kelas berkuda kelompok yang menyenangkan dan berkesan.', 90, 350000, 'Easy', 8, '/images/group-class.jpg', 'group_class', array['Suasana sosial','Dasar grooming kuda','Diskon grup tersedia','Sertifikat kelulusan']),
  ('6', 'Mountain Summit Trail', 'mountain-summit-trail', 'Trip menantang menuju jalur pegunungan Banyuwangi dengan panorama luas untuk rider berpengalaman.', 'Trip puncak gunung yang menantang dengan panorama 360° di Banyuwangi.', 180, 1500000, 'Challenging', 3, '/images/mountain-trail.jpg', 'mountain_trail', array['Panorama puncak','Petualangan seharian','Makan siang gourmet','Pemandu berpengalaman'])
on conflict (id) do nothing;

insert into public.services (id, icon, title, title_id, description, description_id, features, features_id, price, suitable_for, suitable_for_id, image_url, sort_order)
values
  ('service-1','graduation-cap','Private Lesson','Pelajaran Privat','One-on-one expert instruction tailored to your skill level.','Instruksi privat satu-ke-satu yang disesuaikan dengan level kemampuanmu.',array['Certified Instructor','All Equipment Provided','Video Analysis','Flexible Scheduling'],array['Instruktur Bersertifikat','Semua Perlengkapan','Analisis Video','Jadwal Fleksibel'],500000,array['First-time riders','Building confidence'],array['Pertama kali berkuda','Membangun kepercayaan diri'],'/images/private-lesson.jpg',0),
  ('service-2','users','Group Class','Kelas Kelompok','Social riding experience with fellow enthusiasts.','Pengalaman berkuda sosial bersama sesama penggemar.',array['Small Groups (max 8)','Team Building','Horse Care Basics'],array['Kelompok Kecil (maks 8)','Team Building','Dasar Perawatan Kuda'],350000,array['Social learners','Team building'],array['Pembelajaran sosial','Team building'],'/images/group-class.jpg',1),
  ('service-3','sparkles','Horse Grooming','Grooming Kuda','Learn the art of horse care in a guided session.','Pelajari seni merawat kuda dalam sesi terpandu.',array['Hands-on Experience','Horse Bonding','Family Friendly'],array['Pengalaman Langsung','Bonding dengan Kuda','Ramah Keluarga'],200000,array['Animal lovers','Families'],array['Pecinta hewan','Keluarga'],'/images/mountain-trail.jpg',2),
  ('service-4','camera','Documentation & Drone','Dokumentasi & Drone','Professional photography and cinematic drone footage.','Fotografi profesional dan rekaman drone sinematik.',array['Professional Photos','4K Drone Video','Same-day Delivery'],array['Foto Profesional','Video Drone 4K','Kirim di Hari yang Sama'],300000,array['Content creators','Special occasions'],array['Kreator konten','Acara spesial'],'/images/sunset-ride.jpg',3)
on conflict (id) do nothing;

insert into public.testimonials (id, name, location, rating, text, text_en, trip, sort_order)
values
  ('t1','Sari Dewi','Jakarta, Indonesia',5,'Pengalaman berkuda yang luar biasa, dengan instruktur sabar dan profesional.','An amazing riding experience with patient and professional instructors.','Golden Hour Sunset Ride',0),
  ('t2','Ahmad Fauzan','Surabaya, Indonesia',5,'Kelas grup sangat dinikmati keluarga kami. Fasilitas bersih dan staf ramah.','Our family loved the group class. Clean facilities and friendly staff.','Group Riding Class',1),
  ('t3','Nadire Abigail','Banyuwangi, Indonesia',5,'Pengalaman yang profesional dan ikut mengangkat pariwisata Banyuwangi.','A professional experience that elevates Banyuwangi tourism.','Forest Mountain Trail',2)
on conflict (id) do nothing;

commit;

-- Setelah akun pertama dibuat, promosikan admin sekali melalui SQL Editor:
-- update public.profiles set role = 'admin' where email = 'admin@domainanda.com';
