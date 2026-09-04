import { EventoEditor } from "@/components/admin/evento-editor";
import { getSiteConfig } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminEventoPage() {
  const config = await getSiteConfig();

  return <EventoEditor initialConfig={config} />;
}
