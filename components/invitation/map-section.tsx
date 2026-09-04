"use client";

import { useEffect, useState } from "react";
import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SiteConfig } from "@/types";

export function MapSection({ config }: { config: SiteConfig }) {
  const [loaded, setLoaded] = useState(false);
  const src = config.mapa_embed?.trim() || "";

  useEffect(() => {
    if (!src) {
      setLoaded(true);
      return;
    }
    setLoaded(false);
    const fallback = window.setTimeout(() => setLoaded(true), 4000);
    return () => window.clearTimeout(fallback);
  }, [src]);

  return (
    <section
      id="mapa"
      className="scroll-mt-16 w-full border-y border-ocre/20 py-10 sm:py-12"
      aria-labelledby="mapa-title"
    >
      <div className="w-full px-5 text-center sm:px-8 lg:px-12">
        <p
          id="mapa-title"
          data-gsap="fade-in"
          className="font-ui text-[0.62rem] uppercase tracking-[0.34em] text-ocre"
        >
          Ubicación
        </p>
      </div>

      <div className="relative mt-2 aspect-[16/10] w-full overflow-hidden bg-noche/10 sm:aspect-[21/9]">
        <div
          className={cn(
            "absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-noche/8 transition-opacity duration-500",
            loaded ? "pointer-events-none opacity-0" : "opacity-100"
          )}
          aria-hidden={loaded}
        >
          <MapPin className="h-7 w-7 text-ocre" strokeWidth={1.6} />
          <p className="font-ui text-[0.62rem] uppercase tracking-[0.22em] text-sepia">
            Cargando mapa
          </p>
        </div>

        {src ? (
          <iframe
            title="Mapa de ubicación"
            src={src}
            className={cn(
              "absolute inset-0 h-full w-full border-0 transition-opacity duration-500",
              loaded ? "opacity-100" : "opacity-0"
            )}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            onLoad={() => setLoaded(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="font-ui text-sm text-sepia">Mapa no disponible</p>
          </div>
        )}
      </div>

      <div className="w-full px-5 pt-5 sm:px-8 lg:px-12">
        <div data-gsap="fade-up" data-gsap-delay="0.08">
          <Button
            asChild
            variant="gold"
            className="h-11 w-full rounded-none text-xs tracking-[0.22em] touch-manipulation"
          >
            <a href={config.mapa_url} target="_blank" rel="noopener noreferrer">
              <Navigation className="h-4 w-4" aria-hidden />
              Cómo llegar
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
