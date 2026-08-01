import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { createCollab } from "@/server/services/collab.service"

const createCollabSchema = z.object({
  title: z.string().min(3).max(80),
  description: z.string().min(10).max(2000),
  rolesNeeded: z.array(z.string()).default([]),
  budget: z.enum(["VOLUNTEER", "REVENUE_SHARE", "PAID"]),
  deadline: z.string().optional(),
  experience: z.string().max(200).optional(),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const data = createCollabSchema.parse(body)
    const collab = await createCollab({
      ...data,
      deadline: data.deadline ? new Date(data.deadline) : undefined,
      ownerId: session.user.id,
    })
    return NextResponse.json(collab, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 })
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}