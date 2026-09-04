"use client";

import { motion } from "framer-motion";
import { useCountdown } from "@/hooks/use-countdown";
import { GoldRule } from "@/components/shared/ornament";
import type { SiteConfig } from "@/types";

function Unit({ label, value }: { label: string; value: number }) {
  return (
    <div
      data-gsap-item
      className="institutional-card flex aspect-square flex-col items-center justify-center rounded-2xl px-2 py-3 sm:aspect-auto sm:min-w-[7rem] sm:rounded-3xl sm:px-6 sm:py-5"
    >
      <motion.span
        key={value}
        initial={{ y: 8, opacity: 0.4 }}
        animate={{ y: 0, opacity: 1 }}
        className="font-display text-3xl text-noche sm:text-5xl"
      >
        {String(value).padStart(2, "0")}
      </motion.span>
      <span className="mt-1 font-ui text-[0.58rem] uppercase tracking-[0.2em] text-sepia sm:mt-2 sm:text-[0.65rem] sm:tracking-[0.25em]">
        {label}
      </span>
    </div>
  );
}

export function Countdown({ config }: { config: SiteConfig }) {
  const { days, hours, minutes, seconds, completed } = useCountdown(
    config.fecha_evento
  );

  return (
    <section
      id="cuenta"
      className="py-12 sm:py-16 md:py-20"
      aria-labelledby="cuenta-title"
    >
      <div className="mx-auto max-w-5xl px-5 text-center sm:px-6">
        <p
          data-gsap="fade-in"
          className="font-ui text-[0.65rem] uppercase tracking-[0.32em] text-ocre sm:text-xs"
        >
          Cuenta regresiva
        </p>
        <h2
          id="cuenta-title"
          data-gsap="fade-up"
          data-gsap-delay="0.08"
          className="mt-3 font-display text-2xl tracking-[0.06em] sm:text-3xl md:text-4xl"
        >
          {completed ? "La fiesta ha comenzado" : "Hasta el inicio del festival"}
        </h2>
        <GoldRule data-gsap="line" className="mx-auto my-5 origin-center" />

        <div
          className="mx-auto mt-8 grid max-w-md grid-cols-4 gap-2 sm:mt-10 sm:flex sm:max-w-none sm:flex-wrap sm:items-center sm:justify-center sm:gap-5"
          aria-live="polite"
          data-gsap-stagger="scale-in"
        >
          <Unit label="Días" value={days} />
          <Unit label="Horas" value={hours} />
          <Unit label="Min" value={minutes} />
          <Unit label="Seg" value={seconds} />
        </div>
      </div>
    </section>
  );
}
