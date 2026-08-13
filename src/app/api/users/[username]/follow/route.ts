import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { followUser, unfollowUser } from "@/server/services/follow.service"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { username } = await params

  try {
    await followUser(session.user.id, username)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Something went wrong" },
      { status: 400 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { username } = await params
  await unfollowUser(session.user.id, username)
  return NextResponse.json({ success: true })
}