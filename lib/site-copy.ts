import type { GalleryItem, SiteConfig } from "@/types";

export const DEFAULT_RSVP_COPY = {
  rsvp_etiqueta: "Confirmación de asistencia",
  rsvp_titulo: "Confirmar Presencia",
  rsvp_boton_abrir: "Confirmar asistencia",
  rsvp_boton_enviar: "Confirmar presencia",
  rsvp_boton_enviando: "Enviando...",
  rsvp_boton_si: "Sí, asistiré",
  rsvp_boton_no: "No podré",
  rsvp_pregunta: "¿Confirmará asistencia?",
  rsvp_gracias_titulo: "Gracias",
  rsvp_gracias_texto:
    "Su confirmación ha sido registrada. Será un honor recibirlo/a en Trancas.",
  rsvp_label_nombre: "Nombre",
  rsvp_label_apellido: "Apellido",
  rsvp_label_cargo: "Cargo",
  rsvp_label_institucion: "Institución",
  rsvp_label_telefono: "Teléfono",
  rsvp_label_email: "Correo electrónico",
} as const;

export const DEFAULT_SITE_COPY = {
  cuenta_etiqueta: "Cuenta regresiva",
  cuenta_titulo: "Hasta el inicio del festival",
  cuenta_titulo_fin: "La fiesta ha comenzado",
  mapa_titulo: "Ubicación",
  mapa_boton: "Cómo llegar",
  video_titulo: "Video institucional",
  cronograma_titulo: "",
  encabezado: "Invitación oficial · Edición 2026",
  boton_abrir: "Abrir Invitación",
  evento_label_fecha: "Fecha",
  evento_label_hora: "Hora",
  evento_label_lugar: "Lugar",
  ...DEFAULT_RSVP_COPY,
} as const;

export type RsvpCopyKey = keyof typeof DEFAULT_RSVP_COPY;
export type SiteCopyKey = keyof typeof DEFAULT_SITE_COPY;

export const RSVP_COPY_KEYS = Object.keys(DEFAULT_RSVP_COPY) as RsvpCopyKey[];
export const SITE_COPY_KEYS = Object.keys(DEFAULT_SITE_COPY) as SiteCopyKey[];

const SITE_META_ID = "__site_copy";
const RSVP_META_ID = "__rsvp_copy";
const INFO_MARKER = /^<!--inv-site-copy:([\s\S]*?)-->\r?\n?/;

export function rsvpText(
  config: Partial<SiteConfig> | undefined,
  key: RsvpCopyKey
) {
  const value = config?.[key];
  if (key === "rsvp_etiqueta") {
    return typeof value === "string" ? value.trim() : "";
  }
  const trimmed = value?.trim();
  return trimmed ? trimmed : DEFAULT_RSVP_COPY[key];
}

function parseCopyBlob(value: string) {
  const packed: Partial<Record<SiteCopyKey, string>> = {};
  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object") return packed;
    for (const key of SITE_COPY_KEYS) {
      const item = parsed[key];
      if (typeof item === "string") packed[key] = item;
    }
  } catch {
    return packed;
  }
  return packed;
}

function parseMetaSrc(src: unknown) {
  if (src && typeof src === "object" && !Array.isArray(src)) {
    const obj = src as Record<string, unknown>;
    const packed: Partial<Record<SiteCopyKey, string>> = {};
    for (const key of SITE_COPY_KEYS) {
      if (typeof obj[key] === "string") packed[key] = obj[key];
    }
    if (Object.keys(packed).length) return packed;
  }
  if (typeof src !== "string" || !src.trim()) {
    return {} as Partial<Record<SiteCopyKey, string>>;
  }
  try {
    const parsed = JSON.parse(src) as Record<string, unknown>;
    const packed: Partial<Record<SiteCopyKey, string>> = {};
    if (!parsed || typeof parsed !== "object") return packed;
    for (const key of SITE_COPY_KEYS) {
      const item = parsed[key];
      if (typeof item === "string") packed[key] = item;
    }
    return packed;
  } catch {
    return {};
  }
}

export function pickSiteCopy(config: Partial<SiteConfig>): Record<SiteCopyKey, string> {
  const copy: Record<SiteCopyKey, string> = { ...DEFAULT_SITE_COPY };
  for (const key of SITE_COPY_KEYS) {
    const value = config[key];
    if (typeof value === "string") copy[key] = value;
  }
  return copy;
}

export function splitSiteMeta(galeria: unknown) {
  const items = Array.isArray(galeria) ? (galeria as GalleryItem[]) : [];
  const siteMeta = items.find((item) => item?.id === SITE_META_ID);
  const rsvpMeta = items.find((item) => item?.id === RSVP_META_ID);
  const rest = items.filter(
    (item) => item?.id !== SITE_META_ID && item?.id !== RSVP_META_ID
  );
  const packed = {
    ...parseMetaSrc(rsvpMeta?.src),
    ...parseMetaSrc(siteMeta?.src),
  };
  return { galeria: rest, packed };
}

export function mergeSiteMeta(
  galeria: GalleryItem[],
  copy: Record<SiteCopyKey, string>
): GalleryItem[] {
  const rest = galeria.filter(
    (item) => item?.id !== SITE_META_ID && item?.id !== RSVP_META_ID
  );
  return [
    ...rest,
    {
      id: SITE_META_ID,
      src: JSON.stringify(copy),
      alt: "",
      categoria: "__meta",
    },
  ];
}

export function unpackSiteInfo(value: string) {
  const match = value.match(INFO_MARKER);
  if (!match) return { text: value, packed: {} as Partial<Record<SiteCopyKey, string>> };
  return {
    text: value.slice(match[0].length),
    packed: parseCopyBlob(match[1]),
  };
}

export function packSiteInfo(text: string, copy: Record<SiteCopyKey, string>) {
  const clean = unpackSiteInfo(text).text;
  return `<!--inv-site-copy:${encodeURIComponent(JSON.stringify(copy))}-->\n${clean}`;
}

export function pickRsvpCopy(config: Partial<SiteConfig>) {
  return pickSiteCopy(config);
}

export function splitRsvpMeta(galeria: unknown) {
  return splitSiteMeta(galeria);
}

export function mergeRsvpMeta(
  galeria: GalleryItem[],
  copy: Record<SiteCopyKey, string>
) {
  return mergeSiteMeta(galeria, copy);
}
