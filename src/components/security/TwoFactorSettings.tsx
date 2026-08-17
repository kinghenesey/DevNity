"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export function TwoFactorSettings({ initialEnabled }: { initialEnabled: boolean }) {
  const router = useRouter()
  const [enabled, setEnabled] = useState(initialEnabled)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [secret, setSecret] = useState<string | null>(null)
  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleStartSetup() {
    setError(null)
    setLoading(true)
    const res = await fetch("/api/security/2fa/setup", { method: "POST" })
    setLoading(false)
    if (res.ok) {
      const data = await res.json()
      setQrDataUrl(data.qrDataUrl)
      setSecret(data.secret)
    }
  }

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const res = await fetch("/api/security/2fa/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
    setLoading(false)
    if (!res.ok) {
      const data = await res.json()
      setError(data.error || "Invalid code")
      return
    }
    setEnabled(true)
    setQrDataUrl(null)
    setCode("")
    router.refresh()
  }

  async function handleDisable() {
    setLoading(true)
    await fetch("/api/security/2fa/disable", { method: "POST" })
    setLoading(false)
    setEnabled(false)
    router.refresh()
  }

  if (enabled) {
    return (
      <div className="rounded-md border border-neutral-800 bg-neutral-900 p-4">
        <p className="text-sm text-indigo-400 mb-3">✓ Two-factor authentication is enabled.</p>
        <button
          onClick={handleDisable}
          disabled={loading}
          className="text-xs rounded-md border border-neutral-700 hover:border-neutral-600 text-neutral-300 px-3 py-1.5 transition"
        >
          {loading ? "..." : "Disable 2FA"}
        </button>
      </div>
    )
  }

  if (qrDataUrl) {
    return (
      <div className="rounded-md border border-neutral-800 bg-neutral-900 p-4 space-y-3">
        <p className="text-sm text-neutral-300">Scan this with your authenticator app:</p>
        <Image src={qrDataUrl} alt="2FA QR code" width={160} height={160} unoptimized />
        {secret && (
          <p className="text-xs text-neutral-500 break-all">
            Or enter manually: <span className="text-neutral-400">{secret}</span>
          </p>
        )}
        <form onSubmit={handleConfirm} className="flex gap-2">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            placeholder="6-digit code"
            className="flex-1 rounded-md bg-neutral-950 border border-neutral-800 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2 text-sm transition"
          >
            {loading ? "..." : "Confirm"}
          </button>
        </form>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    )
  }

  return (
    <div className="rounded-md border border-neutral-800 bg-neutral-900 p-4">
      <p className="text-sm text-neutral-400 mb-3">Two-factor authentication is off.</p>
      <button
        onClick={handleStartSetup}
        disabled={loading}
        className="rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2 text-sm transition"
      >
        {loading ? "..." : "Enable 2FA"}
      </button>
    </div>
  )
}