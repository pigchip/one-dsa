import { useRef, useState } from 'react'
import { useProgress } from '@/context/useProgress'
import { deckStats } from '@/lib/selectors'

export function Settings() {
  const { state, updateSettings, exportJson, importJson, reset } = useProgress()
  const fileRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<string | null>(null)
  const stats = deckStats(state)

  const handleExport = () => {
    const blob = new Blob([exportJson()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `one-dsa-progress-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setMessage('Progress exported.')
  }

  const handleImport = async (file: File) => {
    try {
      const text = await file.text()
      importJson(text)
      setMessage('Progress imported.')
    } catch {
      setMessage('Import failed: not a valid progress file.')
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 pt-12 pb-20">
      <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">
        Settings
      </h1>
      <p className="mt-2 text-ink-soft">
        Progress is stored in this browser. Export it to move between the dev
        server and the deployed site.
      </p>

      <section className="mt-8 space-y-5 rounded-3xl border border-line bg-surface p-6">
        <h2 className="font-display text-lg font-semibold text-ink">Study session</h2>
        <label className="flex items-center justify-between gap-4">
          <span className="text-sm text-ink">Daily review goal</span>
          <input
            type="number"
            min={5}
            max={200}
            value={state.settings.dailyGoal}
            onChange={(e) => updateSettings({ dailyGoal: Number(e.target.value) })}
            className="w-24 rounded-xl border border-line bg-surface px-3 py-1.5 text-right text-ink outline-none focus:border-line-strong"
          />
        </label>
        <label className="flex items-center justify-between gap-4">
          <span className="text-sm text-ink">New cards per session</span>
          <input
            type="number"
            min={0}
            max={50}
            value={state.settings.newPerSession}
            onChange={(e) => updateSettings({ newPerSession: Number(e.target.value) })}
            className="w-24 rounded-xl border border-line bg-surface px-3 py-1.5 text-right text-ink outline-none focus:border-line-strong"
          />
        </label>
      </section>

      <section className="mt-6 space-y-4 rounded-3xl border border-line bg-surface p-6">
        <h2 className="font-display text-lg font-semibold text-ink">Data</h2>
        <p className="text-sm text-ink-faint">
          {stats.reviewed} of {stats.total} cards started · {Math.round(stats.progress * 100)}%
          overall mastery
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExport}
            className="rounded-2xl bg-py px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            <i className="fa-solid fa-download mr-2" />
            Export progress
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="rounded-2xl border border-line-strong bg-surface px-4 py-2 text-sm font-semibold text-ink hover:bg-surface-2"
          >
            <i className="fa-solid fa-upload mr-2" />
            Import progress
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) handleImport(f)
              e.target.value = ''
            }}
          />
        </div>
      </section>

      <section className="mt-6 space-y-3 rounded-3xl border border-bad/40 bg-surface p-6">
        <h2 className="font-display text-lg font-semibold text-ink">Danger zone</h2>
        <button
          onClick={() => {
            if (confirm('Reset all study progress? This cannot be undone.')) {
              reset()
              setMessage('Progress reset.')
            }
          }}
          className="rounded-2xl border border-bad px-4 py-2 text-sm font-semibold text-bad hover:bg-[#fbe7e3]"
        >
          <i className="fa-solid fa-trash mr-2" />
          Reset all progress
        </button>
      </section>

      {message && (
        <p className="mt-6 rounded-2xl border border-line bg-surface-2 px-4 py-3 text-sm text-ink">
          {message}
        </p>
      )}
    </div>
  )
}
