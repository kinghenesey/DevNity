import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { createStartup } from "@/server/services/startup.service"

const createStartupSchema = z.object({
  name: z.string().min(2).max(60),
  pitch: z.string().min(10).max(1000),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const data = createStartupSchema.parse(body)
    const startup = await createStartup({ ...data, founderId: session.user.id })
    return NextResponse.json(startup, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 })
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}