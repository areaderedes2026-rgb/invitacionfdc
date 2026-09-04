"use client";

import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ImageUploadField({
  id,
  label,
  hint,
  value,
  folder,
  onChange,
}: {
  id: string;
  label: string;
  hint?: string;
  value: string;
  folder: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [broken, setBroken] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", folder);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "No se pudo subir");
      onChange(data.url);
      setBroken(false);
      toast.success("Imagen subida");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al subir");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        placeholder="/images/... o https://..."
        onChange={(e) => {
          setBroken(false);
          onChange(e.target.value);
        }}
      />
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void upload(file);
          }}
        />
        <Button
          type="button"
          variant="outline"
          className="rounded-lg"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          Subir desde la PC
        </Button>
        {hint ? <p className="text-xs text-sepia">{hint}</p> : null}
      </div>
      <p className="text-xs text-sepia">
        Después de subir, tocá Guardar cambios para que se vea en la invitación.
      </p>
      {value && !broken ? (
        <div className="flex h-36 items-center justify-center overflow-hidden rounded-xl border border-ocre/15 bg-marfil">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt=""
            className="max-h-36 w-full object-contain"
            onError={() => setBroken(true)}
          />
        </div>
      ) : value ? (
        <p className="text-sm text-noche">No se pudo mostrar esa imagen.</p>
      ) : null}
    </div>
  );
}
