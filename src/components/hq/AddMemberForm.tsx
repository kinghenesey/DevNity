"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function AddMemberForm({ slug }: { slug: string }) {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const res = await fetch("/api/hqs/" + slug + "/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, role: "MEMBER" }),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(typeof data.error === "string" ? data.error : "Failed to add member")
      return
    }

    setUsername("")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-start">
      <div className="flex-1">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="username to add"
        />
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-3 py-1.5 text-sm transition"
      >
        {loading ? "..." : "Add"}
      </button>
    </form>
  )
}