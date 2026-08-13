import Link from "next/link"
import { listQuestions, extractAllTags } from "@/server/services/qa.service"

export default async function QaListPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>
}) {
  const { tag } = await searchParams
  const [questions, allQuestions] = await Promise.all([
    listQuestions(tag),
    listQuestions(),
  ])
  const tags = extractAllTags(allQuestions)

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 text-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Q&amp;A</h1>
        <Link
          href="/qa/new"
          className="rounded-md bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-sm transition"
        >
          + Ask a Question
        </Link>
      </div>

      {tags.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-6">
          <Link
            href="/qa"
            className={"text-xs rounded-full border px-3 py-1 transition " + (!tag ? "border-indigo-500 text-indigo-400" : "border-neutral-800 text-neutral-400")}
          >
            All
          </Link>
          {tags.map((t) => (
            <Link
              key={t}
              href={"/qa?tag=" + encodeURIComponent(t)}
              className={"text-xs rounded-full border px-3 py-1 transition " + (tag === t ? "border-indigo-500 text-indigo-400" : "border-neutral-800 text-neutral-400")}
            >
              {t}
            </Link>
          ))}
        </div>
      )}

      {questions.length === 0 ? (
        <p className="text-neutral-500 text-sm">No questions yet.</p>
      ) : (
        <div className="space-y-3">
          {questions.map((q) => (
            <Link
              key={q.id}
              href={"/qa/" + q.id}
              className="block rounded-md border border-neutral-800 bg-neutral-900 p-4 hover:border-neutral-700 transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{q.title}</span>
                <span className="text-xs text-neutral-500">{q._count.answers} answers</span>
              </div>
              {q.tags.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-2">
                  {q.tags.map((t) => (
                    <span key={t} className="text-xs rounded-md bg-neutral-800 px-2 py-0.5">{t}</span>
                  ))}
                </div>
              )}
              <p className="text-neutral-500 text-xs mt-2">by {q.author.name || q.author.username}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}