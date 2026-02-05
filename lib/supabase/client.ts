import { createBrowserClient } from '@supabase/ssr';

/**
 * Browser-side Supabase client (singleton).
 * Uses NEXT_PUBLIC_ env vars which are embedded at build time.
 * For full DB type safety, pass generated types to createBrowserClient<Database>().
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
}
