import { db } from "@/lib/db"
import { awardHonor } from "./honor.service"
import { createNotification } from "./notification.service"

export async function createEvent(input: {
  hostId: string
  title: string
  description?: string
  startsAt: Date
  endsAt?: Date
  online: boolean
}) {
  const event = await db.event.create({ data: input })
  await awardHonor(input.hostId, "Organizer of Events")
  return event
}

export async function listUpcomingEvents() {
  return db.event.findMany({
    where: { startsAt: { gte: new Date() } },
    include: {
      host: { select: { username: true, name: true } },
      _count: { select: { attendees: true } },
    },
    orderBy: { startsAt: "asc" },
  })
}

export async function getEventById(id: string, viewerId?: string) {
  const event = await db.event.findUnique({
    where: { id },
    include: {
      host: { select: { id: true, username: true, name: true } },
      attendees: { include: { user: { select: { username: true, name: true } } } },
    },
  })

  if (!event) return null

  const isAttending = event.attendees.some((a) => a.userId === viewerId)
  const isHost = viewerId === event.hostId

  return { ...event, isAttending, isHost }
}

export async function rsvpToEvent(eventId: string, userId: string) {
  const result = await db.eventAttendee.upsert({
    where: { eventId_userId: { eventId, userId } },
    create: { eventId, userId },
    update: {},
  })

  const event = await db.event.findUnique({ where: { id: eventId } })
  const user = await db.user.findUnique({ where: { id: userId } })
  if (event && event.hostId !== userId) {
    await createNotification({
      userId: event.hostId,
      type: "event_rsvp",
      message: (user?.name || user?.username || "Someone") + " RSVP'd to " + event.title,
      link: "/event/" + eventId,
    })
  }

  return result
}

export async function cancelRsvp(eventId: string, userId: string) {
  await db.eventAttendee.deleteMany({ where: { eventId, userId } })
}