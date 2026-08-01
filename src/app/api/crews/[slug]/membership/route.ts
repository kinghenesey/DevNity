import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { joinCrew, leaveCrew } from "@/server/services/crew.service"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { slug } = await params
  await joinCrew(slug, session.user.id)
  return NextResponse.json({ success: true })
}

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
    await leaveCrew(slug, session.user.id)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Something went wrong" },
      { status: 400 }
    )
  }
}