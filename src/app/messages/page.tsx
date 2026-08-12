import Link from "next/link"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { listConversationsForUser } from "@/server/services/message.service"

export default async function MessagesPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const conversations = await listConversationsForUser(session.user.id)

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 text-white">
      <h1 className="text-2xl font-semibold mb-6">Messages</h1>

      {conversations.length === 0 ? (
        <p className="text-neutral-500 text-sm">
          No conversations yet. Visit a Devcard and click Message to start one.
        </p>
      ) : (
        <div className="space-y-2">
          {conversations.map((c) => (
            <Link
              key={c.id}
              href={"/messages/" + c.id}
              className="flex items-center gap-3 rounded-md border border-neutral-800 bg-neutral-900 p-4 hover:border-neutral-700 transition"
            >
              <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-sm flex-shrink-0">
                {c.otherUser?.username[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium">{c.otherUser?.name || c.otherUser?.username}</p>
                <p className="text-neutral-500 text-xs truncate">
                  {c.lastMessage?.content || "No messages yet"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}