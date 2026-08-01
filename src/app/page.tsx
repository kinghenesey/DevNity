import { auth, signOut } from "@/lib/auth"

export default async function Home() {
  const session = await auth()

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950">
      {session?.user ? (
        <div className="text-center space-y-4">
          <p className="text-white text-lg">
            Logged in as <span className="font-semibold">{session.user.email}</span>
          </p>
          <p className="text-neutral-400 text-sm">
            username: {session.user.username ?? "—"}
          </p>
          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/" })
            }}
          >
            <button className="rounded-md bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 text-sm">
              Log out
            </button>
          </form>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <p className="text-white text-lg">Not logged in</p>
          <div className="flex gap-3 justify-center">
            <a href="/login" className="rounded-md bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-sm">
              Log in
            </a>
            <a href="/register" className="rounded-md border border-neutral-800 hover:bg-neutral-900 text-white px-4 py-2 text-sm">
              Sign up
            </a>
          </div>
        </div>
      )}
    </div>
  )
}