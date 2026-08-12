import Link from "next/link"
import { listStartups } from "@/server/services/startup.service"

export default async function StartupListPage() {
  const startups = await listStartups()

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 text-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Startup Hub</h1>
        <Link
          href="/startup/new"
          className="rounded-md bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-sm transition"
        >
          + Start a Startup
        </Link>
      </div>

      {startups.length === 0 ? (
        <p className="text-neutral-500 text-sm">No startups yet. Be the first.</p>
      ) : (
        <div className="space-y-3">
          {startups.map((s) => (
            <Link
              key={s.id}
              href={"/startup/" + s.slug}
              className="block rounded-md border border-neutral-800 bg-neutral-900 p-4 hover:border-neutral-700 transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{s.name}</span>
                <span className="text-xs text-neutral-500">{s._count.cofounderReqs} roles open</span>
              </div>
              <p className="text-neutral-400 text-sm mt-1 line-clamp-2">{s.pitch}</p>
              <p className="text-neutral-500 text-xs mt-2">by {s.founder.name || s.founder.username}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}