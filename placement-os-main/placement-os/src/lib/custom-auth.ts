/**
 * custom-auth.ts
 *
 * Custom authentication layer using Supabase PostgreSQL (app_users table).
 * NO Supabase Auth. All operations are raw database queries via anon key.
 *
 * KEY FIX: Supabase JS error objects have non-enumerable properties.
 * console.error("error:", err) logs {} even when err.message exists.
 * Always extract: err?.message || err?.code || JSON.stringify(err)
 */

import { supabase, hasSupabaseConfig } from "./supabase";
import { hashPassword, verifyPassword, generateSessionToken } from "./auth-utils";
import type { SessionUser } from "./session-store";

export interface AuthResult {
  user: SessionUser | null;
  error: string | null;
}

/** Extract a readable message from a Supabase error object */
function extractError(err: any): string {
  if (!err) return "Unknown error";
  // Supabase errors have non-enumerable properties — must access directly
  const msg = err?.message || err?.error_description || err?.hint || "";
  const code = err?.code || err?.status || "";
  const details = err?.details || "";
  if (msg) return `${msg}${details ? ` — ${details}` : ""}`;
  if (code) return `Database error (code: ${code})`;
  return "An unexpected database error occurred.";
}

// ─── Register a new user ──────────────────────────────────────────────────────

export async function registerUser(
  username: string,
  password: string,
  name: string,
  semester: string,
  email?: string
): Promise<AuthResult> {
  if (!hasSupabaseConfig) {
    return {
      user: null,
      error:
        "Database not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file.",
    };
  }

  // ── Input validation ─────────────────────────────────────────────────────
  const trimmedUsername = username?.trim().toLowerCase();
  const trimmedName = name?.trim();
  const trimmedEmail = email?.trim() || null;

  if (!trimmedUsername || trimmedUsername.length < 3) {
    return { user: null, error: "Username must be at least 3 characters." };
  }
  if (!password || password.length < 6) {
    return { user: null, error: "Password must be at least 6 characters." };
  }
  if (!/^[a-zA-Z0-9_.\-]+$/.test(trimmedUsername)) {
    return {
      user: null,
      error: "Username can only contain letters, numbers, underscores, dots, or hyphens.",
    };
  }
  if (!trimmedName) {
    return { user: null, error: "Name is required." };
  }

  try {
    // ── Check if username is taken ─────────────────────────────────────────
    const { data: existing, error: checkError } = await supabase
      .from("app_users")
      .select("id")
      .ilike("username", trimmedUsername)
      .maybeSingle();

    if (checkError) {
      const msg = extractError(checkError);
      console.error("[registerUser] Username check failed:", msg, checkError);
      // If the table doesn't exist yet, give a specific helpful message
      if (checkError.code === "42P01" || msg.includes("does not exist")) {
        return {
          user: null,
          error:
            "Database tables not set up yet. Please run the SQL schema in your Supabase SQL Editor first. See supabase-schema-custom-auth.sql in your project root.",
        };
      }
      return { user: null, error: `Database check failed: ${msg}` };
    }

    if (existing) {
      return { user: null, error: "Username is already taken. Please choose another." };
    }

    // ── Hash password ──────────────────────────────────────────────────────
    const password_hash = await hashPassword(password);
    const token = generateSessionToken();

    // ── Insert new user ────────────────────────────────────────────────────
    const { data, error: insertError } = await supabase
      .from("app_users")
      .insert({
        username: trimmedUsername,
        email: trimmedEmail,
        password_hash,
        name: trimmedName,
        semester,
        xp: 0,
        level: 1,
        streak: 0,
        energy_mode: "normal",
        shortcuts_enabled: true,
      })
      .select("id, username, name, email, semester")
      .single();

    if (insertError) {
      const msg = extractError(insertError);
      console.error("[registerUser] Insert failed:", msg, insertError);

      // Handle specific error codes
      if (insertError.code === "23505") {
        return { user: null, error: "Username or email is already registered." };
      }
      if (insertError.code === "42501" || msg.toLowerCase().includes("permission")) {
        return {
          user: null,
          error:
            "Database permission error. Please re-run the SQL schema which includes the required GRANT statements.",
        };
      }
      if (insertError.code === "42P01" || msg.includes("does not exist")) {
        return {
          user: null,
          error:
            "The app_users table does not exist. Please run supabase-schema-custom-auth.sql in your Supabase SQL Editor.",
        };
      }
      return { user: null, error: `Registration failed: ${msg}` };
    }

    if (!data) {
      return { user: null, error: "Registration failed: no data returned from database." };
    }

    const sessionUser: SessionUser = {
      id: data.id,
      username: data.username,
      name: data.name,
      email: data.email,
      semester: data.semester,
      token,
      createdAt: new Date().toISOString(),
    };

    console.log("[registerUser] ✅ User registered successfully:", data.username);
    return { user: sessionUser, error: null };
  } catch (err: any) {
    const msg = extractError(err);
    console.error("[registerUser] Exception:", msg, err);
    return { user: null, error: `Unexpected error: ${msg}` };
  }
}

// ─── Log in an existing user ─────────────────────────────────────────────────

export async function loginUser(
  username: string,
  password: string
): Promise<AuthResult> {
  if (!hasSupabaseConfig) {
    return {
      user: null,
      error:
        "Database not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file.",
    };
  }

  const trimmedUsername = username?.trim().toLowerCase();

  if (!trimmedUsername || !password) {
    return { user: null, error: "Username and password are required." };
  }

  try {
    // ── Fetch user by username (case-insensitive) ──────────────────────────
    const { data, error: fetchError } = await supabase
      .from("app_users")
      .select("id, username, name, email, semester, password_hash")
      .ilike("username", trimmedUsername)
      .maybeSingle();

    if (fetchError) {
      const msg = extractError(fetchError);
      console.error("[loginUser] Fetch failed:", msg, fetchError);

      if (fetchError.code === "42P01" || msg.includes("does not exist")) {
        return {
          user: null,
          error:
            "Database tables not set up. Please run supabase-schema-custom-auth.sql in your Supabase SQL Editor.",
        };
      }
      return { user: null, error: `Login failed: ${msg}` };
    }

    if (!data) {
      return { user: null, error: "No account found with that username." };
    }

    // ── Verify password ────────────────────────────────────────────────────
    const isValid = await verifyPassword(password, data.password_hash);
    if (!isValid) {
      return { user: null, error: "Incorrect password. Please try again." };
    }

    const token = generateSessionToken();

    const sessionUser: SessionUser = {
      id: data.id,
      username: data.username,
      name: data.name,
      email: data.email,
      semester: data.semester,
      token,
      createdAt: new Date().toISOString(),
    };

    console.log("[loginUser] ✅ User logged in:", data.username);
    return { user: sessionUser, error: null };
  } catch (err: any) {
    const msg = extractError(err);
    console.error("[loginUser] Exception:", msg, err);
    return { user: null, error: `Unexpected error: ${msg}` };
  }
}

// ─── Fetch user profile from DB (for hydration validation) ────────────────────

export async function getUserById(userId: string): Promise<SessionUser | null> {
  if (!hasSupabaseConfig) return null;

  try {
    const { data, error } = await supabase
      .from("app_users")
      .select("id, username, name, email, semester")
      .eq("id", userId)
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: data.id,
      username: data.username,
      name: data.name,
      email: data.email,
      semester: data.semester,
      token: "",
      createdAt: "",
    };
  } catch {
    return null;
  }
}
