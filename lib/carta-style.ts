import type { SiteConfig } from "@/types";

export const CARTA_FUENTES = [
  { id: "editorial", label: "Editorial", className: "font-editorial" },
  { id: "display", label: "Títulos", className: "font-display" },
  { id: "ui", label: "Moderna", className: "font-ui" },
  { id: "script", label: "Manuscrita", className: "font-script" },
] as const;

export type CartaFuente = (typeof CARTA_FUENTES)[number]["id"];

export const CARTA_GROSORES = [
  { id: 400, label: "Normal" },
  { id: 500, label: "Medio" },
  { id: 600, label: "Seminegrita" },
  { id: 700, label: "Negrita" },
] as const;

const FUENTE_IDS = new Set(CARTA_FUENTES.map((item) => item.id));

export function clampCartaTamano(value: unknown) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 18;
  return Math.min(32, Math.max(14, Math.round(n)));
}

export function clampCartaGrosor(value: unknown) {
  const n = Number(value);
  if (n === 400 || n === 500 || n === 600 || n === 700) return n;
  return 600;
}

export function asCartaFuente(value: unknown): CartaFuente {
  return typeof value === "string" && FUENTE_IDS.has(value as CartaFuente)
    ? (value as CartaFuente)
    : "editorial";
}

export function cartaBodyStyle(config: Pick<SiteConfig, "carta_fuente" | "carta_tamano" | "carta_grosor">) {
  const fuente = asCartaFuente(config.carta_fuente);
  const font = CARTA_FUENTES.find((item) => item.id === fuente) || CARTA_FUENTES[0];
  const size = clampCartaTamano(config.carta_tamano);
  const weight = fuente === "script" ? 400 : clampCartaGrosor(config.carta_grosor);

  return {
    className: font.className,
    style: {
      fontSize: `${size}px`,
      fontWeight: weight,
      lineHeight: 1.65,
    } as const,
  };
}
