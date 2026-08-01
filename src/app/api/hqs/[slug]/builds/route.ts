import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { linkBuildToHq } from "@/server/services/hq.service"

const linkSchema = z.object({ buildId: z.string() })

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
    const { buildId } = linkSchema.parse(body)
    await linkBuildToHq(slug, buildId, session.user.id)
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