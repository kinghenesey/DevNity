import { db } from "@/lib/db"
import { createNotification } from "./notification.service"

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export async function createCrew(input: {
  name: string
  description?: string
  visibility: "PUBLIC" | "PRIVATE"
  ownerId: string
}) {
  const base = slugify(input.name) || "crew"
  let slug = base
  let suffix = 0
  while (await db.crew.findUnique({ where: { slug } })) {
    suffix++
    slug = base + "-" + suffix
  }

  return db.$transaction(async (tx) => {
    const crew = await tx.crew.create({
      data: {
        name: input.name,
        slug,
        description: input.description,
        visibility: input.visibility,
      },
    })

    await tx.crewMember.create({
      data: { crewId: crew.id, userId: input.ownerId, role: "OWNER" },
    })

    return crew
  })
}

export async function listCrews(viewerId?: string) {
  return db.crew.findMany({
    where: viewerId
      ? { OR: [{ visibility: "PUBLIC" }, { members: { some: { userId: viewerId } } }] }
      : { visibility: "PUBLIC" },
    include: { _count: { select: { members: true } } },
    orderBy: { createdAt: "desc" },
  })
}

export async function getCrewBySlug(slug: string, viewerId?: string) {
  const crew = await db.crew.findUnique({
    where: { slug },
    include: {
      members: {
        include: { user: { select: { username: true, name: true, image: true } } },
        orderBy: { joinedAt: "asc" },
      },
    },
  })

  if (!crew) return null

  const isMember = crew.members.some((m) => m.userId === viewerId)
  if (crew.visibility === "PRIVATE" && !isMember) return null

  return crew
}

export async function joinCrew(slug: string, userId: string) {
  const crew = await db.crew.findUnique({ where: { slug } })
  if (!crew) throw new Error("Crew not found")

  const result = await db.crewMember.upsert({
    where: { crewId_userId: { crewId: crew.id, userId } },
    create: { crewId: crew.id, userId, role: "MEMBER" },
    update: {},
  })

  const owner = await db.crewMember.findFirst({ where: { crewId: crew.id, role: "OWNER" } })
  if (owner && owner.userId !== userId) {
    const user = await db.user.findUnique({ where: { id: userId } })
    await createNotification({
      userId: owner.userId,
      type: "crew_join",
      message: (user?.name || user?.username || "Someone") + " joined " + crew.name,
      link: "/crew/" + crew.slug,
    })
  }

  return result
}

export async function leaveCrew(slug: string, userId: string) {
  const crew = await db.crew.findUnique({ where: { slug } })
  if (!crew) throw new Error("Crew not found")

  const membership = await db.crewMember.findUnique({
    where: { crewId_userId: { crewId: crew.id, userId } },
  })

  if (membership?.role === "OWNER") {
    throw new Error("Owners can't leave their own Crew")
  }

  await db.crewMember.deleteMany({ where: { crewId: crew.id, userId } })
}

export async function getPublicCrewsForUsername(username: string) {
  return db.crew.findMany({
    where: {
      visibility: "PUBLIC",
      members: { some: { user: { username } } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getCrewsForUser(userId: string) {
  const memberships = await db.crewMember.findMany({
    where: { userId },
    include: { crew: true },
    orderBy: { joinedAt: "desc" },
  })

  return memberships.map((m) => ({ ...m.crew, role: m.role }))
}