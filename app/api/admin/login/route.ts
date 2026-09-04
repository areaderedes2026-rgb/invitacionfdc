import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminSession, validateAdminCredentials } from "@/lib/auth";
import { clientIp, rateLimit, tooManyRequests } from "@/lib/rate-limit";

const schema = z.object({
  username: z.string().trim().min(1).max(80),
  password: z.string().min(1).max(200),
});

export async function POST(request: Request) {
  const limited = rateLimit(`login:${clientIp(request)}`, 5, 15 * 60 * 1000);
  if (!limited.ok) {
    return tooManyRequests(limited.retryAfter);
  }

  try {
    const body = await request.json();
    const { username, password } = schema.parse(body);

    if (!validateAdminCredentials(username, password)) {
      return NextResponse.json(
        { error: "Credenciales incorrectas" },
        { status: 401 }
      );
    }

    await createAdminSession();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }
}
