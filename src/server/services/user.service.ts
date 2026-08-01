import { db } from "@/lib/db"

export async function getDevcardByUsername(username: string) {
  return db.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      handle: true,
      name: true,
      bio: true,
      country: true,
      image: true,
      trustScore: true,
      createdAt: true,
      skills: {
        select: {
          level: true,
          skill: { select: { name: true } },
        },
      },
    },
  })
}