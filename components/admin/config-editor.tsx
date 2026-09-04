"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { SiteConfig } from "@/types";

interface Field {
  key: keyof SiteConfig;
  label: string;
  type?: "text" | "textarea" | "datetime";
}

interface ConfigEditorProps {
  initialConfig: SiteConfig;
  fields: Field[];
  title: string;
  description?: string;
}

export function ConfigEditor({
  initialConfig,
  fields,
  title,
  description,
}: ConfigEditorProps) {
  const [config, setConfig] = useState(initialConfig);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Error al guardar");
      }
      toast.success("Cambios guardados");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl tracking-wide">{title}</h2>
        {description ? (
          <p className="mt-2 text-sm text-sepia">{description}</p>
        ) : null}
      </div>

      <div className="space-y-5 rounded-2xl border border-gold/20 bg-cream p-6">
        {fields.map((field) => {
          const value = String(config[field.key] ?? "");
          return (
            <div key={String(field.key)} className="space-y-2">
              <Label htmlFor={String(field.key)}>{field.label}</Label>
              {field.type === "textarea" ? (
                <Textarea
                  id={String(field.key)}
                  value={value}
                  rows={10}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, [field.key]: e.target.value }))
                  }
                />
              ) : (
                <Input
                  id={String(field.key)}
                  type={field.type === "datetime" ? "datetime-local" : "text"}
                  value={
                    field.type === "datetime"
                      ? value.slice(0, 16)
                      : value
                  }
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      [field.key]:
                        field.type === "datetime"
                          ? e.target.value
                            ? `${e.target.value}:00-03:00`
                            : ""
                          : e.target.value,
                    }))
                  }
                />
              )}
            </div>
          );
        })}

        <Button type="button" variant="admin" onClick={save} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Guardar cambios
        </Button>
      </div>
    </div>
  );
}
