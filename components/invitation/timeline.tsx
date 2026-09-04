"use client";

import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Clock } from "lucide-react";
import { CoverMedia } from "@/components/shared/cover-media";
import { cn } from "@/lib/utils";
import type { SiteConfig } from "@/types";

const DAY_SHORT: Record<string, string> = {
  Jueves: "Jue",
  Viernes: "Vie",
  Sábado: "Sáb",
  Domingo: "Dom",
};

function dayNumber(fecha: string) {
  const day = fecha.split("-")[2];
  return String(Number(day || 0));
}

function formatHora(hora: string) {
  const value = hora.trim();
  return /hs$/i.test(value) ? value : `${value} hs`;
}

function clampOverlay(value: number) {
  if (Number.isNaN(value)) return 58;
  return Math.min(100, Math.max(0, value));
}

export function Timeline({
  config,
  preview = false,
}: {
  config: SiteConfig;
  preview?: boolean;
}) {
  const reduced = useReducedMotion();
  const [brokenImage, setBrokenImage] = useState(false);
  const overlay = clampOverlay(Number(config.cronograma_overlay));
  const imageSrc = config.cronograma_fondo_url?.trim() || "";
  const showImage = Boolean(imageSrc) && !brokenImage;
  const title =
    config.cronograma_titulo?.trim() || "CRONOGRAMA DE ACTIVIDADES";

  useEffect(() => {
    setBrokenImage(false);
  }, [imageSrc]);

  const days = useMemo(() => {
    const map = new Map<string, typeof config.cronograma>();
    for (const event of config.cronograma) {
      const key = `${event.dia}|${event.fecha}`;
      const list = map.get(key) || [];
      list.push(event);
      map.set(key, list);
    }
    return Array.from(map.entries()).map(([key, events]) => {
      const [dia, fecha] = key.split("|");
      return { dia, fecha, events };
    });
  }, [config]);

  const [active, setActive] = useState(0);

  return (
    <section
      id="cronograma"
      className="relative isolate w-full overflow-hidden bg-noche-deep scroll-mt-0"
      aria-labelledby="cronograma-title"
    >
      {showImage ? (
        <div className="absolute inset-0 overflow-hidden" aria-hidden>
          <div
            className="absolute inset-[-8%]"
            data-kenburns={preview ? undefined : true}
          >
            <CoverMedia
              src={imageSrc}
              priority={!preview}
              onError={() => setBrokenImage(true)}
            />
          </div>
        </div>
      ) : null}

      <div
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(26, 23, 51, ${overlay / 100})` }}
      />

      <div
        className={cn(
          "relative z-10 mx-auto max-w-3xl px-5 sm:px-8",
          preview ? "py-10" : "py-16 sm:py-20 md:py-28"
        )}
      >
        <h2
          id="cronograma-title"
          data-gsap={preview ? undefined : "fade-up"}
          className="text-center font-display text-[clamp(1.35rem,4.6vw,2.35rem)] tracking-[0.12em] text-marfil"
        >
          {title}
        </h2>

        <div
          className="mt-8 grid grid-cols-4 overflow-hidden rounded-lg border border-marfil/20 sm:mt-10"
          role="tablist"
          aria-label="Días del festival"
          data-gsap={preview ? undefined : "fade-in"}
          data-gsap-delay={preview ? undefined : "0.12"}
        >
          {days.map((day, index) => {
            const selected = active === index;
            const number = dayNumber(day.fecha);
            return (
              <button
                key={`${day.dia}-${day.fecha}`}
                type="button"
                role="tab"
                id={`dia-tab-${index}`}
                aria-controls={`cronograma-panel-${index}`}
                aria-selected={selected}
                className={cn(
                  "min-h-12 px-1 py-3 font-ui text-[0.58rem] font-semibold uppercase leading-tight tracking-[0.08em] transition-colors touch-manipulation sm:min-h-14 sm:text-xs sm:tracking-[0.14em]",
                  index > 0 ? "border-l border-marfil/20" : "",
                  selected
                    ? "bg-arena text-noche"
                    : "bg-marfil/10 text-marfil/80 hover:bg-marfil/20"
                )}
                onClick={() => setActive(index)}
              >
                <span className="sm:hidden">
                  {DAY_SHORT[day.dia] || day.dia.slice(0, 3)} {number}
                </span>
                <span className="hidden sm:inline">
                  {day.dia} {number}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-2 grid">
          {days.map((day, dayIndex) => {
            const selected = active === dayIndex;
            return (
              <ul
                key={`${day.dia}-${day.fecha}`}
                id={`cronograma-panel-${dayIndex}`}
                role="tabpanel"
                aria-labelledby={`dia-tab-${dayIndex}`}
                aria-hidden={!selected}
                inert={!selected}
                className={cn(
                  "col-start-1 row-start-1 m-0 list-none p-0",
                  reduced || preview
                    ? ""
                    : "transition-opacity duration-300 ease-out",
                  selected
                    ? "z-10 opacity-100"
                    : "pointer-events-none z-0 opacity-0"
                )}
              >
                {day.events.map((event, index) => (
                  <li
                    key={event.id}
                    className={cn(
                      "flex items-start gap-3 py-5 sm:items-center sm:gap-4 sm:py-6",
                      index > 0 ? "border-t border-marfil/15" : ""
                    )}
                  >
                    <Clock
                      className="mt-0.5 h-5 w-5 shrink-0 text-arena sm:mt-0"
                      strokeWidth={1.6}
                      aria-hidden
                    />
                    <p className="min-w-0 text-pretty">
                      <span className="font-ui text-[0.95rem] font-semibold text-marfil sm:text-base">
                        {formatHora(event.hora)}
                      </span>
                      <span className="ml-2 font-editorial text-[1.05rem] text-marfil/80 sm:ml-3 sm:text-lg">
                        {event.titulo}
                      </span>
                    </p>
                  </li>
                ))}
              </ul>
            );
          })}
        </div>
      </div>
    </section>
  );
}
