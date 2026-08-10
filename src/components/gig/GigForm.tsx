"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function GigForm({ hqs }: { hqs: { id: string; name: string }[] }) {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [remote, setRemote] = useState(true)
  const [hqId, setHqId] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const res = await fetch("/api/gigs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        location: location || undefined,
        remote,
        hqId: hqId || undefined,
      }),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(typeof data.error === "string" ? data.error : "Failed to post Gig")
      return
    }

    const gig = await res.json()
    router.push("/gig/" + gig.id)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-5 py-10 px-4">
      <h1 className="text-2xl font-semibold text-white">Post a Gig</h1>

      <div>
        <label className="block text-sm text-neutral-300 mb-1">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Senior Backend Engineer"
        />
      </div>

      <div>
        <label className="block text-sm text-neutral-300 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={5}
          className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Role, responsibilities, requirements..."
        />
      </div>

      {hqs.length > 0 && (
        <div>
          <label className="block text-sm text-neutral-300 mb-1">Post under an HQ (optional)</label>
          <select
            value={hqId}
            onChange={(e) => setHqId(e.target.value)}
            className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Post as yourself</option>
            {hqs.map((hq) => (
              <option key={hq.id} value={hq.id}>{hq.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="remote"
          checked={remote}
          onChange={(e) => setRemote(e.target.checked)}
          className="rounded"
        />
        <label htmlFor="remote" className="text-sm text-neutral-300">Remote</label>
      </div>

      {!remote && (
        <div>
          <label className="block text-sm text-neutral-300 mb-1">Location</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="City, Country"
          />
        </div>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-2 font-medium transition"
      >
        {loading ? "Posting..." : "Post Gig"}
      </button>
    </form>
  )
}