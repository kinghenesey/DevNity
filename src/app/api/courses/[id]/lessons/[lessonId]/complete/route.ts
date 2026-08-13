import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { toggleLessonComplete } from "@/server/services/dojo.service"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string; lessonId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { id, lessonId } = await params

  try {
    const result = await toggleLessonComplete(id, session.user.id, lessonId)
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Something went wrong" },
      { status: 400 }
    )
  }
}