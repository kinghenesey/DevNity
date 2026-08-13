import { notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { getQuestionById } from "@/server/services/qa.service"
import { AnswerForm } from "@/components/qa/AnswerForm"
import { AcceptButton } from "@/components/qa/AcceptButton"

export default async function QuestionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()
  const question = await getQuestionById(id)
  if (!question) notFound()

  const isAuthor = session?.user?.id === question.authorId
  const hasAccepted = question.answers.some((a) => a.accepted)

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 text-white">
      <h1 className="text-2xl font-semibold mb-2">{question.title}</h1>
      <p className="text-neutral-500 text-sm mb-4">by {question.author.name || question.author.username}</p>

      {question.tags.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-4">
          {question.tags.map((t) => (
            <span key={t} className="text-xs rounded-md bg-neutral-800 px-2 py-0.5">{t}</span>
          ))}
        </div>
      )}

      <p className="text-neutral-300 whitespace-pre-wrap mb-8">{question.body}</p>

      <h2 className="text-lg font-semibold mb-3">{question.answers.length} Answers</h2>
      <div className="space-y-3 mb-8">
        {question.answers.map((a) => (
          <div
            key={a.id}
            className={
              "rounded-md border p-4 " +
              (a.accepted ? "border-indigo-600 bg-indigo-950/30" : "border-neutral-800 bg-neutral-900")
            }
          >
            {a.accepted && <p className="text-xs text-indigo-400 mb-2">✓ Accepted answer</p>}
            <p className="text-neutral-200 text-sm whitespace-pre-wrap">{a.body}</p>
            <div className="flex items-center justify-between mt-3">
              <p className="text-neutral-500 text-xs">by {a.author.name || a.author.username}</p>
              {isAuthor && !hasAccepted && (
                <AcceptButton questionId={question.id} answerId={a.id} />
              )}
            </div>
          </div>
        ))}
      </div>

      {session?.user ? (
        <AnswerForm questionId={question.id} />
      ) : (
        <p className="text-neutral-500 text-sm">Log in to answer.</p>
      )}
    </div>
  )
}