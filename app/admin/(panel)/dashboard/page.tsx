import Link from "next/link";
import { getSiteConfig, listAccessLogs, listConfirmations } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [config, confirmations, accessLogs] = await Promise.all([
    getSiteConfig(),
    listConfirmations(),
    listAccessLogs(),
  ]);

  const yesCount = confirmations.filter((c) => c.asistencia === "si").length;

  const cards = [
    { label: "Confirmaciones", value: confirmations.length, href: "/admin/confirmaciones" },
    { label: "Asistencias Sí", value: yesCount, href: "/admin/confirmaciones" },
    { label: "Accesos a enlaces", value: accessLogs.length, href: "/admin/enlaces" },
    { label: "Eventos en cronograma", value: config.cronograma.length, href: "/admin/cronograma" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl tracking-wide">Resumen</h2>
        <p className="mt-2 text-sm text-sepia">
          {config.titulo} · panel de gestión de contenido
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-gold/20 bg-cream p-5 transition hover:border-gold/50"
          >
            <p className="text-sm text-sepia">{card.label}</p>
            <p className="mt-2 font-display text-4xl text-wine">{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-gold/20 bg-cream p-6">
        <h3 className="font-display text-xl">Accesos rápidos</h3>
        <ul className="mt-4 grid gap-2 text-sm md:grid-cols-2">
          <li>
            <Link className="text-wine underline" href="/admin/carta">
              Editar carta institucional
            </Link>
          </li>
          <li>
            <Link className="text-wine underline" href="/admin/evento">
              Editar fecha, horarios y ubicación
            </Link>
          </li>
          <li>
            <Link className="text-wine underline" href="/admin/galeria">
              Administrar galería
            </Link>
          </li>
          <li>
            <Link className="text-wine underline" href="/" target="_blank">
              Ver invitación pública
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
