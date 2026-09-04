import Image from "next/image";
import { Ornament } from "@/components/shared/ornament";
import type { SiteConfig } from "@/types";

export function Footer({ config }: { config: SiteConfig }) {
  return (
    <footer className="relative z-10 overflow-hidden bg-noche text-marfil pb-[max(7.25rem,calc(5.75rem+env(safe-area-inset-bottom)))]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-arena to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(179,149,97,0.12),transparent_52%)]"
      />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-5 pt-14 text-center sm:px-8 sm:pt-16 md:pt-20">
        <div
          data-gsap="scale-in"
          className="relative h-12 w-full max-w-lg sm:h-14 sm:max-w-xl md:h-16 md:max-w-2xl"
        >
          <Image
            src="/images/oficiales/morenos-blanco.png"
            alt="Intendente Antonio Moreno · Legislador Roberto Moreno"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 90vw, 672px"
            priority={false}
          />
        </div>

        <div data-gsap="fade-in" data-gsap-delay="0.1">
          <Ornament onDark className="mt-8 sm:mt-10" />
        </div>

        <p
          data-gsap="fade-up"
          data-gsap-delay="0.08"
          className="mt-6 max-w-xl text-balance font-display text-[clamp(1.05rem,3.4vw,1.65rem)] leading-tight tracking-[0.08em] text-marfil"
        >
          {config.titulo}
        </p>
        <p
          data-gsap="fade-up"
          data-gsap-delay="0.16"
          className="mt-3 font-editorial text-lg italic text-marfil/70 sm:text-xl"
        >
          {config.subtitulo}
        </p>
        <p
          data-gsap="fade-down"
          data-gsap-delay="0.22"
          className="mt-4 font-ui text-[0.65rem] uppercase tracking-[0.28em] text-arena/90 sm:text-[0.7rem]"
        >
          Edición 2026
        </p>
      </div>
    </footer>
  );
}
