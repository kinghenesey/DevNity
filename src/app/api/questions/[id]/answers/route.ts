import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { postAnswer } from "@/server/services/qa.service"

const answerSchema = z.object({ body: z.string().min(10).max(5000) })

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { id } = await params

  try {
    const body = await req.json()
    const { body: answerBody } = answerSchema.parse(body)
    const answer = await postAnswer(id, session.user.id, answerBody)
    return NextResponse.json(answer, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 })
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}