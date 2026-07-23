import test from "node:test";
import assert from "node:assert/strict";
import { generateSessionToken } from "../../src/lib/auth-utils";
import { generateUUID } from "../../src/lib/utils";

test("Integration - Session Token & UUID Generator", () => {
  const token1 = generateSessionToken();
  const token2 = generateSessionToken();

  assert.ok(token1, "Token 1 should not be empty");
  assert.ok(token2, "Token 2 should not be empty");
  assert.notEqual(token1, token2, "Generated session tokens must be unique");

  const uuid1 = generateUUID();
  const uuid2 = generateUUID();
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  assert.ok(uuidRegex.test(uuid1), `UUID 1 (${uuid1}) must be valid UUID format`);
  assert.ok(uuidRegex.test(uuid2), `UUID 2 (${uuid2}) must be valid UUID format`);
  assert.notEqual(uuid1, uuid2, "Generated UUIDs must be unique");
});
