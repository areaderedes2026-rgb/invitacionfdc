import { NextResponse } from "next/server";
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
    return NextResponse.json({ ok: true, config });
  } catch {
    return NextResponse.json(
      { error: "No se pudo guardar la configuración" },
      { status: 500 }
    );
  }
}
