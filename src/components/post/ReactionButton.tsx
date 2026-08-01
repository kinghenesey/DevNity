"use client"

import { useState } from "react"

export function ReactionButton({
  postId,
  initialReacted,
  initialCount,
}: {
  postId: string
  initialReacted: boolean
  initialCount: number
}) {
  const [reacted, setReacted] = useState(initialReacted)
  const [count, setCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    const res = await fetch("/api/posts/" + postId + "/react", { method: "POST" })
    if (res.ok) {
      const data = await res.json()
      setReacted(data.reacted)
      setCount((c) => (data.reacted ? c + 1 : c - 1))
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={
        "text-xs rounded-full border px-3 py-1 transition " +
        (reacted
          ? "border-indigo-500 text-indigo-400 bg-neutral-900"
          : "border-neutral-800 text-neutral-400 hover:border-neutral-700")
      }
    >
      ⚡ {count}
    </button>
  )
}