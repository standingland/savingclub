import { createClient } from '@supabase/supabase-js';

// Public project URL + publishable (anon) key — safe to expose client-side.
// Row Level Security policies on the database are what actually gate access.
// Configurable via .env (see .env.example) so this can point at a different
// Supabase project (e.g. staging) without editing source.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://zlokvjlhpvncdbfkkcjp.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_lkRPWsOlKj8_LK_iuMvBrQ__UGU9SPt';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
