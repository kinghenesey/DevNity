import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { verifyTwoFactorCode } from "@/server/services/security.service"

const schema = z.object({ code: z.string().length(6) })

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { code } = schema.parse(body)

  const user = await db.user.findUnique({ where: { id: session.user.id } })
  if (!user?.twoFactorSecret) {
    return NextResponse.json({ error: "2FA not set up" }, { status: 400 })
  }

  const valid = await verifyTwoFactorCode(user.twoFactorSecret, code)
  if (!valid) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}