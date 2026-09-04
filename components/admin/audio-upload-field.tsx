"use client";

import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AudioUploadField({
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
      toast.success("Canción subida. Escuchala abajo y después guardá.");
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
        placeholder="/audio/cancion.mp3"
        onChange={(e) => {
          setBroken(false);
          onChange(e.target.value);
        }}
      />
      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="audio/mpeg,audio/mp3,audio/ogg,audio/wav,audio/mp4,audio/x-m4a,.mp3,.ogg,.wav,.m4a"
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
          Subir MP3 desde la PC
        </Button>
        {hint ? <p className="text-xs text-sepia">{hint}</p> : null}
      </div>
      <p className="text-xs text-sepia">
        Después de subir, escuchá la vista previa y tocá Guardar cambios.
      </p>
      {value && !broken ? (
        <audio
          key={value}
          className="w-full"
          controls
          preload="metadata"
          src={value}
          onError={() => setBroken(true)}
        />
      ) : value ? (
        <p className="text-sm text-noche">
          Ese enlace no es un audio reproducible. Subí un MP3.
        </p>
      ) : null}
    </div>
  );
}
