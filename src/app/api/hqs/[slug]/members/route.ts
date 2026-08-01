import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { addMember } from "@/server/services/hq.service"

const addMemberSchema = z.object({
  username: z.string().min(1),
  role: z.enum(["ADMIN", "MEMBER"]).default("MEMBER"),
})

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { slug } = await params

  try {
    const body = await req.json()
    const { username, role } = addMemberSchema.parse(body)
    await addMember(slug, session.user.id, username, role)
    return NextResponse.json({ success: true })
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