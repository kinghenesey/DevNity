import { db } from "@/lib/db"
import { createNotification } from "./notification.service"

const HONOR_DEFINITIONS: Record<string, string> = {
  "Builder": "Created your first Build",
  "Community Founder": "Started your first Crew",
  "Team Player": "Joined your first Crew",
  "Collaborator": "Applied to your first Collab",
  "Organizer": "Started your first HQ",
}

async function getOrCreateHonor(name: string) {
  return db.honor.upsert({
    where: { name },
    create: { name, description: HONOR_DEFINITIONS[name] || name },
    update: {},
  })
}

export async function awardHonor(userId: string, honorName: string) {
  const honor = await getOrCreateHonor(honorName)

  const existing = await db.userHonor.findUnique({
    where: { userId_honorId: { userId, honorId: honor.id } },
  })
  if (existing) return existing // idempotent — no duplicate awards, no duplicate notifications

  const awarded = await db.userHonor.create({ data: { userId, honorId: honor.id } })

  await createNotification({
    userId,
    type: "honor_awarded",
    message: "You earned the \"" + honorName + "\" honor",
    link: "/devcard/" + (await db.user.findUnique({ where: { id: userId } }))?.username,
  })

  return awarded
}

export async function listHonorsForUser(userId: string) {
  const records = await db.userHonor.findMany({
    where: { userId },
    include: { honor: true },
    orderBy: { awardedAt: "asc" },
  })
  return records.map((r) => ({ name: r.honor.name, description: r.honor.description, awardedAt: r.awardedAt }))
}