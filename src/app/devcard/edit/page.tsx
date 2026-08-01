import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { getDevcardByUsername } from "@/server/services/user.service"
import { EditDevcardForm } from "@/components/devcard/EditDevcardForm"

export default async function EditDevcardPage() {
  const session = await auth()
  if (!session?.user?.username) redirect("/login")

  const user = await getDevcardByUsername(session.user.username)
  if (!user) redirect("/login")

  return (
    <EditDevcardForm
      username={user.username}
      initialBio={user.bio || ""}
      initialHandle={user.handle || ""}
      initialCountry={user.country || ""}
      initialImage={user.image || ""}
      initialSkills={user.skills.map((s) => s.skill.name).join(", ")}
    />
  )
}