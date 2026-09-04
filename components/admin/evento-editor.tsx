"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { EventInfo } from "@/components/invitation/event-info";
import { RsvpForm } from "@/components/invitation/rsvp-form";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { SiteConfig } from "@/types";

function datetimeValue(value: string) {
  return (value || "").slice(0, 16);
}

export function EventoEditor({ initialConfig }: { initialConfig: SiteConfig }) {
  const [config, setConfig] = useState(initialConfig);
  const [saving, setSaving] = useState(false);
  const [rsvpPreview, setRsvpPreview] = useState<"closed" | "form" | "done">("closed");

  const update = <K extends keyof SiteConfig>(key: K, value: SiteConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Error al guardar");
      }
      if (data.config) setConfig(data.config);
      toast.success("Cambios guardados. Recargá la invitación para verlos.");
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
          Evento y mapa
        </h2>
        <p className="mt-2 text-sm text-sepia">
          Fecha, hora, lugar, cuenta regresiva, cómo llegar y textos de
          confirmación de asistencia.
        </p>
      </div>

      <div className="space-y-5 rounded-2xl border border-ocre/20 bg-white p-6 shadow-sm">
        <div>
          <h3 className="font-display text-xl tracking-wide">Bloque fecha, hora y lugar</h3>
          <p className="mt-1 text-sm text-sepia">
            Imagen de fondo, overlay oscuro y textos. Si un texto queda vacío, se
            genera solo a partir de la fecha y el lugar.
          </p>
        </div>

        <ImageUploadField
          id="evento_fondo_url"
          label="Imagen de fondo"
          hint="JPG, PNG o WEBP · máximo 3 MB"
          folder="evento"
          value={config.evento_fondo_url || ""}
          onChange={(url) => update("evento_fondo_url", url)}
        />

        <div className="space-y-2">
          <Label htmlFor="evento_overlay">
            Intensidad del overlay oscuro: {config.evento_overlay}%
          </Label>
          <input
            id="evento_overlay"
            type="range"
            min={0}
            max={100}
            step={1}
            value={Number(config.evento_overlay) || 0}
            onChange={(e) => update("evento_overlay", Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-noche/15 accent-ocre"
          />
          <p className="text-xs text-sepia">
            0 deja ver la foto completa. 100 cubre casi toda la imagen para que
            el texto se lea mejor.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="evento_fecha_texto">Texto de fecha</Label>
            <Input
              id="evento_fecha_texto"
              value={config.evento_fecha_texto}
              placeholder="Se genera con el inicio, o con inicio y fin"
              onChange={(e) => update("evento_fecha_texto", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="evento_hora_texto">Texto de hora</Label>
            <Input
              id="evento_hora_texto"
              value={config.evento_hora_texto}
              placeholder="Se genera automáticamente"
              onChange={(e) => update("evento_hora_texto", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="evento_lugar_texto">Texto de lugar</Label>
          <Input
            id="evento_lugar_texto"
            value={config.evento_lugar_texto}
            placeholder="Se usa el lugar institucional"
            onChange={(e) => update("evento_lugar_texto", e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="evento_label_fecha">Etiqueta de fecha</Label>
            <Input
              id="evento_label_fecha"
              value={config.evento_label_fecha}
              placeholder="Fecha"
              onChange={(e) => update("evento_label_fecha", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="evento_label_hora">Etiqueta de hora</Label>
            <Input
              id="evento_label_hora"
              value={config.evento_label_hora}
              placeholder="Hora"
              onChange={(e) => update("evento_label_hora", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="evento_label_lugar">Etiqueta de lugar</Label>
            <Input
              id="evento_label_lugar"
              value={config.evento_label_lugar}
              placeholder="Lugar"
              onChange={(e) => update("evento_label_lugar", e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-ocre/20">
          <p className="bg-noche/5 px-4 py-2 font-ui text-xs uppercase tracking-[0.18em] text-sepia">
            Vista previa
          </p>
          <div className="max-h-[28rem] overflow-hidden">
            <EventInfo config={config} preview />
          </div>
        </div>

        <Button type="button" variant="admin" onClick={() => void save()} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Guardar cambios
        </Button>
      </div>

        <div className="space-y-5 rounded-2xl border border-ocre/20 bg-white p-6 shadow-sm">
        <h3 className="font-display text-xl tracking-wide">Cuenta regresiva y mapa</h3>
        <p className="text-sm text-sepia">
          La cuenta regresiva usa solo la fecha de inicio. El fin es opcional:
          si lo dejás vacío, en la invitación aparece únicamente el inicio.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fecha_evento">Inicio del festival</Label>
            <Input
              id="fecha_evento"
              type="datetime-local"
              value={datetimeValue(config.fecha_evento)}
              onChange={(e) =>
                update(
                  "fecha_evento",
                  e.target.value ? `${e.target.value}:00-03:00` : ""
                )
              }
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="fecha_fin">Fin del festival (opcional)</Label>
              {config.fecha_fin ? (
                <button
                  type="button"
                  className="font-ui text-xs text-ocre underline-offset-4 hover:underline"
                  onClick={() => update("fecha_fin", "")}
                >
                  Quitar
                </button>
              ) : null}
            </div>
            <Input
              id="fecha_fin"
              type="datetime-local"
              value={datetimeValue(config.fecha_fin)}
              onChange={(e) =>
                update(
                  "fecha_fin",
                  e.target.value ? `${e.target.value}:00-03:00` : ""
                )
              }
            />
            <p className="text-xs text-sepia">
              Vacío = se muestra solo el inicio.
            </p>
          </div>
        </div>

        <div>
          <h4 className="font-display text-lg tracking-wide">Títulos de la cuenta regresiva</h4>
          <p className="mt-1 text-sm text-sepia">
            La línea chica va arriba; el título grande es el que ves ahora como
            “Hasta el inicio del festival”.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="cuenta_etiqueta">Línea chica</Label>
            <Input
              id="cuenta_etiqueta"
              value={config.cuenta_etiqueta}
              placeholder="Cuenta regresiva"
              onChange={(e) => update("cuenta_etiqueta", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cuenta_titulo">Título grande</Label>
            <Input
              id="cuenta_titulo"
              value={config.cuenta_titulo}
              placeholder="Hasta el inicio del lanzamiento"
              onChange={(e) => update("cuenta_titulo", e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cuenta_titulo_fin">Título cuando ya empezó</Label>
          <Input
            id="cuenta_titulo_fin"
            value={config.cuenta_titulo_fin}
            placeholder="La fiesta ha comenzado"
            onChange={(e) => update("cuenta_titulo_fin", e.target.value)}
          />
        </div>

        <div>
          <h4 className="font-display text-lg tracking-wide">Títulos del mapa</h4>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="mapa_titulo">Título del mapa</Label>
            <Input
              id="mapa_titulo"
              value={config.mapa_titulo}
              placeholder="Ubicación"
              onChange={(e) => update("mapa_titulo", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mapa_boton">Texto del botón</Label>
            <Input
              id="mapa_boton"
              value={config.mapa_boton}
              placeholder="Cómo llegar"
              onChange={(e) => update("mapa_boton", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ubicacion">Lugar (si no hay texto de lugar arriba)</Label>
          <Input
            id="ubicacion"
            value={config.ubicacion}
            onChange={(e) => update("ubicacion", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ubicacion_detalle">Detalle bajo el lugar</Label>
          <Input
            id="ubicacion_detalle"
            value={config.ubicacion_detalle}
            onChange={(e) => update("ubicacion_detalle", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mapa_url">Enlace del botón Cómo llegar</Label>
          <Input
            id="mapa_url"
            value={config.mapa_url}
            onChange={(e) => update("mapa_url", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mapa_embed">URL embed de Google Maps</Label>
          <Textarea
            id="mapa_embed"
            rows={3}
            value={config.mapa_embed}
            onChange={(e) => update("mapa_embed", e.target.value)}
          />
        </div>

        <Button type="button" variant="admin" onClick={() => void save()} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Guardar cambios
        </Button>
      </div>

      <div className="space-y-5 rounded-2xl border border-ocre/20 bg-white p-6 shadow-sm">
        <div>
          <h3 className="font-display text-xl tracking-wide">Confirmar presencia</h3>
          <p className="mt-1 text-sm text-sepia">
            Títulos, botones, pregunta de asistencia, etiquetas del formulario y
            el mensaje de agradecimiento.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="rsvp_etiqueta">Línea chica</Label>
            <Input
              id="rsvp_etiqueta"
              value={config.rsvp_etiqueta}
              placeholder="Confirmación de asistencia"
              onChange={(e) => update("rsvp_etiqueta", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rsvp_titulo">Título</Label>
            <Input
              id="rsvp_titulo"
              value={config.rsvp_titulo}
              placeholder="Confirmar Presencia"
              onChange={(e) => update("rsvp_titulo", e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="rsvp_boton_abrir">Botón inicial</Label>
            <Input
              id="rsvp_boton_abrir"
              value={config.rsvp_boton_abrir}
              placeholder="Confirmar asistencia"
              onChange={(e) => update("rsvp_boton_abrir", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rsvp_boton_enviar">Botón de envío</Label>
            <Input
              id="rsvp_boton_enviar"
              value={config.rsvp_boton_enviar}
              placeholder="Confirmar presencia"
              onChange={(e) => update("rsvp_boton_enviar", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="rsvp_boton_enviando">Texto mientras envía</Label>
          <Input
            id="rsvp_boton_enviando"
            value={config.rsvp_boton_enviando}
            placeholder="Enviando..."
            onChange={(e) => update("rsvp_boton_enviando", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rsvp_pregunta">Pregunta de asistencia</Label>
          <Input
            id="rsvp_pregunta"
            value={config.rsvp_pregunta}
            placeholder="¿Confirmará asistencia?"
            onChange={(e) => update("rsvp_pregunta", e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="rsvp_boton_si">Botón sí</Label>
            <Input
              id="rsvp_boton_si"
              value={config.rsvp_boton_si}
              placeholder="Sí, asistiré"
              onChange={(e) => update("rsvp_boton_si", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rsvp_boton_no">Botón no</Label>
            <Input
              id="rsvp_boton_no"
              value={config.rsvp_boton_no}
              placeholder="No podré"
              onChange={(e) => update("rsvp_boton_no", e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="rsvp_gracias_titulo">Título de agradecimiento</Label>
            <Input
              id="rsvp_gracias_titulo"
              value={config.rsvp_gracias_titulo}
              placeholder="Gracias"
              onChange={(e) => update("rsvp_gracias_titulo", e.target.value)}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="rsvp_gracias_texto">Texto de agradecimiento</Label>
            <Textarea
              id="rsvp_gracias_texto"
              rows={3}
              value={config.rsvp_gracias_texto}
              placeholder="Su confirmación ha sido registrada."
              onChange={(e) => update("rsvp_gracias_texto", e.target.value)}
            />
          </div>
        </div>

        <div>
          <h4 className="font-display text-lg tracking-wide">Etiquetas del formulario</h4>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="rsvp_label_nombre">Nombre</Label>
            <Input
              id="rsvp_label_nombre"
              value={config.rsvp_label_nombre}
              onChange={(e) => update("rsvp_label_nombre", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rsvp_label_apellido">Apellido</Label>
            <Input
              id="rsvp_label_apellido"
              value={config.rsvp_label_apellido}
              onChange={(e) => update("rsvp_label_apellido", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rsvp_label_cargo">Cargo</Label>
            <Input
              id="rsvp_label_cargo"
              value={config.rsvp_label_cargo}
              onChange={(e) => update("rsvp_label_cargo", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rsvp_label_institucion">Institución</Label>
            <Input
              id="rsvp_label_institucion"
              value={config.rsvp_label_institucion}
              onChange={(e) => update("rsvp_label_institucion", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rsvp_label_telefono">Teléfono</Label>
            <Input
              id="rsvp_label_telefono"
              value={config.rsvp_label_telefono}
              onChange={(e) => update("rsvp_label_telefono", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rsvp_label_email">Correo</Label>
            <Input
              id="rsvp_label_email"
              value={config.rsvp_label_email}
              onChange={(e) => update("rsvp_label_email", e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-ocre/20">
          <div className="flex flex-wrap items-center justify-between gap-2 bg-noche/5 px-4 py-2">
            <p className="font-ui text-xs uppercase tracking-[0.18em] text-sepia">
              Vista previa
            </p>
            <div className="flex flex-wrap gap-1">
              {(
                [
                  ["closed", "Botón"],
                  ["form", "Formulario"],
                  ["done", "Agradecimiento"],
                ] as const
              ).map(([state, label]) => (
                <button
                  key={state}
                  type="button"
                  className={cn(
                    "rounded-full px-3 py-1 font-ui text-[0.65rem] uppercase tracking-[0.14em]",
                    rsvpPreview === state
                      ? "bg-noche text-marfil"
                      : "bg-white text-sepia"
                  )}
                  onClick={() => setRsvpPreview(state)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-marfil">
            <RsvpForm config={config} preview previewState={rsvpPreview} />
          </div>
        </div>

        <Button type="button" variant="admin" onClick={() => void save()} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Guardar cambios
        </Button>
      </div>
    </div>
  );
}
