import { INPUT_PATTERNS } from '@/data/inputPatterns'
import { LANGUAGE_BY_ID } from '@/data/languages'
import { useLanguageFilter } from '@/context/useLanguageFilter'
import { CodeBlock } from '@/components/ui/CodeBlock'

export function InputPatterns() {
  const { isSelected } = useLanguageFilter()
  const cards = INPUT_PATTERNS.filter((c) => isSelected(c.language))

  const gridClass =
    cards.length <= 1
      ? 'grid-cols-1 sm:max-w-md'
      : cards.length === 2
        ? 'grid-cols-1 sm:grid-cols-2'
        : cards.length === 3
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'

  return (
    <section id="input-patterns" className="mx-auto max-w-7xl px-6 pb-16">
      <div className="mb-6">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          2. Common LeetCode Input Patterns
        </h2>
        <p className="mt-1 text-ink-soft">
          These repetitive input-reading snippets are used in 80%+ of problems.
          Use the language toggles above to filter. Copy-paste ready for a blank
          file.
        </p>
      </div>

      <div className={`grid gap-4 ${gridClass}`}>
        {cards.map((card) => {
          const lang = LANGUAGE_BY_ID[card.language]
          return (
            <div
              key={card.language}
              className="rounded-3xl border bg-surface p-5"
              style={{ borderColor: `color-mix(in srgb, ${lang.color} 40%, var(--color-line))` }}
            >
              <div className="mb-4 flex items-center gap-x-3">
                <i className={`${lang.icon} text-2xl`} style={{ color: lang.color }} />
                <div>
                  <div className="font-semibold text-ink">{lang.label}</div>
                  <div className="text-[10px] text-ink-faint">{card.subtitle}</div>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                {card.snippets.map((snippet) => (
                  <div key={snippet.label}>
                    <div
                      className="font-mono mb-1 text-[11px]"
                      style={{ color: lang.color }}
                    >
                      {snippet.label}
                    </div>
                    <CodeBlock code={snippet.code} language={card.language} />
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 text-center text-xs text-ink-faint">
        These patterns + the syntax table above give you everything needed to
        start any template from a blank file.
      </div>
    </section>
  )
}
