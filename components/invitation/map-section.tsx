"use client";

import { Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SiteConfig } from "@/types";

export function MapSection({ config }: { config: SiteConfig }) {
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

      <div
        data-gsap="clip-up"
        className="relative mt-2 aspect-[16/10] w-full overflow-hidden bg-arena-clara/30 sm:aspect-[21/9]"
      >
        <iframe
          title="Mapa de ubicación"
          src={config.mapa_embed}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
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
