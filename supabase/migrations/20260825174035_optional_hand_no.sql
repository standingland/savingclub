-- มือ (hand number) becomes optional: a member can join a circle before knowing
-- which hand they will take, and pick it later.
--
-- Applied to the Supabase project as migration `optional_hand_no`.
-- (Migrations before this one were applied directly to the project and are not
-- checked into this repo.)

alter table public.circle_members alter column hand_no drop not null;

alter table public.circle_members
  add constraint circle_members_hand_no_positive
  check (hand_no is null or hand_no >= 1);

comment on column public.circle_members.hand_no is
  'มือที่สมาชิกถือในวง — null = ยังไม่ระบุ (เลือกภายหลังได้)';

-- Preview now reports how many members already joined (unassigned hands still
-- take a seat) and keeps NULL hands out of taken_hands.
drop function if exists public.preview_circle_by_invite_code(text);

create function public.preview_circle_by_invite_code(p_code text)
returns table(
  id uuid,
  name text,
  hand_amount numeric,
  hands_count integer,
  frequency text,
  bid_type text,
  taken_hands integer[],
  members_count integer
)
language sql
stable
security definer
set search_path to 'public'
as $$
  select c.id, c.name, c.hand_amount, c.hands_count, c.frequency, c.bid_type,
    coalesce(
      (select array_agg(hand_no) from public.circle_members
        where circle_id = c.id and hand_no is not null),
      '{}'
    ),
    (select count(*)::int from public.circle_members where circle_id = c.id)
  from public.circles c
  where c.invite_code = p_code;
$$;

revoke all on function public.preview_circle_by_invite_code(text) from public;
grant execute on function public.preview_circle_by_invite_code(text) to anon, authenticated, service_role;

-- Joining with p_hand_no = null means "ยังไม่ระบุมือ".
create or replace function public.join_circle_by_invite_code(p_code text, p_hand_no integer default null)
returns uuid
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_circle_id uuid;
  v_hands_count integer;
  v_member_id uuid;
  v_cm_id uuid;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  select id, hands_count into v_circle_id, v_hands_count
  from public.circles where invite_code = p_code;
  if v_circle_id is null then
    raise exception 'invalid_invite_code';
  end if;

  select id into v_member_id from public.members where user_id = auth.uid();
  if v_member_id is null then
    raise exception 'no_member_profile';
  end if;

  if exists (select 1 from public.circle_members where circle_id = v_circle_id and member_id = v_member_id) then
    raise exception 'already_joined';
  end if;

  -- Members without a hand number still occupy a seat in the circle.
  if (select count(*) from public.circle_members where circle_id = v_circle_id) >= v_hands_count then
    raise exception 'circle_full';
  end if;

  if p_hand_no is not null then
    if p_hand_no < 1 or p_hand_no > v_hands_count then
      raise exception 'invalid_hand_no';
    end if;
    if exists (select 1 from public.circle_members where circle_id = v_circle_id and hand_no = p_hand_no) then
      raise exception 'hand_taken';
    end if;
  end if;

  insert into public.circle_members (circle_id, member_id, hand_no, role)
  values (v_circle_id, v_member_id, p_hand_no, 'member')
  returning id into v_cm_id;

  return v_cm_id;
end;
$$;

-- Lets a member fill in (or clear) their own hand number later on.
create or replace function public.set_my_hand_no(p_circle_id uuid, p_hand_no integer)
returns integer
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_member_id uuid;
  v_hands_count integer;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;

  select id into v_member_id from public.members where user_id = auth.uid();
  if v_member_id is null then
    raise exception 'no_member_profile';
  end if;

  select hands_count into v_hands_count from public.circles where id = p_circle_id;
  if v_hands_count is null then
    raise exception 'circle_not_found';
  end if;

  if not exists (select 1 from public.circle_members where circle_id = p_circle_id and member_id = v_member_id) then
    raise exception 'not_a_circle_member';
  end if;

  if p_hand_no is not null then
    if p_hand_no < 1 or p_hand_no > v_hands_count then
      raise exception 'invalid_hand_no';
    end if;
    if exists (
      select 1 from public.circle_members
      where circle_id = p_circle_id and hand_no = p_hand_no and member_id <> v_member_id
    ) then
      raise exception 'hand_taken';
    end if;
  end if;

  update public.circle_members
  set hand_no = p_hand_no
  where circle_id = p_circle_id and member_id = v_member_id;

  return p_hand_no;
end;
$$;

revoke all on function public.set_my_hand_no(uuid, integer) from public;
grant execute on function public.set_my_hand_no(uuid, integer) to authenticated, service_role;
