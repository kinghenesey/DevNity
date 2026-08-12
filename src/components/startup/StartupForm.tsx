"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function StartupForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [pitch, setPitch] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const res = await fetch("/api/startups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, pitch }),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(typeof data.error === "string" ? data.error : "Failed to create Startup")
      return
    }

    const startup = await res.json()
    router.push("/startup/" + startup.slug)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-5 py-10 px-4">
      <h1 className="text-2xl font-semibold text-white">Start a Startup</h1>

      <div>
        <label className="block text-sm text-neutral-300 mb-1">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Acme AI"
        />
      </div>

      <div>
        <label className="block text-sm text-neutral-300 mb-1">Pitch</label>
        <textarea
          value={pitch}
          onChange={(e) => setPitch(e.target.value)}
          required
          rows={5}
          className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="What problem are you solving, and for who?"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-2 font-medium transition"
      >
        {loading ? "Creating..." : "Create Startup"}
      </button>
    </form>
  )
}