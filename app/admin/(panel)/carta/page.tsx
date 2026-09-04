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
        title="Inicio y carta"
        description="Portada (antes de abrir), título del pie y el texto de la carta institucional."
        fields={[
          { key: "bienvenida", label: "Saludo de la portada" },
          { key: "titulo", label: "Título (aparece en el pie)" },
          { key: "subtitulo", label: "Subtítulo (portada, carta y pie)" },
          { key: "carta", label: "Cuerpo de la carta", type: "textarea" },
        ]}
      />

      <JsonListEditor
        initialConfig={config}
        listKey="firmas"
        title="Firmas"
        description="Se muestran al pie de la carta, en dos columnas."
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
