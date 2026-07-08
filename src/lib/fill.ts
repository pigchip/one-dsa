/**
 * Derive a deterministic fill-in-the-blank exercise from a Python template.
 * "Interesting" lines (the core logic) are masked; structural lines (def,
 * class, imports, comments) stay visible as scaffolding.
 */

export interface FillLine {
  /** Original line text (with indentation). */
  text: string
  /** Leading whitespace, preserved for the input placeholder. */
  indent: string
  /** Trimmed content the learner must reproduce when blanked. */
  content: string
  /** Whether this line is masked. */
  blank: boolean
}

function isStructural(trimmed: string): boolean {
  return (
    trimmed.length <= 5 ||
    trimmed.startsWith('#') ||
    trimmed.startsWith('def ') ||
    trimmed.startsWith('class ') ||
    trimmed.startsWith('import ') ||
    trimmed.startsWith('from ') ||
    trimmed.startsWith('@') ||
    trimmed === 'else:' ||
    trimmed === 'return' ||
    trimmed.startsWith('"""')
  )
}

export function buildFill(template: string): FillLine[] {
  const raw = template.replace(/\r\n/g, '\n').split('\n')
  let candidateIndex = 0
  return raw.map((line) => {
    const trimmed = line.trim()
    const indent = line.slice(0, line.length - line.trimStart().length)
    const structural = trimmed.length === 0 || isStructural(trimmed)
    let blank = false
    if (!structural) {
      // Blank roughly every other logic line for stable, solvable exercises.
      blank = candidateIndex % 2 === 0
      candidateIndex += 1
    }
    return { text: line, indent, content: trimmed, blank }
  })
}

/** Count of blanked lines in an exercise. */
export function blankCount(lines: FillLine[]): number {
  return lines.filter((l) => l.blank).length
}
