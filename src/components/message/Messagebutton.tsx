"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export function MessageButton({ username }: { username: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    })
    setLoading(false)
    if (res.ok) {
      const conversation = await res.json()
      router.push("/messages/" + conversation.id)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="text-xs rounded-md border border-neutral-700 hover:border-neutral-600 text-neutral-300 px-3 py-1.5 transition"
    >
      {loading ? "..." : "Message"}
    </button>
  )
}