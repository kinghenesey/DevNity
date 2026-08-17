"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [code, setCode] = useState("")
  const [needsCode, setNeedsCode] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const res = await signIn("credentials", {
      email,
      password,
      code: needsCode ? code : undefined,
      redirect: false,
    })

    setLoading(false)

    if (res?.error === "2FA_REQUIRED") {
      setNeedsCode(true)
      return
    }

    if (res?.error === "2FA_INVALID") {
      setError("Invalid 2FA code")
      return
    }

    if (res?.error) {
      setError("Invalid email or password")
      return
    }

    window.location.href = "/"
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
          <p className="text-neutral-400 text-sm mt-1">Log in to DevNity</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!needsCode ? (
            <>
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm text-neutral-300 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm text-neutral-300 mb-1">2FA Code</label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
                autoFocus
                required
                className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="6-digit code"
              />
            </div>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-2 font-medium transition"
          >
            {loading ? "..." : needsCode ? "Verify" : "Log in"}
          </button>
        </form>

        {!needsCode && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-800" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-neutral-950 px-2 text-neutral-500">or</span>
              </div>
            </div>

            <button
              onClick={() => signIn("github", { callbackUrl: "/" })}
              className="w-full rounded-md border border-neutral-800 hover:bg-neutral-900 text-white py-2 font-medium transition"
            >
              Continue with GitHub
            </button>

            <p className="text-center text-sm text-neutral-400">
              Don&apos;t have an account?{" "}
              <a href="/register" className="text-indigo-400 hover:underline">
                Sign up
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  )
}