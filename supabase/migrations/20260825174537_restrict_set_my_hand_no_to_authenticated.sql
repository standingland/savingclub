-- Supabase's default privileges grant EXECUTE on new public functions to anon;
-- set_my_hand_no always requires a signed-in user, so drop that grant.
revoke execute on function public.set_my_hand_no(uuid, integer) from anon;
