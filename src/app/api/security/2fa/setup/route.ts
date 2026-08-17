import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { generateTwoFactorSetup } from "@/server/services/security.service"

export async function POST() {
  const session = await auth()
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const result = await generateTwoFactorSetup(session.user.id, session.user.email)
  return NextResponse.json(result)
}