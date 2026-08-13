import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { rsvpToEvent, cancelRsvp } from "@/server/services/event.service"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { id } = await params
  await rsvpToEvent(id, session.user.id)
  return NextResponse.json({ success: true })
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { id } = await params
  await cancelRsvp(id, session.user.id)
  return NextResponse.json({ success: true })
}