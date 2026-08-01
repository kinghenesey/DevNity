import Link from "next/link"
import { ReactionButton } from "./ReactionButton"

type PostItem = {
  id: string
  content: string
  createdAt: Date
  author: { username: string; name: string | null; image: string | null }
  build: { name: string; owner: { username: string } } | null
  reactionCount: number
  viewerReacted: boolean
}

export function PostList({ posts, showAuthor = true }: { posts: PostItem[]; showAuthor?: boolean }) {
  if (posts.length === 0) {
    return <p className="text-neutral-500 text-sm">No posts yet.</p>
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <div key={post.id} className="rounded-md border border-neutral-800 bg-neutral-900 p-4">
          {showAuthor && (
            <Link
              href={"/devcard/" + post.author.username}
              className="text-sm font-medium text-white hover:underline"
            >
              {post.author.name || post.author.username}
            </Link>
          )}
          <p className="text-neutral-200 text-sm mt-1 whitespace-pre-wrap">{post.content}</p>

          {post.build && (
            <Link
              href={"/build/" + post.build.owner.username + "/" + post.build.name}
              className="inline-block mt-2 text-xs rounded-md bg-neutral-800 px-2 py-1 text-neutral-300 hover:bg-neutral-700 transition"
            >
              🔗 {post.build.name}
            </Link>
          )}

          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-neutral-500">
              {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
            <ReactionButton
              postId={post.id}
              initialReacted={post.viewerReacted}
              initialCount={post.reactionCount}
            />
          </div>
        </div>
      ))}
    </div>
  )
}