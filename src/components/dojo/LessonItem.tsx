"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function LessonItem({
  courseId,
  lesson,
  completed,
  canComplete,
}: {
  courseId: string
  lesson: { id: string; title: string; content: string }
  completed: boolean
  canComplete: boolean
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleToggle() {
    setLoading(true)
    await fetch("/api/courses/" + courseId + "/lessons/" + lesson.id + "/complete", { method: "POST" })
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="rounded-md border border-neutral-800 bg-neutral-900 p-4">
      <button onClick={() => setOpen((o) => !o)} className="flex items-center justify-between w-full text-left">
        <span className="text-sm font-medium">
          {completed && "✓ "}
          {lesson.title}
        </span>
        <span className="text-xs text-neutral-500">{open ? "Hide" : "Show"}</span>
      </button>

      {open && (
        <div className="mt-3 pt-3 border-t border-neutral-800">
          <p className="text-neutral-300 text-sm whitespace-pre-wrap mb-3">{lesson.content}</p>
          {canComplete && (
            <button
              onClick={handleToggle}
              disabled={loading}
              className="text-xs rounded-md border border-neutral-700 hover:border-neutral-600 text-neutral-300 px-3 py-1 transition"
            >
              {loading ? "..." : completed ? "Mark incomplete" : "Mark complete"}
            </button>
          )}
        </div>
      )}
    </div>
  )
}