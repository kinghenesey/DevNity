import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { createGig } from "@/server/services/gig.service"

const createGigSchema = z.object({
  title: z.string().min(3).max(80),
  description: z.string().min(10).max(2000),
  location: z.string().max(60).optional(),
  remote: z.boolean().default(true),
  hqId: z.string().optional(),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const data = createGigSchema.parse(body)
    const gig = await createGig({ ...data, postedById: session.user.id })
    return NextResponse.json(gig, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 })
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}