import { authenticator } from "otplib"
import QRCode from "qrcode"
import { db } from "@/lib/db"

export async function generateTwoFactorSetup(userId: string, email: string) {
  const secret = authenticator.generateSecret()
  const otpauth = authenticator.keyuri(email, "DevNity", secret)
  const qrDataUrl = await QRCode.toDataURL(otpauth)

  // Stored but not yet "enabled" until confirmed with a valid code
  await db.user.update({ where: { id: userId }, data: { twoFactorSecret: secret } })

  return { qrDataUrl, secret }
}

export async function confirmTwoFactorSetup(userId: string, code: string) {
  const user = await db.user.findUnique({ where: { id: userId } })
  if (!user?.twoFactorSecret) throw new Error("No pending 2FA setup found")

  const valid = authenticator.verify({ token: code, secret: user.twoFactorSecret })
  if (!valid) throw new Error("Invalid code")

  await db.user.update({ where: { id: userId }, data: { twoFactorEnabled: true } })
  return { success: true }
}

export async function disableTwoFactor(userId: string) {
  await db.user.update({
    where: { id: userId },
    data: { twoFactorEnabled: false, twoFactorSecret: null },
  })
}

export function verifyTwoFactorCode(secret: string, code: string) {
  return authenticator.verify({ token: code, secret })
}

export async function logLogin(userId: string, method: string) {
  await db.loginEvent.create({ data: { userId, method } })
}

export async function listLoginHistory(userId: string, take = 20) {
  return db.loginEvent.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take,
  })
}