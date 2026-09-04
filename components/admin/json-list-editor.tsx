"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { SiteConfig } from "@/types";

type ListKey = "cronograma" | "galeria" | "enlaces" | "firmas";

interface JsonListEditorProps {
  initialConfig: SiteConfig;
  listKey: ListKey;
  title: string;
  description?: string;
  createItem: () => Record<string, unknown>;
  fields: { key: string; label: string; type?: "text" | "textarea" | "checkbox" }[];
}

export function JsonListEditor({
  initialConfig,
  listKey,
  title,
  description,
  createItem,
  fields,
}: JsonListEditorProps) {
  const [config, setConfig] = useState(initialConfig);
  const [saving, setSaving] = useState(false);
  const items = config[listKey] as Record<string, unknown>[];

  const updateItem = (index: number, key: string, value: string | boolean) => {
    setConfig((prev) => {
      const next = [...(prev[listKey] as Record<string, unknown>[])];
      next[index] = { ...next[index], [key]: value };
      return { ...prev, [listKey]: next };
    });
  };

  const addItem = () => {
    setConfig((prev) => ({
      ...prev,
      [listKey]: [...(prev[listKey] as Record<string, unknown>[]), createItem()],
    }));
  };

  const removeItem = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      [listKey]: (prev[listKey] as Record<string, unknown>[]).filter(
        (_, i) => i !== index
      ),
    }));
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error("No se pudo guardar");
      toast.success("Listado actualizado");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl tracking-wide">{title}</h2>
          {description ? <p className="mt-2 text-sm text-sepia">{description}</p> : null}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={addItem}>
            <Plus className="h-4 w-4" />
            Agregar
          </Button>
          <Button type="button" variant="admin" onClick={save} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Guardar
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={String(item.id || index)}
            className="rounded-2xl border border-ocre/20 bg-white p-5 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-medium text-wine">Ítem {index + 1}</p>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeItem(index)}
                aria-label="Eliminar ítem"
              >
                <Trash2 className="h-4 w-4 text-wine" />
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {fields.map((field) => (
                <div
                  key={field.key}
                  className={field.type === "textarea" ? "md:col-span-2 space-y-2" : "space-y-2"}
                >
                  <Label>{field.label}</Label>
                  {field.type === "checkbox" ? (
                    <label className="flex min-h-12 items-center gap-3 rounded-xl border border-ocre/30 bg-marfil/90 px-3">
                      <input
                        type="checkbox"
                        checked={Boolean(item[field.key])}
                        onChange={(e) =>
                          updateItem(index, field.key, e.target.checked)
                        }
                      />
                      <span className="text-sm">{field.label}</span>
                    </label>
                  ) : field.type === "textarea" ? (
                    <Textarea
                      value={String(item[field.key] ?? "")}
                      onChange={(e) => updateItem(index, field.key, e.target.value)}
                    />
                  ) : (
                    <Input
                      value={String(item[field.key] ?? "")}
                      onChange={(e) => updateItem(index, field.key, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
