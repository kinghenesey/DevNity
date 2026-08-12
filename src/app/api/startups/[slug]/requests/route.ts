import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { addCofounderRequest } from "@/server/services/startup.service"

const requestSchema = z.object({
  roleNeeded: z.string().min(2).max(60),
  message: z.string().min(5).max(500),
})

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { slug } = await params

  try {
    const body = await req.json()
    const { roleNeeded, message } = requestSchema.parse(body)
    await addCofounderRequest(slug, session.user.id, roleNeeded, message)
    return NextResponse.json({ success: true })
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