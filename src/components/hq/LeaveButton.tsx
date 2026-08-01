"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function LeaveButton({ slug }: { slug: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    await fetch("/api/hqs/" + slug + "/membership", { method: "DELETE" })
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="rounded-md border border-neutral-800 hover:bg-neutral-900 text-white px-4 py-2 text-sm transition"
    >
      {loading ? "..." : "Leave HQ"}
    </button>
  )
}