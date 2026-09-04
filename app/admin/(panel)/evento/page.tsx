import { EventoEditor } from "@/components/admin/evento-editor";
import { getSiteConfig } from "@/lib/data";
import { ensureSiteConfig } from "@/lib/ensure-config";

export const dynamic = "force-dynamic";

export default async function AdminEventoPage() {
  const config = ensureSiteConfig(await getSiteConfig());
  return <EventoEditor initialConfig={config} />;
}
