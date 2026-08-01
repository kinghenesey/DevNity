import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { BuildForm } from "@/components/build/BuildForm"

export default async function NewBuildPage() {
  const session = await auth()
  if (!session?.user) {
    redirect("/login")
  }

  return <BuildForm />
}