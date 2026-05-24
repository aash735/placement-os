/**
 * custom-auth.ts
 *
 * Custom authentication layer using Supabase PostgreSQL (users table).
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
  semester: string
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
      .from("users")
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
            "Database tables not set up yet. Please run the SQL schema in your Supabase SQL Editor first.",
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
      .from("users")
      .insert({
        username: trimmedUsername,
        password_hash,
        full_name: trimmedName,
        semester,
        xp: 0,
        level: 1,
        streak: 0,
        energy_mode: "normal",
        shortcuts_enabled: true,
      })
      .select("id, username, full_name, semester")
      .single();

    if (insertError) {
      const msg = extractError(insertError);
      console.error("[registerUser] Insert failed:", msg, insertError);

      // Handle specific error codes
      if (insertError.code === "23505") {
        return { user: null, error: "Username is already registered." };
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
            "The users table does not exist. Please run the SQL schema in your Supabase SQL Editor.",
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
      name: data.full_name,
      email: null,
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
      .from("users")
      .select("id, username, full_name, semester, password_hash")
      .ilike("username", trimmedUsername)
      .maybeSingle();

    if (fetchError) {
      const msg = extractError(fetchError);
      console.error("[loginUser] Fetch failed:", msg, fetchError);

      if (fetchError.code === "42P01" || msg.includes("does not exist")) {
        return {
          user: null,
          error:
            "Database tables not set up. Please run the SQL schema in your Supabase SQL Editor.",
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
      name: data.full_name,
      email: null,
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
  if (!userId || userId === "guest-user-id") return null;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(userId)) return null;

  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, username, full_name, semester")
      .eq("id", userId)
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: data.id,
      username: data.username,
      name: data.full_name,
      email: null,
      semester: data.semester,
      token: "",
      createdAt: "",
    };
  } catch {
    return null;
  }
}
