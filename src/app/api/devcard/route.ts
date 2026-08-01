import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { updateDevcard } from "@/server/services/user.service"

const updateSchema = z.object({
  bio: z.string().max(300).optional(),
  handle: z.string().max(30).optional(),
  country: z.string().max(60).optional(),
  image: z.string().url().optional().or(z.literal("")),
  skills: z.array(z.string()).default([]),
})

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const data = updateSchema.parse(body)
    await updateDevcard(session.user.id, data)
    return NextResponse.json({ success: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 })
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}