import { db } from "@/lib/db"
import { awardHonor } from "./honor.service"

export async function createListing(input: {
  sellerId: string
  title: string
  description: string
  priceCents: number
  category: string
}) {
  const item = await db.marketplaceItem.create({ data: input })
  await awardHonor(input.sellerId, "Seller")
  return item
}

export async function listListings(category?: string) {
  return db.marketplaceItem.findMany({
    where: category ? { category } : undefined,
    include: { seller: { select: { username: true, name: true } } },
    orderBy: { createdAt: "desc" },
  })
}

export async function getListingById(id: string) {
  return db.marketplaceItem.findUnique({
    where: { id },
    include: { seller: { select: { id: true, username: true, name: true } } },
  })
}

export const CATEGORIES = [
  "Templates", "UI Kits", "APIs", "Plugins", "Themes", "Components", "Icons", "Assets", "Courses", "Services",
]