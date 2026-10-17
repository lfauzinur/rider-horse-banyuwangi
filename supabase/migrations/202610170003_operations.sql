begin;

alter table public.profiles add column if not exists address text;
alter table public.profiles add column if not exists referral_code text;
alter table public.profiles add column if not exists referred_by text;
alter table public.profiles add column if not exists referral_balance bigint not null default 0;
create unique index if not exists profiles_referral_code_idx on public.profiles(referral_code) where referral_code is not null;

create table if not exists public.member_directory (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  email text not null,
  full_name text not null,
  phone_number text not null default '',
  address text,
  riding_level text not null default 'Beginner' check (riding_level in ('Beginner','Intermediate','Advanced')),
  referral_code text not null unique,
  referred_by text,
  referral_balance bigint not null default 0,
  status text not null default 'active' check (status in ('active','inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.bookings alter column user_id drop not null;
alter table public.bookings add column if not exists member_id uuid references public.member_directory(id) on delete set null;
alter table public.bookings add column if not exists customer_name text;
alter table public.bookings add column if not exists customer_email text;
alter table public.bookings add column if not exists customer_phone text;
alter table public.bookings add column if not exists service_id text references public.services(id) on delete set null;
alter table public.bookings add column if not exists service_name text;
alter table public.bookings add column if not exists payment_plan text not null default 'dp' check (payment_plan in ('dp','full'));
alter table public.bookings add column if not exists payment_status text not null default 'unpaid' check (payment_status in ('unpaid','dp_paid','paid','refunded'));
alter table public.bookings add column if not exists dp_amount bigint not null default 0;
alter table public.bookings add column if not exists paid_amount bigint not null default 0;
alter table public.bookings add column if not exists outstanding_amount bigint not null default 0;
alter table public.bookings add column if not exists payment_method text;
alter table public.bookings add column if not exists created_by text not null default 'member' check (created_by in ('member','admin'));
alter table public.bookings add column if not exists referral_code text;

create table if not exists public.booking_payments (
  id uuid primary key default gen_random_uuid(), booking_id uuid not null references public.bookings(id) on delete cascade,
  member_id uuid references public.member_directory(id) on delete set null, member_name text not null,
  type text not null check (type in ('dp','settlement','full','refund')), amount bigint not null check (amount > 0),
  method text not null, status text not null default 'paid' check (status in ('pending','paid','refunded')),
  paid_at timestamptz not null default now(), created_by text not null default 'member' check (created_by in ('member','admin'))
);

create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(), referrer_member_id uuid not null references public.member_directory(id) on delete cascade,
  referrer_name text not null, code text not null, referred_name text not null,
  booking_id uuid references public.bookings(id) on delete set null, commission_amount bigint not null default 0,
  status text not null default 'pending' check (status in ('pending','approved','paid')), created_at timestamptz not null default now()
);

create table if not exists public.member_feedback (
  id uuid primary key default gen_random_uuid(), member_id uuid references public.member_directory(id) on delete set null,
  auth_user_id uuid references auth.users(id) on delete set null, member_name text not null,
  type text not null check (type in ('testimonial','suggestion')), rating integer not null default 5 check (rating between 1 and 5),
  message text not null, status text not null default 'pending' check (status in ('pending','published','archived')),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path=public as $$
declare generated_code text := 'RH' || upper(substr(md5(new.id::text),1,8));
begin
  insert into public.profiles (id,email,full_name,phone_number,role,referral_code,referred_by)
  values (new.id,coalesce(new.email,''),coalesce(nullif(new.raw_user_meta_data->>'full_name',''),split_part(coalesce(new.email,'Rider'),'@',1)),nullif(new.raw_user_meta_data->>'phone_number',''),'member',generated_code,nullif(new.raw_user_meta_data->>'referred_by',''))
  on conflict (id) do update set email=excluded.email,full_name=excluded.full_name,phone_number=excluded.phone_number;
  insert into public.member_directory (auth_user_id,email,full_name,phone_number,riding_level,referral_code,referred_by)
  values (new.id,coalesce(new.email,''),coalesce(nullif(new.raw_user_meta_data->>'full_name',''),split_part(coalesce(new.email,'Rider'),'@',1)),coalesce(new.raw_user_meta_data->>'phone_number',''),'Beginner',generated_code,nullif(new.raw_user_meta_data->>'referred_by',''))
  on conflict (auth_user_id) do update set email=excluded.email,full_name=excluded.full_name,phone_number=excluded.phone_number;
  return new;
end; $$;

insert into public.member_directory (auth_user_id,email,full_name,phone_number,riding_level,referral_code,referred_by,created_at)
select p.id,p.email,p.full_name,coalesce(p.phone_number,''),p.riding_level,coalesce(p.referral_code,'RH'||upper(substr(md5(p.id::text),1,8))),p.referred_by,p.created_at from public.profiles p
on conflict (auth_user_id) do nothing;

update public.profiles
set referral_code='RH'||upper(substr(md5(id::text),1,8))
where referral_code is null;

create or replace function public.sync_profile_to_member_directory()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  update public.member_directory set email=new.email,full_name=new.full_name,phone_number=coalesce(new.phone_number,''),address=new.address,riding_level=new.riding_level,referral_code=coalesce(new.referral_code,referral_code),referred_by=new.referred_by,updated_at=now() where auth_user_id=new.id;
  return new;
end; $$;
drop trigger if exists sync_profile_after_update on public.profiles;
create trigger sync_profile_after_update after update on public.profiles for each row execute function public.sync_profile_to_member_directory();

create or replace function public.prepare_booking()
returns trigger language plpgsql security definer set search_path = public as $$
declare selected_trip public.trips%rowtype; selected_service public.services%rowtype; selected_member public.member_directory%rowtype; reserved_pax integer; service_price bigint := 0; admin_request boolean := public.is_admin();
begin
  select * into selected_trip from public.trips where id = new.trip_id and (is_active = true or admin_request);
  if not found then raise exception 'Trip tidak tersedia'; end if;
  if new.booking_date < current_date then raise exception 'Tanggal booking tidak valid'; end if;
  select coalesce(sum(pax_count),0) into reserved_pax from public.bookings where trip_id=new.trip_id and booking_date=new.booking_date and time_slot=new.time_slot and status in ('pending','confirmed');
  if reserved_pax + new.pax_count > selected_trip.max_capacity then raise exception 'Kapasitas pada jadwal ini tidak mencukupi'; end if;
  if new.service_id is not null then select * into selected_service from public.services where id=new.service_id; if found then service_price:=selected_service.price; new.service_name:=selected_service.title_id; end if; end if;
  if not admin_request then
    new.user_id:=auth.uid(); new.created_by:='member';
    select * into selected_member from public.member_directory where auth_user_id=auth.uid();
    if not found then raise exception 'Data member tidak ditemukan'; end if;
    new.member_id:=selected_member.id; new.customer_name:=selected_member.full_name; new.customer_email:=selected_member.email; new.customer_phone:=selected_member.phone_number;
  end if;
  new.total_price:=(selected_trip.price*new.pax_count)+service_price;
  new.dp_amount:=round(new.total_price*.30); new.paid_amount:=least(coalesce(new.paid_amount,0),new.total_price); new.outstanding_amount:=new.total_price-new.paid_amount;
  new.payment_status:=case when new.paid_amount>=new.total_price then 'paid' when new.paid_amount>0 then 'dp_paid' else 'unpaid' end;
  new.qr_code_token:=coalesce(new.qr_code_token,'RH-'||upper(substr(gen_random_uuid()::text,1,8)));
  return new;
end; $$;

create or replace function public.create_booking_referral()
returns trigger language plpgsql security definer set search_path=public as $$
declare referrer public.member_directory%rowtype;
begin
  if new.referral_code is null or new.referral_code='' then return new; end if;
  select * into referrer from public.member_directory where referral_code=upper(new.referral_code);
  if found and referrer.id is distinct from new.member_id then
    insert into public.referrals (referrer_member_id,referrer_name,code,referred_name,booking_id,commission_amount,status)
    values (referrer.id,referrer.full_name,referrer.referral_code,coalesce(new.customer_name,'Member'),new.id,round(new.total_price*.05),'pending');
  end if;
  return new;
end; $$;
drop trigger if exists create_referral_after_booking on public.bookings;
create trigger create_referral_after_booking after insert on public.bookings for each row execute function public.create_booking_referral();

create or replace function public.sync_payment_to_booking()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  if new.status='paid' then update public.bookings set paid_amount=least(total_price,paid_amount+new.amount), outstanding_amount=greatest(0,total_price-(paid_amount+new.amount)), payment_status=case when paid_amount+new.amount>=total_price then 'paid' else 'dp_paid' end where id=new.booking_id; end if;
  return new;
end; $$;
drop trigger if exists sync_payment_after_insert on public.booking_payments;
create trigger sync_payment_after_insert after insert on public.booking_payments for each row execute function public.sync_payment_to_booking();

alter table public.member_directory enable row level security; alter table public.booking_payments enable row level security; alter table public.referrals enable row level security; alter table public.member_feedback enable row level security;
create policy "Admins manage member directory" on public.member_directory for all using (public.is_admin()) with check (public.is_admin());
create policy "Members view own directory record" on public.member_directory for select using (auth_user_id=auth.uid() or public.is_admin());
create policy "Admins manage payments" on public.booking_payments for all using (public.is_admin()) with check (public.is_admin());
create policy "Members view own payments" on public.booking_payments for select using (exists(select 1 from public.member_directory m where m.id=member_id and m.auth_user_id=auth.uid()) or public.is_admin());
create policy "Members create own payments" on public.booking_payments for insert with check (exists(select 1 from public.bookings b where b.id=booking_id and b.user_id=auth.uid()));
create policy "Admins manage referrals" on public.referrals for all using (public.is_admin()) with check (public.is_admin());
create policy "Members view own referrals" on public.referrals for select using (exists(select 1 from public.member_directory m where m.id=referrer_member_id and m.auth_user_id=auth.uid()) or public.is_admin());
create policy "Members submit feedback" on public.member_feedback for insert with check (auth_user_id=auth.uid());
create policy "Members view own feedback" on public.member_feedback for select using (auth_user_id=auth.uid() or public.is_admin());
create policy "Admins manage feedback" on public.member_feedback for all using (public.is_admin()) with check (public.is_admin());

grant update (full_name,phone_number,address,riding_level,helmet_size,boot_size,emergency_contact_name,emergency_contact_phone,avatar_url) on public.profiles to authenticated;
commit;
