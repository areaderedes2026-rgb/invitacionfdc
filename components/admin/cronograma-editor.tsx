"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { Timeline } from "@/components/invitation/timeline";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  toTimeInput,
  weekdayFromIso,
} from "@/lib/cronograma";
import type { CronogramaEvento, SiteConfig } from "@/types";

type ActivityDraft = {
  id: string;
  hora: string;
  titulo: string;
  descripcion: string;
  tipo: CronogramaEvento["tipo"];
};

type DayDraft = {
  id: string;
  dia: string;
  fecha: string;
  activities: ActivityDraft[];
};

function eventsToDays(events: CronogramaEvento[]): DayDraft[] {
  const list = Array.isArray(events) ? events : [];
  const map = new Map<string, DayDraft>();
  const order: string[] = [];

  for (const event of list) {
    const dia = event.dia?.trim() || weekdayFromIso(event.fecha) || "";
    const fecha = event.fecha?.trim() || "";
    const key = `${dia}|${fecha}`;
    if (!map.has(key)) {
      map.set(key, {
        id: crypto.randomUUID(),
        dia,
        fecha,
        activities: [],
      });
      order.push(key);
    }
    map.get(key)!.activities.push({
      id: event.id || crypto.randomUUID(),
      hora: toTimeInput(event.hora) || "10:00",
      titulo: event.titulo || "",
      descripcion: event.descripcion || "",
      tipo: event.tipo || "oficial",
    });
  }

  return order.map((key) => map.get(key)!);
}

function daysToEvents(days: DayDraft[]): CronogramaEvento[] {
  return days.flatMap((day) =>
    day.activities.map((activity) => ({
      id: activity.id,
      dia: day.dia.trim() || weekdayFromIso(day.fecha) || "Día",
      fecha: day.fecha.trim(),
      hora: activity.hora || "00:00",
      titulo: activity.titulo.trim() || "Actividad",
      descripcion: activity.descripcion.trim(),
      tipo: activity.tipo || "oficial",
    }))
  );
}

function createActivity(): ActivityDraft {
  return {
    id: crypto.randomUUID(),
    hora: "10:00",
    titulo: "",
    descripcion: "",
    tipo: "oficial",
  };
}

export function CronogramaEditor({ initialConfig }: { initialConfig: SiteConfig }) {
  const [config, setConfig] = useState(initialConfig);
  const [days, setDays] = useState<DayDraft[]>(() =>
    eventsToDays(initialConfig.cronograma)
  );
  const [saving, setSaving] = useState(false);
  const [newDia, setNewDia] = useState("");
  const [newFecha, setNewFecha] = useState("");

  const previewConfig = useMemo(
    () => ({ ...config, cronograma: daysToEvents(days) }),
    [config, days]
  );

  const update = <K extends keyof SiteConfig>(key: K, value: SiteConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const addDay = () => {
    if (!newFecha) {
      toast.error("Elegí la fecha del día.");
      return;
    }
    const dia = newDia.trim() || weekdayFromIso(newFecha) || "Día";
    setDays((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        dia,
        fecha: newFecha,
        activities: [createActivity()],
      },
    ]);
    setNewDia("");
    setNewFecha("");
    toast.success(`Día agregado: ${dia}`);
  };

  const updateDay = (dayId: string, patch: Partial<Pick<DayDraft, "dia" | "fecha">>) => {
    setDays((prev) =>
      prev.map((day) => (day.id === dayId ? { ...day, ...patch } : day))
    );
  };

  const removeDay = (dayId: string) => {
    setDays((prev) => prev.filter((day) => day.id !== dayId));
  };

  const addActivity = (dayId: string) => {
    setDays((prev) =>
      prev.map((day) =>
        day.id === dayId
          ? { ...day, activities: [...day.activities, createActivity()] }
          : day
      )
    );
  };

  const updateActivity = (
    dayId: string,
    activityId: string,
    patch: Partial<ActivityDraft>
  ) => {
    setDays((prev) =>
      prev.map((day) =>
        day.id === dayId
          ? {
              ...day,
              activities: day.activities.map((activity) =>
                activity.id === activityId ? { ...activity, ...patch } : activity
              ),
            }
          : day
      )
    );
  };

  const removeActivity = (dayId: string, activityId: string) => {
    setDays((prev) =>
      prev.map((day) =>
        day.id === dayId
          ? {
              ...day,
              activities: day.activities.filter((activity) => activity.id !== activityId),
            }
          : day
      )
    );
  };

  const save = async () => {
    const cronograma = daysToEvents(days);
    const emptyDay = days.find((day) => !day.fecha.trim());
    if (emptyDay) {
      toast.error("Cada día necesita una fecha.");
      return;
    }

    setSaving(true);
    try {
      const payload = { ...config, cronograma };
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
      toast.success("Cronograma guardado");
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
          <h2 className="mt-1 font-display text-3xl tracking-wide">Cronograma</h2>
          <p className="mt-2 max-w-2xl text-sm text-sepia">
            Creá los días que quieras y, adentro de cada uno, las actividades con
            su horario. Después podés editarlas o borrarlas.
          </p>
        </div>
        <Button type="button" variant="admin" onClick={() => void save()} disabled={saving}>
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

        <ImageUploadField
          id="cronograma_fondo_url"
          label="Imagen de fondo"
          hint="JPG, PNG o WEBP · máximo 3 MB"
          folder="cronograma"
          value={config.cronograma_fondo_url || ""}
          onChange={(url) => update("cronograma_fondo_url", url)}
        />

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
            <Timeline config={previewConfig} preview />
          </div>
        </div>
      </div>

      <section className="space-y-4 rounded-2xl border border-ocre/20 bg-white p-6 shadow-sm">
        <div>
          <h3 className="font-display text-xl tracking-wide">Agregar un día</h3>
          <p className="mt-1 text-sm text-sepia">
            Poné el nombre y la fecha. Si el nombre queda vacío, se completa
            solo (Lunes, Martes, etc.).
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <div className="space-y-2">
            <Label htmlFor="nuevo_dia">Nombre del día</Label>
            <Input
              id="nuevo_dia"
              value={newDia}
              placeholder="Lunes"
              onChange={(e) => setNewDia(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nueva_fecha">Fecha</Label>
            <Input
              id="nueva_fecha"
              type="date"
              value={newFecha}
              onChange={(e) => {
                const value = e.target.value;
                setNewFecha(value);
                if (!newDia.trim() && value) setNewDia(weekdayFromIso(value));
              }}
            />
          </div>
          <Button type="button" variant="outline" className="rounded-lg" onClick={addDay}>
            <Plus className="h-4 w-4" />
            Agregar día
          </Button>
        </div>
      </section>

      {days.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-ocre/30 bg-white px-5 py-10 text-center text-sm text-sepia">
          Todavía no hay días. Agregá el primero arriba.
        </p>
      ) : null}

      <div className="space-y-6">
        {days.map((day, dayIndex) => (
          <section
            key={day.id}
            className="space-y-4 rounded-2xl border border-ocre/20 bg-white p-5 shadow-sm sm:p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-ui text-[0.62rem] uppercase tracking-[0.22em] text-ocre">
                  Día {dayIndex + 1}
                </p>
                <h3 className="mt-1 font-display text-xl tracking-wide text-noche">
                  {day.dia || "Sin nombre"}
                  {day.fecha ? ` · ${day.fecha.slice(8, 10)}` : ""}
                </h3>
              </div>
              <Button
                type="button"
                variant="ghost"
                className="text-noche"
                onClick={() => removeDay(day.id)}
              >
                <Trash2 className="h-4 w-4" />
                Borrar día
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Nombre del día</Label>
                <Input
                  value={day.dia}
                  placeholder="Lunes"
                  onChange={(e) => updateDay(day.id, { dia: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Fecha</Label>
                <Input
                  type="date"
                  value={day.fecha}
                  onChange={(e) => {
                    const value = e.target.value;
                    updateDay(day.id, {
                      fecha: value,
                      dia: day.dia.trim() ? day.dia : weekdayFromIso(value),
                    });
                  }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium text-noche">
                  Actividades ({day.activities.length})
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-lg"
                  onClick={() => addActivity(day.id)}
                >
                  <Plus className="h-4 w-4" />
                  Agregar actividad
                </Button>
              </div>

              {day.activities.length === 0 ? (
                <p className="rounded-xl border border-dashed border-ocre/30 px-4 py-6 text-center text-sm text-sepia">
                  Este día no tiene actividades. Agregá una.
                </p>
              ) : null}

              {day.activities.map((activity, activityIndex) => (
                <div
                  key={activity.id}
                  className="space-y-3 rounded-xl border border-ocre/15 bg-marfil/60 p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs uppercase tracking-[0.16em] text-sepia">
                      Actividad {activityIndex + 1}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Eliminar actividad"
                      onClick={() => removeActivity(day.id, activity.id)}
                    >
                      <Trash2 className="h-4 w-4 text-noche" />
                    </Button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-[8.5rem_1fr]">
                    <div className="space-y-2">
                      <Label>Hora</Label>
                      <Input
                        type="time"
                        value={activity.hora}
                        onChange={(e) =>
                          updateActivity(day.id, activity.id, { hora: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Actividad</Label>
                      <Input
                        value={activity.titulo}
                        placeholder="Apertura, acto, show..."
                        onChange={(e) =>
                          updateActivity(day.id, activity.id, { titulo: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Nota (opcional, no se muestra en la invitación)</Label>
                    <Textarea
                      rows={2}
                      value={activity.descripcion}
                      onChange={(e) =>
                        updateActivity(day.id, activity.id, {
                          descripcion: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {days.length > 0 ? (
        <Button type="button" variant="admin" onClick={() => void save()} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Guardar cambios
        </Button>
      ) : null}
    </div>
  );
}
