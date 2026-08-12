import { db } from "@/lib/db"
import { createNotification } from "./notification.service"

export async function getOrCreateConversation(userId: string, otherUsername: string) {
  const other = await db.user.findUnique({ where: { username: otherUsername } })
  if (!other) throw new Error("User not found")
  if (other.id === userId) throw new Error("Can't message yourself")

  const existing = await db.conversation.findFirst({
    where: {
      isGroup: false,
      AND: [
        { participants: { some: { userId } } },
        { participants: { some: { userId: other.id } } },
      ],
    },
  })

  if (existing) return existing

  return db.conversation.create({
    data: {
      participants: {
        create: [{ userId }, { userId: other.id }],
      },
    },
  })
}

export async function listConversationsForUser(userId: string) {
  const conversations = await db.conversation.findMany({
    where: { participants: { some: { userId } } },
    include: {
      participants: {
        include: { user: { select: { id: true, username: true, name: true, image: true } } },
      },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { messages: { _count: "desc" } },
  })

  return conversations
    .map((c) => ({
      id: c.id,
      otherUser: c.participants.find((p) => p.userId !== userId)?.user,
      lastMessage: c.messages[0] || null,
    }))
    .filter((c) => c.otherUser)
    .sort((a, b) => {
      const at = a.lastMessage?.createdAt.getTime() || 0
      const bt = b.lastMessage?.createdAt.getTime() || 0
      return bt - at
    })
}

export async function getConversation(conversationId: string, userId: string) {
  const participant = await db.conversationParticipant.findUnique({
    where: { conversationId_userId: { conversationId, userId } },
  })
  if (!participant) return null

  const conversation = await db.conversation.findUnique({
    where: { id: conversationId },
    include: {
      participants: { include: { user: { select: { id: true, username: true, name: true, image: true } } } },
      messages: {
        orderBy: { createdAt: "asc" },
        include: { sender: { select: { id: true, username: true, name: true } } },
      },
    },
  })

  return conversation
}

export async function sendMessage(conversationId: string, senderId: string, content: string) {
  const participant = await db.conversationParticipant.findUnique({
    where: { conversationId_userId: { conversationId, userId: senderId } },
  })
  if (!participant) throw new Error("Not a participant in this conversation")

  const message = await db.message.create({
    data: { conversationId, senderId, content },
  })

  const others = await db.conversationParticipant.findMany({
    where: { conversationId, userId: { not: senderId } },
  })
  const sender = await db.user.findUnique({ where: { id: senderId } })

  for (const other of others) {
    await createNotification({
      userId: other.userId,
      type: "new_message",
      message: (sender?.name || sender?.username || "Someone") + " sent you a message",
      link: "/messages/" + conversationId,
    })
  }

  return message
}