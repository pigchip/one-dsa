import { LANGUAGES } from '@/data/languages'
import { useLanguageFilter } from '@/context/useLanguageFilter'

export function LanguageToggles() {
  const { isSelected, toggle } = useLanguageFilter()

  return (
    <section className="mx-auto max-w-7xl px-6 pb-6">
      <div className="flex flex-col items-center">
        <div className="mb-3 text-xs font-medium tracking-[2px] text-ink-faint uppercase">
          Filter by language (click to toggle)
        </div>
        <div className="flex items-center justify-center gap-x-3">
          {LANGUAGES.map((lang) => {
            const on = isSelected(lang.id)
            return (
              <button
                key={lang.id}
                type="button"
                onClick={() => toggle(lang.id)}
                aria-pressed={on}
                aria-label={`Toggle ${lang.label}`}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-surface transition-all hover:scale-105 active:scale-95"
                style={{
                  border: `2px solid ${on ? lang.color : 'var(--color-line-strong)'}`,
                  boxShadow: on ? `0 0 0 3px color-mix(in srgb, ${lang.color} 18%, transparent)` : 'none',
                  opacity: on ? 1 : 0.55,
                }}
              >
                <span className="flex flex-col items-center" style={{ color: lang.color }}>
                  <i className={`${lang.icon} text-2xl`} />
                  <span className="mt-0.5 text-[9px] font-bold">{lang.short}</span>
                </span>
              </button>
            )
          })}
        </div>
        <div className="mt-2 text-[10px] text-ink-faint">
          All languages selected by default • Click any to filter table &amp;
          content
        </div>
      </div>
    </section>
  )
}
