import Link from "next/link"
import { listOpenGigs } from "@/server/services/gig.service"

export default async function GigListPage() {
  const gigs = await listOpenGigs()

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 text-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Gigs</h1>
        <Link
          href="/gig/new"
          className="rounded-md bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-sm transition"
        >
          + Post a Gig
        </Link>
      </div>

      {gigs.length === 0 ? (
        <p className="text-neutral-500 text-sm">No Gigs yet. Post the first one.</p>
      ) : (
        <div className="space-y-3">
          {gigs.map((gig) => (
            <Link
              key={gig.id}
              href={"/gig/" + gig.id}
              className="block rounded-md border border-neutral-800 bg-neutral-900 p-4 hover:border-neutral-700 transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{gig.title}</span>
                <span className="text-xs rounded-full border border-neutral-700 px-2 py-0.5 text-neutral-400">
                  {gig.remote ? "Remote" : gig.location || "On-site"}
                </span>
              </div>
              <p className="text-neutral-400 text-sm mt-1 line-clamp-2">{gig.description}</p>
              <p className="text-neutral-500 text-xs mt-2">
                {gig.hq ? gig.hq.name : gig.postedBy.name || gig.postedBy.username}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}