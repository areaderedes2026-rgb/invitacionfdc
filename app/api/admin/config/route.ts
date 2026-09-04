import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/lib/auth";
import { getSiteConfig, saveSiteConfig } from "@/lib/data";
import type { SiteConfig } from "@/types";

export async function GET() {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const config = await getSiteConfig();
  return NextResponse.json({ config });
}

export async function PUT(request: Request) {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as SiteConfig;
    const config = await saveSiteConfig(body);
    revalidatePath("/");
    revalidatePath("/invitacion", "layout");
    return NextResponse.json({ ok: true, config });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    return NextResponse.json(
      {
        error: /timestamp|date/i.test(message)
          ? "Revisá las fechas. El fin puede quedar vacío."
          : "No se pudo guardar la configuración",
      },
      { status: 500 }
    );
  }
}
