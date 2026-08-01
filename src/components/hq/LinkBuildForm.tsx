"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function LinkBuildForm({
  slug,
  myBuilds,
}: {
  slug: string
  myBuilds: { id: string; name: string }[]
}) {
  const router = useRouter()
  const [buildId, setBuildId] = useState(myBuilds[0]?.id || "")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (myBuilds.length === 0) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const res = await fetch("/api/hqs/" + slug + "/builds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ buildId }),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(typeof data.error === "string" ? data.error : "Failed to link Build")
      return
    }

    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-start">
      <select
        value={buildId}
        onChange={(e) => setBuildId(e.target.value)}
        className="flex-1 rounded-md bg-neutral-900 border border-neutral-800 px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {myBuilds.map((b) => (
          <option key={b.id} value={b.id}>{b.name}</option>
        ))}
      </select>
      <button
        type="submit"
        disabled={loading}
        className="rounded-md border border-neutral-800 hover:bg-neutral-900 text-white px-3 py-1.5 text-sm transition"
      >
        {loading ? "..." : "Link Build"}
      </button>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </form>
  )
}