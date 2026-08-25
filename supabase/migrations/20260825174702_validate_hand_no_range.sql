-- hand_no ต้องไม่เกินจำนวนมือของวง (null = ยังไม่ระบุ ผ่านได้)
create or replace function public.validate_hand_no()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  v_hands_count integer;
begin
  if new.hand_no is null then
    return new;
  end if;

  select hands_count into v_hands_count from public.circles where id = new.circle_id;
  if v_hands_count is not null and new.hand_no > v_hands_count then
    raise exception 'invalid_hand_no';
  end if;

  return new;
end;
$$;

revoke all on function public.validate_hand_no() from public, anon, authenticated;

drop trigger if exists validate_hand_no on public.circle_members;
create trigger validate_hand_no
  before insert or update of hand_no on public.circle_members
  for each row execute function public.validate_hand_no();
