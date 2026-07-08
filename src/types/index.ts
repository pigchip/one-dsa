export type LanguageId = 'python' | 'csharp' | 'typescript' | 'rust'

export interface Language {
  id: LanguageId
  label: string
  /** Short badge abbreviation, e.g. "PY". */
  short: string
  /** Grammar name understood by Shiki. */
  grammar: 'python' | 'csharp' | 'typescript' | 'rust'
  /** Tailwind-friendly hex accent (matches --color-* tokens). */
  color: string
  /** Font Awesome icon class. */
  icon: string
}

export type RowTone = 'good' | 'bad' | 'neutral'

/** A single row of the syntax comparison table. */
export interface SyntaxRow {
  topic: string
  /** Short comparison note shown under the topic. */
  note?: string
  /** Per-language code snippet, keyed by language id. */
  code: Record<LanguageId, string>
  /** Optional per-language tone override. */
  tone?: Partial<Record<LanguageId, RowTone>>
}

/** A titled group of syntax rows (rendered as a category header row). */
export interface SyntaxCategory {
  title: string
  rows: SyntaxRow[]
}

/** One labeled snippet inside an input-pattern card. */
export interface InputSnippet {
  label: string
  code: string
}

/** A "common input pattern" boilerplate card for one language. */
export interface InputPatternCard {
  language: LanguageId
  subtitle: string
  snippets: InputSnippet[]
}

export interface HowToStep {
  language: LanguageId
  headline: string
  points: string[]
}

export interface TemplateColumn {
  heading: string
  /** Each item may contain inline <code>…</code> markup. */
  items: string[]
}

/** A collapsible DSA template card. */
export interface TemplateCard {
  title: string
  icon: string
  /** Accent color hex for the icon. */
  accent: string
  description?: string
  columns: TemplateColumn[]
  /** Optional trailing note (may contain inline <code>…</code> markup). */
  note?: string
  /** Full reference implementation per language. */
  code?: Partial<Record<LanguageId, string>>
}
