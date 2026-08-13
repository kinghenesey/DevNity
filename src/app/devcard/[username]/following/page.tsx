import Link from "next/link"
import { listFollowing } from "@/server/services/follow.service"

export default async function FollowingPage({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const following = await listFollowing(username)

  return (
    <div className="max-w-md mx-auto py-10 px-4 text-white">
      <h1 className="text-xl font-semibold mb-6">@{username} follows</h1>
      {following.length === 0 ? (
        <p className="text-neutral-500 text-sm">Not following anyone yet.</p>
      ) : (
        <div className="space-y-2">
          {following.map((f) => (
            <Link
              key={f.username}
              href={"/devcard/" + f.username}
              className="flex items-center gap-2 rounded-md border border-neutral-800 bg-neutral-900 p-3 hover:border-neutral-700 transition"
            >
              <span className="text-sm">{f.name || f.username}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}