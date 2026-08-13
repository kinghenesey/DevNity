import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { acceptAnswer } from "@/server/services/qa.service"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string; answerId: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { id, answerId } = await params

  try {
    const result = await acceptAnswer(id, answerId, session.user.id)
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Something went wrong" },
      { status: 400 }
    )
  }
}