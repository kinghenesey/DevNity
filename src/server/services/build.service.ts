import { db } from "@/lib/db"
import type { VisibilityMode } from "@prisma/client"
import { awardHonor } from "./honor.service"

interface CreateBuildInput {
  ownerId: string
  name: string
  description?: string
  visibility: VisibilityMode
  languages: string[]
  readme?: string
}

export async function createBuild(input: CreateBuildInput) {
  const build = await db.build.create({ data: input })
  await awardHonor(input.ownerId, "Builder")
  return build
}

export async function getBuildBySlug(username: string, buildName: string, viewerId?: string) {
  const build = await db.build.findFirst({
    where: { name: buildName, owner: { username } },
  })

  if (!build) return null

  const isOwner = viewerId === build.ownerId
  if (build.visibility === "PRIVATE" && !isOwner) return null

  return build
}

export async function listBuildsForUsername(username: string, viewerId?: string) {
  const owner = await db.user.findUnique({ where: { username } })
  if (!owner) return []

  const isOwner = viewerId === owner.id

  return db.build.findMany({
    where: {
      ownerId: owner.id,
      ...(isOwner ? {} : { visibility: { not: "PRIVATE" } }),
    },
    orderBy: { updatedAt: "desc" },
  })
}