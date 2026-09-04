import { DEFAULT_CONFIG } from "@/lib/default-content";
import type { SiteConfig } from "@/types";

export function ensureSiteConfig(
  config: Partial<SiteConfig> | null | undefined
): SiteConfig {
  const raw = config || {};
  return {
    ...DEFAULT_CONFIG,
    ...raw,
    firmas: Array.isArray(raw.firmas) && raw.firmas.length
      ? raw.firmas
      : DEFAULT_CONFIG.firmas,
    cronograma: Array.isArray(raw.cronograma)
      ? raw.cronograma
      : DEFAULT_CONFIG.cronograma,
    galeria: Array.isArray(raw.galeria) ? raw.galeria : DEFAULT_CONFIG.galeria,
    enlaces: Array.isArray(raw.enlaces) ? raw.enlaces : DEFAULT_CONFIG.enlaces,
    carta_tamano: Number(raw.carta_tamano) || DEFAULT_CONFIG.carta_tamano,
    carta_grosor: Number(raw.carta_grosor) || DEFAULT_CONFIG.carta_grosor,
    evento_overlay:
      typeof raw.evento_overlay === "number"
        ? raw.evento_overlay
        : DEFAULT_CONFIG.evento_overlay,
    cronograma_overlay:
      typeof raw.cronograma_overlay === "number"
        ? raw.cronograma_overlay
        : DEFAULT_CONFIG.cronograma_overlay,
  };
}
