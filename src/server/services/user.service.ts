import { db } from "@/lib/db"
import { computeCred } from "@/lib/cred"

export async function getDevcardByUsername(username: string) {
  const user = await db.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      handle: true,
      name: true,
      bio: true,
      country: true,
      image: true,
      createdAt: true,
      skills: {
        select: {
          level: true,
          skill: { select: { name: true } },
        },
      },
      builds: {
        select: { updatedAt: true, statsSource: true },
      },
    },
  })

  if (!user) return null

  const { builds, ...rest } = user
  const cred = computeCred({ createdAt: user.createdAt, builds })

  return { ...rest, cred }
}