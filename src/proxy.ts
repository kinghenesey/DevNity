import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export const proxy = auth((req) => {
  const session = req.auth
  const pathname = req.nextUrl.pathname

  const allowed =
    pathname.startsWith("/verify-2fa") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/security/2fa/verify-session")

  if (session?.user?.needs2FA && !allowed) {
    return NextResponse.redirect(new URL("/verify-2fa", req.url))
  }
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo.png).*)"],
}