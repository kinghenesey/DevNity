import Link from "next/link"
import { listUpcomingEvents } from "@/server/services/event.service"

export default async function EventListPage() {
  const events = await listUpcomingEvents()

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 text-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Events</h1>
        <Link
          href="/event/new"
          className="rounded-md bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-sm transition"
        >
          + Host an Event
        </Link>
      </div>

      {events.length === 0 ? (
        <p className="text-neutral-500 text-sm">No upcoming Events yet.</p>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <Link
              key={event.id}
              href={"/event/" + event.id}
              className="block rounded-md border border-neutral-800 bg-neutral-900 p-4 hover:border-neutral-700 transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{event.title}</span>
                <span className="text-xs rounded-full border border-neutral-700 px-2 py-0.5 text-neutral-400">
                  {event.online ? "Online" : "In-person"}
                </span>
              </div>
              <p className="text-neutral-400 text-sm mt-1">
                {new Date(event.startsAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
              </p>
              <p className="text-neutral-500 text-xs mt-2">
                Hosted by {event.host.name || event.host.username} · {event._count.attendees} attending
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}