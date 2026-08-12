import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { StartupForm } from "@/components/startup/StartupForm"

export default async function NewStartupPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  return <StartupForm />
}