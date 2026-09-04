"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { SiteConfig } from "@/types";

export function EnlacesEditor({ initialConfig }: { initialConfig: SiteConfig }) {
  const [config, setConfig] = useState(initialConfig);
  const [saving, setSaving] = useState(false);
  const enlaces = Array.isArray(config.enlaces) ? config.enlaces : [];

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Error al guardar");
      }
      toast.success("Enlaces actualizados");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-ui text-[0.65rem] uppercase tracking-[0.28em] text-ocre">
            Invitación pública
          </p>
          <h2 className="mt-1 font-display text-3xl tracking-wide text-noche">
            Enlaces especiales
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-sepia">
            Cada slug genera /invitacion/[slug] y registra el acceso.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setConfig((prev) => ({
                ...prev,
                enlaces: [
                  ...enlaces,
                  {
                    id: crypto.randomUUID(),
                    slug: "nuevo-enlace",
                    etiqueta: "Nueva etiqueta",
                    descripcion: "Descripción del enlace",
                    activo: true,
                  },
                ],
              }))
            }
          >
            <Plus className="h-4 w-4" />
            Agregar
          </Button>
          <Button type="button" variant="admin" onClick={() => void save()} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Guardar
          </Button>
        </div>
      </div>

      {enlaces.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-ocre/30 bg-white px-5 py-10 text-center text-sm text-sepia">
          Todavía no hay enlaces. Agregá uno y guardá.
        </p>
      ) : null}

      {enlaces.map((link, index) => (
        <div
          key={link.id || index}
          className="rounded-2xl border border-ocre/20 bg-white p-5 shadow-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-noche">Enlace {index + 1}</p>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Eliminar enlace"
              onClick={() =>
                setConfig((prev) => ({
                  ...prev,
                  enlaces: enlaces.filter((_, i) => i !== index),
                }))
              }
            >
              <Trash2 className="h-4 w-4 text-noche" />
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Slug (sin espacios)</Label>
              <Input
                value={link.slug}
                onChange={(e) =>
                  setConfig((prev) => {
                    const next = [...enlaces];
                    next[index] = {
                      ...next[index],
                      slug: e.target.value.trim().toLowerCase(),
                    };
                    return { ...prev, enlaces: next };
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Etiqueta</Label>
              <Input
                value={link.etiqueta}
                onChange={(e) =>
                  setConfig((prev) => {
                    const next = [...enlaces];
                    next[index] = { ...next[index], etiqueta: e.target.value };
                    return { ...prev, enlaces: next };
                  })
                }
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Descripción</Label>
              <Textarea
                value={link.descripcion}
                onChange={(e) =>
                  setConfig((prev) => {
                    const next = [...enlaces];
                    next[index] = { ...next[index], descripcion: e.target.value };
                    return { ...prev, enlaces: next };
                  })
                }
              />
            </div>
            <label className="flex min-h-12 items-center gap-3 rounded-xl border border-ocre/30 bg-marfil/90 px-3">
              <input
                type="checkbox"
                checked={Boolean(link.activo)}
                onChange={(e) =>
                  setConfig((prev) => {
                    const next = [...enlaces];
                    next[index] = { ...next[index], activo: e.target.checked };
                    return { ...prev, enlaces: next };
                  })
                }
              />
              <span className="text-sm">Activo</span>
            </label>
          </div>
          <p className="mt-3 text-xs text-sepia">
            /invitacion/{link.slug || "..."}
          </p>
        </div>
      ))}
    </div>
  );
}
