import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { CollabForm } from "@/components/collab/CollabForm"

export default async function NewCollabPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  return <CollabForm />
}