/**
 * A small, presentation-only badge that flags a memorization-critical item the
 * learner should reproduce by hand. Used across the roadmap on canonical
 * templates and key ideas — the parts worth burning into muscle memory.
 */
export function WriteOnPaper({
  label = 'Practice this writing on paper',
  className,
}: {
  label?: string
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center gap-x-1.5 rounded-full border border-dashed px-2.5 py-0.5 text-xs font-semibold ${className ?? ''}`}
      style={{ color: '#8a5a00', borderColor: '#d8b26a', backgroundColor: '#fbf3df' }}
      title="Reproduce this from memory by hand to lock it into long-term recall."
    >
      <i className="fa-solid fa-pen-to-square" aria-hidden="true" />
      {label}
    </span>
  )
}
