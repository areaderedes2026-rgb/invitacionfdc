"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-ocre/20 bg-white p-8 text-center shadow-sm">
      <p className="font-ui text-[0.65rem] uppercase tracking-[0.28em] text-ocre">
        Panel
      </p>
      <h2 className="mt-2 font-display text-2xl tracking-wide text-noche">
        No se pudo cargar esta sección
      </h2>
      <p className="mt-3 text-sm text-sepia">
        Reintentá. Si sigue igual, volvé al resumen y entrá de nuevo.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button type="button" variant="admin" onClick={reset}>
          Reintentar
        </Button>
        <Link
          href="/admin/dashboard"
          className="inline-flex h-11 items-center rounded-md border border-ocre/50 px-6 text-sm text-noche hover:bg-ocre/10"
        >
          Ir al resumen
        </Link>
      </div>
    </div>
  );
}
