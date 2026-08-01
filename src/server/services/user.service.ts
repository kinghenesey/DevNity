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

export async function updateDevcard(
  userId: string,
  data: { bio?: string; handle?: string; country?: string; image?: string; skills: string[] }
) {
  const skillNames = data.skills.map((s) => s.trim()).filter(Boolean)

  await db.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: {
        bio: data.bio?.trim() || null,
        handle: data.handle?.trim() || null,
        country: data.country?.trim() || null,
        image: data.image?.trim() || null,
      },
    })

    const skillRecords = await Promise.all(
      skillNames.map((name) =>
        tx.skill.upsert({ where: { name }, create: { name }, update: {} })
      )
    )

    await tx.userSkill.deleteMany({
      where: { userId, skillId: { notIn: skillRecords.map((s) => s.id) } },
    })

    for (const skill of skillRecords) {
      await tx.userSkill.upsert({
        where: { userId_skillId: { userId, skillId: skill.id } },
        create: { userId, skillId: skill.id },
        update: {},
      })
    }
  })
}