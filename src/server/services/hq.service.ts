import { db } from "@/lib/db"
import { createNotification } from "./notification.service"
import { awardHonor } from "./honor.service"

function slugify(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

export async function createHq(input: {
  name: string
  description?: string
  visibility: "PUBLIC" | "PRIVATE"
  ownerId: string
}) {
  const base = slugify(input.name) || "hq"
  let slug = base
  let suffix = 0
  while (await db.hq.findUnique({ where: { slug } })) {
    suffix++
    slug = base + "-" + suffix
  }

  return db.$transaction(async (tx) => {
    const hq = await tx.hq.create({
      data: { name: input.name, slug, description: input.description, visibility: input.visibility },
    })
    await tx.hqMember.create({ data: { hqId: hq.id, userId: input.ownerId, role: "OWNER" } })
    return hq
  }).then(async (hq) => {
    await awardHonor(input.ownerId, "Organizer")
    return hq
  })
}

export async function listHqs(viewerId?: string) {
  return db.hq.findMany({
    where: viewerId
      ? { OR: [{ visibility: "PUBLIC" }, { members: { some: { userId: viewerId } } }] }
      : { visibility: "PUBLIC" },
    include: { _count: { select: { members: true } } },
    orderBy: { createdAt: "desc" },
  })
}

export async function getHqBySlug(slug: string, viewerId?: string) {
  const hq = await db.hq.findUnique({
    where: { slug },
    include: {
      members: {
        include: { user: { select: { username: true, name: true, image: true } } },
        orderBy: { joinedAt: "asc" },
      },
      buildLinks: {
        include: { build: { include: { owner: { select: { username: true } } } } },
      },
    },
  })

  if (!hq) return null

  const isMember = hq.members.some((m) => m.userId === viewerId)
  if (hq.visibility === "PRIVATE" && !isMember) return null

  return hq
}

export async function addMember(slug: string, actingUserId: string, targetUsername: string, role: "ADMIN" | "MEMBER") {
  const hq = await db.hq.findUnique({ where: { slug } })
  if (!hq) throw new Error("HQ not found")

  const acting = await db.hqMember.findUnique({ where: { hqId_userId: { hqId: hq.id, userId: actingUserId } } })
  if (!acting || (acting.role !== "OWNER" && acting.role !== "ADMIN")) {
    throw new Error("Only owners and admins can add members")
  }

  const target = await db.user.findUnique({ where: { username: targetUsername } })
  if (!target) throw new Error("User not found")

  const result = await db.hqMember.upsert({
    where: { hqId_userId: { hqId: hq.id, userId: target.id } },
    create: { hqId: hq.id, userId: target.id, role },
    update: {},
  })

  await createNotification({
    userId: target.id,
    type: "hq_added",
    message: "You were added to " + hq.name,
    link: "/hq/" + hq.slug,
  })

  return result
}

export async function leaveHq(slug: string, userId: string) {
  const hq = await db.hq.findUnique({ where: { slug } })
  if (!hq) throw new Error("HQ not found")

  const membership = await db.hqMember.findUnique({ where: { hqId_userId: { hqId: hq.id, userId } } })
  if (membership?.role === "OWNER") throw new Error("Owners can't leave their own HQ")

  await db.hqMember.deleteMany({ where: { hqId: hq.id, userId } })
}

export async function linkBuildToHq(slug: string, buildId: string, userId: string) {
  const hq = await db.hq.findUnique({ where: { slug } })
  if (!hq) throw new Error("HQ not found")

  const membership = await db.hqMember.findUnique({ where: { hqId_userId: { hqId: hq.id, userId } } })
  if (!membership) throw new Error("Only members can link Builds to this HQ")

  const build = await db.build.findUnique({ where: { id: buildId } })
  if (!build || build.ownerId !== userId) throw new Error("You can only link your own Builds")

  return db.hqBuild.upsert({
    where: { hqId_buildId: { hqId: hq.id, buildId } },
    create: { hqId: hq.id, buildId },
    update: {},
  })
}

export async function getHqsForUser(userId: string) {
  const memberships = await db.hqMember.findMany({
    where: { userId },
    include: { hq: true },
    orderBy: { joinedAt: "desc" },
  })
  return memberships.map((m) => ({ ...m.hq, role: m.role }))
}

export async function getPublicHqsForUsername(username: string) {
  return db.hq.findMany({
    where: { visibility: "PUBLIC", members: { some: { user: { username } } } },
    orderBy: { createdAt: "desc" },
  })
}