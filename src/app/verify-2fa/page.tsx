"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function Verify2FAPage() {
  const { update } = useSession()
  const router = useRouter()
  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const res = await fetch("/api/security/2fa/verify-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "Invalid code")
      setLoading(false)
      return
    }

    await update({ verified2FA: true })
    router.push("/")
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold text-white text-center">Verify it&apos;s you</h1>
        <p className="text-neutral-400 text-sm text-center">Enter your 2FA code to continue.</p>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={6}
          autoFocus
          required
          className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-white text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="000000"
        />
        {error && <p className="text-sm text-red-400 text-center">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-2 font-medium transition"
        >
          {loading ? "..." : "Verify"}
        </button>
      </form>
    </div>
  )
}