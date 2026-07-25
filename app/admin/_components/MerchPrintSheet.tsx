"use client";

import { useMemo, useState } from "react";
import { PrintSheetHeader, PrintSheetFooter } from "./PrintOverlay";
import type { MerchItem, MerchRecipient } from "@/lib/merch";
import type { TableRow } from "@/lib/tables";
import type { Attendee } from "@/lib/attendees";

const SIN_GRUPO = "Sin grupo";
const SIN_MESA = "Sin mesa asignada";
const groupOf = (r: MerchRecipient) => r.group_name?.trim() || SIN_GRUPO;
const norm = (s: string) => s.trim().toLowerCase();
// Número de mesa a partir del nombre ("Mesa 10 · Familia" → 10); sin número → al final.
const tableNumber = (name: string) => {
  const m = name.match(/\d+/);
  return m ? parseInt(m[0], 10) : Number.MAX_SAFE_INTEGER;
};

type Mode = "grupos" | "mesas";

/* Hoja de entrega de merch para imprimir: checklist con el contenido de cada
   paquete y una casilla para marcar la entrega. Se puede organizar por grupo
   o por mesa (la mesa se deduce del acomodo real: attendees.table_id). */
export default function MerchPrintSheet({
  recipients,
  items,
  tables,
  attendees,
}: {
  recipients: MerchRecipient[];
  items: MerchItem[];
  tables: TableRow[];
  attendees: Attendee[];
}) {
  const [mode, setMode] = useState<Mode>("grupos");

  const itemById = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);
  const packageSize = (r: MerchRecipient) => r.items.reduce((s, e) => s + e.qty, 0);

  const contentOf = (r: MerchRecipient) =>
    r.items
      .map((e) => {
        const it = itemById.get(e.item_id);
        return it ? `${it.emoji} ${it.name} ×${e.qty}` : null;
      })
      .filter(Boolean)
      .join("   ·   ");

  // Deduce la mesa de una persona: match exacto (misma familia + nombre) y, si no,
  // la mesa de cualquier miembro de su familia que ya esté sentado.
  const mesaOf = (r: MerchRecipient): { key: string; order: number } => {
    let tableId: number | null = null;
    if (r.guest_id != null) {
      const exact = attendees.find(
        (a) => a.guest_id === r.guest_id && norm(a.name) === norm(r.name) && a.table_id != null,
      );
      const fam = exact ?? attendees.find((a) => a.guest_id === r.guest_id && a.table_id != null);
      tableId = fam?.table_id ?? null;
    }
    if (tableId == null) return { key: SIN_MESA, order: Number.MAX_SAFE_INTEGER };
    const name = tables.find((t) => t.id === tableId)?.name;
    // Ordena por el número de mesa del nombre (no por orden de creación / id).
    return name ? { key: name, order: tableNumber(name) } : { key: SIN_MESA, order: Number.MAX_SAFE_INTEGER };
  };

  // Agrupa según el modo, conservando un orden estable.
  const groups: [string, MerchRecipient[]][] = useMemo(() => {
    if (mode === "grupos") {
      const out: [string, MerchRecipient[]][] = [];
      const index = new Map<string, MerchRecipient[]>();
      for (const r of recipients) {
        const key = groupOf(r);
        if (!index.has(key)) {
          const arr: MerchRecipient[] = [];
          index.set(key, arr);
          out.push([key, arr]);
        }
        index.get(key)!.push(r);
      }
      return out;
    }
    const index = new Map<string, { order: number; list: MerchRecipient[] }>();
    for (const r of recipients) {
      const { key, order } = mesaOf(r);
      if (!index.has(key)) index.set(key, { order, list: [] });
      index.get(key)!.list.push(r);
    }
    return [...index.entries()]
      .sort((a, b) => a[1].order - b[1].order || a[0].localeCompare(b[0]))
      .map(([k, v]) => [k, v.list] as [string, MerchRecipient[]]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipients, mode, attendees, tables]);

  const totalPieces = recipients.reduce((s, r) => s + packageSize(r), 0);

  return (
    <div style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
      <PrintSheetHeader title="Entrega de merch" subtitle="Marca la casilla al entregar cada paquete" />

      {/* Selector de organización — no se imprime */}
      <div className="no-print flex items-center justify-center gap-1 mb-4">
        <span className="text-xs text-gray-400 mr-1">Organizar por:</span>
        {(["grupos", "mesas"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`text-xs px-3 py-1 rounded-full border font-medium transition-colors ${
              mode === m
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {m === "grupos" ? "👨‍👩‍👧 Grupo" : "🍽️ Mesa"}
          </button>
        ))}
      </div>

      <p className="text-center text-xs text-gray-500 mb-4">
        <strong className="text-gray-800">{groups.length}</strong>{" "}
        {mode === "grupos" ? "grupos" : "mesas"} ·{" "}
        <strong className="text-gray-800">{recipients.length}</strong> personas ·{" "}
        <strong className="text-gray-800">{totalPieces}</strong> piezas
      </p>

      {recipients.length === 0 ? (
        <p className="text-center text-sm text-gray-400 py-10">Aún no hay nadie en el merch.</p>
      ) : (
        <div className="space-y-3">
          {groups.map(([groupName, members]) => {
            const groupPieces = members.reduce((s, m) => s + packageSize(m), 0);
            const allDelivered = members.every((m) => m.delivered);
            const muted = groupName === SIN_GRUPO || groupName === SIN_MESA;
            return (
              <section
                key={groupName}
                className="print-break border border-gray-300 rounded-md overflow-hidden"
              >
                <div
                  className={`flex items-baseline justify-between px-2.5 py-1 text-white ${
                    muted ? "bg-gray-400" : "bg-gray-700"
                  }`}
                >
                  <h2 className="text-[15px] font-semibold" style={{ fontFamily: "var(--font-deco), serif" }}>
                    {groupName}
                  </h2>
                  <span className="text-[11px] opacity-80 shrink-0 ml-2">
                    {members.length} {members.length === 1 ? "persona" : "personas"} · {groupPieces}{" "}
                    {groupPieces === 1 ? "pieza" : "piezas"}
                    {allDelivered && " · ✅"}
                  </span>
                </div>
                <ul className="px-2.5 py-0.5">
                  {members.map((r) => {
                    const content = contentOf(r);
                    return (
                      <li
                        key={r.id}
                        className="flex items-start gap-2 py-1 border-b border-gray-200 last:border-b-0"
                      >
                        {/* Casilla de entrega (marcada si ya se entregó en el sistema) */}
                        <span
                          className="mt-px w-[18px] h-[18px] rounded-sm border-2 border-gray-700 shrink-0 flex items-center justify-center text-xs leading-none text-gray-800"
                          aria-hidden
                        >
                          {r.delivered ? "✓" : ""}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span
                              className={`text-[13px] font-medium ${
                                r.delivered ? "text-gray-400 line-through" : "text-gray-900"
                              }`}
                            >
                              {r.name}
                            </span>
                            {r.notes && <span className="text-[10px] text-gray-400">({r.notes})</span>}
                          </div>
                          <p className={`text-[11px] leading-snug ${r.delivered ? "text-gray-300" : "text-gray-600"}`}>
                            {content || <span className="italic text-gray-300">Paquete vacío</span>}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      )}

      <PrintSheetFooter />
    </div>
  );
}
