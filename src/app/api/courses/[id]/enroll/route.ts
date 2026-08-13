import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { enroll } from "@/server/services/dojo.service"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { id } = await params
  await enroll(id, session.user.id)
  return NextResponse.json({ success: true })
}