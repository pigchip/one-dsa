import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <p className="font-display text-6xl font-semibold text-ink">404</p>
      <p className="mt-2 text-ink-soft">That page does not exist.</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-2xl bg-py px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
      >
        Back to dashboard
      </Link>
    </div>
  )
}
