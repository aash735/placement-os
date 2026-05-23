/**
 * auth-utils.ts
 *
 * Pure utility functions for password hashing and session token generation.
 * Uses bcryptjs — works on both server and client (pure JS, no native bindings).
 */

import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

/** Hash a plaintext password with bcrypt */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/** Compare a plaintext password against a stored bcrypt hash */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/** Generate a simple random session token (stored in localStorage) */
export function generateSessionToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
