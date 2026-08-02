"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"

type Notification = {
  id: string
  type: string
  message: string
  link: string | null
  read: boolean
  createdAt: string
}

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  async function fetchNotifications() {
    const res = await fetch("/api/notifications")
    if (res.ok) {
      const data = await res.json()
      setNotifications(data.notifications)
      setUnreadCount(data.unreadCount)
    }
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  async function handleOpen() {
    setOpen((o) => !o)
    if (unreadCount > 0) {
      await fetch("/api/notifications/read-all", { method: "POST" })
      setUnreadCount(0)
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    }
  }

  return (
    <div ref={ref} className="relative">
      <button onClick={handleOpen} className="relative text-neutral-300 hover:text-white transition">
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-md border border-neutral-800 bg-neutral-900 shadow-lg z-50">
          {notifications.length === 0 ? (
            <p className="text-sm text-neutral-500 p-4">No notifications yet.</p>
          ) : (
            notifications.map((n) => (
              <Link
                key={n.id}
                href={n.link || "#"}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 border-b border-neutral-800 last:border-0 hover:bg-neutral-800 transition"
              >
                <p className="text-sm text-neutral-200">{n.message}</p>
                <p className="text-xs text-neutral-500 mt-1">
                  {new Date(n.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  )
}