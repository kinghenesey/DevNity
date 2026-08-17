import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { disableTwoFactor } from "@/server/services/security.service"

export async function POST() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  await disableTwoFactor(session.user.id)
  return NextResponse.json({ success: true })
}