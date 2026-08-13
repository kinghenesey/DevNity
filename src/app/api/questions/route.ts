import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { askQuestion } from "@/server/services/qa.service"

const askSchema = z.object({
  title: z.string().min(10).max(150),
  body: z.string().min(20).max(5000),
  tags: z.array(z.string()).default([]),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const data = askSchema.parse(body)
    const question = await askQuestion({ ...data, authorId: session.user.id })
    return NextResponse.json(question, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 })
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}