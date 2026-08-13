import { db } from "@/lib/db"
import { awardHonor } from "./honor.service"
import { createNotification } from "./notification.service"

export async function askQuestion(input: { authorId: string; title: string; body: string; tags: string[] }) {
  const question = await db.question.create({ data: input })
  await awardHonor(input.authorId, "Curious Mind")
  return question
}

export async function listQuestions(tag?: string) {
  return db.question.findMany({
    where: tag ? { tags: { has: tag } } : undefined,
    include: {
      author: { select: { username: true, name: true } },
      _count: { select: { answers: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getQuestionById(id: string) {
  const question = await db.question.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, username: true, name: true } },
      answers: {
        include: { author: { select: { username: true, name: true } } },
        orderBy: [{ accepted: "desc" }, { createdAt: "asc" }],
      },
    },
  })
  return question
}

export async function postAnswer(questionId: string, authorId: string, body: string) {
  const answer = await db.answer.create({
    data: { questionId, authorId, body },
  })

  await awardHonor(authorId, "Helper")

  const question = await db.question.findUnique({ where: { id: questionId } })
  const answerer = await db.user.findUnique({ where: { id: authorId } })
  if (question && question.authorId !== authorId) {
    await createNotification({
      userId: question.authorId,
      type: "new_answer",
      message: (answerer?.name || answerer?.username || "Someone") + " answered your question",
      link: "/qa/" + questionId,
    })
  }

  return answer
}

export async function acceptAnswer(questionId: string, answerId: string, actingUserId: string) {
  const question = await db.question.findUnique({ where: { id: questionId } })
  if (!question) throw new Error("Question not found")
  if (question.authorId !== actingUserId) throw new Error("Only the question author can accept an answer")

  await db.answer.updateMany({ where: { questionId }, data: { accepted: false } })
  const answer = await db.answer.update({ where: { id: answerId }, data: { accepted: true } })

  await awardHonor(answer.authorId, "Trusted Answer")

  await createNotification({
    userId: answer.authorId,
    type: "answer_accepted",
    message: "Your answer was accepted",
    link: "/qa/" + questionId,
  })

  return answer
}

export function extractAllTags(questions: { tags: string[] }[]) {
  const set = new Set<string>()
  questions.forEach((q) => q.tags.forEach((t) => set.add(t)))
  return Array.from(set).sort()
}