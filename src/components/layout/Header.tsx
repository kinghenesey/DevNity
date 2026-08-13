import Link from "next/link"
import Image from "next/image"
import { auth, signOut } from "@/lib/auth"
import { NotificationBell } from "@/components/notification/NotificationBell"

export async function Header() {
  const session = await auth()

  return (
    <header className="border-b border-neutral-800 bg-neutral-950">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="DevNity" width={32} height={32} className="rounded" />
            <span className="text-white font-semibold text-lg">DevNity</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-5 text-sm">
            <Link href="/feed" className="text-neutral-300 hover:text-white transition">
              Feed
            </Link>
            <Link href="/crew" className="text-neutral-300 hover:text-white transition">
              Crews
            </Link>
            <Link href="/collab" className="text-neutral-300 hover:text-white transition">
              Collabs
            </Link>
            <Link href="/hq" className="text-neutral-300 hover:text-white transition">
              HQs
            </Link>
            <Link href="/gig" className="text-neutral-300 hover:text-white transition">
              Gigs
            </Link>
            <Link href="/startup" className="text-neutral-300 hover:text-white transition">
              Startups
            </Link>
            <Link href="/messages" className="text-neutral-300 hover:text-white transition">
              Messages
            </Link>
            {session?.user && (
              <Link href="/build/new" className="text-neutral-300 hover:text-white transition">
                New Build
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {session?.user ? (
            <>
              <NotificationBell />
              <Link
                href={"/devcard/" + session.user.username}
                className="flex items-center gap-2 text-sm text-neutral-300 hover:text-white transition"
              >
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.username || ""}
                    width={28}
                    height={28}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-neutral-800 flex items-center justify-center text-xs">
                    {session.user.username?.[0]?.toUpperCase()}
                  </div>
                )}
                <span>{session.user.username}</span>
              </Link>
              <form
                action={async () => {
                  "use server"
                  await signOut({ redirectTo: "/" })
                }}
              >
                <button className="text-sm text-neutral-500 hover:text-white transition">
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-neutral-300 hover:text-white transition">
                Log in
              </Link>
              <Link
                href="/register"
                className="text-sm rounded-md bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 transition"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}