import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { CrewForm } from "@/components/crew/CrewForm"

export default async function NewCrewPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  return <CrewForm />
}