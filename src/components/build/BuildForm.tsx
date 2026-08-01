"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

const VISIBILITY_OPTIONS = [
  { value: "PUBLIC", label: "Public", hint: "Everything visible to everyone" },
  { value: "PRIVATE", label: "Private", hint: "Only you can see this" },
  { value: "STATISTICS", label: "Statistics Mode", hint: "Only metadata/stats visible, code hidden" },
  { value: "SHOWCASE", label: "Showcase Mode", hint: "README, screenshots, demo — no code" },
] as const

export function BuildForm() {
  const router = useRouter()
  const { data: session } = useSession()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [visibility, setVisibility] = useState<string>("PUBLIC")
  const [languages, setLanguages] = useState("")
  const [readme, setReadme] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const res = await fetch("/api/builds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description: description || undefined,
        visibility,
        languages: languages.split(",").map((l) => l.trim()).filter(Boolean),
        readme: readme || undefined,
      }),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(typeof data.error === "string" ? data.error : "Failed to create Build")
      return
    }

    const build = await res.json()
    const username = session?.user?.username
    router.push(username ? `/build/${username}/${build.name}` : "/")
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-5 py-10">
      <h1 className="text-2xl font-semibold text-white">Create a new Build</h1>

      <div>
        <label className="block text-sm text-neutral-300 mb-1">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="my-project"
        />
      </div>

      <div>
        <label className="block text-sm text-neutral-300 mb-1">Description</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="What does this Build do?"
        />
      </div>

      <div>
        <label className="block text-sm text-neutral-300 mb-1">Languages (comma-separated)</label>
        <input
          value={languages}
          onChange={(e) => setLanguages(e.target.value)}
          className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="TypeScript, Python, Rust"
        />
      </div>

      <div>
        <label className="block text-sm text-neutral-300 mb-2">Visibility</label>
        <div className="space-y-2">
          {VISIBILITY_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex items-start gap-3 rounded-md border px-3 py-2 cursor-pointer ${
                visibility === opt.value ? "border-indigo-500 bg-neutral-900" : "border-neutral-800"
              }`}
            >
              <input
                type="radio"
                name="visibility"
                value={opt.value}
                checked={visibility === opt.value}
                onChange={() => setVisibility(opt.value)}
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

      <div>
        <label className="block text-sm text-neutral-300 mb-1">README</label>
        <textarea
          value={readme}
          onChange={(e) => setReadme(e.target.value)}
          rows={6}
          className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Plain text for now — Markdown rendering comes later"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-2 font-medium transition"
      >
        {loading ? "Creating..." : "Create Build"}
      </button>
    </form>
  )
}