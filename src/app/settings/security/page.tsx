import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { listLoginHistory } from "@/server/services/security.service"
import { TwoFactorSettings } from "@/components/security/TwoFactorSettings"

export default async function SecuritySettingsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const user = await db.user.findUnique({ where: { id: session.user.id } })
  const history = await listLoginHistory(session.user.id)

  return (
    <div className="max-w-lg mx-auto py-10 px-4 text-white space-y-8">
      <h1 className="text-2xl font-semibold">Security</h1>

      <div>
        <h2 className="text-lg font-semibold mb-3">Two-Factor Authentication</h2>
        <TwoFactorSettings initialEnabled={!!user?.twoFactorEnabled} />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Login History</h2>
        {history.length === 0 ? (
          <p className="text-neutral-500 text-sm">No login history yet.</p>
        ) : (
          <div className="space-y-2">
            {history.map((h) => (
              <div key={h.id} className="flex items-center justify-between rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm">
                <span className="text-neutral-300 capitalize">{h.method}</span>
                <span className="text-neutral-500 text-xs">
                  {new Date(h.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}