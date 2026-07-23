import test from "node:test";
import assert from "node:assert/strict";
import { isGuest } from "../../src/lib/supabase-db";

test("Supabase DB - isGuest UUID format validation", () => {
  // Guest and null checks
  assert.equal(isGuest(""), true);
  assert.equal(isGuest("guest-user-id"), true);
  assert.equal(isGuest(null as any), true);

  // Invalid UUID formats (should return true -> treated as guest to prevent PostgreSQL 22P02 error)
  assert.equal(isGuest("12345"), true);
  assert.equal(isGuest("not-a-uuid"), true);
  assert.equal(isGuest("12345678-1234-1234-1234-1234567890g"), true, "Contains non-hex 'g'");
  assert.equal(isGuest("12345678-1234-1234-1234-1234567890123"), true, "Too long");

  // Valid UUID format (should return false -> valid authenticated UUID)
  assert.equal(isGuest("e8b8c1d2-3f4a-5b6c-7d8e-9f0a1b2c3d4e"), false);
  assert.equal(isGuest("E8B8C1D2-3F4A-5B6C-7D8E-9F0A1B2C3D4E"), false, "Case insensitive hex");
});
