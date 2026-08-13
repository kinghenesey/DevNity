import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { createEvent } from "@/server/services/event.service"

const createEventSchema = z.object({
  title: z.string().min(3).max(80),
  description: z.string().max(2000).optional(),
  startsAt: z.string(),
  endsAt: z.string().optional(),
  online: z.boolean().default(true),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const data = createEventSchema.parse(body)
    const event = await createEvent({
      hostId: session.user.id,
      title: data.title,
      description: data.description,
      startsAt: new Date(data.startsAt),
      endsAt: data.endsAt ? new Date(data.endsAt) : undefined,
      online: data.online,
    })
    return NextResponse.json(event, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 })
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}