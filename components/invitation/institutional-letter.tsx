"use client";

import { motion, useReducedMotion } from "framer-motion";
import { GoldRule, Ornament } from "@/components/shared/ornament";
import type { SiteConfig } from "@/types";

interface InstitutionalLetterProps {
  config: SiteConfig;
  /** Primera sección visible al abrir la invitación */
  isOpening?: boolean;
}

export function InstitutionalLetter({
  config,
  isOpening = false,
}: InstitutionalLetterProps) {
  const reduced = useReducedMotion();
  const paragraphs = config.carta.split("\n\n").filter(Boolean);

  return (
    <section
      id="carta"
      className={
        isOpening
          ? "relative z-10 flex min-h-dvh items-center scroll-mt-0 px-5 pb-16 pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-8 sm:pb-20 md:pb-24"
          : "relative z-10 scroll-mt-20 px-5 py-16 sm:px-8 sm:py-20 md:py-32"
      }
      aria-labelledby="carta-title"
    >
      <div className="mx-auto w-full max-w-3xl">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            delay: isOpening ? 0.15 : 0,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <motion.p
            className="text-center font-ui text-[0.62rem] uppercase tracking-[0.34em] text-ocre sm:text-xs"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: isOpening ? 0.2 : 0 }}
          >
            Invitación oficial · Edición 2026
          </motion.p>
          <h2
            id="carta-title"
            className="mt-3 text-center font-display text-[1.55rem] leading-tight tracking-[0.06em] text-noche sm:text-3xl md:text-4xl"
          >
            XXVII Fiesta Nacional e Internacional del Caballo
          </h2>
          <p className="mt-3 text-center font-editorial text-base italic text-ink-soft sm:text-lg">
            {config.subtitulo}
          </p>
          <motion.div
            initial={reduced ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.7,
              delay: isOpening ? 0.35 : 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Ornament className="my-6 sm:my-8" />
          </motion.div>

          <div className="space-y-5 font-editorial text-base leading-7 text-ink-soft sm:space-y-6 sm:text-lg sm:leading-8 md:text-xl md:leading-9">
            {paragraphs.map((paragraph, index) => (
              <motion.p
                key={index}
                initial={reduced ? false : { opacity: 0, y: 12 }}
                animate={isOpening ? { opacity: 1, y: 0 } : undefined}
                whileInView={isOpening ? undefined : { opacity: 1, y: 0 }}
                viewport={isOpening ? undefined : { once: true, amount: 0.35 }}
                transition={{
                  duration: 0.8,
                  delay: (isOpening ? 0.35 : 0) + index * 0.1,
                }}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>

          <GoldRule data-gsap="line" data-gsap-delay="0.55" className="my-8 origin-center sm:my-10" />

          <div className="mx-auto flex w-full max-w-xl items-stretch justify-center gap-3 sm:gap-6">
            {config.firmas.map((firma, index) => (
              <motion.div
                key={firma.nombre}
                className={`flex min-w-0 flex-1 flex-col items-center px-1 text-center sm:px-4 ${
                  index === 0 ? "border-r border-ocre/25" : ""
                }`}
                initial={reduced ? false : { opacity: 0, x: index === 0 ? -18 : 18 }}
                animate={isOpening ? { opacity: 1, x: 0 } : undefined}
                whileInView={isOpening ? undefined : { opacity: 1, x: 0 }}
                viewport={isOpening ? undefined : { once: true }}
                transition={{
                  delay: (isOpening ? 0.7 : 0.2) + index * 0.12,
                  duration: 0.9,
                }}
              >
                <p className="font-script text-[1.15rem] leading-tight text-noche sm:text-2xl md:text-[1.65rem]">
                  {firma.nombre}
                </p>
                <p className="mt-1.5 max-w-[11rem] font-ui text-[0.58rem] uppercase leading-snug tracking-[0.12em] text-sepia sm:max-w-none sm:text-[0.68rem] sm:tracking-[0.16em]">
                  {firma.cargo}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
