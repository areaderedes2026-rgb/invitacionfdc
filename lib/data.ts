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

function mapConfigRow(row: Record<string, unknown> | null): SiteConfig | null {
  if (!row) return null;
  return {
    ...DEFAULT_CONFIG,
    ...(row as Partial<SiteConfig>),
    firmas: (row.firmas as SiteConfig["firmas"]) || DEFAULT_CONFIG.firmas,
    cronograma: (row.cronograma as SiteConfig["cronograma"]) || DEFAULT_CONFIG.cronograma,
    galeria: (row.galeria as SiteConfig["galeria"]) || DEFAULT_CONFIG.galeria,
    enlaces: (row.enlaces as SiteConfig["enlaces"]) || DEFAULT_CONFIG.enlaces,
    evento_overlay:
      typeof row.evento_overlay === "number"
        ? row.evento_overlay
        : DEFAULT_CONFIG.evento_overlay,
    cronograma_overlay:
      typeof row.cronograma_overlay === "number"
        ? row.cronograma_overlay
        : DEFAULT_CONFIG.cronograma_overlay,
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
      return mapConfigRow(data) || DEFAULT_CONFIG;
    }
  }

  const local = await readJsonFile<SiteConfig | null>(CONFIG_FILE, null);
  return local ? { ...DEFAULT_CONFIG, ...local } : DEFAULT_CONFIG;
}

export async function saveSiteConfig(config: SiteConfig): Promise<SiteConfig> {
  const supabase = getSupabaseServerClient();

  if (supabase) {
    const payload = {
      id: 1,
      carta: config.carta,
      fecha_evento: config.fecha_evento,
      fecha_fin: config.fecha_fin,
      horarios: config.horarios,
      ubicacion: config.ubicacion,
      ubicacion_detalle: config.ubicacion_detalle,
      mapa_url: config.mapa_url,
      mapa_embed: config.mapa_embed,
      accesos: config.accesos,
      info_protocolar: config.info_protocolar,
      musica_url: config.musica_url,
      video_url: config.video_url,
      logo_fiesta: config.logo_fiesta,
      logo_municipalidad: config.logo_municipalidad,
      logo_tucuman: config.logo_tucuman,
      titulo: config.titulo,
      subtitulo: config.subtitulo,
      bienvenida: config.bienvenida,
      evento_fondo_url: config.evento_fondo_url,
      evento_overlay: config.evento_overlay,
      evento_fecha_texto: config.evento_fecha_texto,
      evento_hora_texto: config.evento_hora_texto,
      evento_lugar_texto: config.evento_lugar_texto,
      cronograma_fondo_url: config.cronograma_fondo_url,
      cronograma_overlay: config.cronograma_overlay,
      cronograma_titulo: config.cronograma_titulo,
      firmas: config.firmas,
      cronograma: config.cronograma,
      galeria: config.galeria,
      enlaces: config.enlaces,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("configuracion").upsert(payload);
    if (error) throw new Error(error.message);
    return config;
  }

  await writeJsonFile(CONFIG_FILE, config);
  return config;
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

    if (error) throw new Error(error.message);
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

    if (error) throw new Error(error.message);
    return (data || []) as AccessLog[];
  }

  return readJsonFile<AccessLog[]>(ACCESS_FILE, []);
}
