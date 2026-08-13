"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function FollowButton({ username, initialFollowing }: { username: string; initialFollowing: boolean }) {
  const router = useRouter()
  const [following, setFollowing] = useState(initialFollowing)
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    await fetch("/api/users/" + username + "/follow", {
      method: following ? "DELETE" : "POST",
    })
    setLoading(false)
    setFollowing(!following)
    router.refresh()
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={
        following
          ? "rounded-md border border-neutral-800 hover:bg-neutral-900 text-white px-4 py-1.5 text-sm transition"
          : "rounded-md bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 text-sm transition"
      }
    >
      {loading ? "..." : following ? "Following" : "Follow"}
    </button>
  )
}