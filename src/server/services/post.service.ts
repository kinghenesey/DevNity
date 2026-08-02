import { db } from "@/lib/db"
import { createNotification } from "./notification.service"

export async function createPost(input: { authorId: string; content: string; buildId?: string }) {
  return db.post.create({ data: input })
}

export async function listFeed(viewerId?: string, take = 30) {
  const posts = await db.post.findMany({
    take,
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { username: true, name: true, image: true } },
      build: { select: { name: true, owner: { select: { username: true } } } },
      reactions: { select: { userId: true } },
    },
  })

  return posts.map((p) => ({
    ...p,
    reactionCount: p.reactions.length,
    viewerReacted: viewerId ? p.reactions.some((r) => r.userId === viewerId) : false,
  }))
}

export async function listPostsForUsername(username: string, viewerId?: string, take = 10) {
  const posts = await db.post.findMany({
    where: { author: { username } },
    take,
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { username: true, name: true, image: true } },
      build: { select: { name: true, owner: { select: { username: true } } } },
      reactions: { select: { userId: true } },
    },
  })

  return posts.map((p) => ({
    ...p,
    reactionCount: p.reactions.length,
    viewerReacted: viewerId ? p.reactions.some((r) => r.userId === viewerId) : false,
  }))
}

export async function toggleReaction(postId: string, userId: string) {
  const existing = await db.postReaction.findUnique({
    where: { postId_userId: { postId, userId } },
  })

  if (existing) {
    await db.postReaction.delete({ where: { id: existing.id } })
    return { reacted: false }
  }

  await db.postReaction.create({ data: { postId, userId } })

  const post = await db.post.findUnique({ where: { id: postId } })
  const reactor = await db.user.findUnique({ where: { id: userId } })
  if (post && post.authorId !== userId) {
    await createNotification({
      userId: post.authorId,
      type: "post_reaction",
      message: (reactor?.name || reactor?.username || "Someone") + " reacted to your post",
      link: "/feed",
    })
  }

  return { reacted: true }
}