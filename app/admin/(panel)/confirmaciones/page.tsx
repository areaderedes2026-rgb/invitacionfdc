import { ConfirmationsTable } from "@/components/admin/confirmations-table";
import { listAccessLogs, listConfirmations } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminConfirmacionesPage() {
  const [confirmations, accessLogs] = await Promise.all([
    listConfirmations(),
    listAccessLogs(),
  ]);

  return (
    <ConfirmationsTable confirmations={confirmations} accessLogs={accessLogs} />
  );
}
