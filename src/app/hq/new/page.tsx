import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { HqForm } from "@/components/hq/HqForm"

export default async function NewHqPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  return <HqForm />
}