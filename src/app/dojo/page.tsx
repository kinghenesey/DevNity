import Link from "next/link"
import { listCourses } from "@/server/services/dojo.service"

export default async function DojoListPage() {
  const courses = await listCourses()

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 text-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Dojo</h1>
        <Link
          href="/dojo/new"
          className="rounded-md bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-sm transition"
        >
          + Create Course
        </Link>
      </div>

      {courses.length === 0 ? (
        <p className="text-neutral-500 text-sm">No courses yet.</p>
      ) : (
        <div className="space-y-3">
          {courses.map((c) => (
            <Link
              key={c.id}
              href={"/dojo/" + c.id}
              className="block rounded-md border border-neutral-800 bg-neutral-900 p-4 hover:border-neutral-700 transition"
            >
              <span className="font-medium">{c.title}</span>
              {c.description && <p className="text-neutral-400 text-sm mt-1">{c.description}</p>}
              <p className="text-neutral-500 text-xs mt-2">
                {c._count.lessons} lessons · {c._count.enrollments} enrolled · by {c.author.name || c.author.username}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}