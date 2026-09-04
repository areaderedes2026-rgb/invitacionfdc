import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getSupabaseServerClient, getSupabaseUrl } from "@/lib/supabase/server";

const BUCKET = "invitacion-media";
const IMAGE_MAX = 3 * 1024 * 1024;
const AUDIO_MAX = 4 * 1024 * 1024;

const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const AUDIO_TYPES: Record<string, string> = {
  "audio/mpeg": "mp3",
  "audio/mp3": "mp3",
  "audio/ogg": "ogg",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
  "audio/mp4": "m4a",
  "audio/aac": "aac",
  "audio/x-m4a": "m4a",
};

function resolveFile(file: File) {
  const type = (file.type || "").toLowerCase();
  if (IMAGE_TYPES[type]) {
    return { kind: "image" as const, ext: IMAGE_TYPES[type], mime: type, max: IMAGE_MAX };
  }
  if (AUDIO_TYPES[type]) {
    return { kind: "audio" as const, ext: AUDIO_TYPES[type], mime: type, max: AUDIO_MAX };
  }

  const name = file.name.toLowerCase();
  if (name.endsWith(".jpg") || name.endsWith(".jpeg")) {
    return { kind: "image" as const, ext: "jpg", mime: "image/jpeg", max: IMAGE_MAX };
  }
  if (name.endsWith(".png")) {
    return { kind: "image" as const, ext: "png", mime: "image/png", max: IMAGE_MAX };
  }
  if (name.endsWith(".webp")) {
    return { kind: "image" as const, ext: "webp", mime: "image/webp", max: IMAGE_MAX };
  }
  if (name.endsWith(".gif")) {
    return { kind: "image" as const, ext: "gif", mime: "image/gif", max: IMAGE_MAX };
  }
  if (name.endsWith(".mp3")) {
    return { kind: "audio" as const, ext: "mp3", mime: "audio/mpeg", max: AUDIO_MAX };
  }
  if (name.endsWith(".ogg")) {
    return { kind: "audio" as const, ext: "ogg", mime: "audio/ogg", max: AUDIO_MAX };
  }
  if (name.endsWith(".wav")) {
    return { kind: "audio" as const, ext: "wav", mime: "audio/wav", max: AUDIO_MAX };
  }
  if (name.endsWith(".m4a")) {
    return { kind: "audio" as const, ext: "m4a", mime: "audio/mp4", max: AUDIO_MAX };
  }

  return null;
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Configure Supabase para subir archivos." },
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

  const resolved = resolveFile(file);
  if (!resolved) {
    return NextResponse.json(
      { error: "Use una imagen (JPG, PNG, WEBP) o un audio (MP3, OGG, M4A)." },
      { status: 400 }
    );
  }

  if (file.size > resolved.max) {
    const mb = Math.round(resolved.max / (1024 * 1024));
    return NextResponse.json(
      {
        error:
          resolved.kind === "audio"
            ? `El audio no puede superar ${mb} MB. Exportalo en MP3 128 kbps.`
            : `La imagen no puede superar ${mb} MB.`,
      },
      { status: 400 }
    );
  }

  await supabase.storage.createBucket(BUCKET, { public: true }).catch(() => undefined);

  const path = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${resolved.ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType: resolved.mime,
    upsert: false,
  });

  if (error) {
    return NextResponse.json(
      {
        error:
          "No se pudo subir el archivo. Creá el bucket invitacion-media en Supabase Storage.",
      },
      { status: 500 }
    );
  }

  const base = getSupabaseUrl().replace(/\/$/, "");
  const url = `${base}/storage/v1/object/public/${BUCKET}/${path}`;
  return NextResponse.json({ ok: true, url, kind: resolved.kind });
}
