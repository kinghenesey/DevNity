import Link from "next/link"
import { listOpenCollabs } from "@/server/services/collab.service"

const BUDGET_LABELS: Record<string, string> = {
  VOLUNTEER: "Volunteer",
  REVENUE_SHARE: "Revenue Share",
  PAID: "Paid",
}

export default async function CollabListPage() {
  const collabs = await listOpenCollabs()

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 text-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Collabs</h1>
        <Link
          href="/collab/new"
          className="rounded-md bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-sm transition"
        >
          + Post a Collab
        </Link>
      </div>

      {collabs.length === 0 ? (
        <p className="text-neutral-500 text-sm">No open Collabs yet. Post the first one.</p>
      ) : (
        <div className="space-y-3">
          {collabs.map((collab) => (
            <Link
              key={collab.id}
              href={"/collab/" + collab.id}
              className="block rounded-md border border-neutral-800 bg-neutral-900 p-4 hover:border-neutral-700 transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{collab.title}</span>
                <span className="text-xs rounded-full border border-neutral-700 px-2 py-0.5 text-neutral-400">
                  {BUDGET_LABELS[collab.budget]}
                </span>
              </div>
              <p className="text-neutral-400 text-sm mt-1 line-clamp-2">{collab.description}</p>
              {collab.rolesNeeded.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-2">
                  {collab.rolesNeeded.map((role) => (
                    <span key={role} className="text-xs rounded-md bg-neutral-800 px-2 py-0.5">
                      {role}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-neutral-500 text-xs mt-2">
                by {collab.owner.name || collab.owner.username}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}