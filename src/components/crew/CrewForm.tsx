"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function CrewForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE">("PUBLIC")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const res = await fetch("/api/crews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description: description || undefined, visibility }),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(typeof data.error === "string" ? data.error : "Failed to create Crew")
      return
    }

    const crew = await res.json()
    router.push("/crew/" + crew.slug)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-5 py-10 px-4">
      <h1 className="text-2xl font-semibold text-white">Start a new Crew</h1>

      <div>
        <label className="block text-sm text-neutral-300 mb-1">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Rust Developers"
        />
      </div>

      <div>
        <label className="block text-sm text-neutral-300 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="What's this Crew about?"
        />
      </div>

      <div>
        <label className="block text-sm text-neutral-300 mb-2">Visibility</label>
        <div className="space-y-2">
          {[
            { value: "PUBLIC", label: "Public", hint: "Anyone can find and join" },
            { value: "PRIVATE", label: "Private", hint: "Invite/approval only, hidden from browse" },
          ].map((opt) => (
            <label
              key={opt.value}
              className={`flex items-start gap-3 rounded-md border px-3 py-2 cursor-pointer ${
                visibility === opt.value ? "border-indigo-500 bg-neutral-900" : "border-neutral-800"
              }`}
            >
              <input
                type="radio"
                name="visibility"
                checked={visibility === opt.value}
                onChange={() => setVisibility(opt.value as "PUBLIC" | "PRIVATE")}
                className="mt-1"
              />
              <span>
                <span className="block text-white text-sm font-medium">{opt.label}</span>
                <span className="block text-neutral-500 text-xs">{opt.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-2 font-medium transition"
      >
        {loading ? "Creating..." : "Create Crew"}
      </button>
    </form>
  )
}