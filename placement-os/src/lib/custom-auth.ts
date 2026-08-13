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
import { generateSessionToken } from "./auth-utils";
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
    return {
      user: null,
      error: "Username must be at least 3 characters.",
    };
  }

  if (!password || password.length < 6) {
    return {
      user: null,
      error: "Password must be at least 6 characters.",
    };
  }

  if (!/^[a-zA-Z0-9_.\-]+$/.test(trimmedUsername)) {
    return {
      user: null,
      error:
        "Username can only contain letters, numbers, underscores, dots, or hyphens.",
    };
  }

  if (!trimmedName) {
    return {
      user: null,
      error: "Name is required.",
    };
  }

  try {
    const token = generateSessionToken();

    // Call database registration RPC.
    //
    // IMPORTANT:
    // This matches the current Supabase function:
    //
    // register_user(
    //   p_username text,
    //   p_password text,
    //   p_full_name text,
    //   p_semester text
    // )
    //
    // The RPC itself inserts into public.app_users.

    const { data, error: rpcError } = await supabase.rpc("register_user", {
      p_username: trimmedUsername,
      p_password: password,
      p_full_name: trimmedName,
      p_semester: semester,
    });

    if (rpcError) {
      const msg = extractError(rpcError);

      console.error(
        "[registerUser] RPC failed:",
        msg,
        rpcError
      );

      return {
        user: null,
        error: `Registration failed: ${msg}`,
      };
    }

    if (data?.error) {
      return {
        user: null,
        error: data.error,
      };
    }

    const userData = data?.user;

    if (!userData) {
      return {
        user: null,
        error: "Registration failed: no user data returned.",
      };
    }

    const sessionUser: SessionUser = {
      id: userData.id,
      username: userData.username,
      name: userData.name,
      email: null,
      semester: userData.semester,
      token,
      createdAt: new Date().toISOString(),
    };

    console.log(
      "[registerUser] User registered successfully:",
      userData.username
    );

    return {
      user: sessionUser,
      error: null,
    };
  } catch (err: any) {
    const msg = extractError(err);

    console.error(
      "[registerUser] Exception:",
      msg,
      err
    );

    return {
      user: null,
      error: `Unexpected error: ${msg}`,
    };
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
    return {
      user: null,
      error: "Username and password are required.",
    };
  }

  try {
    const token = generateSessionToken();

    // Call database login RPC.
    //
    // IMPORTANT:
    // This matches the current Supabase function:
    //
    // login_user(
    //   p_username text,
    //   p_password text
    // )
    //
    // The RPC itself reads from public.app_users.

    const { data, error: rpcError } = await supabase.rpc("login_user", {
      p_username: trimmedUsername,
      p_password: password,
    });

    if (rpcError) {
      const msg = extractError(rpcError);

      console.error(
        "[loginUser] RPC failed:",
        msg,
        rpcError
      );

      return {
        user: null,
        error: `Login failed: ${msg}`,
      };
    }

    if (data?.error) {
      return {
        user: null,
        error: data.error,
      };
    }

    const userData = data?.user;

    if (!userData) {
      return {
        user: null,
        error: "Login failed: no user data returned.",
      };
    }

    const sessionUser: SessionUser = {
      id: userData.id,
      username: userData.username,
      name: userData.name,
      email: null,
      semester: userData.semester,
      token,
      createdAt: new Date().toISOString(),
    };

    console.log(
      "[loginUser] User logged in:",
      userData.username
    );

    return {
      user: sessionUser,
      error: null,
    };
  } catch (err: any) {
    const msg = extractError(err);

    console.error(
      "[loginUser] Exception:",
      msg,
      err
    );

    return {
      user: null,
      error: `Unexpected error: ${msg}`,
    };
  }
}

// ─── Fetch user profile from DB (for hydration validation) ────────────────────

export async function getUserById(
  userId: string
): Promise<SessionUser | null> {
  if (!hasSupabaseConfig) return null;

  if (!userId || userId === "guest-user-id") {
    return null;
  }

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!uuidRegex.test(userId)) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from("app_users")
      .select("id, username, name, email, semester")
      .eq("id", userId)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      username: data.username,
      name: data.name,
      email: data.email ?? null,
      semester: data.semester,
      token: "",
      createdAt: "",
    };
  } catch {
    return null;
  }
}
