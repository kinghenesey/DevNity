"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function AddLessonForm({ courseId }: { courseId: string }) {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const res = await fetch("/api/courses/" + courseId + "/lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(typeof data.error === "string" ? data.error : "Failed to add lesson")
      return
    }

    setTitle("")
    setContent("")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-md border border-neutral-800 bg-neutral-900 p-4 space-y-3">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full rounded-md bg-neutral-950 border border-neutral-800 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Lesson title"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        rows={4}
        className="w-full rounded-md bg-neutral-950 border border-neutral-800 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Lesson content (plain text for now)"
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-1.5 text-sm transition"
      >
        {loading ? "Adding..." : "Add lesson"}
      </button>
    </form>
  )
}