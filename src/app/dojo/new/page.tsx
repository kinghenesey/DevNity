import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { CourseForm } from "@/components/dojo/CourseForm"

export default async function NewCoursePage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  return <CourseForm />
}