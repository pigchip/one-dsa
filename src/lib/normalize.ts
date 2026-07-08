/**
 * Helpers for self-graded coding drills: normalize Python source so cosmetic
 * differences (trailing spaces, blank lines, quote style) don't matter, and
 * compute a rough similarity so the UI can hint how close the attempt was.
 */

/** Normalize a snippet for lenient comparison. */
export function normalizeCode(src: string): string {
  return src
    .replace(/\r\n/g, '\n')
    .replace(/#.*$/gm, '') // strip line comments
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter((line) => line.length > 0)
    .join('\n')
    .replace(/"/g, "'") // treat quote styles as equal
}

/** Exact match after normalization. */
export function isExactMatch(attempt: string, answer: string): boolean {
  return normalizeCode(attempt) === normalizeCode(answer)
}

/** Token-level similarity in [0, 1] (order-insensitive multiset overlap). */
export function similarity(attempt: string, answer: string): number {
  const tok = (s: string) => normalizeCode(s).split(/[^A-Za-z0-9_]+/).filter(Boolean)
  const a = tok(attempt)
  const b = tok(answer)
  if (a.length === 0 && b.length === 0) return 1
  if (a.length === 0 || b.length === 0) return 0

  const counts = new Map<string, number>()
  for (const t of b) counts.set(t, (counts.get(t) ?? 0) + 1)
  let overlap = 0
  for (const t of a) {
    const c = counts.get(t) ?? 0
    if (c > 0) {
      overlap += 1
      counts.set(t, c - 1)
    }
  }
  return overlap / Math.max(a.length, b.length)
}

/** Per-line correctness flags of the attempt against the answer (normalized). */
export interface LineDiff {
  answerLine: string
  matched: boolean
}

export function lineDiff(attempt: string, answer: string): LineDiff[] {
  const attemptLines = new Set(
    normalizeCode(attempt)
      .split('\n')
      .map((l) => l.trim()),
  )
  return normalizeCode(answer)
    .split('\n')
    .map((line) => ({ answerLine: line, matched: attemptLines.has(line.trim()) }))
}
