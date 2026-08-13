import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { AskForm } from "@/components/qa/AskForm"

export default async function AskPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  return <AskForm />
}