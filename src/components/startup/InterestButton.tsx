"use client"

import { useState } from "react"

export function InterestButton({ requestId }: { requestId: string }) {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    const res = await fetch("/api/cofounder-requests/" + requestId + "/interest", { method: "POST" })
    if (res.ok) setSent(true)
    setLoading(false)
  }

  if (sent) return <span className="text-xs text-indigo-400">Interest sent</span>

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="text-xs rounded-md border border-neutral-700 hover:border-neutral-600 text-neutral-300 px-3 py-1 transition"
    >
      {loading ? "..." : "I'm interested"}
    </button>
  )
}