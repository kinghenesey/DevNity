"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function EditDevcardForm({
  username,
  initialBio,
  initialHandle,
  initialCountry,
  initialImage,
  initialSkills,
}: {
  username: string
  initialBio: string
  initialHandle: string
  initialCountry: string
  initialImage: string
  initialSkills: string
}) {
  const router = useRouter()
  const [bio, setBio] = useState(initialBio)
  const [handle, setHandle] = useState(initialHandle)
  const [country, setCountry] = useState(initialCountry)
  const [image, setImage] = useState(initialImage)
  const [skills, setSkills] = useState(initialSkills)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const res = await fetch("/api/devcard", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bio,
        handle,
        country,
        image,
        skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      }),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(typeof data.error === "string" ? data.error : "Failed to update Devcard")
      return
    }

    router.push("/devcard/" + username)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-5 py-10 px-4">
      <h1 className="text-2xl font-semibold text-white">Edit your Devcard</h1>

      <div>
        <label className="block text-sm text-neutral-300 mb-1">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          maxLength={300}
          className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="What do you build?"
        />
      </div>

      <div>
        <label className="block text-sm text-neutral-300 mb-1">Devnity Handle</label>
        <input
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="A public display handle, separate from your username"
        />
      </div>

      <div>
        <label className="block text-sm text-neutral-300 mb-1">Country</label>
        <input
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm text-neutral-300 mb-1">Avatar image URL</label>
        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="https://..."
        />
        <p className="text-xs text-neutral-500 mt-1">
          Direct file upload isn&apos;t available yet — paste a link to an image for now.
        </p>
      </div>

      <div>
        <label className="block text-sm text-neutral-300 mb-1">Skills (comma-separated)</label>
        <input
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="TypeScript, React, PostgreSQL"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-2 font-medium transition"
      >
        {loading ? "Saving..." : "Save changes"}
      </button>
    </form>
  )
}