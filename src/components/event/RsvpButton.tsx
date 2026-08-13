"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function RsvpButton({ eventId, isAttending }: { eventId: string; isAttending: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    await fetch("/api/events/" + eventId + "/rsvp", {
      method: isAttending ? "DELETE" : "POST",
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={
        isAttending
          ? "rounded-md border border-neutral-800 hover:bg-neutral-900 text-white px-4 py-2 text-sm transition"
          : "rounded-md bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-sm transition"
      }
    >
      {loading ? "..." : isAttending ? "Cancel RSVP" : "RSVP"}
    </button>
  )
}