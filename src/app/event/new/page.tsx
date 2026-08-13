import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { EventForm } from "@/components/event/EventForm"

export default async function NewEventPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  return <EventForm />
}