"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SiteConfig } from "@/types";

function youtubeEmbed(url: string) {
  const value = url.trim();
  if (!value) return "";
  const id =
    value.match(/youtu\.be\/([\w-]+)/)?.[1] ||
    value.match(/[?&]v=([\w-]+)/)?.[1] ||
    value.match(/youtube\.com\/embed\/([\w-]+)/)?.[1];
  return id ? `https://www.youtube.com/embed/${id}` : value;
}

export function MultimediaEditor({ initialConfig }: { initialConfig: SiteConfig }) {
  const [config, setConfig] = useState(initialConfig);
  const [saving, setSaving] = useState(false);
  const [logoBroken, setLogoBroken] = useState(false);

  const update = (key: "musica_url" | "video_url" | "logo_fiesta", value: string) => {
    if (key === "logo_fiesta") setLogoBroken(false);
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        ...config,
        video_url: youtubeEmbed(config.video_url),
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

  const logoSrc = config.logo_fiesta.trim();

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
        <div className="space-y-2">
          <Label htmlFor="logo_fiesta">Ruta o URL del logo</Label>
          <Input
            id="logo_fiesta"
            value={config.logo_fiesta}
            placeholder="/images/brand/logo-oficial.png"
            onChange={(e) => update("logo_fiesta", e.target.value)}
          />
        </div>
        {logoSrc && !logoBroken ? (
          <div className="flex h-40 items-center justify-center rounded-xl border border-ocre/15 bg-marfil">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc}
              alt="Vista previa del logo"
              className="max-h-36 max-w-[min(100%,18rem)] object-contain"
              onError={() => setLogoBroken(true)}
            />
          </div>
        ) : logoSrc ? (
          <p className="text-sm text-noche">No se pudo cargar esa imagen. Revisá la ruta.</p>
        ) : null}
      </section>

      <section className="space-y-5 rounded-2xl border border-ocre/20 bg-white p-6 shadow-sm">
        <div>
          <h3 className="font-display text-xl tracking-wide">Música</h3>
          <p className="mt-1 text-sm text-sepia">
            Si hay una URL, el botón de volumen de la invitación reproduce esta
            pista. Si queda vacío, el botón usa el ambiente suave.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="musica_url">URL del audio (mp3 u ogg)</Label>
          <Input
            id="musica_url"
            value={config.musica_url}
            placeholder="https://.../musica.mp3"
            onChange={(e) => update("musica_url", e.target.value)}
          />
        </div>
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
