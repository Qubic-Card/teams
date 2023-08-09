import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL.toString(),
  import.meta.env.VITE_SUPABASE_ANON_KEY.toString(), { auth: { persistSession: true } }
);

export default supabase;
