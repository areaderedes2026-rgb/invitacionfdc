# XXVII Fiesta Nacional e Internacional del Caballo

Invitación oficial digital de la Municipalidad de Trancas (Tucumán, Argentina).

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS 4
- Framer Motion + GSAP
- Supabase (persistencia en producción)
- Vercel

## Desarrollo local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

En desarrollo, si no carga variables, el admin usa `admin` / `trancas2026`. Cámbielas antes de producción.

## Producción (GitHub + Vercel)

1. Crear proyecto en [Supabase](https://supabase.com) e ejecutar `supabase/schema.sql`.
2. Generar secretos:
   - `AUTH_SECRET`: `openssl rand -base64 48`
   - `ADMIN_PASSWORD`: mínimo 12 caracteres
3. Subir el repo a GitHub (sin `.env.local`).
4. Importar el repo en [Vercel](https://vercel.com), framework **Next.js**.
5. Cargar variables de entorno (Production + Preview):

```env
ADMIN_USER=
ADMIN_PASSWORD=
AUTH_SECRET=
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

6. Deploy. El panel queda en `/admin`.

En Vercel **no** se usa `/data`: sin Supabase no se guardan confirmaciones ni cambios del admin.

## Enlaces de invitación

- `/invitacion/gobernador`
- `/invitacion/ministros`
- `/invitacion/legisladores`
- `/invitacion/intendentes`
- `/invitacion/embajadores`

## Seguridad

- Sesión admin en cookie httpOnly firmada (JWT)
- Middleware que protege `/admin` y `/api/admin`
- Rate limit en login, RSVP y tracking
- RLS de Supabase sin políticas públicas (todo pasa por el servidor)
- Headers de seguridad y `robots` bloqueando el admin
