import { notFound } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { getDevcardByUsername } from "@/server/services/user.service"
import { listBuildsForUsername } from "@/server/services/build.service"
import Image from "next/image"

export default async function DevcardPage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const session = await auth()
  const user = await getDevcardByUsername(username)
  if (!user) notFound()

  const builds = await listBuildsForUsername(username, session?.user?.id)
  const isOwner = session?.user?.id === user.id

  const joined = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  })

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 text-white">
      <div className="flex items-start gap-4 mb-6">
        {user.image ? (
            <Image
                src={user.image}
                alt={user.username}
                width={80}
                height={80}
                className="w-20 h-20 rounded-full"
            />
            ) : (
          <div className="w-20 h-20 rounded-full bg-neutral-800 flex items-center justify-center text-2xl">
            {user.username[0].toUpperCase()}
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">{user.name || user.username}</h1>
            {isOwner && (
              <>
                <span className="text-xs rounded-full border border-neutral-700 px-2 py-0.5 text-neutral-400">
                  You
                </span>
                <Link href="/devcard/edit" className="text-xs text-indigo-400 hover:underline">
                  Edit
                </Link>
              </>
            )}
          </div>
          <p className="text-neutral-400">
            @{user.username}
            {user.handle ? " · " + user.handle : ""}
          </p>
          {user.bio && <p className="text-neutral-300 mt-2">{user.bio}</p>}
          <div className="flex gap-4 mt-3 text-sm text-neutral-500">
            {user.country && <span>{user.country}</span>}
            <span>Joined {joined}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-semibold text-indigo-400">{user.cred}</div>
          <div className="text-xs text-neutral-500 uppercase tracking-wide">Cred</div>
        </div>
      </div>

      {user.skills.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-8">
          {user.skills.map((s) => (
            <span
              key={s.skill.name}
              className="text-xs rounded-md bg-neutral-900 border border-neutral-800 px-2 py-1"
            >
              {s.skill.name}
            </span>
          ))}
        </div>
      )}

      <h2 className="text-lg font-semibold mb-3">Builds</h2>
      {builds.length === 0 ? (
        <p className="text-neutral-500 text-sm">
          {isOwner ? "You haven't created any Builds yet." : "No public Builds yet."}
        </p>
      ) : (
        <div className="space-y-3">
          {builds.map((build) => (
            <Link
              key={build.id}
              href={"/build/" + user.username + "/" + build.name}
              className="block rounded-md border border-neutral-800 bg-neutral-900 p-4 hover:border-neutral-700 transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{build.name}</span>
                <span className="text-xs rounded-full border border-neutral-700 px-2 py-0.5 text-neutral-400">
                  {build.visibility}
                </span>
              </div>
              {build.description && (
                <p className="text-neutral-400 text-sm mt-1">{build.description}</p>
              )}
            </Link>
          ))}
        </div>
      )}

      {isOwner && (
        <Link href="/build/new" className="inline-block mt-6 text-sm text-indigo-400 hover:underline">
          + Create a new Build
        </Link>
      )}
    </div>
  )
}