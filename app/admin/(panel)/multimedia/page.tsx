import { MultimediaEditor } from "@/components/admin/multimedia-editor";
import { getSiteConfig } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminMultimediaPage() {
  const config = await getSiteConfig();
  return <MultimediaEditor initialConfig={config} />;
}
