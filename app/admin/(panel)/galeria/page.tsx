import { JsonListEditor } from "@/components/admin/json-list-editor";
import { getSiteConfig } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminGaleriaPage() {
  const config = await getSiteConfig();

  return (
    <JsonListEditor
      initialConfig={config}
      listKey="galeria"
      title="Galería"
      description="Rutas de imagen en /public o URLs externas HTTPS."
      createItem={() => ({
        id: crypto.randomUUID(),
        src: "/images/gallery-caballo.png",
        alt: "Nueva imagen",
        categoria: "Tradición",
      })}
      fields={[
        { key: "src", label: "Ruta o URL de imagen" },
        { key: "alt", label: "Texto alternativo" },
        { key: "categoria", label: "Categoría" },
      ]}
    />
  );
}
