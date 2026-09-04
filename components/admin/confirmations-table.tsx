"use client";

import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import { Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { downloadBlob } from "@/lib/utils";
import type { AccessLog, Confirmation } from "@/types";

interface ConfirmationsTableProps {
  confirmations: Confirmation[];
  accessLogs: AccessLog[];
}

export function ConfirmationsTable({
  confirmations,
  accessLogs,
}: ConfirmationsTableProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"todos" | "si" | "no">("todos");
  const [linkFilter, setLinkFilter] = useState("todos");

  const links = useMemo(() => {
    const set = new Set(
      confirmations.map((c) => c.enlace_origen).filter(Boolean) as string[]
    );
    return Array.from(set);
  }, [confirmations]);

  const filtered = useMemo(() => {
    return confirmations.filter((item) => {
      const haystack = [
        item.nombre,
        item.apellido,
        item.cargo,
        item.institucion,
        item.email,
        item.telefono,
        item.enlace_origen || "",
      ]
        .join(" ")
        .toLowerCase();

      const matchesQuery = haystack.includes(query.toLowerCase());
      const matchesAsistencia =
        filter === "todos" ? true : item.asistencia === filter;
      const matchesLink =
        linkFilter === "todos" ? true : item.enlace_origen === linkFilter;

      return matchesQuery && matchesAsistencia && matchesLink;
    });
  }, [confirmations, query, filter, linkFilter]);

  const exportCsv = () => {
    const headers = [
      "nombre",
      "apellido",
      "cargo",
      "institucion",
      "telefono",
      "email",
      "asistencia",
      "enlace_origen",
      "fecha_creacion",
    ];
    const rows = filtered.map((item) =>
      headers
        .map((key) => `"${String(item[key as keyof Confirmation] ?? "").replaceAll('"', '""')}"`)
        .join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8" }), "confirmaciones.csv");
  };

  const exportExcel = () => {
    const sheet = XLSX.utils.json_to_sheet(filtered);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, "Confirmaciones");
    XLSX.writeFile(book, "confirmaciones.xlsx");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl tracking-wide">Confirmaciones</h2>
        <p className="mt-2 text-sm text-sepia">
          {filtered.length} registros · {accessLogs.length} accesos a enlaces especiales
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-ocre/20 bg-white p-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sepia" />
          <Input
            className="pl-9"
            placeholder="Buscar por nombre, cargo, institución..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <SelectTrigger className="md:w-44">
            <SelectValue placeholder="Asistencia" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas</SelectItem>
            <SelectItem value="si">Confirmaron Sí</SelectItem>
            <SelectItem value="no">Confirmaron No</SelectItem>
          </SelectContent>
        </Select>
        <Select value={linkFilter} onValueChange={setLinkFilter}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Enlace" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los enlaces</SelectItem>
            {links.map((link) => (
              <SelectItem key={link} value={link}>
                {link}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="button" variant="outline" onClick={exportCsv}>
          <Download className="h-4 w-4" />
          CSV
        </Button>
        <Button type="button" variant="admin" onClick={exportExcel}>
          <Download className="h-4 w-4" />
          Excel
        </Button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-ocre/20 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-gold/20 bg-parchment-deep/50">
            <tr>
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Cargo</th>
              <th className="px-4 py-3 font-medium">Institución</th>
              <th className="px-4 py-3 font-medium">Contacto</th>
              <th className="px-4 py-3 font-medium">Asistencia</th>
              <th className="px-4 py-3 font-medium">Enlace</th>
              <th className="px-4 py-3 font-medium">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-b border-gold/10">
                <td className="px-4 py-3">
                  {item.nombre} {item.apellido}
                </td>
                <td className="px-4 py-3">{item.cargo}</td>
                <td className="px-4 py-3">{item.institucion}</td>
                <td className="px-4 py-3">
                  <div>{item.email}</div>
                  <div className="text-sepia">{item.telefono}</div>
                </td>
                <td className="px-4 py-3 uppercase">{item.asistencia}</td>
                <td className="px-4 py-3">{item.enlace_origen || "—"}</td>
                <td className="px-4 py-3">
                  {new Date(item.fecha_creacion).toLocaleString("es-AR")}
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sepia">
                  No hay confirmaciones para mostrar.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="rounded-2xl border border-ocre/20 bg-white p-5 shadow-sm">
        <h3 className="font-display text-xl">Últimos accesos a enlaces</h3>
        <ul className="mt-4 space-y-2 text-sm">
          {accessLogs.slice(0, 12).map((log) => (
            <li key={log.id} className="flex justify-between gap-4 border-b border-gold/10 py-2">
              <span className="font-medium">/{log.slug}</span>
              <span className="text-sepia">
                {new Date(log.fecha_acceso).toLocaleString("es-AR")}
              </span>
            </li>
          ))}
          {accessLogs.length === 0 ? (
            <li className="text-sepia">Aún no hay accesos registrados.</li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
