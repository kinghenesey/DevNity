"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function JoinLeaveButton({ slug, isMember, isOwner }: { slug: string; isMember: boolean; isOwner: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  if (isOwner) return null

  async function handleClick() {
    setLoading(true)
    await fetch("/api/crews/" + slug + "/membership", {
      method: isMember ? "DELETE" : "POST",
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={
        isMember
          ? "rounded-md border border-neutral-800 hover:bg-neutral-900 text-white px-4 py-2 text-sm transition"
          : "rounded-md bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-sm transition"
      }
    >
      {loading ? "..." : isMember ? "Leave Crew" : "Join Crew"}
    </button>
  )
}