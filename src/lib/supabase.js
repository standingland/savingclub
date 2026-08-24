import { createClient } from '@supabase/supabase-js';

// Public project URL + publishable (anon) key — safe to expose client-side.
// Row Level Security policies on the database are what actually gate access.
const SUPABASE_URL = 'https://zlokvjlhpvncdbfkkcjp.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_lkRPWsOlKj8_LK_iuMvBrQ__UGU9SPt';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
