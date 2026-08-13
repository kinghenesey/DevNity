"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CATEGORIES } from "@/server/services/marketplace.service"

export function ListingForm() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState(CATEGORIES[0])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const res = await fetch("/api/marketplace", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        priceCents: Math.round(parseFloat(price || "0") * 100),
        category,
      }),
    })

    setLoading(false)

    if (!res.ok) {
      const data = await res.json()
      setError(typeof data.error === "string" ? data.error : "Failed to create listing")
      return
    }

    const item = await res.json()
    router.push("/marketplace/" + item.id)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-5 py-10 px-4">
      <h1 className="text-2xl font-semibold text-white">List something</h1>
      <p className="text-neutral-500 text-sm -mt-3">
        Checkout isn&apos;t built yet — buyers contact you directly via Messages to arrange payment.
      </p>

      <div>
        <label className="block text-sm text-neutral-300 mb-1">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Admin Dashboard UI Kit"
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
        />
      </div>

      <div>
        <label className="block text-sm text-neutral-300 mb-1">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm text-neutral-300 mb-1">Price (USD, 0 for free)</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="29.00"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-2 font-medium transition"
      >
        {loading ? "Listing..." : "List item"}
      </button>
    </form>
  )
}