"use client";

import { CoverMedia } from "@/components/shared/cover-media";
import { useEffect, useMemo, useState } from "react";
import { GoldRule } from "@/components/shared/ornament";
import { formatEventDateRange, formatEventTime } from "@/lib/utils";
import type { SiteConfig } from "@/types";

function clampOverlay(value: number) {
  if (Number.isNaN(value)) return 58;
  return Math.min(100, Math.max(0, value));
}

export function EventInfo({
  config,
  preview = false,
}: {
  config: SiteConfig;
  preview?: boolean;
}) {
  const [brokenImage, setBrokenImage] = useState(false);
  const overlay = clampOverlay(Number(config.evento_overlay));
  const imageSrc = config.evento_fondo_url?.trim() || "";
  const showImage = Boolean(imageSrc) && !brokenImage;

  useEffect(() => {
    setBrokenImage(false);
  }, [imageSrc]);

  const facts = useMemo(
    () =>
      [
        {
          label: "Fecha",
          value:
            config.evento_fecha_texto?.trim() ||
            formatEventDateRange(config.fecha_evento, config.fecha_fin),
        },
        {
          label: "Hora",
          value:
            config.evento_hora_texto?.trim() || formatEventTime(config.fecha_evento),
        },
        {
          label: "Lugar",
          value: config.evento_lugar_texto?.trim() || config.ubicacion,
          detail: config.ubicacion_detalle,
        },
      ].filter((fact) => Boolean(fact.value)),
    [config]
  );

  return (
    <section
      id="evento"
      className="relative isolate w-full overflow-hidden bg-noche-deep scroll-mt-0"
      aria-labelledby="evento-title"
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

      <h2 id="evento-title" className="sr-only">
        Fecha, hora y lugar
      </h2>

      <div className={`relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center justify-center px-5 text-center sm:px-8 ${
        preview
          ? "min-h-[22rem] py-10"
          : "min-h-[72dvh] py-20 sm:min-h-[78dvh] sm:py-24"
      }`}>
        {facts.map((fact, index) => {
          const motionPreset = ["fade-up", "scale-in", "fade-right"] as const;

          return (
            <div
              key={fact.label}
              className="flex w-full flex-col items-center"
              data-gsap={preview ? undefined : motionPreset[index] || "fade-up"}
              data-gsap-delay={preview ? undefined : String(index * 0.1)}
            >
              {index > 0 ? (
                <GoldRule className="my-8 w-16 origin-center via-arena sm:my-10" />
              ) : null}

              <p className="font-ui text-[0.68rem] uppercase tracking-[0.38em] text-arena sm:text-xs sm:tracking-[0.42em]">
                {fact.label}
              </p>
              <p className="mt-3 text-balance font-display text-[clamp(1.85rem,7.2vw,3.75rem)] leading-[1.12] tracking-[0.04em] text-marfil sm:tracking-[0.06em]">
                {fact.value}
              </p>
              {fact.detail ? (
                <p className="mt-3 max-w-md font-editorial text-lg leading-snug text-marfil/75 sm:text-xl">
                  {fact.detail}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
