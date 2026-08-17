import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { verifyTwoFactorCode, logLogin } from "@/server/services/security.service"
import type { AdapterUser } from "next-auth/adapters"

const baseAdapter = PrismaAdapter(db)

const adapter = {
  ...baseAdapter,
  createUser: async (data: Omit<AdapterUser, "id">) => {
    const base =
      (data.email?.split("@")[0] || data.name || "user")
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, "")
        .slice(0, 20) || "user"

    let username = base
    let suffix = 0
    while (await db.user.findUnique({ where: { username } })) {
      suffix++
      username = `${base}${suffix}`
    }

    return db.user.create({
      data: { ...data, username },
    })
  },
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter,
  session: { strategy: "jwt" },
  providers: [
    GitHub,
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        code: { label: "2FA Code", type: "text" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.passwordHash) return null

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )

        if (!isValid) return null

        if (user.twoFactorEnabled) {
          const code = credentials.code as string | undefined
          if (!code) throw new Error("2FA_REQUIRED")
          if (!user.twoFactorSecret || !(await verifyTwoFactorCode(user.twoFactorSecret, code))) {
            throw new Error("2FA_INVALID")
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = user.username
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.username = token.username as string
      }
      return session
    },
  },
  events: {
    async signIn({ user, account }) {
      if (user.id) {
        await logLogin(user.id, account?.provider || "credentials")
      }
    },
  },
  pages: {
    signIn: "/login",
  },
})