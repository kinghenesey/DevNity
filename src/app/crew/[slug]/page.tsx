import { notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { getCrewBySlug } from "@/server/services/crew.service"
import { JoinLeaveButton } from "@/components/crew/JoinLeaveButton"

export default async function CrewPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const session = await auth()
  const crew = await getCrewBySlug(slug, session?.user?.id)
  if (!crew) notFound()

  const membership = crew.members.find((m) => m.userId === session?.user?.id)
  const isMember = !!membership
  const isOwner = membership?.role === "OWNER"

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 text-white">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-semibold">{crew.name}</h1>
        <JoinLeaveButton slug={crew.slug} isMember={isMember} isOwner={isOwner} />
      </div>

      {crew.description && <p className="text-neutral-400 mb-6">{crew.description}</p>}

      <h2 className="text-lg font-semibold mb-3">Members ({crew.members.length})</h2>
      <div className="space-y-2">
        {crew.members.map((m) => (
          <div key={m.id} className="flex items-center justify-between rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2">
            <span className="text-sm">{m.user.name || m.user.username}</span>
            <span className="text-xs text-neutral-500">{m.role}</span>
          </div>
        ))}
      </div>
    </div>
  )
}