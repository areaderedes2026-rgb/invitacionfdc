import { JsonListEditor } from "@/components/admin/json-list-editor";
import { getSiteConfig } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminEnlacesPage() {
  const config = await getSiteConfig();

  return (
    <div className="space-y-8">
      <JsonListEditor
        initialConfig={config}
        listKey="enlaces"
        title="Enlaces especiales"
        description="Cada slug genera una ruta /invitacion/[slug] con tracking de acceso."
        createItem={() => ({
          id: crypto.randomUUID(),
          slug: "nuevo-enlace",
          etiqueta: "Nueva etiqueta",
          descripcion: "Descripción del enlace protocolar",
          activo: true,
        })}
        fields={[
          { key: "slug", label: "Slug (sin espacios)" },
          { key: "etiqueta", label: "Etiqueta" },
          { key: "descripcion", label: "Descripción", type: "textarea" },
        ]}
      />

      <div className="rounded-2xl border border-gold/20 bg-cream p-5 text-sm text-sepia">
        <p className="font-medium text-ink">Ejemplos activos:</p>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          {config.enlaces.map((link) => (
            <li key={link.id}>
              <a className="text-wine underline" href={`/invitacion/${link.slug}`}>
                /invitacion/{link.slug}
              </a>{" "}
              — {link.etiqueta}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
