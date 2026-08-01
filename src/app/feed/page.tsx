import { auth } from "@/lib/auth"
import { listFeed } from "@/server/services/post.service"
import { listBuildsForUsername } from "@/server/services/build.service"
import { PostComposer } from "@/components/post/PostComposer"
import { PostList } from "@/components/post/PostList"

export default async function FeedPage() {
  const session = await auth()
  const posts = await listFeed(session?.user?.id)

  const myBuilds = session?.user?.username
    ? await listBuildsForUsername(session.user.username, session.user.id)
    : []

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 text-white">
      <h1 className="text-2xl font-semibold mb-6">Feed</h1>

      {session?.user && (
        <div className="mb-6">
          <PostComposer myBuilds={myBuilds} />
        </div>
      )}

      <PostList posts={posts} />
    </div>
  )
}