"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarRange,
  FileText,
  ImageIcon,
  LayoutDashboard,
  Link2,
  LogOut,
  Music,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const nav = [
  { href: "/admin/dashboard", label: "Resumen", icon: LayoutDashboard },
  { href: "/admin/carta", label: "Carta", icon: FileText },
  { href: "/admin/evento", label: "Evento", icon: CalendarRange },
  { href: "/admin/cronograma", label: "Cronograma", icon: CalendarRange },
  { href: "/admin/galeria", label: "Galería", icon: ImageIcon },
  { href: "/admin/multimedia", label: "Multimedia", icon: Music },
  { href: "/admin/confirmaciones", label: "Confirmaciones", icon: Users },
  { href: "/admin/enlaces", label: "Enlaces", icon: Link2 },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="min-h-dvh bg-[#f7f2ea] font-ui text-ink">
      <div className="mx-auto grid min-h-dvh max-w-7xl gap-0 lg:grid-cols-[260px_1fr]">
        <aside className="border-r border-gold/20 bg-cream/80 p-5">
          <div className="mb-8">
            <p className="font-display text-sm tracking-[0.2em] text-wine">
              ADMIN
            </p>
            <h1 className="mt-1 font-display text-lg">Fiesta del Caballo</h1>
          </div>
          <nav className="space-y-1" aria-label="Administración">
            {nav.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-noche text-marfil"
                      : "text-ink-soft hover:bg-ocre/15"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <Button
            type="button"
            variant="outline"
            className="mt-8 w-full justify-start rounded-lg"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </Button>
        </aside>
        <main className="p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
