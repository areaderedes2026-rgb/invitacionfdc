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

export const CARTA_ALINEACIONES = [
  { id: "left", label: "Izquierda" },
  { id: "center", label: "Centrado" },
] as const;

export type CartaAlinear = (typeof CARTA_ALINEACIONES)[number]["id"];

export function asCartaAlinear(value: unknown): CartaAlinear {
  return value === "center" ? "center" : "left";
}

const FONT_STACKS: Record<CartaFuente, string> = {
  editorial: "var(--font-cormorant), Georgia, serif",
  display: 'var(--font-cinzel), "Times New Roman", serif',
  ui: "var(--font-sans), system-ui, sans-serif",
  script: "var(--font-script), cursive",
};

export function cartaBodyStyle(
  config: Pick<SiteConfig, "carta_fuente" | "carta_tamano" | "carta_grosor" | "carta_alinear">
) {
  const fuente = asCartaFuente(config.carta_fuente);
  const font = CARTA_FUENTES.find((item) => item.id === fuente) || CARTA_FUENTES[0];
  const size = clampCartaTamano(config.carta_tamano);
  const weight = fuente === "script" ? 400 : clampCartaGrosor(config.carta_grosor);
  const align = asCartaAlinear(config.carta_alinear);

  return {
    className: font.className,
    style: {
      fontFamily: FONT_STACKS[fuente],
      fontSize: `${size}px`,
      fontWeight: weight,
      lineHeight: 1.65,
      textAlign: align,
    } as const,
  };
}

const CARTA_STYLE_RE = /^<!--inv-carta-style:([a-z]+):(\d+):(\d+)(?::([a-z]+))?-->\r?\n?/;

export function unpackCarta(value: string) {
  const match = value.match(CARTA_STYLE_RE);
  if (!match) {
    return {
      text: value,
      style: null as {
        fuente: CartaFuente;
        tamano: number;
        grosor: number;
        alinear: CartaAlinear;
      } | null,
    };
  }
  return {
    text: value.slice(match[0].length),
    style: {
      fuente: asCartaFuente(match[1]),
      tamano: clampCartaTamano(match[2]),
      grosor: clampCartaGrosor(match[3]),
      alinear: asCartaAlinear(match[4]),
    },
  };
}

export function packCarta(
  text: string,
  fuente: string,
  tamano: number,
  grosor: number,
  alinear: string
) {
  const clean = unpackCarta(text).text;
  return `<!--inv-carta-style:${asCartaFuente(fuente)}:${clampCartaTamano(tamano)}:${clampCartaGrosor(grosor)}:${asCartaAlinear(alinear)}-->\n${clean}`;
}
