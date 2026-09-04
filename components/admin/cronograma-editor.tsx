"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { Timeline } from "@/components/invitation/timeline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CronogramaEvento, SiteConfig } from "@/types";

const EVENT_FIELDS: { key: keyof CronogramaEvento; label: string; type?: "textarea" }[] = [
  { key: "dia", label: "Día" },
  { key: "fecha", label: "Fecha (YYYY-MM-DD)" },
  { key: "hora", label: "Hora" },
  { key: "titulo", label: "Título" },
  { key: "tipo", label: "Tipo (oficial|artistico|tradicional|protocolar)" },
  { key: "descripcion", label: "Descripción", type: "textarea" },
];

function createEvent(): CronogramaEvento {
  return {
    id: crypto.randomUUID(),
    dia: "Jueves",
    fecha: "2026-10-08",
    hora: "21:00",
    titulo: "Nuevo evento",
    descripcion: "Descripción del evento",
    tipo: "oficial",
  };
}

export function CronogramaEditor({ initialConfig }: { initialConfig: SiteConfig }) {
  const [config, setConfig] = useState(initialConfig);
  const [saving, setSaving] = useState(false);

  const update = <K extends keyof SiteConfig>(key: K, value: SiteConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const updateItem = (index: number, key: keyof CronogramaEvento, value: string) => {
    setConfig((prev) => {
      const next = [...prev.cronograma];
      next[index] = { ...next[index], [key]: value } as CronogramaEvento;
      return { ...prev, cronograma: next };
    });
  };

  const addItem = () => {
    setConfig((prev) => ({
      ...prev,
      cronograma: [...prev.cronograma, createEvent()],
    }));
  };

  const removeItem = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      cronograma: prev.cronograma.filter((_, i) => i !== index),
    }));
  };

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

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl tracking-wide">Cronograma</h2>
          <p className="mt-2 text-sm text-sepia">
            Fondo, overlay y actividades de cada día.
          </p>
        </div>
        <Button type="button" variant="admin" onClick={save} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Guardar cambios
        </Button>
      </div>

      <div className="space-y-5 rounded-2xl border border-ocre/20 bg-white p-6 shadow-sm">
        <div>
          <h3 className="font-display text-xl tracking-wide">Fondo de la sección</h3>
          <p className="mt-1 text-sm text-sepia">
            Imagen, overlay oscuro y título. Si el título queda vacío, se usa
            Cronograma de actividades.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cronograma_fondo_url">Imagen de fondo</Label>
          <Input
            id="cronograma_fondo_url"
            value={config.cronograma_fondo_url}
            placeholder="/images/gallery-gauchos.png o https://..."
            onChange={(e) => update("cronograma_fondo_url", e.target.value)}
          />
          <p className="text-xs text-sepia">
            Usá una ruta del sitio o una URL pública de imagen.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cronograma_overlay">
            Intensidad del overlay oscuro: {config.cronograma_overlay}%
          </Label>
          <input
            id="cronograma_overlay"
            type="range"
            min={0}
            max={100}
            step={1}
            value={Number(config.cronograma_overlay) || 0}
            onChange={(e) => update("cronograma_overlay", Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-noche/15 accent-ocre"
          />
          <p className="text-xs text-sepia">
            0 deja ver la foto completa. 100 cubre casi toda la imagen para que
            el texto se lea mejor.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cronograma_titulo">Título de la sección</Label>
          <Input
            id="cronograma_titulo"
            value={config.cronograma_titulo}
            placeholder="CRONOGRAMA DE ACTIVIDADES"
            onChange={(e) => update("cronograma_titulo", e.target.value)}
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-ocre/20">
          <p className="bg-noche/5 px-4 py-2 font-ui text-xs uppercase tracking-[0.18em] text-sepia">
            Vista previa
          </p>
          <div className="max-h-[28rem] overflow-auto">
            <Timeline config={config} preview />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <h3 className="font-display text-xl tracking-wide">Actividades</h3>
        <Button type="button" variant="outline" onClick={addItem}>
          <Plus className="h-4 w-4" />
          Agregar
        </Button>
      </div>

      <div className="space-y-4">
        {config.cronograma.map((item, index) => (
          <div
            key={item.id || index}
            className="rounded-2xl border border-ocre/20 bg-white p-5 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-medium text-wine">Ítem {index + 1}</p>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeItem(index)}
                aria-label="Eliminar ítem"
              >
                <Trash2 className="h-4 w-4 text-wine" />
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {EVENT_FIELDS.map((field) => {
                if (field.key === "dia") {
                  return (
                    <div key={field.key} className="space-y-2">
                      <Label>Día</Label>
                      <select
                        className="flex h-12 w-full rounded-xl border border-ocre/30 bg-marfil/90 px-3 font-ui text-noche"
                        value={item.dia}
                        onChange={(e) => updateItem(index, "dia", e.target.value)}
                      >
                        {["Jueves", "Viernes", "Sábado", "Domingo"].map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }
                if (field.key === "tipo") {
                  return (
                    <div key={field.key} className="space-y-2">
                      <Label>Tipo</Label>
                      <select
                        className="flex h-12 w-full rounded-xl border border-ocre/30 bg-marfil/90 px-3 font-ui text-noche"
                        value={item.tipo}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "tipo",
                            e.target.value as CronogramaEvento["tipo"]
                          )
                        }
                      >
                        <option value="oficial">Oficial</option>
                        <option value="artistico">Artístico</option>
                        <option value="tradicional">Tradicional</option>
                        <option value="protocolar">Protocolar</option>
                      </select>
                    </div>
                  );
                }
                return (
                <div
                  key={field.key}
                  className={field.type === "textarea" ? "space-y-2 md:col-span-2" : "space-y-2"}
                >
                  <Label>{field.label}</Label>
                  {field.type === "textarea" ? (
                    <Textarea
                      value={String(item[field.key] ?? "")}
                      onChange={(e) => updateItem(index, field.key, e.target.value)}
                    />
                  ) : (
                    <Input
                      value={String(item[field.key] ?? "")}
                      onChange={(e) => updateItem(index, field.key, e.target.value)}
                    />
                  )}
                </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
