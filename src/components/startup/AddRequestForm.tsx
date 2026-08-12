"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function AddRequestForm({ slug }: { slug: string }) {
  const router = useRouter()
  const [roleNeeded, setRoleNeeded] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const res = await fetch("/api/startups/" + slug + "/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roleNeeded, message }),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(typeof data.error === "string" ? data.error : "Failed to post")
      return
    }

    setRoleNeeded("")
    setMessage("")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-md border border-neutral-800 bg-neutral-900 p-4 space-y-3">
      <input
        value={roleNeeded}
        onChange={(e) => setRoleNeeded(e.target.value)}
        required
        className="w-full rounded-md bg-neutral-950 border border-neutral-800 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Role needed (e.g. Technical Co-founder)"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        rows={2}
        className="w-full rounded-md bg-neutral-950 border border-neutral-800 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="What are you looking for?"
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-1.5 text-sm transition"
      >
        {loading ? "Posting..." : "Post request"}
      </button>
    </form>
  )
}