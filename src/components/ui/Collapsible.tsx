import type { ReactNode } from 'react'

/**
 * A reusable collapsible section built on native <details>/<summary> (the same
 * convention as ui/TemplateCard). The summary acts as a button with an icon,
 * title, optional subtitle and right-aligned badge, plus a rotating chevron.
 */
export function Collapsible({
  title,
  subtitle,
  icon,
  accent = 'var(--color-line-strong)',
  badge,
  practice = false,
  defaultOpen = false,
  children,
}: {
  title: string
  subtitle?: string
  icon?: string
  accent?: string
  badge?: ReactNode
  practice?: boolean
  defaultOpen?: boolean
  children: ReactNode
}) {
  return (
    <details
      open={defaultOpen}
      className="group mb-3 rounded-2xl border border-line bg-surface"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-4 py-3 hover:bg-surface-2">
        <div className="flex min-w-0 items-center gap-x-3">
          {icon && (
            <span style={{ color: accent }}>
              <i className={`${icon} fa-fw`} aria-hidden="true" />
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{title}</p>
            {subtitle && <p className="truncate text-xs text-ink-faint">{subtitle}</p>}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {practice && (
            <span
              className="flex h-6 w-6 items-center justify-center rounded-lg bg-py text-white"
              title="Practice this — drill it until it's muscle memory"
              aria-label="Practice this"
            >
              <i className="fa-solid fa-dumbbell text-xs" aria-hidden="true" />
            </span>
          )}
          {badge}
          <span
            className="rounded-xl px-2 py-1 text-xs transition-transform group-open:rotate-180"
            style={{
              color: accent,
              backgroundColor: `color-mix(in srgb, ${accent} 14%, transparent)`,
            }}
          >
            <i className="fa-solid fa-chevron-down" aria-hidden="true" />
          </span>
        </div>
      </summary>
      <div className="border-t border-line px-4 pt-4 pb-5">{children}</div>
    </details>
  )
}
