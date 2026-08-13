import { notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { getEventById } from "@/server/services/event.service"
import { RsvpButton } from "@/components/event/RsvpButton"

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()
  const event = await getEventById(id, session?.user?.id)
  if (!event) notFound()

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 text-white">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-semibold">{event.title}</h1>
        {session?.user && !event.isHost && (
          <RsvpButton eventId={event.id} isAttending={event.isAttending} />
        )}
      </div>

      <p className="text-neutral-500 text-sm mb-6">
        {new Date(event.startsAt).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}
        {" · "}
        {event.online ? "Online" : "In-person"}
        {" · Hosted by "}
        {event.host.name || event.host.username}
      </p>

      {event.description && <p className="text-neutral-300 whitespace-pre-wrap mb-8">{event.description}</p>}

      <h2 className="text-lg font-semibold mb-3">Attending ({event.attendees.length})</h2>
      {event.attendees.length === 0 ? (
        <p className="text-neutral-500 text-sm">No one has RSVP&apos;d yet.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {event.attendees.map((a) => (
            <span key={a.id} className="text-xs rounded-md bg-neutral-900 border border-neutral-800 px-2 py-1">
              {a.user.name || a.user.username}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}