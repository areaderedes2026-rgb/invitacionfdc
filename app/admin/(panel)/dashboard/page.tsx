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
  const noCount = confirmations.filter((c) => c.asistencia === "no").length;

  const cards = [
    { label: "Confirmaciones", value: confirmations.length, href: "/admin/confirmaciones" },
    { label: "Van a asistir", value: yesCount, href: "/admin/confirmaciones" },
    { label: "No pueden", value: noCount, href: "/admin/confirmaciones" },
    { label: "Accesos a enlaces", value: accessLogs.length, href: "/admin/enlaces" },
  ];

  const shortcuts = [
    { href: "/admin/carta", label: "Inicio, carta y firmas" },
    { href: "/admin/evento", label: "Fecha, lugar, mapa y confirmación" },
    { href: "/admin/cronograma", label: "Actividades por día" },
    { href: "/admin/multimedia", label: "Logo, audio y video" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="font-ui text-[0.65rem] uppercase tracking-[0.28em] text-ocre">
          Panel
        </p>
        <h2 className="mt-1 font-display text-3xl tracking-wide text-noche">Resumen</h2>
        <p className="mt-2 text-sm text-sepia">
          {config.titulo}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-ocre/20 bg-white p-5 shadow-sm transition hover:border-ocre/50"
          >
            <p className="font-ui text-xs uppercase tracking-[0.16em] text-sepia">
              {card.label}
            </p>
            <p className="mt-3 font-display text-4xl text-noche">{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-ocre/20 bg-white p-6 shadow-sm">
        <h3 className="font-display text-xl tracking-wide">Editar la invitación</h3>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {shortcuts.map((item) => (
            <li key={item.href}>
              <Link
                className="text-sm text-noche underline decoration-ocre/40 underline-offset-4 hover:text-ocre"
                href={item.href}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-block font-ui text-xs uppercase tracking-[0.18em] text-ocre"
        >
          Abrir invitación pública
        </a>
      </div>
    </div>
  );
}
