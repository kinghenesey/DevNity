import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { applyToCollab } from "@/server/services/collab.service"

const applySchema = z.object({ message: z.string().min(5).max(500) })

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
    const { message } = applySchema.parse(body)
    await applyToCollab(id, session.user.id, message)
    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 })
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}