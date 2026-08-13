import Link from "next/link"
import { listListings, CATEGORIES } from "@/server/services/marketplace.service"

function formatPrice(cents: number) {
  return cents === 0 ? "Free" : "$" + (cents / 100).toFixed(2)
}

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const items = await listListings(category)

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 text-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Marketplace</h1>
        <Link
          href="/marketplace/new"
          className="rounded-md bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-sm transition"
        >
          + List something
        </Link>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        <Link
          href="/marketplace"
          className={"text-xs rounded-full border px-3 py-1 transition " + (!category ? "border-indigo-500 text-indigo-400" : "border-neutral-800 text-neutral-400")}
        >
          All
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            href={"/marketplace?category=" + encodeURIComponent(c)}
            className={"text-xs rounded-full border px-3 py-1 transition " + (category === c ? "border-indigo-500 text-indigo-400" : "border-neutral-800 text-neutral-400")}
          >
            {c}
          </Link>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="text-neutral-500 text-sm">No listings yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {items.map((item) => (
            <Link
              key={item.id}
              href={"/marketplace/" + item.id}
              className="block rounded-md border border-neutral-800 bg-neutral-900 p-4 hover:border-neutral-700 transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{item.title}</span>
                <span className="text-sm text-indigo-400">{formatPrice(item.priceCents)}</span>
              </div>
              <p className="text-neutral-400 text-sm mt-1 line-clamp-2">{item.description}</p>
              <p className="text-neutral-500 text-xs mt-2">
                {item.category} · by {item.seller.name || item.seller.username}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}