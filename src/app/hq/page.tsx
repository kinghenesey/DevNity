import Link from "next/link"
import { auth } from "@/lib/auth"
import { listHqs } from "@/server/services/hq.service"

export default async function HqListPage() {
  const session = await auth()
  const hqs = await listHqs(session?.user?.id)

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 text-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">HQs</h1>
        <Link
          href="/hq/new"
          className="rounded-md bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-sm transition"
        >
          + New HQ
        </Link>
      </div>

      {hqs.length === 0 ? (
        <p className="text-neutral-500 text-sm">No HQs yet. Start the first one.</p>
      ) : (
        <div className="space-y-3">
          {hqs.map((hq) => (
            <Link
              key={hq.id}
              href={"/hq/" + hq.slug}
              className="block rounded-md border border-neutral-800 bg-neutral-900 p-4 hover:border-neutral-700 transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{hq.name}</span>
                <span className="text-xs text-neutral-500">{hq._count.members} members</span>
              </div>
              {hq.description && <p className="text-neutral-400 text-sm mt-1">{hq.description}</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}