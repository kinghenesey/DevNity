import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { getConversation, sendMessage } from "@/server/services/message.service"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const conversation = await getConversation(id, session.user.id)
  if (!conversation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  return NextResponse.json(conversation)
}

const sendSchema = z.object({ content: z.string().min(1).max(2000) })

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
    const { content } = sendSchema.parse(body)
    const message = await sendMessage(id, session.user.id, content)
    return NextResponse.json(message, { status: 201 })
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