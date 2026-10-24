begin;

create or replace function public.expire_stale_bookings()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  affected integer;
begin
  update public.bookings
  set status = 'cancelled', updated_at = now()
  where status = 'pending'
    and created_at <= now() - interval '24 hours';

  get diagnostics affected = row_count;
  return affected;
end;
$$;

create or replace function public.cancel_my_booking(booking_uuid uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.bookings
  set status = 'cancelled', updated_at = now()
  where id = booking_uuid
    and user_id = auth.uid()
    and status = 'pending';

  if not found then
    raise exception 'Booking tidak ditemukan atau sudah tidak dapat dibatalkan';
  end if;
end;
$$;

create or replace function public.update_my_pending_feedback(
  feedback_uuid uuid,
  feedback_type text,
  feedback_rating integer,
  feedback_message text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if feedback_type not in ('testimonial', 'suggestion') then
    raise exception 'Jenis feedback tidak valid';
  end if;
  if feedback_rating not between 1 and 5 then
    raise exception 'Rating harus antara 1 dan 5';
  end if;
  if length(trim(feedback_message)) < 10 then
    raise exception 'Pesan minimal 10 karakter';
  end if;

  update public.member_feedback f
  set type = feedback_type,
      rating = feedback_rating,
      message = trim(feedback_message),
      auth_user_id = auth.uid()
  where f.id = feedback_uuid
    and f.status = 'pending'
    and (
      f.auth_user_id = auth.uid()
      or exists (
        select 1 from public.member_directory m
        where m.id = f.member_id and m.auth_user_id = auth.uid()
      )
    );

  if not found then
    raise exception 'Review tidak ditemukan atau sudah tidak dapat diedit';
  end if;
end;
$$;

create or replace function public.delete_my_pending_feedback(feedback_uuid uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.member_feedback f
  where f.id = feedback_uuid
    and f.status = 'pending'
    and (
      f.auth_user_id = auth.uid()
      or exists (
        select 1 from public.member_directory m
        where m.id = f.member_id and m.auth_user_id = auth.uid()
      )
    );

  if not found then
    raise exception 'Review tidak ditemukan atau sudah tidak dapat dibatalkan';
  end if;
end;
$$;

revoke all on function public.expire_stale_bookings() from public;
revoke all on function public.cancel_my_booking(uuid) from public;
revoke all on function public.update_my_pending_feedback(uuid, text, integer, text) from public;
revoke all on function public.delete_my_pending_feedback(uuid) from public;
grant execute on function public.expire_stale_bookings() to authenticated;
grant execute on function public.cancel_my_booking(uuid) to authenticated;
grant execute on function public.update_my_pending_feedback(uuid, text, integer, text) to authenticated;
grant execute on function public.delete_my_pending_feedback(uuid) to authenticated;

commit;

create extension if not exists pg_cron with schema extensions;

do $$
declare
  existing_job bigint;
begin
  select jobid into existing_job from cron.job where jobname = 'expire-stale-rider-horse-bookings' limit 1;
  if existing_job is not null then
    perform cron.unschedule(existing_job);
  end if;
  perform cron.schedule(
    'expire-stale-rider-horse-bookings',
    '*/15 * * * *',
    'select public.expire_stale_bookings();'
  );
end;
$$;
