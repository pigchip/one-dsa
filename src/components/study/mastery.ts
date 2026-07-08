import type { MasteryLevel } from '@/lib/srs'

/** Visual metadata (label + colors) for each mastery bucket. */
export const MASTERY_META: Record<
  MasteryLevel,
  { label: string; color: string; bg: string }
> = {
  new: { label: 'New', color: '#6f6656', bg: '#efe7d4' },
  learning: { label: 'Learning', color: '#b45309', bg: '#fbeeda' },
  young: { label: 'Familiar', color: '#1a6fb0', bg: '#e3eefa' },
  mature: { label: 'Strong', color: '#0e7c7b', bg: '#e1f2f1' },
  mastered: { label: 'Mastered', color: '#0a5c39', bg: '#cdeede' },
}
