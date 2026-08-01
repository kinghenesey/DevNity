import { notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { getCollabById } from "@/server/services/collab.service"
import { ApplyForm } from "@/components/collab/ApplyForm"

const BUDGET_LABELS: Record<string, string> = {
  VOLUNTEER: "Volunteer",
  REVENUE_SHARE: "Revenue Share",
  PAID: "Paid",
}

export default async function CollabPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()
  const collab = await getCollabById(id, session?.user?.id)
  if (!collab) notFound()

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 text-white">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-semibold">{collab.title}</h1>
        <span className="text-xs rounded-full border border-neutral-700 px-2 py-1 text-neutral-300">
          {BUDGET_LABELS[collab.budget]}
        </span>
      </div>
      <p className="text-neutral-500 text-sm mb-6">
        by {collab.owner.name || collab.owner.username}
        {collab.deadline && " · deadline " + new Date(collab.deadline).toLocaleDateString()}
        {collab.experience && " · " + collab.experience}
      </p>

      <p className="text-neutral-300 whitespace-pre-wrap mb-6">{collab.description}</p>

      {collab.rolesNeeded.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-8">
          {collab.rolesNeeded.map((role) => (
            <span key={role} className="text-xs rounded-md bg-neutral-900 border border-neutral-800 px-2 py-1">
              {role}
            </span>
          ))}
        </div>
      )}

      {collab.isOwner ? (
        <>
          <h2 className="text-lg font-semibold mb-3">Applicants ({collab.applications.length})</h2>
          {collab.applications.length === 0 ? (
            <p className="text-neutral-500 text-sm">No applications yet.</p>
          ) : (
            <div className="space-y-3">
              {collab.applications.map((app) => (
                <div key={app.id} className="rounded-md border border-neutral-800 bg-neutral-900 p-4">
                  <p className="text-sm font-medium">{app.user.name || app.user.username}</p>
                  <p className="text-neutral-400 text-sm mt-1">{app.message}</p>
                </div>
              ))}
            </div>
          )}
        </>
      ) : session?.user ? (
        collab.viewerApplication ? (
          <p className="text-sm text-neutral-400">You&apos;ve already applied to this Collab.</p>
        ) : (
          <ApplyForm collabId={collab.id} />
        )
      ) : (
        <p className="text-sm text-neutral-500">Log in to apply.</p>
      )}
    </div>
  )
}