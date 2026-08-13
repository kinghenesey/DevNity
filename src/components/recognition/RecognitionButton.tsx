"use client"

import { useState } from "react"

export function RecognitionButton({
  targetType,
  targetId,
  initialRecognized,
  initialCount,
}: {
  targetType: string
  targetId: string
  initialRecognized: boolean
  initialCount: number
}) {
  const [recognized, setRecognized] = useState(initialRecognized)
  const [count, setCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    const res = await fetch("/api/recognitions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetType, targetId }),
    })
    if (res.ok) {
      const data = await res.json()
      setRecognized(data.recognized)
      setCount((c) => (data.recognized ? c + 1 : c - 1))
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={
        "text-xs rounded-full border px-3 py-1 transition " +
        (recognized
          ? "border-indigo-500 text-indigo-400 bg-neutral-900"
          : "border-neutral-800 text-neutral-400 hover:border-neutral-700")
      }
    >
      ⚡ {count}
    </button>
  )
}