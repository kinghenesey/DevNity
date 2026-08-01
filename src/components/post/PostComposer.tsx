"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function PostComposer({ myBuilds }: { myBuilds: { id: string; name: string }[] }) {
  const router = useRouter()
  const [content, setContent] = useState("")
  const [buildId, setBuildId] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, buildId: buildId || undefined }),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(typeof data.error === "string" ? data.error : "Failed to post")
      return
    }

    setContent("")
    setBuildId("")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-md border border-neutral-800 bg-neutral-900 p-4 space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        rows={3}
        maxLength={2000}
        className="w-full rounded-md bg-neutral-950 border border-neutral-800 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="What are you building?"
      />

      <div className="flex items-center justify-between gap-3">
        {myBuilds.length > 0 && (
          <select
            value={buildId}
            onChange={(e) => setBuildId(e.target.value)}
            className="rounded-md bg-neutral-950 border border-neutral-800 px-2 py-1.5 text-xs text-neutral-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">No linked Build</option>
            {myBuilds.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        )}
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="ml-auto rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-1.5 text-sm transition"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </form>
  )
}