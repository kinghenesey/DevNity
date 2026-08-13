import { db } from "@/lib/db"
import { createNotification } from "./notification.service"

type Target = { type: string; id: string; ownerId: string; label: string; link: string }

export async function toggleRecognition(userId: string, target: Target) {
  const existing = await db.recognition.findUnique({
    where: { userId_targetType_targetId: { userId, targetType: target.type, targetId: target.id } },
  })

  if (existing) {
    await db.recognition.delete({ where: { id: existing.id } })
    return { recognized: false }
  }

  await db.recognition.create({
    data: { userId, targetType: target.type, targetId: target.id },
  })

  if (target.ownerId !== userId) {
    const user = await db.user.findUnique({ where: { id: userId } })
    await createNotification({
      userId: target.ownerId,
      type: "recognition",
      message: (user?.name || user?.username || "Someone") + " recognized your " + target.label,
      link: target.link,
    })
  }

  return { recognized: true }
}

export async function getRecognitionInfo(targetType: string, targetId: string, viewerId?: string) {
  const [count, viewerRecord] = await Promise.all([
    db.recognition.count({ where: { targetType, targetId } }),
    viewerId
      ? db.recognition.findUnique({
          where: { userId_targetType_targetId: { userId: viewerId, targetType, targetId } },
        })
      : null,
  ])
  return { count, recognized: !!viewerRecord }
}

export async function getRecognitionInfoBulk(targetType: string, targetIds: string[], viewerId?: string) {
  const [all, viewerRecords] = await Promise.all([
    db.recognition.findMany({ where: { targetType, targetId: { in: targetIds } } }),
    viewerId
      ? db.recognition.findMany({ where: { targetType, targetId: { in: targetIds }, userId: viewerId } })
      : Promise.resolve([]),
  ])

  const counts = new Map<string, number>()
  all.forEach((r) => counts.set(r.targetId, (counts.get(r.targetId) || 0) + 1))
  const recognizedSet = new Set(viewerRecords.map((r) => r.targetId))

  return (id: string) => ({ count: counts.get(id) || 0, recognized: recognizedSet.has(id) })
}