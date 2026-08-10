import { db } from "@/lib/db"
import { awardHonor } from "./honor.service"
import { createNotification } from "./notification.service"

function slugify(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

export async function createStartup(input: { name: string; pitch: string; founderId: string }) {
  const base = slugify(input.name) || "startup"
  let slug = base
  let suffix = 0
  while (await db.startup.findUnique({ where: { slug } })) {
    suffix++
    slug = base + "-" + suffix
  }

  const startup = await db.startup.create({
    data: { name: input.name, pitch: input.pitch, founderId: input.founderId, slug },
  })

  await awardHonor(input.founderId, "Founder")
  return startup
}

export async function listStartups() {
  return db.startup.findMany({
    include: {
      founder: { select: { username: true, name: true } },
      _count: { select: { cofounderReqs: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getStartupBySlug(slug: string, viewerId?: string) {
  const startup = await db.startup.findUnique({
    where: { slug },
    include: {
      founder: { select: { id: true, username: true, name: true } },
      cofounderReqs: true,
    },
  })

  if (!startup) return null

  return { ...startup, isFounder: viewerId === startup.founderId }
}

export async function addCofounderRequest(slug: string, founderId: string, roleNeeded: string, message: string) {
  const startup = await db.startup.findUnique({ where: { slug } })
  if (!startup) throw new Error("Startup not found")
  if (startup.founderId !== founderId) throw new Error("Only the founder can post co-founder requests")

  return db.cofounderRequest.create({
    data: { startupId: startup.id, roleNeeded, message },
  })
}

export async function expressInterest(requestId: string, userId: string) {
  const request = await db.cofounderRequest.findUnique({
    where: { id: requestId },
    include: { startup: true },
  })
  if (!request) throw new Error("Request not found")

  const interested = await db.user.findUnique({ where: { id: userId } })

  await createNotification({
    userId: request.startup.founderId,
    type: "cofounder_interest",
    message: (interested?.name || interested?.username || "Someone") +
      " is interested in your \"" + request.roleNeeded + "\" role for " + request.startup.name,
    link: "/startup/" + request.startup.slug,
  })

  return { success: true }
}