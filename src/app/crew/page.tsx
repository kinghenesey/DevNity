import Link from "next/link"
import { auth } from "@/lib/auth"
import { listCrews } from "@/server/services/crew.service"

export default async function CrewListPage() {
  const session = await auth()
  const crews = await listCrews(session?.user?.id)

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 text-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Crews</h1>
        <Link
          href="/crew/new"
          className="rounded-md bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-sm transition"
        >
          + New Crew
        </Link>
      </div>

      {crews.length === 0 ? (
        <p className="text-neutral-500 text-sm">No Crews yet. Start the first one.</p>
      ) : (
        <div className="space-y-3">
          {crews.map((crew) => (
            <Link
              key={crew.id}
              href={"/crew/" + crew.slug}
              className="block rounded-md border border-neutral-800 bg-neutral-900 p-4 hover:border-neutral-700 transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{crew.name}</span>
                <span className="text-xs text-neutral-500">{crew._count.members} members</span>
              </div>
              {crew.description && (
                <p className="text-neutral-400 text-sm mt-1">{crew.description}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}