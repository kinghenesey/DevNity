import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { createCourse } from "@/server/services/dojo.service"

const createCourseSchema = z.object({
  title: z.string().min(3).max(80),
  description: z.string().max(500).optional(),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const data = createCourseSchema.parse(body)
    const course = await createCourse({ ...data, authorId: session.user.id })
    return NextResponse.json(course, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 })
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}