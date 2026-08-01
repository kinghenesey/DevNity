import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { createCrew } from "@/server/services/crew.service"

const createCrewSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().max(300).optional(),
  visibility: z.enum(["PUBLIC", "PRIVATE"]),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const data = createCrewSchema.parse(body)
    const crew = await createCrew({ ...data, ownerId: session.user.id })
    return NextResponse.json(crew, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 })
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}