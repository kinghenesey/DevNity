import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { addLesson } from "@/server/services/dojo.service"

const lessonSchema = z.object({
  title: z.string().min(2).max(80),
  content: z.string().min(1).max(10000),
})

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
    const { title, content } = lessonSchema.parse(body)
    const lesson = await addLesson(id, session.user.id, title, content)
    return NextResponse.json(lesson, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 })
    }
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Something went wrong" },
      { status: 400 }
    )
  }
}