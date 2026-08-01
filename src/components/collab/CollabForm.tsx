"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const BUDGET_OPTIONS = [
  { value: "VOLUNTEER", label: "Volunteer" },
  { value: "REVENUE_SHARE", label: "Revenue Share" },
  { value: "PAID", label: "Paid" },
] as const

export function CollabForm() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [roles, setRoles] = useState("")
  const [budget, setBudget] = useState<string>("VOLUNTEER")
  const [deadline, setDeadline] = useState("")
  const [experience, setExperience] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const res = await fetch("/api/collabs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        rolesNeeded: roles.split(",").map((r) => r.trim()).filter(Boolean),
        budget,
        deadline: deadline || undefined,
        experience: experience || undefined,
      }),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(typeof data.error === "string" ? data.error : "Failed to post Collab")
      return
    }

    const collab = await res.json()
    router.push("/collab/" + collab.id)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-5 py-10 px-4">
      <h1 className="text-2xl font-semibold text-white">Post a Collab</h1>

      <div>
        <label className="block text-sm text-neutral-300 mb-1">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Looking for a backend dev for a fintech app"
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
          placeholder="What are you building, and what do you need help with?"
        />
      </div>

      <div>
        <label className="block text-sm text-neutral-300 mb-1">Roles needed (comma-separated)</label>
        <input
          value={roles}
          onChange={(e) => setRoles(e.target.value)}
          className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Backend, DevOps"
        />
      </div>

      <div>
        <label className="block text-sm text-neutral-300 mb-2">Budget</label>
        <div className="flex gap-2">
          {BUDGET_OPTIONS.map((opt) => (
            <button
              type="button"
              key={opt.value}
              onClick={() => setBudget(opt.value)}
              className={`rounded-md border px-3 py-1.5 text-sm transition ${
                budget === opt.value
                  ? "border-indigo-500 bg-neutral-900 text-white"
                  : "border-neutral-800 text-neutral-400"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm text-neutral-300 mb-1">Deadline (optional)</label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm text-neutral-300 mb-1">Experience needed (optional)</label>
        <input
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="2+ years, comfortable with Postgres"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-2 font-medium transition"
      >
        {loading ? "Posting..." : "Post Collab"}
      </button>
    </form>
  )
}