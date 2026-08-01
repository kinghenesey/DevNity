import { db } from "@/lib/db"

export async function createCollab(input: {
  title: string
  description: string
  rolesNeeded: string[]
  budget: "VOLUNTEER" | "REVENUE_SHARE" | "PAID"
  deadline?: Date
  experience?: string
  ownerId: string
}) {
  return db.collab.create({ data: input })
}

export async function listOpenCollabs() {
  return db.collab.findMany({
    where: { status: "OPEN" },
    include: { owner: { select: { username: true, name: true } } },
    orderBy: { createdAt: "desc" },
  })
}

export async function getCollabById(id: string, viewerId?: string) {
  const collab = await db.collab.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, username: true, name: true } },
      applications: {
        include: { user: { select: { username: true, name: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  })

  if (!collab) return null

  const isOwner = viewerId === collab.ownerId
  const viewerApplication = collab.applications.find((a) => a.userId === viewerId)

  return { ...collab, isOwner, viewerApplication }
}

export async function applyToCollab(collabId: string, userId: string, message: string) {
  return db.collabApplication.upsert({
    where: { collabId_userId: { collabId, userId } },
    create: { collabId, userId, message },
    update: { message },
  })
}

export async function listCollabsForUser(userId: string) {
  return db.collab.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
  })
}