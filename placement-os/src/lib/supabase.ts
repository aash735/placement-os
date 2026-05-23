/**
 * supabase.ts
 *
 * Supabase client for DIRECT DATABASE ACCESS ONLY.
 * No Supabase Auth. Uses the anon key for table-level operations.
 *
 * Tables are protected by application logic, not RLS.
 * GRANT ALL statements in the SQL schema allow anon key access.
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const hasSupabaseConfig = !!(supabaseUrl && supabaseAnonKey);

if (!hasSupabaseConfig && typeof window !== "undefined") {
  console.warn(
    "⚠️ Supabase credentials missing! Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local"
  );
}

// Use standard createClient (not createBrowserClient) since we don't use Supabase Auth
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key",
  {
    auth: {
      // Disable all Supabase Auth features — we use custom auth only
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  }
);
