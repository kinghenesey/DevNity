import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { createBuild } from "@/server/services/build.service"

const createBuildSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-zA-Z0-9-_]+$/, "Only letters, numbers, hyphens, and underscores allowed"),
  description: z.string().max(300).optional(),
  visibility: z.enum(["PUBLIC", "PRIVATE", "STATISTICS", "SHOWCASE"]),
  languages: z.array(z.string()).default([]),
  readme: z.string().optional(),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const data = createBuildSchema.parse(body)

    const build = await createBuild({ ownerId: session.user.id, ...data })
    return NextResponse.json(build, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 })
    }
    if (typeof err === "object" && err !== null && "code" in err && err.code === "P2002") {
      return NextResponse.json({ error: "You already have a Build with this name" }, { status: 409 })
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}