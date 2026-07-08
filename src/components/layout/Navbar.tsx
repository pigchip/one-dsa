import { useEffect, useState } from 'react'

const LINKS = [
  { id: 'syntax-comparison', label: 'Syntax Table' },
  { id: 'input-patterns', label: 'Input Patterns' },
  { id: 'dsa-templates', label: 'DSA Templates' },
  { id: 'how-to-start', label: 'From Blank File' },
]

/** Sticky top navigation with an IntersectionObserver-based scroll spy. */
export function Navbar() {
  const [active, setActive] = useState<string>(LINKS[0].id)

  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => el !== null,
    )

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.5, 1] },
    )

    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-surface/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
        <a href="#top" className="flex shrink-0 items-center gap-x-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-py text-white">
            <i className="fa-solid fa-code text-lg" />
          </span>
          <span className="flex items-baseline gap-x-1">
            <span className="font-display text-2xl font-semibold tracking-tight text-ink">
              SyntaxLab
            </span>
            <span className="hidden text-sm font-medium text-py sm:inline">
              2026
            </span>
          </span>
        </a>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-x-1 overflow-x-auto text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`shrink-0 rounded-xl px-3 py-2 text-ink-soft transition-colors hover:bg-surface-2 sm:px-4 ${
                active === link.id ? 'nav-active text-ink' : ''
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}
