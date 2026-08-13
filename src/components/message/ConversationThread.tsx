"use client"

import { useState, useEffect, useRef } from "react"

type Message = {
  id: string
  content: string
  createdAt: string
  sender: { id: string; username: string; name: string | null }
}

export function ConversationThread({
  conversationId,
  currentUserId,
  initialMessages,
}: {
  conversationId: string
  currentUserId: string
  initialMessages: Message[]
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [content, setContent] = useState("")
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    let ignore = false

    async function poll() {
      const res = await fetch("/api/conversations/" + conversationId + "/messages")
      if (res.ok && !ignore) {
        const data = await res.json()
        setMessages(data.messages)
      }
    }

    const interval = setInterval(poll, 4000)
    return () => {
      ignore = true
      clearInterval(interval)
    }
  }, [conversationId])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return

    setSending(true)
    const res = await fetch("/api/conversations/" + conversationId + "/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    })
    setSending(false)

    if (res.ok) {
      const message = await res.json()
      setMessages((prev) => [...prev, { ...message, sender: { id: currentUserId, username: "", name: "" } }])
      setContent("")
    }
  }

  return (
    <div className="flex flex-col h-[70vh]">
      <div className="flex-1 overflow-y-auto space-y-3 pb-4">
        {messages.map((m) => {
          const isMine = m.sender.id === currentUserId
          return (
            <div key={m.id} className={"flex " + (isMine ? "justify-end" : "justify-start")}>
              <div
                className={
                  "max-w-xs rounded-md px-3 py-2 text-sm " +
                  (isMine ? "bg-indigo-600 text-white" : "bg-neutral-900 border border-neutral-800 text-neutral-200")
                }
              >
                {m.content}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2 pt-3 border-t border-neutral-800">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Type a message..."
        />
        <button
          type="submit"
          disabled={sending || !content.trim()}
          className="rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2 text-sm transition"
        >
          Send
        </button>
      </form>
    </div>
  )
}