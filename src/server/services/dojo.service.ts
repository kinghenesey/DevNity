import { db } from "@/lib/db"
import { awardHonor } from "./honor.service"

export async function createCourse(input: { authorId: string; title: string; description?: string }) {
  const course = await db.course.create({ data: input })
  await awardHonor(input.authorId, "Instructor")
  return course
}

export async function addLesson(courseId: string, authorId: string, title: string, content: string) {
  const course = await db.course.findUnique({ where: { id: courseId } })
  if (!course) throw new Error("Course not found")
  if (course.authorId !== authorId) throw new Error("Only the course author can add lessons")

  const count = await db.lesson.count({ where: { courseId } })

  return db.lesson.create({
    data: { courseId, title, content, order: count },
  })
}

export async function listCourses() {
  return db.course.findMany({
    include: {
      author: { select: { username: true, name: true } },
      _count: { select: { lessons: true, enrollments: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getCourseById(id: string, viewerId?: string) {
  const course = await db.course.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, username: true, name: true } },
      lessons: { orderBy: { order: "asc" } },
    },
  })

  if (!course) return null

  const enrollment = viewerId
    ? await db.enrollment.findUnique({ where: { courseId_userId: { courseId: id, userId: viewerId } } })
    : null

  return { ...course, isAuthor: viewerId === course.authorId, enrollment }
}

export async function enroll(courseId: string, userId: string) {
  const result = await db.enrollment.upsert({
    where: { courseId_userId: { courseId, userId } },
    create: { courseId, userId },
    update: {},
  })
  await awardHonor(userId, "Student")
  return result
}

export async function toggleLessonComplete(courseId: string, userId: string, lessonId: string) {
  const enrollment = await db.enrollment.findUnique({
    where: { courseId_userId: { courseId, userId } },
  })
  if (!enrollment) throw new Error("Not enrolled in this course")

  const has = enrollment.completedLessonIds.includes(lessonId)
  const updated = has
    ? enrollment.completedLessonIds.filter((id) => id !== lessonId)
    : [...enrollment.completedLessonIds, lessonId]

  const result = await db.enrollment.update({
    where: { courseId_userId: { courseId, userId } },
    data: { completedLessonIds: updated },
  })

  const totalLessons = await db.lesson.count({ where: { courseId } })
  if (updated.length === totalLessons && totalLessons > 0) {
    await awardHonor(userId, "Course Completer")
  }

  return result
}