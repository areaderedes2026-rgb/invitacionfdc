import { jwtVerify } from "jose/jwt/verify";

export const ADMIN_COOKIE = "fnc_admin_session";

export function isProductionEnv() {
  return process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);
}

export function getAuthSecretKey() {
  const secret = process.env.AUTH_SECRET?.trim();

  if (secret && secret.length >= 32) {
    return new TextEncoder().encode(secret);
  }

  if (isProductionEnv()) {
    throw new Error("AUTH_SECRET debe estar definido y tener al menos 32 caracteres.");
  }

  return new TextEncoder().encode(
    process.env.ADMIN_PASSWORD || "dev-secret-change-me"
  );
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getAuthSecretKey());
    return payload.role === "admin";
  } catch {
    return false;
  }
}
