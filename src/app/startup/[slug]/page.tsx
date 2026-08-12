import { notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { getStartupBySlug } from "@/server/services/startup.service"
import { AddRequestForm } from "@/components/startup/AddRequestForm"
import { InterestButton } from "@/components/startup/InterestButton"

export default async function StartupPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const session = await auth()
  const startup = await getStartupBySlug(slug, session?.user?.id)
  if (!startup) notFound()

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 text-white">
      <h1 className="text-2xl font-semibold mb-1">{startup.name}</h1>
      <p className="text-neutral-500 text-sm mb-6">
        by {startup.founder.name || startup.founder.username}
      </p>

      <p className="text-neutral-300 mb-8">{startup.pitch}</p>

      <h2 className="text-lg font-semibold mb-3">Co-founder roles</h2>
      {startup.cofounderReqs.length === 0 ? (
        <p className="text-neutral-500 text-sm mb-6">No open roles yet.</p>
      ) : (
        <div className="space-y-3 mb-6">
          {startup.cofounderReqs.map((r) => (
            <div key={r.id} className="rounded-md border border-neutral-800 bg-neutral-900 p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{r.roleNeeded}</span>
                {!startup.isFounder && session?.user && <InterestButton requestId={r.id} />}
              </div>
              <p className="text-neutral-400 text-sm mt-1">{r.message}</p>
            </div>
          ))}
        </div>
      )}

      {startup.isFounder && <AddRequestForm slug={startup.slug} />}
    </div>
  )
}