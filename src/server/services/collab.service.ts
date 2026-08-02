import { db } from "@/lib/db"
import { createNotification } from "./notification.service"
import { awardHonor } from "./honor.service"

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
  const result = await db.collabApplication.upsert({
    where: { collabId_userId: { collabId, userId } },
    create: { collabId, userId, message },
    update: { message },
  })

  const collab = await db.collab.findUnique({ where: { id: collabId } })
  const applicant = await db.user.findUnique({ where: { id: userId } })
  if (collab && collab.ownerId !== userId) {
    await createNotification({
      userId: collab.ownerId,
      type: "collab_application",
      message: (applicant?.name || applicant?.username || "Someone") + " applied to " + collab.title,
      link: "/collab/" + collabId,
    })
  }
  await awardHonor(userId, "Collaborator")

  return result
}

export async function listCollabsForUser(userId: string) {
  return db.collab.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
  })
}