/** XP required per level band (level N covers XP in [(N-1)*500, N*500)). */
export const XP_PER_LEVEL = 500;

/** Level is 1-based: 0–499 XP → L1, 500–999 → L2, etc. */
export function levelFromXp(xp: number): number {
  return Math.floor(Math.max(0, xp) / XP_PER_LEVEL) + 1;
}

/** Progress through the current level (0–100). */
export function xpProgressInLevel(xp: number): number {
  return ((Math.max(0, xp) % XP_PER_LEVEL) / XP_PER_LEVEL) * 100;
}

/** XP still needed to reach the next level. */
export function xpToNextLevel(xp: number): number {
  const level = levelFromXp(xp);
  return level * XP_PER_LEVEL - xp;
}

export function syncLevelFromXp(xp: number): { xp: number; level: number } {
  return { xp, level: levelFromXp(xp) };
}
