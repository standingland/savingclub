import { useCallback, useEffect, useState } from 'react';
import { supabase } from './supabase.js';

// The member row linked to the signed-in user (bridges auth.users -> members).
// undefined = loading, null = no member profile found for this account.
export function useMember(userId) {
  const [member, setMember] = useState(undefined);

  const refresh = useCallback(async () => {
    if (!userId) {
      setMember(null);
      return;
    }
    const { data } = await supabase.from('members').select('*').eq('user_id', userId).maybeSingle();
    setMember(data ?? null);
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return [member, refresh];
}
