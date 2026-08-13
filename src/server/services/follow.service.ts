import { db } from "@/lib/db"
import { awardHonor } from "./honor.service"
import { createNotification } from "./notification.service"

export async function followUser(followerId: string, targetUsername: string) {
  const target = await db.user.findUnique({ where: { username: targetUsername } })
  if (!target) throw new Error("User not found")
  if (target.id === followerId) throw new Error("Can't follow yourself")

  const result = await db.follow.upsert({
    where: { followerId_followingId: { followerId, followingId: target.id } },
    create: { followerId, followingId: target.id },
    update: {},
  })

  await awardHonor(followerId, "Connector")

  const follower = await db.user.findUnique({ where: { id: followerId } })
  await createNotification({
    userId: target.id,
    type: "new_follower",
    message: (follower?.name || follower?.username || "Someone") + " followed you",
    link: "/devcard/" + follower?.username,
  })

  return result
}

export async function unfollowUser(followerId: string, targetUsername: string) {
  const target = await db.user.findUnique({ where: { username: targetUsername } })
  if (!target) throw new Error("User not found")

  await db.follow.deleteMany({ where: { followerId, followingId: target.id } })
}

export async function getFollowStatus(viewerId: string | undefined, targetUserId: string) {
  if (!viewerId) return { isFollowing: false, isConnection: false }

  const [following, followedBack] = await Promise.all([
    db.follow.findUnique({ where: { followerId_followingId: { followerId: viewerId, followingId: targetUserId } } }),
    db.follow.findUnique({ where: { followerId_followingId: { followerId: targetUserId, followingId: viewerId } } }),
  ])

  return { isFollowing: !!following, isConnection: !!following && !!followedBack }
}

export async function getFollowCounts(userId: string) {
  const [followers, following] = await Promise.all([
    db.follow.count({ where: { followingId: userId } }),
    db.follow.count({ where: { followerId: userId } }),
  ])
  return { followers, following }
}

export async function listFollowers(username: string) {
  const user = await db.user.findUnique({ where: { username } })
  if (!user) return []
  const rows = await db.follow.findMany({
    where: { followingId: user.id },
    include: { follower: { select: { username: true, name: true, image: true } } },
    orderBy: { createdAt: "desc" },
  })
  return rows.map((r) => r.follower)
}

export async function listFollowing(username: string) {
  const user = await db.user.findUnique({ where: { username } })
  if (!user) return []
  const rows = await db.follow.findMany({
    where: { followerId: user.id },
    include: { following: { select: { username: true, name: true, image: true } } },
    orderBy: { createdAt: "desc" },
  })
  return rows.map((r) => r.following)
}