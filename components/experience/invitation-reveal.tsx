"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useExperienceStore } from "@/store/experience-store";

/**
 * Apertura institucional premium:
 * sello + destello dorado + disolución elegante.
 */
export function InvitationReveal() {
  const { curtainAnimating, completeCurtain } = useExperienceStore();
  const reduced = useReducedMotion();
  const duration = reduced ? 0.2 : 1.55;

  useEffect(() => {
    if (!curtainAnimating) return;
    const timeout = window.setTimeout(
      () => completeCurtain(),
      reduced ? 240 : 1600
    );
    return () => window.clearTimeout(timeout);
  }, [curtainAnimating, completeCurtain, reduced]);

  return (
    <AnimatePresence>
      {curtainAnimating ? (
        <motion.div
          key="invitation-reveal"
          className="pointer-events-none fixed inset-0 z-[80] overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <motion.div
            className="absolute inset-0 bg-marfil"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration, times: [0, 0.38, 1], ease: "easeInOut" }}
          />

          <motion.div
            className="absolute left-1/2 top-1/2 h-[120vmax] w-[120vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(179,149,97,0.5) 0%, rgba(251,251,248,0.28) 26%, transparent 60%)",
            }}
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: 1.05, opacity: [0, 1, 0] }}
            transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
          />

          <motion.div
            className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0.55, opacity: 0 }}
            animate={{
              scale: [0.55, 1, 1.2],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration,
              times: [0, 0.42, 1],
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="relative flex h-32 w-32 items-center justify-center sm:h-40 sm:w-40">
              <span className="absolute inset-0 rounded-full border border-ocre/70 shadow-[0_0_40px_rgba(148,108,38,0.28)]" />
              <span className="absolute inset-[5px] rounded-full border border-noche/15" />
              <span className="absolute inset-[5px] rounded-full bg-marfil/85 backdrop-blur-sm" />
              <Image
                src="/images/brand/logo-oficial.png"
                alt=""
                width={96}
                height={96}
                priority
                className="relative z-10 h-[4.5rem] w-[4.5rem] object-contain sm:h-24 sm:w-24"
              />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
