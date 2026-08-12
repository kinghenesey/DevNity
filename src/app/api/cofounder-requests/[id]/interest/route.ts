import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { expressInterest } from "@/server/services/startup.service"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  await expressInterest(id, session.user.id)
  return NextResponse.json({ success: true })
}