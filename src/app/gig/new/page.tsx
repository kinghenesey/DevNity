import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { GigForm } from "@/components/gig/GigForm"
import { listHqsForUser } from "@/server/services/gig.service"

export default async function NewGigPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const hqs = await listHqsForUser(session.user.id)
  return <GigForm hqs={hqs} />
}