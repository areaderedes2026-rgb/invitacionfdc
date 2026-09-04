"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { AudioUploadField } from "@/components/admin/audio-upload-field";
import { youtubeEmbedUrl } from "@/lib/youtube";
import type { SiteConfig } from "@/types";

export function MultimediaEditor({ initialConfig }: { initialConfig: SiteConfig }) {
  const [config, setConfig] = useState(initialConfig);
  const [saving, setSaving] = useState(false);

  const update = (
    key: "musica_url" | "video_url" | "logo_fiesta" | "video_titulo",
    value: string
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        ...config,
        video_url: youtubeEmbedUrl(config.video_url),
      };
      const res = await fetch("/api/admin/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Error al guardar");
      }
      setConfig(payload);
      toast.success("Cambios guardados");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="font-ui text-[0.65rem] uppercase tracking-[0.28em] text-ocre">
          Invitación pública
        </p>
        <h2 className="mt-1 font-display text-3xl tracking-wide text-noche">
          Audio y video
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-sepia">
          Solo lo que se ve y se oye en la invitación: logo de portada, música del
          botón de volumen y video institucional opcional.
        </p>
      </div>

      <section className="space-y-5 rounded-2xl border border-ocre/20 bg-white p-6 shadow-sm">
        <div>
          <h3 className="font-display text-xl tracking-wide">Logo de portada</h3>
          <p className="mt-1 text-sm text-sepia">
            Aparece en la pantalla de inicio, antes de abrir la invitación.
          </p>
        </div>
        <ImageUploadField
          id="logo_fiesta"
          label="Logo de portada"
          hint="JPG, PNG o WEBP · máximo 3 MB"
          folder="logo"
          value={config.logo_fiesta || ""}
          onChange={(url) => update("logo_fiesta", url)}
        />
      </section>

      <section className="space-y-5 rounded-2xl border border-ocre/20 bg-white p-6 shadow-sm">
        <div>
          <h3 className="font-display text-xl tracking-wide">Música</h3>
          <p className="mt-1 text-sm text-sepia">
            YouTube no se puede usar acá: bloquea la reproducción en otras webs.
            Subí un archivo MP3 desde tu PC (hasta 4 MB). Si queda vacío, el
            botón usa el ambiente suave.
          </p>
        </div>
        <AudioUploadField
          id="musica_url"
          label="Canción de la invitación"
          hint="MP3, OGG o M4A · máximo 4 MB"
          folder="musica"
          value={config.musica_url || ""}
          onChange={(url) => update("musica_url", url)}
        />
      </section>

      <section className="space-y-5 rounded-2xl border border-ocre/20 bg-white p-6 shadow-sm">
        <div>
          <h3 className="font-display text-xl tracking-wide">Video institucional</h3>
          <p className="mt-1 text-sm text-sepia">
            Opcional. Si está vacío, la sección no se muestra. Podés pegar un
            enlace de YouTube; se convierte solo a formato embed.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="video_titulo">Título de la sección</Label>
          <Input
            id="video_titulo"
            value={config.video_titulo}
            placeholder="Video institucional"
            onChange={(e) => update("video_titulo", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="video_url">URL de YouTube o archivo</Label>
          <Input
            id="video_url"
            value={config.video_url}
            placeholder="https://www.youtube.com/watch?v=..."
            onChange={(e) => update("video_url", e.target.value)}
          />
        </div>
      </section>

      <Button type="button" variant="admin" onClick={() => void save()} disabled={saving}>
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Guardar cambios
      </Button>
    </div>
  );
}
