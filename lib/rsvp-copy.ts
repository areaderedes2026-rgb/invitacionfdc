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

export type RsvpCopyKey = keyof typeof DEFAULT_RSVP_COPY;

export const RSVP_COPY_KEYS = Object.keys(DEFAULT_RSVP_COPY) as RsvpCopyKey[];

const RSVP_META_ID = "__rsvp_copy";

export function rsvpText(
  config: Partial<SiteConfig> | undefined,
  key: RsvpCopyKey
) {
  const value = config?.[key]?.trim();
  return value || DEFAULT_RSVP_COPY[key];
}

export function pickRsvpCopy(config: Partial<SiteConfig>): Record<RsvpCopyKey, string> {
  const copy: Record<RsvpCopyKey, string> = { ...DEFAULT_RSVP_COPY };
  for (const key of RSVP_COPY_KEYS) {
    const value = config[key]?.trim();
    if (value) copy[key] = value;
  }
  return copy;
}

export function splitRsvpMeta(galeria: unknown) {
  const items = Array.isArray(galeria) ? (galeria as GalleryItem[]) : [];
  const meta = items.find((item) => item?.id === RSVP_META_ID);
  const rest = items.filter((item) => item?.id !== RSVP_META_ID);
  let packed: Partial<Record<RsvpCopyKey, string>> = {};
  if (typeof meta?.src === "string" && meta.src.trim()) {
    try {
      const parsed = JSON.parse(meta.src) as Record<string, unknown>;
      if (parsed && typeof parsed === "object") {
        for (const key of RSVP_COPY_KEYS) {
          const value = parsed[key];
          if (typeof value === "string" && value.trim()) packed[key] = value;
        }
      }
    } catch {
      packed = {};
    }
  }
  return { galeria: rest, packed };
}

export function mergeRsvpMeta(
  galeria: GalleryItem[],
  copy: Record<RsvpCopyKey, string>
): GalleryItem[] {
  const rest = galeria.filter((item) => item?.id !== RSVP_META_ID);
  return [
    ...rest,
    {
      id: RSVP_META_ID,
      src: JSON.stringify(copy),
      alt: "",
      categoria: "__meta",
    },
  ];
}
