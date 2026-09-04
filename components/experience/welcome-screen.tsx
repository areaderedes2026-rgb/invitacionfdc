"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { SealButton } from "@/components/experience/seal-button";
import { GoldRule } from "@/components/shared/ornament";
import { useExperienceStore } from "@/store/experience-store";
import type { SiteConfig } from "@/types";

export function WelcomeScreen({ config }: { config: SiteConfig }) {
  const { invitationOpened, curtainAnimating, openInvitation } =
    useExperienceStore();
  const reduced = useReducedMotion();

  if (invitationOpened) return null;

  return (
    <section
      className="fixed inset-0 z-40 flex min-h-dvh items-center justify-center overflow-hidden px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))]"
      aria-label="Pantalla de bienvenida"
    >
      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-[26rem] flex-col items-center px-2 text-center sm:max-w-xl"
        initial={reduced ? false : { opacity: 0, y: 18 }}
        animate={
          curtainAnimating
            ? { opacity: 0, scale: 1.03, filter: "blur(6px)" }
            : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
        }
        transition={{
          duration: curtainAnimating ? 0.7 : 1.05,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className="relative w-full rounded-[1.4rem] border border-ocre/25 px-5 py-8 sm:rounded-[1.75rem] sm:px-10 sm:py-10">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-3 rounded-[1.1rem] border border-noche/8 sm:inset-4"
          />

          <p className="relative font-ui text-[0.62rem] uppercase tracking-[0.34em] text-ocre sm:text-[0.68rem]">
            Invitación oficial
          </p>

          <p className="relative mt-4 font-script text-[2.05rem] leading-none text-noche sm:mt-5 sm:text-4xl md:text-5xl">
            {config.bienvenida}
          </p>

          <GoldRule className="relative my-5 w-28 sm:my-6 sm:w-36" />

          <div className="relative mx-auto h-[12.5rem] w-full max-w-[15.5rem] sm:h-[16rem] sm:max-w-[19rem] md:h-[18rem] md:max-w-[21rem]">
            <Image
              src={config.logo_fiesta}
              alt="Logo oficial XXVII Fiesta Nacional e Internacional del Caballo · Edición 2026"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 248px, 336px"
              priority
            />
          </div>

          <p className="relative mt-4 font-editorial text-base italic text-ink-soft sm:text-lg">
            {config.subtitulo}
          </p>

          <div className="relative mt-8 flex justify-center sm:mt-9">
            <SealButton disabled={curtainAnimating} onClick={openInvitation}>
              Abrir Invitación
            </SealButton>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
