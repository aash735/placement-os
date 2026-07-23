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
import { createBrowserClient, createServerClient } from "@supabase/ssr";

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

/**
 * Standard Browser Client for Client Components
 */
export function createBrowserSupabaseClient() {
  return createBrowserClient(
    supabaseUrl || "https://placeholder.supabase.co",
    supabaseAnonKey || "placeholder-key"
  );
}

/**
 * Standard Server Client for Server Components and Route Handlers
 */
export async function createServerSupabaseClient() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();

  return createServerClient(
    supabaseUrl || "https://placeholder.supabase.co",
    supabaseAnonKey || "placeholder-key",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Can be ignored if middleware handles session refreshing
          }
        },
      },
    }
  );
}
