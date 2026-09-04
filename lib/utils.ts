import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const EVENT_TZ = "America/Argentina/Tucuman";

export function isValidDateValue(value?: string | Date | null) {
  if (value instanceof Date) return !Number.isNaN(value.getTime());
  if (!value || !String(value).trim()) return false;
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime());
}

export function formatDateEs(date: string | Date) {
  const value = typeof date === "string" ? new Date(date) : date;
  if (!isValidDateValue(value)) return "";
  return new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: EVENT_TZ,
  }).format(value);
}

function capitalizeEs(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function formatEventDateRange(start: string, end?: string | null) {
  const hasStart = isValidDateValue(start);
  const hasEnd = isValidDateValue(end);

  if (!hasStart && !hasEnd) return "";

  const part = (date: Date, options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("es-AR", { ...options, timeZone: EVENT_TZ }).format(date);

  const formatSingle = (date: Date) => {
    const day = part(date, { day: "numeric" });
    const month = capitalizeEs(part(date, { month: "long" }));
    const year = part(date, { year: "numeric" });
    return `${day} de ${month} de ${year}`;
  };

  if (!hasStart && hasEnd) return formatSingle(new Date(end as string));

  const from = new Date(start);
  if (!hasEnd) return formatSingle(from);

  const to = new Date(end as string);
  if (to.getTime() <= from.getTime()) return formatSingle(from);

  const startDay = part(from, { day: "numeric" });
  const endDay = part(to, { day: "numeric" });
  const startMonth = capitalizeEs(part(from, { month: "long" }));
  const endMonth = capitalizeEs(part(to, { month: "long" }));
  const startYear = part(from, { year: "numeric" });
  const endYear = part(to, { year: "numeric" });

  if (startDay === endDay && startMonth === endMonth && startYear === endYear) {
    return `${startDay} de ${startMonth} de ${startYear}`;
  }

  if (startMonth === endMonth && startYear === endYear) {
    return `${startDay} al ${endDay} de ${endMonth} de ${endYear}`;
  }

  if (startYear === endYear) {
    return `${startDay} de ${startMonth} al ${endDay} de ${endMonth} de ${endYear}`;
  }

  return `${startDay} de ${startMonth} de ${startYear} al ${endDay} de ${endMonth} de ${endYear}`;
}

export function formatEventTime(date: string) {
  if (!isValidDateValue(date)) return "";
  const time = new Intl.DateTimeFormat("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: EVENT_TZ,
  }).format(new Date(date));

  return `${time} hs`;
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
