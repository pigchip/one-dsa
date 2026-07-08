import type { Language, LanguageId } from '@/types'

export const LANGUAGES: Language[] = [
  {
    id: 'python',
    label: 'Python',
    short: 'PY',
    grammar: 'python',
    color: 'var(--color-py)',
    icon: 'fa-brands fa-python',
  },
  {
    id: 'csharp',
    label: 'C#',
    short: 'CS',
    grammar: 'csharp',
    color: 'var(--color-cs)',
    icon: 'fa-solid fa-hashtag',
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    short: 'TS',
    grammar: 'typescript',
    color: 'var(--color-ts)',
    icon: 'fa-brands fa-js',
  },
  {
    id: 'rust',
    label: 'Rust',
    short: 'RS',
    grammar: 'rust',
    color: 'var(--color-rs)',
    icon: 'fa-brands fa-rust',
  },
]

export const LANGUAGE_ORDER: LanguageId[] = LANGUAGES.map((l) => l.id)

export const LANGUAGE_BY_ID: Record<LanguageId, Language> = LANGUAGES.reduce(
  (acc, lang) => {
    acc[lang.id] = lang
    return acc
  },
  {} as Record<LanguageId, Language>,
)
