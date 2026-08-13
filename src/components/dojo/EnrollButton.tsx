"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function EnrollButton({ courseId }: { courseId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    await fetch("/api/courses/" + courseId + "/enroll", { method: "POST" })
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2 text-sm transition"
    >
      {loading ? "..." : "Enroll"}
    </button>
  )
}