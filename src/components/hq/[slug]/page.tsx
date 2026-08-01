import { notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { getHqBySlug } from "@/server/services/hq.service"
import { listBuildsForUsername } from "@/server/services/build.service"
import { AddMemberForm } from "@/components/hq/AddMemberForm"
import { LinkBuildForm } from "@/components/hq/LinkBuildForm"
import { LeaveButton } from "@/components/hq/LeaveButton"
import Link from "next/link"

export default async function HqPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const session = await auth()
  const hq = await getHqBySlug(slug, session?.user?.id)
  if (!hq) notFound()

  const membership = hq.members.find((m) => m.userId === session?.user?.id)
  const isMember = !!membership
  const isOwner = membership?.role === "OWNER"
  const isAdmin = isOwner || membership?.role === "ADMIN"

  const myBuilds = session?.user?.username
    ? await listBuildsForUsername(session.user.username, session.user.id)
    : []
  const alreadyLinkedIds = new Set(hq.buildLinks.map((l) => l.buildId))
  const linkableBuilds = myBuilds.filter((b) => !alreadyLinkedIds.has(b.id))

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 text-white">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-semibold">{hq.name}</h1>
        {isMember && !isOwner && <LeaveButton slug={hq.slug} />}
      </div>

      {hq.description && <p className="text-neutral-400 mb-6">{hq.description}</p>}

      {hq.buildLinks.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mb-3">Builds</h2>
          <div className="space-y-3 mb-8">
            {hq.buildLinks.map((link) => (
              <Link
                key={link.id}
                href={"/build/" + link.build.owner.username + "/" + link.build.name}
                className="block rounded-md border border-neutral-800 bg-neutral-900 p-4 hover:border-neutral-700 transition"
              >
                <span className="font-medium">{link.build.name}</span>
              </Link>
            ))}
          </div>
        </>
      )}

      {isMember && linkableBuilds.length > 0 && (
        <div className="mb-8">
          <LinkBuildForm slug={hq.slug} myBuilds={linkableBuilds} />
        </div>
      )}

      <h2 className="text-lg font-semibold mb-3">Members ({hq.members.length})</h2>
      <div className="space-y-2 mb-6">
        {hq.members.map((m) => (
          <div key={m.id} className="flex items-center justify-between rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2">
            <span className="text-sm">{m.user.name || m.user.username}</span>
            <span className="text-xs text-neutral-500">{m.role}</span>
          </div>
        ))}
      </div>

      {isAdmin && <AddMemberForm slug={hq.slug} />}
    </div>
  )
}