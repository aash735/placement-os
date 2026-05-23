/**
 * session-store.ts
 *
 * Manages the custom auth session using localStorage.
 * Stores a SessionUser object that persists across page refreshes and browser restarts.
 */

export interface SessionUser {
  id: string;          // UUID from app_users table
  username: string;
  name: string;
  email: string | null;
  semester: string;
  token: string;       // Random session token (for future validation if needed)
  createdAt: string;   // ISO timestamp of login
}

const SESSION_KEY = "placement-os-session";

/** Store session in localStorage */
export function setSession(user: SessionUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

/** Retrieve session from localStorage */
export function getSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

/** Clear session from localStorage (logout) */
export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

/** Check if a session currently exists */
export function hasSession(): boolean {
  return getSession() !== null;
}
