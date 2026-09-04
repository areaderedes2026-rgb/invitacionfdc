"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarRange,
  FileText,
  LayoutDashboard,
  Link2,
  LogOut,
  MapPin,
  Menu,
  Users,
  Volume2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const nav = [
  { href: "/admin/dashboard", label: "Resumen", icon: LayoutDashboard },
  { href: "/admin/carta", label: "Inicio y carta", icon: FileText },
  { href: "/admin/evento", label: "Evento y mapa", icon: MapPin },
  { href: "/admin/cronograma", label: "Cronograma", icon: CalendarRange },
  { href: "/admin/multimedia", label: "Audio y video", icon: Volume2 },
  { href: "/admin/confirmaciones", label: "Confirmaciones", icon: Users },
  { href: "/admin/enlaces", label: "Enlaces", icon: Link2 },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  };

  const NavLinks = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="space-y-1" aria-label="Administración">
      {nav.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              active
                ? "bg-arena/20 text-marfil"
                : "text-marfil/70 hover:bg-white/5 hover:text-marfil"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-dvh bg-marfil font-ui text-noche">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-ocre/15 bg-noche px-4 py-3 text-marfil lg:hidden">
        <div>
          <p className="font-ui text-[0.58rem] uppercase tracking-[0.22em] text-arena">
            Admin
          </p>
          <p className="font-display text-sm tracking-wide">Fiesta del Caballo</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-marfil hover:bg-white/10"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </header>

      {open ? (
        <div className="fixed inset-0 z-30 bg-noche/95 px-4 pb-8 pt-20 lg:hidden">
          <NavLinks onNavigate={() => setOpen(false)} />
          <Button
            type="button"
            variant="outline"
            className="mt-8 w-full justify-start rounded-lg border-marfil/20 text-marfil hover:bg-white/10"
            onClick={() => void logout()}
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>
      ) : null}

      <div className="mx-auto grid min-h-dvh max-w-7xl lg:grid-cols-[240px_1fr]">
        <aside className="sticky top-0 hidden h-dvh flex-col border-r border-noche/80 bg-noche p-5 text-marfil lg:flex">
          <div className="mb-8">
            <p className="font-ui text-[0.62rem] uppercase tracking-[0.28em] text-arena">
              Panel admin
            </p>
            <h1 className="mt-2 font-display text-lg leading-tight tracking-wide">
              Fiesta del Caballo
            </h1>
          </div>
          <div className="flex-1">
            <NavLinks />
          </div>
          <div className="space-y-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="block px-3 font-ui text-xs text-marfil/50 underline-offset-4 hover:text-arena hover:underline"
            >
              Ver invitación
            </a>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-start rounded-lg border-marfil/20 text-marfil hover:bg-white/10"
              onClick={() => void logout()}
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </Button>
          </div>
        </aside>
        <main className="p-5 pb-16 sm:p-8 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
