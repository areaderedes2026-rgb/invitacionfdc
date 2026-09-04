import { promises as fs } from "fs";
import path from "path";
import { DEFAULT_CONFIG } from "@/lib/default-content";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { AccessLog, Confirmation, RsvpPayload, SiteConfig } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");
const CONFIG_FILE = path.join(DATA_DIR, "config.json");
const CONFIRMATIONS_FILE = path.join(DATA_DIR, "confirmations.json");
const ACCESS_FILE = path.join(DATA_DIR, "access-logs.json");

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJsonFile<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJsonFile<T>(file: string, value: T) {
  if (process.env.VERCEL) {
    throw new Error(
      "En Vercel la persistencia local no está disponible. Configure SUPABASE_SERVICE_ROLE_KEY."
    );
  }
  await ensureDataDir();
  await fs.writeFile(file, JSON.stringify(value, null, 2), "utf8");
}

function asArray<T>(value: unknown, fallback: T[]): T[] {
  return Array.isArray(value) ? (value as T[]) : fallback;
}

function asString(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

function asTimestamp(value: unknown, fallback = "") {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }
  if (typeof value === "string" && value.trim()) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return value;
  }
  return fallback;
}

function toDbTimestamp(value: string) {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return null;
  return trimmed;
}

function asNumber(value: unknown, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeConfig(row: Record<string, unknown> | Partial<SiteConfig> | null): SiteConfig {
  const raw = (row || {}) as Record<string, unknown>;
  return {
    ...DEFAULT_CONFIG,
    carta: asString(raw.carta, DEFAULT_CONFIG.carta),
    fecha_evento: asTimestamp(raw.fecha_evento, DEFAULT_CONFIG.fecha_evento),
    fecha_fin: asTimestamp(raw.fecha_fin, ""),
    horarios: asString(raw.horarios, DEFAULT_CONFIG.horarios),
    ubicacion: asString(raw.ubicacion, DEFAULT_CONFIG.ubicacion),
    ubicacion_detalle: asString(raw.ubicacion_detalle, DEFAULT_CONFIG.ubicacion_detalle),
    mapa_url: asString(raw.mapa_url, DEFAULT_CONFIG.mapa_url),
    mapa_embed: asString(raw.mapa_embed, DEFAULT_CONFIG.mapa_embed),
    accesos: asString(raw.accesos, DEFAULT_CONFIG.accesos),
    info_protocolar: asString(raw.info_protocolar, DEFAULT_CONFIG.info_protocolar),
    musica_url: asString(raw.musica_url, DEFAULT_CONFIG.musica_url),
    video_url: asString(raw.video_url, DEFAULT_CONFIG.video_url),
    logo_fiesta: asString(raw.logo_fiesta, DEFAULT_CONFIG.logo_fiesta),
    logo_municipalidad: asString(raw.logo_municipalidad, DEFAULT_CONFIG.logo_municipalidad),
    logo_tucuman: asString(raw.logo_tucuman, DEFAULT_CONFIG.logo_tucuman),
    titulo: asString(raw.titulo, DEFAULT_CONFIG.titulo),
    subtitulo: asString(raw.subtitulo, DEFAULT_CONFIG.subtitulo),
    bienvenida: asString(raw.bienvenida, DEFAULT_CONFIG.bienvenida),
    encabezado: asString(raw.encabezado, DEFAULT_CONFIG.encabezado),
    boton_abrir: asString(raw.boton_abrir, DEFAULT_CONFIG.boton_abrir),
    evento_fondo_url: asString(raw.evento_fondo_url, DEFAULT_CONFIG.evento_fondo_url),
    evento_overlay: asNumber(raw.evento_overlay, DEFAULT_CONFIG.evento_overlay),
    evento_fecha_texto: asString(raw.evento_fecha_texto, DEFAULT_CONFIG.evento_fecha_texto),
    evento_hora_texto: asString(raw.evento_hora_texto, DEFAULT_CONFIG.evento_hora_texto),
    evento_lugar_texto: asString(raw.evento_lugar_texto, DEFAULT_CONFIG.evento_lugar_texto),
    cronograma_fondo_url: asString(raw.cronograma_fondo_url, DEFAULT_CONFIG.cronograma_fondo_url),
    cronograma_overlay: asNumber(raw.cronograma_overlay, DEFAULT_CONFIG.cronograma_overlay),
    cronograma_titulo: asString(raw.cronograma_titulo, DEFAULT_CONFIG.cronograma_titulo),
    firmas: asArray(raw.firmas, DEFAULT_CONFIG.firmas),
    cronograma: asArray(raw.cronograma, DEFAULT_CONFIG.cronograma),
    galeria: asArray(raw.galeria, DEFAULT_CONFIG.galeria),
    enlaces: asArray(raw.enlaces, DEFAULT_CONFIG.enlaces),
  };
}

export async function getSiteConfig(): Promise<SiteConfig> {
  const supabase = getSupabaseServerClient();

  if (supabase) {
    const { data, error } = await supabase
      .from("configuracion")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (!error && data) {
      return normalizeConfig(data as Record<string, unknown>);
    }
  }

  const local = await readJsonFile<SiteConfig | null>(CONFIG_FILE, null);
  return normalizeConfig(local);
}

export async function saveSiteConfig(config: SiteConfig): Promise<SiteConfig> {
  const next = normalizeConfig(config);
  const supabase = getSupabaseServerClient();

  if (supabase) {
    const payload = {
      id: 1,
      carta: next.carta,
      fecha_evento: toDbTimestamp(next.fecha_evento),
      fecha_fin: toDbTimestamp(next.fecha_fin),
      horarios: next.horarios,
      ubicacion: next.ubicacion,
      ubicacion_detalle: next.ubicacion_detalle,
      mapa_url: next.mapa_url,
      mapa_embed: next.mapa_embed,
      accesos: next.accesos,
      info_protocolar: next.info_protocolar,
      musica_url: next.musica_url,
      video_url: next.video_url,
      logo_fiesta: next.logo_fiesta,
      logo_municipalidad: next.logo_municipalidad,
      logo_tucuman: next.logo_tucuman,
      titulo: next.titulo,
      subtitulo: next.subtitulo,
      bienvenida: next.bienvenida,
      encabezado: next.encabezado,
      boton_abrir: next.boton_abrir,
      evento_fondo_url: next.evento_fondo_url,
      evento_overlay: next.evento_overlay,
      evento_fecha_texto: next.evento_fecha_texto,
      evento_hora_texto: next.evento_hora_texto,
      evento_lugar_texto: next.evento_lugar_texto,
      cronograma_fondo_url: next.cronograma_fondo_url,
      cronograma_overlay: next.cronograma_overlay,
      cronograma_titulo: next.cronograma_titulo,
      firmas: next.firmas,
      cronograma: next.cronograma,
      galeria: next.galeria,
      enlaces: next.enlaces,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("configuracion").upsert(payload);
    if (error) {
      const missingNewColumns = /encabezado|boton_abrir/i.test(error.message);
      if (missingNewColumns) {
        const fallback = { ...payload } as Record<string, unknown>;
        delete fallback.encabezado;
        delete fallback.boton_abrir;
        const retry = await supabase.from("configuracion").upsert(fallback);
        if (retry.error) throw new Error(retry.error.message);
        return next;
      }
      throw new Error(error.message);
    }
    return next;
  }

  await writeJsonFile(CONFIG_FILE, next);
  return next;
}

export async function createConfirmation(payload: RsvpPayload): Promise<Confirmation> {
  const confirmation: Confirmation = {
    id: crypto.randomUUID(),
    nombre: payload.nombre.trim(),
    apellido: payload.apellido.trim(),
    cargo: payload.cargo.trim(),
    institucion: payload.institucion.trim(),
    telefono: payload.telefono.trim(),
    email: payload.email.trim().toLowerCase(),
    asistencia: payload.asistencia,
    enlace_origen: payload.enlace_origen || null,
    fecha_creacion: new Date().toISOString(),
  };

  const supabase = getSupabaseServerClient();

  if (supabase) {
    const { error } = await supabase.from("confirmaciones").insert({
      id: confirmation.id,
      nombre: confirmation.nombre,
      apellido: confirmation.apellido,
      cargo: confirmation.cargo,
      institucion: confirmation.institucion,
      telefono: confirmation.telefono,
      email: confirmation.email,
      asistencia: confirmation.asistencia,
      enlace_origen: confirmation.enlace_origen,
      fecha_creacion: confirmation.fecha_creacion,
    });

    if (error) throw new Error(error.message);
    return confirmation;
  }

  const list = await readJsonFile<Confirmation[]>(CONFIRMATIONS_FILE, []);
  list.unshift(confirmation);
  await writeJsonFile(CONFIRMATIONS_FILE, list);
  return confirmation;
}

export async function listConfirmations(): Promise<Confirmation[]> {
  const supabase = getSupabaseServerClient();

  if (supabase) {
    const { data, error } = await supabase
      .from("confirmaciones")
      .select("*")
      .order("fecha_creacion", { ascending: false });

    if (error) {
      console.error("listConfirmations", error.message);
      return [];
    }
    return (data || []) as Confirmation[];
  }

  return readJsonFile<Confirmation[]>(CONFIRMATIONS_FILE, []);
}

export async function trackAccess(slug: string, userAgent?: string | null) {
  const log: AccessLog = {
    id: crypto.randomUUID(),
    slug,
    fecha_acceso: new Date().toISOString(),
    user_agent: userAgent || null,
  };

  const supabase = getSupabaseServerClient();

  if (supabase) {
    await supabase.from("accesos").insert({
      id: log.id,
      slug: log.slug,
      fecha_acceso: log.fecha_acceso,
      user_agent: log.user_agent,
    });
    return log;
  }

  const list = await readJsonFile<AccessLog[]>(ACCESS_FILE, []);
  list.unshift(log);
  await writeJsonFile(ACCESS_FILE, list.slice(0, 1000));
  return log;
}

export async function listAccessLogs(): Promise<AccessLog[]> {
  const supabase = getSupabaseServerClient();

  if (supabase) {
    const { data, error } = await supabase
      .from("accesos")
      .select("*")
      .order("fecha_acceso", { ascending: false })
      .limit(500);

    if (error) {
      console.error("listAccessLogs", error.message);
      return [];
    }
    return (data || []) as AccessLog[];
  }

  return readJsonFile<AccessLog[]>(ACCESS_FILE, []);
}
