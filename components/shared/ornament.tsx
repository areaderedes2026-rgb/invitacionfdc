import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/** Divisor geométrico institucional (sin imagen externa). */
export function Ornament({
  className,
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <div
      className={cn("mx-auto flex h-6 w-44 items-center justify-center gap-2", className)}
      aria-hidden
    >
      <span
        className={cn(
          "h-px flex-1 bg-gradient-to-r from-transparent",
          onDark ? "to-arena/80" : "to-ocre/70"
        )}
      />
      <span
        className={cn(
          "h-1.5 w-1.5 rotate-45 border bg-arena/40",
          onDark ? "border-arena/90" : "border-ocre/80"
        )}
      />
      <span
        className={cn(
          "h-2 w-2 rotate-45 border bg-transparent",
          onDark ? "border-marfil/35" : "border-noche/30"
        )}
      />
      <span
        className={cn(
          "h-1.5 w-1.5 rotate-45 border bg-arena/40",
          onDark ? "border-arena/90" : "border-ocre/80"
        )}
      />
      <span
        className={cn(
          "h-px flex-1 bg-gradient-to-l from-transparent",
          onDark ? "to-arena/80" : "to-ocre/70"
        )}
      />
    </div>
  );
}

export function GoldRule({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mx-auto h-px w-24 origin-center bg-gradient-to-r from-transparent via-ocre to-transparent",
        className
      )}
      aria-hidden
      {...props}
    />
  );
}
