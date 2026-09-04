import { ConfigEditor } from "@/components/admin/config-editor";
import { JsonListEditor } from "@/components/admin/json-list-editor";
import { getSiteConfig } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminCartaPage() {
  const config = await getSiteConfig();

  return (
    <div className="space-y-12">
      <ConfigEditor
        initialConfig={config}
        title="Carta institucional"
        description="Texto editable de la carta diplomática mostrada en la invitación."
        fields={[
          { key: "bienvenida", label: "Texto de bienvenida" },
          { key: "titulo", label: "Título principal" },
          { key: "subtitulo", label: "Subtítulo" },
          { key: "carta", label: "Cuerpo de la carta", type: "textarea" },
        ]}
      />

      <JsonListEditor
        initialConfig={config}
        listKey="firmas"
        title="Firmas"
        description="Autoridades firmantes de la carta."
        createItem={() => ({
          nombre: "Nueva autoridad",
          cargo: "Cargo institucional",
        })}
        fields={[
          { key: "nombre", label: "Nombre" },
          { key: "cargo", label: "Cargo" },
        ]}
      />
    </div>
  );
}
