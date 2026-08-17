import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { confirmTwoFactorSetup } from "@/server/services/security.service"

const schema = z.object({ code: z.string().length(6) })

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { code } = schema.parse(body)
    await confirmTwoFactorSetup(session.user.id, code)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Something went wrong" },
      { status: 400 }
    )
  }
}