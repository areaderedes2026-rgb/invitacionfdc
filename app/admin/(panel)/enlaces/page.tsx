import { EnlacesEditor } from "@/components/admin/enlaces-editor";
import { getSiteConfig } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminEnlacesPage() {
  const config = await getSiteConfig();
  return <EnlacesEditor initialConfig={config} />;
}
