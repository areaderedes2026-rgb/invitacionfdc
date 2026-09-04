import type { CronogramaEvento } from "@/types";

export const WEEKDAYS_ES = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
] as const;

export function weekdayFromIso(isoDate: string) {
  if (!isoDate?.trim()) return "";
  const date = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(date.getTime())) return "";
  return WEEKDAYS_ES[date.getDay()];
}

export function dayShortLabel(dia: string) {
  const map: Record<string, string> = {
    Lunes: "Lun",
    Martes: "Mar",
    Miércoles: "Mié",
    Miercoles: "Mié",
    Jueves: "Jue",
    Viernes: "Vie",
    Sábado: "Sáb",
    Sabado: "Sáb",
    Domingo: "Dom",
  };
  const value = dia.trim();
  return map[value] || value.slice(0, 3) || "Día";
}

export function timeToMinutes(hora: string) {
  const match = hora.match(/(\d{1,2}):(\d{2})/);
  if (!match) return Number.MAX_SAFE_INTEGER;
  return Number(match[1]) * 60 + Number(match[2]);
}

export function toTimeInput(hora: string) {
  const match = hora.match(/(\d{1,2}):(\d{2})/);
  if (!match) return "";
  return `${match[1].padStart(2, "0")}:${match[2]}`;
}

export function sortEventsByTime(events: CronogramaEvento[]) {
  return [...events].sort((a, b) => {
    const byTime = timeToMinutes(a.hora) - timeToMinutes(b.hora);
    if (byTime !== 0) return byTime;
    return (a.titulo || "").localeCompare(b.titulo || "", "es");
  });
}

export type CronogramaDay = {
  dia: string;
  fecha: string;
  events: CronogramaEvento[];
};

export function groupCronogramaDays(events: CronogramaEvento[]): CronogramaDay[] {
  const items = Array.isArray(events) ? events : [];
  const map = new Map<string, CronogramaDay>();
  const order: string[] = [];

  for (const event of items) {
    const dia = event.dia?.trim() || weekdayFromIso(event.fecha) || "Día";
    const fecha = event.fecha?.trim() || "";
    const key = `${dia}|${fecha}`;
    if (!map.has(key)) {
      map.set(key, { dia, fecha, events: [] });
      order.push(key);
    }
    map.get(key)!.events.push(event);
  }

  return order.map((key) => {
    const day = map.get(key)!;
    return { ...day, events: sortEventsByTime(day.events) };
  });
}
