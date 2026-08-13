import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { toggleRecognition } from "@/server/services/recognition.service"
import { db } from "@/lib/db"

const schema = z.object({
  targetType: z.enum(["post", "build", "answer", "startup"]),
  targetId: z.string(),
})

async function resolveOwnerAndMeta(targetType: string, targetId: string) {
  if (targetType === "post") {
    const p = await db.post.findUnique({ where: { id: targetId } })
    return p ? { ownerId: p.authorId, label: "post", link: "/feed" } : null
  }
  if (targetType === "build") {
    const b = await db.build.findUnique({ where: { id: targetId }, include: { owner: true } })
    return b ? { ownerId: b.ownerId, label: "Build", link: "/build/" + b.owner.username + "/" + b.name } : null
  }
  if (targetType === "answer") {
    const a = await db.answer.findUnique({ where: { id: targetId } })
    return a ? { ownerId: a.authorId, label: "answer", link: "/qa/" + a.questionId } : null
  }
  if (targetType === "startup") {
    const s = await db.startup.findUnique({ where: { id: targetId } })
    return s ? { ownerId: s.founderId, label: "startup", link: "/startup/" + s.slug } : null
  }
  return null
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { targetType, targetId } = schema.parse(body)

    const meta = await resolveOwnerAndMeta(targetType, targetId)
    if (!meta) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const result = await toggleRecognition(session.user.id, { type: targetType, id: targetId, ...meta })
    return NextResponse.json(result)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 })
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}