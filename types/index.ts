export type Attendance = "si" | "no";

export interface Confirmation {
  id: string;
  nombre: string;
  apellido: string;
  cargo: string;
  institucion: string;
  telefono: string;
  email: string;
  asistencia: Attendance;
  enlace_origen: string | null;
  fecha_creacion: string;
}

export interface CronogramaEvento {
  id: string;
  dia: string;
  fecha: string;
  hora: string;
  titulo: string;
  descripcion: string;
  tipo: "oficial" | "artistico" | "tradicional" | "protocolar";
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  categoria: string;
}

export interface SpecialLink {
  id: string;
  slug: string;
  etiqueta: string;
  descripcion: string;
  activo: boolean;
}

export interface AccessLog {
  id: string;
  slug: string;
  fecha_acceso: string;
  user_agent: string | null;
}

export interface SiteConfig {
  carta: string;
  fecha_evento: string;
  fecha_fin: string;
  horarios: string;
  ubicacion: string;
  ubicacion_detalle: string;
  mapa_url: string;
  mapa_embed: string;
  accesos: string;
  info_protocolar: string;
  musica_url: string;
  video_url: string;
  logo_fiesta: string;
  logo_municipalidad: string;
  logo_tucuman: string;
  titulo: string;
  subtitulo: string;
  bienvenida: string;
  encabezado: string;
  boton_abrir: string;
  carta_fuente: string;
  carta_tamano: number;
  carta_grosor: number;
  evento_fondo_url: string;
  evento_overlay: number;
  evento_fecha_texto: string;
  evento_hora_texto: string;
  evento_lugar_texto: string;
  cuenta_etiqueta: string;
  cuenta_titulo: string;
  cuenta_titulo_fin: string;
  mapa_titulo: string;
  mapa_boton: string;
  video_titulo: string;
  rsvp_etiqueta: string;
  rsvp_titulo: string;
  evento_label_fecha: string;
  evento_label_hora: string;
  evento_label_lugar: string;
  cronograma_fondo_url: string;
  cronograma_overlay: number;
  cronograma_titulo: string;
  firmas: {
    nombre: string;
    cargo: string;
  }[];
  cronograma: CronogramaEvento[];
  galeria: GalleryItem[];
  enlaces: SpecialLink[];
}

export interface RsvpPayload {
  nombre: string;
  apellido: string;
  cargo: string;
  institucion: string;
  telefono: string;
  email: string;
  asistencia: Attendance;
  enlace_origen?: string | null;
}
