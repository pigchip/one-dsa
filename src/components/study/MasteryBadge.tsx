import type { MasteryLevel } from '@/lib/srs'
import { MASTERY_META } from './mastery'

export function MasteryBadge({
  level,
  className,
}: {
  level: MasteryLevel
  className?: string
}) {
  const m = MASTERY_META[level]
  return (
    <span
      className={`inline-flex items-center gap-x-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${className ?? ''}`}
      style={{ color: m.color, backgroundColor: m.bg }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: m.color }}
      />
      {m.label}
    </span>
  )
}
