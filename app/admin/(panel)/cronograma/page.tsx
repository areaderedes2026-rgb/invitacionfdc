import { CronogramaEditor } from "@/components/admin/cronograma-editor";
import { getSiteConfig } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminCronogramaPage() {
  const config = await getSiteConfig();

  return <CronogramaEditor initialConfig={config} />;
}
