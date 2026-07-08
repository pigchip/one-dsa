const ITEMS = [
  {
    label: 'GREEN',
    color: 'var(--color-good)',
    text: 'Similar / concise syntax (Python-like, low ceremony)',
  },
  {
    label: 'RED',
    color: 'var(--color-bad)',
    text: 'Different / more verbose or paradigm shift (static typing, ownership, explicit OOP)',
  },
  {
    label: 'PURPLE',
    color: 'var(--color-neutral)',
    text: 'Neutral / modern flexible syntax (TypeScript)',
  },
]

export function ColorLegend() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-8">
      <div className="rounded-3xl border border-line bg-surface p-5">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
          {ITEMS.map((item) => (
            <div key={item.label} className="flex items-center gap-x-2">
              <span className="font-semibold" style={{ color: item.color }}>
                {item.label}
              </span>
              <span className="text-ink-soft">= {item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
