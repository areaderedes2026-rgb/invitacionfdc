"use client";

import { useEffect, useState } from "react";
import {
  CalendarRange,
  MapPin,
  ScrollText,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "#carta", label: "Carta", icon: ScrollText },
  { href: "#evento", label: "Evento", icon: Info },
  { href: "#mapa", label: "Mapa", icon: MapPin },
  { href: "#cronograma", label: "Agenda", icon: CalendarRange },
];

export function MobileDock() {
  const [active, setActive] = useState("#carta");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 80);

      const sections = [
        "#carta",
        "#evento",
        "#cuenta",
        "#mapa",
        "#cronograma",
      ];

      let current = "#carta";
      for (const id of sections) {
        const el = document.querySelector(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= 140) current = id;
      }

      if (current === "#cuenta") current = "#evento";
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-[55] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 transition-all duration-500",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-8 opacity-0"
      )}
    >
      <div className="mx-auto flex max-w-lg items-center rounded-[1.6rem] border border-arena/30 bg-marfil/92 p-2 shadow-[0_16px_50px_rgba(26,23,51,0.28)] backdrop-blur-xl">
        <nav
          className="grid w-full grid-cols-4 gap-1"
          aria-label="Navegación"
        >
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-2xl px-1 py-1.5 transition-colors",
                  isActive ? "bg-noche text-marfil" : "text-ink-soft"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
                <span className="font-ui text-[0.58rem] tracking-wide">
                  {item.label}
                </span>
              </a>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
