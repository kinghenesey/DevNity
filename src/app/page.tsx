import Link from "next/link"
import { auth } from "@/lib/auth"
import { listBuildsForUsername } from "@/server/services/build.service"

export default async function HomePage() {
  const session = await auth()

  if (session?.user?.username) {
    const builds = await listBuildsForUsername(session.user.username, session.user.id)

    return (
      <div className="max-w-3xl mx-auto py-10 px-4 text-white">
        <h1 className="text-2xl font-semibold mb-1">
          Welcome back, {session.user.name?.split(" ")[0] || session.user.username}
        </h1>
        <p className="text-neutral-400 mb-8">What are you building today?</p>

        <div className="flex gap-3 mb-10">
          <Link
            href="/build/new"
            className="rounded-md bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-sm transition"
          >
            + New Build
          </Link>
          <Link
            href={"/devcard/" + session.user.username}
            className="rounded-md border border-neutral-800 hover:bg-neutral-900 text-white px-4 py-2 text-sm transition"
          >
            View your Devcard
          </Link>
        </div>

        <h2 className="text-lg font-semibold mb-3">Your Builds</h2>
        {builds.length === 0 ? (
          <p className="text-neutral-500 text-sm">
            You haven&apos;t created any Builds yet.{" "}
            <Link href="/build/new" className="text-indigo-400 hover:underline">
              Start one
            </Link>
            .
          </p>
        ) : (
          <div className="space-y-3">
            {builds.map((build) => (
              <Link
                key={build.id}
                href={"/build/" + session.user!.username + "/" + build.name}
                className="block rounded-md border border-neutral-800 bg-neutral-900 p-4 hover:border-neutral-700 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{build.name}</span>
                  <span className="text-xs rounded-full border border-neutral-700 px-2 py-0.5 text-neutral-400">
                    {build.visibility}
                  </span>
                </div>
                {build.description && (
                  <p className="text-neutral-400 text-sm mt-1">{build.description}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-20 px-4 text-center text-white">
      <h1 className="text-4xl font-semibold mb-4">Build. Collaborate. Grow.</h1>
      <p className="text-neutral-400 text-lg mb-10">
        One ecosystem for developers — your Devcard, your Builds, your Cred, all in one place.
      </p>
      <div className="flex gap-3 justify-center">
        <Link
          href="/register"
          className="rounded-md bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 font-medium transition"
        >
          Get started
        </Link>
        <Link
          href="/login"
          className="rounded-md border border-neutral-800 hover:bg-neutral-900 text-white px-5 py-2.5 font-medium transition"
        >
          Log in
        </Link>
      </div>
    </div>
  )
}