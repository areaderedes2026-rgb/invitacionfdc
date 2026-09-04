-- Semilla opcional: ejecutar después de schema.sql
-- Puede omitirse: la app ya incluye contenido por defecto.

insert into public.configuracion (
  id,
  carta,
  fecha_evento,
  fecha_fin,
  horarios,
  ubicacion,
  ubicacion_detalle,
  mapa_url,
  mapa_embed,
  accesos,
  info_protocolar,
  titulo,
  subtitulo,
  bienvenida,
  logo_fiesta,
  logo_municipalidad,
  logo_tucuman
) values (
  1,
  'Es un honor para la Municipalidad de Trancas dirigirse a Ud. con el fin de invitarlo/a cordialmente a la XXVII Fiesta Nacional e Internacional del Caballo.',
  '2026-10-08T21:00:00-03:00',
  '2026-10-11T23:59:00-03:00',
  'Jueves 8 al domingo 11 de octubre de 2026',
  'Club Deportivo Trancas',
  'Trancas, Provincia de Tucumán, República Argentina',
  'https://www.google.com/maps/search/?api=1&query=Club+Deportivo+Trancas+Tucumán',
  'https://maps.google.com/maps?q=Club%20Deportivo%20Trancas%2C%20Trancas%2C%20Tucum%C3%A1n&t=&z=15&ie=UTF8&iwloc=&output=embed',
  'Ingreso protocolar por acceso principal',
  'Vestimenta formal o tradicional criolla de gala.',
  'XXVII Fiesta Nacional e Internacional del Caballo',
  'Trancas • Tucumán • Argentina',
  'Usted ha sido cordialmente invitado',
  '/images/brand/logo-oficial.png',
  '/images/brand/logo-oficial.png',
  '/images/brand/logo-oficial.png'
)
on conflict (id) do nothing;
