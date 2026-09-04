-- XXVII Fiesta Nacional e Internacional del Caballo
-- Schema para Supabase Free

create extension if not exists "pgcrypto";

create table if not exists public.configuracion (
  id integer primary key default 1,
  carta text,
  fecha_evento timestamptz,
  fecha_fin timestamptz,
  horarios text,
  ubicacion text,
  ubicacion_detalle text,
  mapa_url text,
  mapa_embed text,
  accesos text,
  info_protocolar text,
  musica_url text,
  video_url text,
  logo_fiesta text,
  logo_municipalidad text,
  logo_tucuman text,
  titulo text,
  subtitulo text,
  bienvenida text,
  encabezado text,
  boton_abrir text,
  carta_fuente text default 'editorial',
  carta_tamano integer default 18,
  carta_grosor integer default 600,
  evento_fondo_url text,
  evento_overlay integer default 58,
  evento_fecha_texto text default '',
  evento_hora_texto text default '',
  evento_lugar_texto text default '',
  cronograma_fondo_url text,
  cronograma_overlay integer default 58,
  cronograma_titulo text default '',
  firmas jsonb default '[]'::jsonb,
  cronograma jsonb default '[]'::jsonb,
  galeria jsonb default '[]'::jsonb,
  enlaces jsonb default '[]'::jsonb,
  updated_at timestamptz default now(),
  constraint configuracion_singleton check (id = 1)
);

create table if not exists public.confirmaciones (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  apellido text not null,
  cargo text not null,
  institucion text not null,
  telefono text not null,
  email text not null,
  asistencia text not null check (asistencia in ('si', 'no')),
  enlace_origen text,
  fecha_creacion timestamptz not null default now()
);

create table if not exists public.accesos (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  fecha_acceso timestamptz not null default now(),
  user_agent text
);

create index if not exists confirmaciones_fecha_idx
  on public.confirmaciones (fecha_creacion desc);

create index if not exists confirmaciones_enlace_idx
  on public.confirmaciones (enlace_origen);

create index if not exists accesos_fecha_idx
  on public.accesos (fecha_acceso desc);

create index if not exists accesos_slug_idx
  on public.accesos (slug);

alter table public.configuracion enable row level security;
alter table public.confirmaciones enable row level security;
alter table public.accesos enable row level security;

-- Sin políticas para anon/authenticated: el acceso queda denegado por RLS.
-- Toda lectura/escritura pasa por Next.js con SUPABASE_SERVICE_ROLE_KEY
-- (el service_role omite RLS). Nunca exponga esa clave en el cliente.

drop policy if exists "config_select_public" on public.configuracion;
drop policy if exists "confirmaciones_insert_public" on public.confirmaciones;
drop policy if exists "accesos_insert_public" on public.accesos;

alter table public.configuracion add column if not exists evento_fondo_url text;
alter table public.configuracion add column if not exists evento_overlay integer default 58;
alter table public.configuracion add column if not exists evento_fecha_texto text default '';
alter table public.configuracion add column if not exists evento_hora_texto text default '';
alter table public.configuracion add column if not exists evento_lugar_texto text default '';
alter table public.configuracion add column if not exists cronograma_fondo_url text;
alter table public.configuracion add column if not exists cronograma_overlay integer default 58;
alter table public.configuracion add column if not exists cronograma_titulo text default '';
alter table public.configuracion add column if not exists encabezado text default '';
alter table public.configuracion add column if not exists boton_abrir text default '';
alter table public.configuracion add column if not exists carta_fuente text default 'editorial';
alter table public.configuracion add column if not exists carta_tamano integer default 18;
alter table public.configuracion add column if not exists carta_grosor integer default 600;
alter table public.configuracion add column if not exists cuenta_etiqueta text default '';
alter table public.configuracion add column if not exists cuenta_titulo text default '';
alter table public.configuracion add column if not exists cuenta_titulo_fin text default '';
alter table public.configuracion add column if not exists mapa_titulo text default '';
alter table public.configuracion add column if not exists mapa_boton text default '';
alter table public.configuracion add column if not exists video_titulo text default '';
alter table public.configuracion add column if not exists rsvp_etiqueta text default '';
alter table public.configuracion add column if not exists rsvp_titulo text default '';
alter table public.configuracion add column if not exists evento_label_fecha text default '';
alter table public.configuracion add column if not exists evento_label_hora text default '';
alter table public.configuracion add column if not exists evento_label_lugar text default '';

-- Bucket público para logos y fondos subidos desde el admin.
insert into storage.buckets (id, name, public)
values ('invitacion-media', 'invitacion-media', true)
on conflict (id) do nothing;
