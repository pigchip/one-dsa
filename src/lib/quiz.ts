/** Deterministic pseudo-random generator from a string seed (stable per card). */
export function seeded(seed: string): () => number {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return () => {
    h += 0x6d2b79f5
    let t = Math.imul(h ^ (h >>> 15), 1 | h)
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Fisher-Yates shuffle using a supplied random source. */
export function shuffle<T>(arr: readonly T[], rand: () => number): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Pick up to `count` distractors from `pool`, excluding the correct item and any
 * duplicates (compared via `keyOf`). Returns a shuffled subset.
 */
export function pickDistractors<T>(
  pool: readonly T[],
  correct: T,
  keyOf: (item: T) => string,
  count: number,
  rand: () => number,
): T[] {
  const correctKey = keyOf(correct)
  const seen = new Set<string>([correctKey])
  const unique: T[] = []
  for (const item of shuffle(pool, rand)) {
    const key = keyOf(item)
    if (seen.has(key)) continue
    seen.add(key)
    unique.push(item)
    if (unique.length >= count) break
  }
  return unique
}
