import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { listNotifications, getUnreadCount } from "@/server/services/notification.service"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const [notifications, unreadCount] = await Promise.all([
    listNotifications(session.user.id),
    getUnreadCount(session.user.id),
  ])

  return NextResponse.json({ notifications, unreadCount })
}