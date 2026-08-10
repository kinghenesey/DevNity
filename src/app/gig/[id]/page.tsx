import { notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { getGigById } from "@/server/services/gig.service"
import { GigApplyForm } from "@/components/gig/GigApplyForm"

export default async function GigPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()
  const gig = await getGigById(id, session?.user?.id)
  if (!gig) notFound()

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 text-white">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-semibold">{gig.title}</h1>
        <span className="text-xs rounded-full border border-neutral-700 px-2 py-1 text-neutral-300">
          {gig.remote ? "Remote" : gig.location || "On-site"}
        </span>
      </div>
      <p className="text-neutral-500 text-sm mb-6">
        {gig.hq ? gig.hq.name : gig.postedBy.name || gig.postedBy.username}
      </p>

      <p className="text-neutral-300 whitespace-pre-wrap mb-8">{gig.description}</p>

      {gig.isOwner ? (
        <>
          <h2 className="text-lg font-semibold mb-3">Applicants ({gig.applications.length})</h2>
          {gig.applications.length === 0 ? (
            <p className="text-neutral-500 text-sm">No applications yet.</p>
          ) : (
            <div className="space-y-3">
              {gig.applications.map((app) => (
                <div key={app.id} className="rounded-md border border-neutral-800 bg-neutral-900 p-4">
                  <p className="text-sm font-medium">{app.user.name || app.user.username}</p>
                  <p className="text-neutral-400 text-sm mt-1">{app.message}</p>
                </div>
              ))}
            </div>
          )}
        </>
      ) : session?.user ? (
        gig.viewerApplication ? (
          <p className="text-sm text-neutral-400">You&apos;ve already applied to this Gig.</p>
        ) : (
          <GigApplyForm gigId={gig.id} />
        )
      ) : (
        <p className="text-sm text-neutral-500">Log in to apply.</p>
      )}
    </div>
  )
}