import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { getConversation } from "@/server/services/message.service"
import { ConversationThread } from "@/components/message/ConversationThread"

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()
  if (!session?.user) redirect("/login")

  const conversation = await getConversation(id, session.user.id)
  if (!conversation) notFound()

  const otherUser = conversation.participants.find((p) => p.userId !== session.user.id)?.user

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 text-white">
      <h1 className="text-xl font-semibold mb-6">
        {otherUser?.name || otherUser?.username}
      </h1>
      <ConversationThread
        conversationId={id}
        currentUserId={session.user.id}
        initialMessages={conversation.messages}
      />
    </div>
  )
}