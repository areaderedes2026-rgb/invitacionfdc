import { NextResponse } from "next/server";
import { z } from "zod";
import { createConfirmation } from "@/lib/data";
import { clientIp, rateLimit, tooManyRequests } from "@/lib/rate-limit";

const schema = z.object({
  nombre: z.string().trim().min(2).max(80),
  apellido: z.string().trim().min(2).max(80),
  cargo: z.string().trim().min(2).max(120),
  institucion: z.string().trim().min(2).max(160),
  telefono: z.string().trim().min(6).max(30),
  email: z.string().trim().email().max(120),
  asistencia: z.enum(["si", "no"]),
  enlace_origen: z.string().trim().max(80).nullable().optional(),
});

export async function POST(request: Request) {
  const limited = rateLimit(`rsvp:${clientIp(request)}`, 6, 10 * 60 * 1000);
  if (!limited.ok) {
    return tooManyRequests(limited.retryAfter);
  }

  try {
    const body = await request.json();
    const parsed = schema.parse(body);
    await createConfirmation(parsed);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    return NextResponse.json(
      { error: "No se pudo guardar la confirmación" },
      { status: 500 }
    );
  }
}
