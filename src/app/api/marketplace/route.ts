import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { createListing, CATEGORIES } from "@/server/services/marketplace.service"

const createListingSchema = z.object({
  title: z.string().min(3).max(80),
  description: z.string().min(10).max(2000),
  priceCents: z.number().int().min(0),
  category: z.enum(CATEGORIES as [string, ...string[]]),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const data = createListingSchema.parse(body)
    const item = await createListing({ ...data, sellerId: session.user.id })
    return NextResponse.json(item, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 })
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}