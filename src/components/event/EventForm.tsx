"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function EventForm() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startsAt, setStartsAt] = useState("")
  const [endsAt, setEndsAt] = useState("")
  const [online, setOnline] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description: description || undefined,
        startsAt: new Date(startsAt).toISOString(),
        endsAt: endsAt ? new Date(endsAt).toISOString() : undefined,
        online,
      }),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(typeof data.error === "string" ? data.error : "Failed to create Event")
      return
    }

    const event = await res.json()
    router.push("/event/" + event.id)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-5 py-10 px-4">
      <h1 className="text-2xl font-semibold text-white">Host an Event</h1>

      <div>
        <label className="block text-sm text-neutral-300 mb-1">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="DevNity Hackathon 2026"
        />
      </div>

      <div>
        <label className="block text-sm text-neutral-300 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm text-neutral-300 mb-1">Starts at</label>
        <input
          type="datetime-local"
          value={startsAt}
          onChange={(e) => setStartsAt(e.target.value)}
          required
          className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm text-neutral-300 mb-1">Ends at (optional)</label>
        <input
          type="datetime-local"
          value={endsAt}
          onChange={(e) => setEndsAt(e.target.value)}
          className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="online"
          checked={online}
          onChange={(e) => setOnline(e.target.checked)}
          className="rounded"
        />
        <label htmlFor="online" className="text-sm text-neutral-300">Online</label>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-2 font-medium transition"
      >
        {loading ? "Creating..." : "Create Event"}
      </button>
    </form>
  )
}