import test from "node:test";
import assert from "node:assert/strict";
import { levelFromXp, xpProgressInLevel, xpToNextLevel, syncLevelFromXp, XP_PER_LEVEL } from "../../src/lib/xp";

test("XP System - levelFromXp", () => {
  assert.equal(levelFromXp(0), 1);
  assert.equal(levelFromXp(250), 1);
  assert.equal(levelFromXp(499), 1);
  assert.equal(levelFromXp(500), 2);
  assert.equal(levelFromXp(999), 2);
  assert.equal(levelFromXp(1000), 3);
  assert.equal(levelFromXp(-100), 1, "Negative XP should clamp to level 1");
});

test("XP System - xpProgressInLevel", () => {
  assert.equal(xpProgressInLevel(0), 0);
  assert.equal(xpProgressInLevel(250), 50);
  assert.equal(xpProgressInLevel(500), 0);
  assert.equal(xpProgressInLevel(750), 50);
});

test("XP System - xpToNextLevel", () => {
  assert.equal(xpToNextLevel(0), 500);
  assert.equal(xpToNextLevel(250), 250);
  assert.equal(xpToNextLevel(499), 1);
  assert.equal(xpToNextLevel(500), 500);
  assert.equal(xpToNextLevel(750), 250);
});

test("XP System - syncLevelFromXp", () => {
  const result = syncLevelFromXp(1250);
  assert.deepEqual(result, { xp: 1250, level: 3 });
});
