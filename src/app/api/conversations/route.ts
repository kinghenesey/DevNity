import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { getOrCreateConversation, listConversationsForUser } from "@/server/services/message.service"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const conversations = await listConversationsForUser(session.user.id)
  return NextResponse.json(conversations)
}

const startSchema = z.object({ username: z.string().min(1) })

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { username } = startSchema.parse(body)
    const conversation = await getOrCreateConversation(session.user.id, username)
    return NextResponse.json(conversation)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Something went wrong" },
      { status: 400 }
    )
  }
}