import { notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { getListingById } from "@/server/services/marketplace.service"
import { MessageButton } from "@/components/message/MessageButton"

function formatPrice(cents: number) {
  return cents === 0 ? "Free" : "$" + (cents / 100).toFixed(2)
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()
  const item = await getListingById(id)
  if (!item) notFound()

  const isOwner = session?.user?.id === item.sellerId

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 text-white">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-semibold">{item.title}</h1>
        <span className="text-lg text-indigo-400">{formatPrice(item.priceCents)}</span>
      </div>
      <p className="text-neutral-500 text-sm mb-6">
        {item.category} · by {item.seller.name || item.seller.username}
      </p>

      <p className="text-neutral-300 whitespace-pre-wrap mb-8">{item.description}</p>

      {!isOwner && session?.user && (
        <div>
          <MessageButton username={item.seller.username} />
          <p className="text-neutral-500 text-xs mt-2">
            Contact the seller to arrange payment and delivery.
          </p>
        </div>
      )}
      {!session?.user && <p className="text-neutral-500 text-sm">Log in to contact the seller.</p>}
    </div>
  )
}