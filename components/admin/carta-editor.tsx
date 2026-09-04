"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { SiteConfig } from "@/types";

export function CartaEditor({ initialConfig }: { initialConfig: SiteConfig }) {
  const [config, setConfig] = useState(initialConfig);
  const [saving, setSaving] = useState(false);

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
      toast.success("Cambios guardados");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const firmas = Array.isArray(config.firmas) ? config.firmas : [];

  return (
    <div className="space-y-8">
      <div>
        <p className="font-ui text-[0.65rem] uppercase tracking-[0.28em] text-ocre">
          Invitación pública
        </p>
        <h2 className="mt-1 font-display text-3xl tracking-wide text-noche">
          Inicio y carta
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-sepia">
          Portada, textos de la carta y firmas. Un solo guardado actualiza todo.
        </p>
      </div>

      <section className="space-y-5 rounded-2xl border border-ocre/20 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="bienvenida">Saludo de la portada</Label>
          <Input
            id="bienvenida"
            value={config.bienvenida}
            onChange={(e) =>
              setConfig((prev) => ({ ...prev, bienvenida: e.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="titulo">Título (aparece en el pie)</Label>
          <Input
            id="titulo"
            value={config.titulo}
            onChange={(e) =>
              setConfig((prev) => ({ ...prev, titulo: e.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subtitulo">Subtítulo (portada, carta y pie)</Label>
          <Input
            id="subtitulo"
            value={config.subtitulo}
            onChange={(e) =>
              setConfig((prev) => ({ ...prev, subtitulo: e.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="carta">Cuerpo de la carta</Label>
          <Textarea
            id="carta"
            rows={12}
            value={config.carta}
            onChange={(e) =>
              setConfig((prev) => ({ ...prev, carta: e.target.value }))
            }
          />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="font-display text-xl tracking-wide">Firmas</h3>
            <p className="mt-1 text-sm text-sepia">
              Se muestran al pie de la carta, en columnas.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setConfig((prev) => ({
                ...prev,
                firmas: [
                  ...firmas,
                  { nombre: "Nueva autoridad", cargo: "Cargo institucional" },
                ],
              }))
            }
          >
            <Plus className="h-4 w-4" />
            Agregar firma
          </Button>
        </div>

        {firmas.map((firma, index) => (
          <div
            key={`${firma.nombre}-${index}`}
            className="rounded-2xl border border-ocre/20 bg-white p-5 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-medium text-noche">Firma {index + 1}</p>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Eliminar firma"
                onClick={() =>
                  setConfig((prev) => ({
                    ...prev,
                    firmas: firmas.filter((_, i) => i !== index),
                  }))
                }
              >
                <Trash2 className="h-4 w-4 text-noche" />
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input
                  value={firma.nombre}
                  onChange={(e) =>
                    setConfig((prev) => {
                      const next = [...firmas];
                      next[index] = { ...next[index], nombre: e.target.value };
                      return { ...prev, firmas: next };
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Cargo</Label>
                <Input
                  value={firma.cargo}
                  onChange={(e) =>
                    setConfig((prev) => {
                      const next = [...firmas];
                      next[index] = { ...next[index], cargo: e.target.value };
                      return { ...prev, firmas: next };
                    })
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </section>

      <Button type="button" variant="admin" onClick={() => void save()} disabled={saving}>
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Guardar cambios
      </Button>
    </div>
  );
}
