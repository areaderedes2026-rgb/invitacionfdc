"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CARTA_FUENTES,
  CARTA_GROSORES,
  cartaBodyStyle,
} from "@/lib/carta-style";
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
      toast.success("Cambios guardados. Recargá la invitación para verlos.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const firmas = Array.isArray(config.firmas) ? config.firmas : [];
  const body = cartaBodyStyle(config);

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
          Cada campo de acá se ve en la invitación. Guardá y recargá la página
          pública para comprobarlo.
        </p>
      </div>

      <section className="space-y-5 rounded-2xl border border-ocre/20 bg-white p-6 shadow-sm">
        <div>
          <h3 className="font-display text-xl tracking-wide">Portada</h3>
          <p className="mt-1 text-sm text-sepia">
            Lo primero que se ve, antes de abrir la invitación.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="encabezado">Línea superior (portada, carta y pie)</Label>
          <Input
            id="encabezado"
            value={config.encabezado}
            placeholder="Invitación oficial · Edición 2026"
            onChange={(e) =>
              setConfig((prev) => ({ ...prev, encabezado: e.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bienvenida">Saludo grande de la portada</Label>
          <Input
            id="bienvenida"
            value={config.bienvenida}
            onChange={(e) =>
              setConfig((prev) => ({ ...prev, bienvenida: e.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="boton_abrir">Texto del botón</Label>
          <Input
            id="boton_abrir"
            value={config.boton_abrir}
            placeholder="Abrir Invitación"
            onChange={(e) =>
              setConfig((prev) => ({ ...prev, boton_abrir: e.target.value }))
            }
          />
        </div>
      </section>

      <section className="space-y-5 rounded-2xl border border-ocre/20 bg-white p-6 shadow-sm">
        <div>
          <h3 className="font-display text-xl tracking-wide">Carta</h3>
          <p className="mt-1 text-sm text-sepia">
            Título, subtítulo y cuerpo que se leen al abrir la invitación.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="titulo">Título de la carta (también en el pie)</Label>
          <Input
            id="titulo"
            value={config.titulo}
            onChange={(e) =>
              setConfig((prev) => ({ ...prev, titulo: e.target.value }))
            }
          />
          <p className="text-xs text-sepia">
            Es el título grande de la carta, no solo el del pie.
          </p>
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
          <p className="text-xs text-sepia">
            Un renglón vacío separa párrafos.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="carta_fuente">Fuente del cuerpo</Label>
            <select
              id="carta_fuente"
              className="flex h-12 w-full rounded-xl border border-ocre/30 bg-marfil/90 px-3 font-ui text-noche"
              value={config.carta_fuente || "editorial"}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, carta_fuente: e.target.value }))
              }
            >
              {CARTA_FUENTES.map((font) => (
                <option key={font.id} value={font.id}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="carta_grosor">Grosor</Label>
            <select
              id="carta_grosor"
              className="flex h-12 w-full rounded-xl border border-ocre/30 bg-marfil/90 px-3 font-ui text-noche disabled:opacity-50"
              value={String(config.carta_grosor || 600)}
              disabled={config.carta_fuente === "script"}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  carta_grosor: Number(e.target.value),
                }))
              }
            >
              {CARTA_GROSORES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
            {config.carta_fuente === "script" ? (
              <p className="text-xs text-sepia">La manuscrita no admite negrita.</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="carta_tamano">
              Tamaño: {config.carta_tamano || 18} px
            </Label>
            <input
              id="carta_tamano"
              type="range"
              min={14}
              max={32}
              step={1}
              value={config.carta_tamano || 18}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  carta_tamano: Number(e.target.value),
                }))
              }
              className="h-12 w-full cursor-pointer appearance-none rounded-full bg-noche/15 accent-ocre"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-ocre/20">
          <p className="bg-noche/5 px-4 py-2 font-ui text-xs uppercase tracking-[0.18em] text-sepia">
            Vista previa del cuerpo
          </p>
          <div className="max-h-[22rem] overflow-auto bg-marfil px-5 py-6 sm:px-8">
            <div
              className={`space-y-4 text-noche ${body.className}`}
              style={body.style}
            >
              {(config.carta || "")
                .split("\n\n")
                .filter(Boolean)
                .map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
            </div>
          </div>
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
