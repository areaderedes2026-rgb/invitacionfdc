import { redirect } from "next/navigation";
import Image from "next/image";
import { LoginForm } from "@/components/admin/login-form";
import { isAdminAuthenticated } from "@/lib/auth";

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-marfil px-4">
      <Image
        src="/images/brand/fondo-acuarela-oficial.png"
        alt=""
        fill
        className="object-cover opacity-35"
        sizes="100vw"
      />
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-ocre/25 bg-white/95 p-8 shadow-[0_24px_60px_rgba(26,23,51,0.18)] backdrop-blur">
        <p className="font-ui text-xs uppercase tracking-[0.3em] text-ocre">
          Panel administrativo
        </p>
        <h1 className="mt-2 font-display text-3xl tracking-wide text-noche">
          Acceso institucional
        </h1>
        <p className="mt-2 mb-8 text-sm text-sepia">
          Gestione el contenido que se muestra en la invitación pública.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
