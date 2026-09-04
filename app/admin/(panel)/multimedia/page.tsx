import { ConfigEditor } from "@/components/admin/config-editor";
import { getSiteConfig } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminMultimediaPage() {
  const config = await getSiteConfig();

  return (
    <ConfigEditor
      initialConfig={config}
      title="Multimedia y logos"
      description="URLs de música, video y rutas de logos institucionales."
      fields={[
        { key: "musica_url", label: "URL de música instrumental (mp3/ogg)" },
        { key: "video_url", label: "URL de video (opcional)" },
        { key: "logo_fiesta", label: "Logo Fiesta del Caballo" },
        { key: "logo_municipalidad", label: "Logo Municipalidad de Trancas" },
        { key: "logo_tucuman", label: "Escudo / logo Tucumán" },
      ]}
    />
  );
}
