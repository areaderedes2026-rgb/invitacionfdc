import { CartaEditor } from "@/components/admin/carta-editor";
import { getSiteConfig } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminCartaPage() {
  const config = await getSiteConfig();
  return <CartaEditor initialConfig={config} />;
}
