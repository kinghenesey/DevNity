"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function GigApplyForm({ gigId }: { gigId: string }) {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const res = await fetch("/api/gigs/" + gigId + "/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(typeof data.error === "string" ? data.error : "Failed to apply")
      return
    }

    setSubmitted(true)
    router.refresh()
  }

  if (submitted) {
    return <p className="text-sm text-indigo-400">Application sent.</p>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        rows={3}
        className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Why are you a good fit?"
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2 text-sm transition"
      >
        {loading ? "Sending..." : "Apply"}
      </button>
    </form>
  )
}