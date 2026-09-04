import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { listAccessLogs, listConfirmations } from "@/lib/data";

export async function GET() {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const [confirmations, accessLogs] = await Promise.all([
    listConfirmations(),
    listAccessLogs(),
  ]);

  return NextResponse.json({ confirmations, accessLogs });
}
