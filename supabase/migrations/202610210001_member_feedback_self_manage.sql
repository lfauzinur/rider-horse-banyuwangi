begin;

drop policy if exists "Members update own pending feedback" on public.member_feedback;
create policy "Members update own pending feedback"
on public.member_feedback for update
using (auth_user_id = auth.uid() and status = 'pending')
with check (auth_user_id = auth.uid() and status = 'pending');

drop policy if exists "Members delete own pending feedback" on public.member_feedback;
create policy "Members delete own pending feedback"
on public.member_feedback for delete
using (auth_user_id = auth.uid() and status = 'pending');

commit;
