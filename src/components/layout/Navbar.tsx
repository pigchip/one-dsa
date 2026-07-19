import { NavLink, useLocation } from 'react-router-dom'

const LINKS = [
  { to: '/', label: 'Dashboard', icon: 'fa-solid fa-gauge-high', end: true },
  { to: '/roadmap', label: 'Roadmap', icon: 'fa-solid fa-route' },
  { to: '/practice?mode=typing', label: 'Practice', icon: 'fa-solid fa-dumbbell' },
  { to: '/practice', label: 'Quiz', icon: 'fa-solid fa-circle-question' },
  { to: '/library', label: 'Library', icon: 'fa-solid fa-book' },
  { to: '/reference', label: 'Reference', icon: 'fa-solid fa-table' },
]

/** Sticky top navigation using router NavLinks with active styling. */
export function Navbar() {
  const location = useLocation()
  const isTyping = location.pathname === '/practice' && location.search.includes('mode=typing')

  // The two Practice links share a pathname, so decide active state by query.
  const linkActive = (to: string, isActive: boolean) => {
    if (to === '/practice?mode=typing') return isTyping
    if (to === '/practice') return location.pathname === '/practice' && !isTyping
    return isActive
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-surface/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
        <NavLink to="/" className="flex shrink-0 items-center gap-x-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-py text-white">
            <i className="fa-solid fa-code text-lg" />
          </span>
          <span className="flex items-baseline gap-x-1">
            <span className="font-display text-2xl font-semibold tracking-tight text-ink">
              One-DSA
            </span>
            <span className="hidden text-sm font-medium text-py sm:inline">
              mastery
            </span>
          </span>
        </NavLink>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-x-1 overflow-x-auto text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-x-2 rounded-xl px-3 py-2 text-ink-soft transition-colors hover:bg-surface-2 sm:px-4 ${
                  linkActive(link.to, isActive) ? 'nav-active text-ink' : ''
                }`
              }
            >
              <i className={`${link.icon} text-xs`} />
              {link.label}
            </NavLink>
          ))}
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex shrink-0 items-center rounded-xl px-3 py-2 text-ink-soft transition-colors hover:bg-surface-2 ${
                isActive ? 'nav-active text-ink' : ''
              }`
            }
            aria-label="Settings"
          >
            <i className="fa-solid fa-gear" />
          </NavLink>
        </div>
      </div>
    </nav>
  )
}
