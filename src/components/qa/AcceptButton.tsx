"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function AcceptButton({ questionId, answerId }: { questionId: string; answerId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    await fetch("/api/questions/" + questionId + "/answers/" + answerId + "/accept", { method: "POST" })
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="text-xs rounded-md border border-neutral-700 hover:border-neutral-600 text-neutral-300 px-3 py-1 transition"
    >
      {loading ? "..." : "Accept answer"}
    </button>
  )
}