import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getSupabaseServerClient, getSupabaseUrl } from "@/lib/supabase/server";

const BUCKET = "invitacion-media";
const MAX_BYTES = 3 * 1024 * 1024;
const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Configure Supabase para subir imágenes." },
      { status: 500 }
    );
  }

  const form = await request.formData();
  const file = form.get("file");
  const folderRaw = String(form.get("folder") || "general");
  const folder = folderRaw.replace(/[^a-z0-9-]/gi, "").slice(0, 32) || "general";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Seleccione un archivo." }, { status: 400 });
  }

  const ext = TYPES[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Use una imagen JPG, PNG, WEBP o GIF." },
      { status: 400 }
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "La imagen no puede superar 3 MB." },
      { status: 400 }
    );
  }

  await supabase.storage.createBucket(BUCKET, { public: true }).catch(() => undefined);

  const path = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    return NextResponse.json(
      { error: "No se pudo subir la imagen. Creá el bucket invitacion-media en Supabase Storage." },
      { status: 500 }
    );
  }

  const base = getSupabaseUrl().replace(/\/$/, "");
  const url = `${base}/storage/v1/object/public/${BUCKET}/${path}`;
  return NextResponse.json({ ok: true, url });
}
