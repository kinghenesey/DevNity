import { notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { getCourseById } from "@/server/services/dojo.service"
import { AddLessonForm } from "@/components/dojo/AddLessonForm"
import { EnrollButton } from "@/components/dojo/EnrollButton"
import { LessonItem } from "@/components/dojo/LessonItem"

export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()
  const course = await getCourseById(id, session?.user?.id)
  if (!course) notFound()

  const completedIds = course.enrollment?.completedLessonIds || []

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 text-white">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-semibold">{course.title}</h1>
        {session?.user && !course.isAuthor && !course.enrollment && (
          <EnrollButton courseId={course.id} />
        )}
      </div>
      <p className="text-neutral-500 text-sm mb-6">by {course.author.name || course.author.username}</p>

      {course.description && <p className="text-neutral-300 mb-8">{course.description}</p>}

      <h2 className="text-lg font-semibold mb-3">
        Lessons {course.enrollment && "(" + completedIds.length + "/" + course.lessons.length + " complete)"}
      </h2>

      {course.lessons.length === 0 ? (
        <p className="text-neutral-500 text-sm mb-6">No lessons yet.</p>
      ) : (
        <div className="space-y-2 mb-6">
          {course.lessons.map((lesson) => (
            <LessonItem
              key={lesson.id}
              courseId={course.id}
              lesson={lesson}
              completed={completedIds.includes(lesson.id)}
              canComplete={!!course.enrollment}
            />
          ))}
        </div>
      )}

      {course.isAuthor && <AddLessonForm courseId={course.id} />}
    </div>
  )
}