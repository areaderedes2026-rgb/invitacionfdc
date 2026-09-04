import { timingSafeEqual } from "crypto";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE,
  getAuthSecretKey,
  isProductionEnv,
  verifyAdminToken,
} from "@/lib/auth-core";

export { ADMIN_COOKIE, verifyAdminToken };

export async function createAdminSession() {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getAuthSecretKey());

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: isProductionEnv(),
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  const length = Math.max(leftBuffer.length, rightBuffer.length, 1);
  const a = Buffer.alloc(length);
  const b = Buffer.alloc(length);
  leftBuffer.copy(a);
  rightBuffer.copy(b);
  return timingSafeEqual(a, b) && leftBuffer.length === rightBuffer.length;
}

export function validateAdminCredentials(username: string, password: string) {
  const expectedUser = process.env.ADMIN_USER?.trim();
  const expectedPass = process.env.ADMIN_PASSWORD;

  if (isProductionEnv()) {
    if (!expectedUser || !expectedPass || expectedPass.length < 12) {
      return false;
    }
    return safeEqual(username, expectedUser) && safeEqual(password, expectedPass);
  }

  const devUser = expectedUser || "admin";
  const devPass = expectedPass || "trancas2026";
  return safeEqual(username, devUser) && safeEqual(password, devPass);
}
