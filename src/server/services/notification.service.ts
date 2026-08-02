import { db } from "@/lib/db"

export async function createNotification(input: {
  userId: string
  type: string
  message: string
  link?: string
}) {
  return db.notification.create({ data: input })
}

export async function listNotifications(userId: string, take = 20) {
  return db.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take,
  })
}

export async function getUnreadCount(userId: string) {
  return db.notification.count({ where: { userId, read: false } })
}

export async function markAsRead(id: string, userId: string) {
  await db.notification.updateMany({ where: { id, userId }, data: { read: true } })
}

export async function markAllAsRead(userId: string) {
  await db.notification.updateMany({ where: { userId, read: false }, data: { read: true } })
}