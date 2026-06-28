import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Admin client with service_role key — bypasses RLS
// ONLY use in server-side admin routes and Edge Functions
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
