import { NextResponse } from "next/server";
import { z } from "zod";
import { getSiteConfig, trackAccess } from "@/lib/data";
import { clientIp, rateLimit, tooManyRequests } from "@/lib/rate-limit";

const schema = z.object({
  slug: z.string().trim().min(1).max(80).regex(/^[a-z0-9-]+$/i),
});

export async function POST(request: Request) {
  const limited = rateLimit(`track:${clientIp(request)}`, 30, 10 * 60 * 1000);
  if (!limited.ok) {
    return tooManyRequests(limited.retryAfter);
  }

  try {
    const body = await request.json();
    const { slug } = schema.parse(body);
    const config = await getSiteConfig();
    const exists = config.enlaces.some((link) => link.slug === slug && link.activo);

    if (!exists) {
      return NextResponse.json({ error: "Enlace no válido" }, { status: 404 });
    }

    const userAgent = request.headers.get("user-agent")?.slice(0, 300) || null;
    await trackAccess(slug, userAgent);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "No se pudo registrar el acceso" }, { status: 400 });
  }
}
