"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SealButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function SealButton({
  children,
  onClick,
  disabled,
  className,
}: SealButtonProps) {
  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={onClick}
      whileTap={disabled ? undefined : { scale: 0.985 }}
      whileHover={disabled ? undefined : { y: -1 }}
      className={cn(
        "group relative isolate min-h-14 w-full max-w-[280px] touch-manipulation overflow-hidden rounded-sm px-8 py-4 disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
    >
      {/* Marco doble institucional */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-sm border border-ocre/70"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[3px] rounded-sm border border-noche/20"
      />

      {/* Relleno elegante */}
      <span
        aria-hidden
        className="absolute inset-[3px] bg-gradient-to-b from-[#2f2a5c] via-noche to-noche-deep transition-all duration-500 group-hover:from-[#3a3468] group-hover:via-[#2b2654]"
      />

      {/* Brillo dorado sutil */}
      <span
        aria-hidden
        className="absolute inset-x-6 top-[3px] h-px bg-gradient-to-r from-transparent via-arena/80 to-transparent"
      />
      <span
        aria-hidden
        className="absolute inset-x-8 bottom-[3px] h-px bg-gradient-to-r from-transparent via-ocre/50 to-transparent"
      />

      {/* Shine sweep */}
      <span
        aria-hidden
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full"
      />

      <span className="relative z-10 flex items-center justify-center gap-3 font-ui text-[0.72rem] font-medium uppercase tracking-[0.28em] text-marfil">
        <span
          aria-hidden
          className="h-1.5 w-1.5 rounded-full bg-arena shadow-[0_0_10px_rgba(179,149,97,0.8)]"
        />
        {children}
        <span
          aria-hidden
          className="h-1.5 w-1.5 rounded-full bg-arena shadow-[0_0_10px_rgba(179,149,97,0.8)]"
        />
      </span>
    </motion.button>
  );
}
