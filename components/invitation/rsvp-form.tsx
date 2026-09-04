"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoldRule } from "@/components/shared/ornament";
import { cn, textOr } from "@/lib/utils";
import { useExperienceStore } from "@/store/experience-store";
import type { SiteConfig } from "@/types";

const schema = z.object({
  nombre: z.string().min(2, "Ingrese su nombre"),
  apellido: z.string().min(2, "Ingrese su apellido"),
  cargo: z.string().min(2, "Ingrese su cargo"),
  institucion: z.string().min(2, "Ingrese su institución"),
  telefono: z.string().min(6, "Ingrese un teléfono válido"),
  email: z.string().email("Ingrese un correo válido"),
  asistencia: z.enum(["si", "no"], {
    required_error: "Seleccione una opción",
  }),
});

type FormValues = z.infer<typeof schema>;

const fieldClass =
  "h-10 rounded-none border-0 border-b border-ocre/30 bg-transparent px-0 shadow-none focus-visible:border-ocre focus-visible:ring-0";

const labelClass = "text-[0.62rem] uppercase tracking-[0.18em] text-ocre";

export function RsvpForm({ config }: { config?: SiteConfig }) {
  const enlaceOrigen = useExperienceStore((s) => s.enlaceOrigen);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [open, setOpen] = useState(false);
  const [asistenciaUi, setAsistenciaUi] = useState<"si" | "no">("si");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      asistencia: "si",
    },
  });

  const chooseAsistencia = (value: "si" | "no") => {
    setAsistenciaUi(value);
    setValue("asistencia", value, { shouldValidate: true });
  };

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, enlace_origen: enlaceOrigen }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "No se pudo registrar la confirmación");
      }

      setDone(true);
      toast.success("Confirmación registrada con éxito");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error inesperado");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="confirmar"
      className="scroll-mt-16 w-full border-y border-ocre/20 py-10 sm:py-12"
      aria-labelledby="rsvp-title"
    >
      <div className="w-full px-5 sm:px-8 lg:px-12">
        <div className="text-center">
          <p
            data-gsap="fade-in"
            className="font-ui text-[0.62rem] uppercase tracking-[0.34em] text-ocre"
          >
            {textOr(config?.rsvp_etiqueta, "Confirmación de asistencia")}
          </p>
          <h2
            id="rsvp-title"
            data-gsap="fade-up"
            data-gsap-delay="0.06"
            className="mt-2 font-display text-xl tracking-[0.08em] sm:text-2xl"
          >
            {textOr(config?.rsvp_titulo, "Confirmar Presencia")}
          </h2>
          <GoldRule data-gsap="line" className="my-4 w-16 origin-center" />
        </div>

        {done ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-xl py-4 text-center"
          >
            <CheckCircle2 className="mx-auto h-8 w-8 text-ocre" />
            <p className="mt-3 font-script text-3xl text-noche">Gracias</p>
            <p className="mt-2 font-editorial text-base text-ink-soft sm:text-lg">
              Su confirmación ha sido registrada. Será un honor recibirlo/a en
              Trancas.
            </p>
          </motion.div>
        ) : open ? (
          <motion.form
            className="mx-auto w-full max-w-5xl space-y-5"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="nombre" className={labelClass}>
                  Nombre
                </Label>
                <Input
                  id="nombre"
                  autoComplete="given-name"
                  enterKeyHint="next"
                  className={fieldClass}
                  {...register("nombre")}
                />
                {errors.nombre ? (
                  <p className="font-ui text-xs text-noche">{errors.nombre.message}</p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="apellido" className={labelClass}>
                  Apellido
                </Label>
                <Input
                  id="apellido"
                  autoComplete="family-name"
                  enterKeyHint="next"
                  className={fieldClass}
                  {...register("apellido")}
                />
                {errors.apellido ? (
                  <p className="font-ui text-xs text-noche">
                    {errors.apellido.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cargo" className={labelClass}>
                  Cargo
                </Label>
                <Input
                  id="cargo"
                  enterKeyHint="next"
                  className={fieldClass}
                  {...register("cargo")}
                />
                {errors.cargo ? (
                  <p className="font-ui text-xs text-noche">{errors.cargo.message}</p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="institucion" className={labelClass}>
                  Institución
                </Label>
                <Input
                  id="institucion"
                  enterKeyHint="next"
                  className={fieldClass}
                  {...register("institucion")}
                />
                {errors.institucion ? (
                  <p className="font-ui text-xs text-noche">
                    {errors.institucion.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="telefono" className={labelClass}>
                  Teléfono
                </Label>
                <Input
                  id="telefono"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  enterKeyHint="next"
                  className={fieldClass}
                  {...register("telefono")}
                />
                {errors.telefono ? (
                  <p className="font-ui text-xs text-noche">
                    {errors.telefono.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className={labelClass}>
                  Correo electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  enterKeyHint="done"
                  className={fieldClass}
                  {...register("email")}
                />
                {errors.email ? (
                  <p className="font-ui text-xs text-noche">{errors.email.message}</p>
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <Label className={labelClass}>¿Confirmará asistencia?</Label>
              <div className="grid grid-cols-2 gap-px overflow-hidden border border-ocre/30">
                <button
                  type="button"
                  className={cn(
                    "min-h-10 font-ui text-xs uppercase tracking-[0.14em] touch-manipulation",
                    asistenciaUi === "si"
                      ? "bg-noche text-marfil"
                      : "bg-transparent text-noche"
                  )}
                  onClick={() => chooseAsistencia("si")}
                >
                  Sí, asistiré
                </button>
                <button
                  type="button"
                  className={cn(
                    "min-h-10 font-ui text-xs uppercase tracking-[0.14em] touch-manipulation",
                    asistenciaUi === "no"
                      ? "bg-noche text-marfil"
                      : "bg-transparent text-noche"
                  )}
                  onClick={() => chooseAsistencia("no")}
                >
                  No podré
                </button>
              </div>
              {errors.asistencia ? (
                <p className="font-ui text-xs text-noche">
                  {errors.asistencia.message}
                </p>
              ) : null}
            </div>

            <Button
              type="submit"
              variant="gold"
              className="mt-1 h-11 w-full rounded-none text-xs tracking-[0.22em] touch-manipulation"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Confirmar presencia"
              )}
            </Button>
          </motion.form>
        ) : (
          <div data-gsap="scale-in" data-gsap-delay="0.1" className="mt-5">
            <Button
              type="button"
              variant="gold"
              className="h-11 w-full rounded-none text-xs tracking-[0.22em] touch-manipulation"
              onClick={() => setOpen(true)}
            >
              Confirmar asistencia
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
