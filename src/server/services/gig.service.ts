import { db } from "@/lib/db"
import { awardHonor } from "./honor.service"
import { createNotification } from "./notification.service"

export async function createGig(input: {
  title: string
  description: string
  location?: string
  remote: boolean
  hqId?: string
  postedById: string
}) {
  const gig = await db.job.create({ data: input })
  await awardHonor(input.postedById, "Recruiter")
  return gig
}

export async function listOpenGigs() {
  return db.job.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      postedBy: { select: { username: true, name: true } },
      hq: { select: { name: true, slug: true } },
    },
  })
}

export async function getGigById(id: string, viewerId?: string) {
  const gig = await db.job.findUnique({
    where: { id },
    include: {
      postedBy: { select: { id: true, username: true, name: true } },
      hq: { select: { name: true, slug: true } },
      applications: {
        include: { user: { select: { username: true, name: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  })

  if (!gig) return null

  const isOwner = viewerId === gig.postedById
  const viewerApplication = gig.applications.find((a) => a.userId === viewerId)

  return { ...gig, isOwner, viewerApplication }
}

export async function applyToGig(gigId: string, userId: string, message: string) {
  const result = await db.jobApplication.upsert({
    where: { jobId_userId: { jobId: gigId, userId } },
    create: { jobId: gigId, userId, message },
    update: { message },
  })

  const gig = await db.job.findUnique({ where: { id: gigId } })
  const applicant = await db.user.findUnique({ where: { id: userId } })
  if (gig && gig.postedById !== userId) {
    await createNotification({
      userId: gig.postedById,
      type: "gig_application",
      message: (applicant?.name || applicant?.username || "Someone") + " applied to " + gig.title,
      link: "/gig/" + gigId,
    })
  }

  return result
}

export async function listHqsForUser(userId: string) {
  const memberships = await db.hqMember.findMany({
    where: { userId, role: { in: ["OWNER", "ADMIN"] } },
    include: { hq: { select: { id: true, name: true, slug: true } } },
  })
  return memberships.map((m) => m.hq)
}