import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { leaveHq } from "@/server/services/hq.service"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { slug } = await params

  try {
    await leaveHq(slug, session.user.id)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Something went wrong" },
      { status: 400 }
    )
  }
}