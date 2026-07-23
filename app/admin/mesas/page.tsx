"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import type { Guest } from "@/lib/guests";
import type { Attendee } from "@/lib/attendees";
import type { TableRow } from "@/lib/tables";

/* paleta lila para distinguir familias */
const FAMILY_COLORS = [
  "#8a6cb8", "#c1694f", "#3f7f6f", "#b8862c", "#5f7bb0",
  "#a14f7a", "#4f8a5f", "#7a5fb0", "#b05f5f", "#5fa1a1",
];

export default function MesasPage() {
  const [tables, setTables] = useState<TableRow[]>([]);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragId, setDragId] = useState<number | null>(null);
  const [overTable, setOverTable] = useState<number | "unassigned" | null>(null);

  const fetchAll = useCallback(async () => {
    const [tRes, aRes, gRes] = await Promise.all([
      fetch("/api/tables"),
      fetch("/api/attendees"),
      fetch("/api/guests"),
    ]);
    setTables((await tRes.json()).tables ?? []);
    setAttendees((await aRes.json()).attendees ?? []);
    setGuests((await gRes.json()).guests ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const guestName = (id: number) => guests.find((g) => g.id === id)?.name ?? "—";
  const guestColor = (id: number) => FAMILY_COLORS[guests.findIndex((g) => g.id === id) % FAMILY_COLORS.length] ?? "#8a6cb8";
  const seatedAt = (tableId: number) => attendees.filter((a) => a.table_id === tableId);
  const unassigned = attendees.filter((a) => a.table_id === null);

  /* mover persona a una mesa (o liberar con null) — optimista */
  const assign = async (attendeeId: number, tableId: number | null) => {
    const target = attendees.find((a) => a.id === attendeeId);
    if (!target || target.table_id === tableId) return;
    if (tableId !== null) {
      const table = tables.find((t) => t.id === tableId);
      if (table && seatedAt(tableId).length >= table.capacity) {
        alert(`${table.name} está llena (${table.capacity} lugares).`);
        return;
      }
    }
    setAttendees((prev) => prev.map((a) => (a.id === attendeeId ? { ...a, table_id: tableId } : a)));
    await fetch(`/api/attendees/${attendeeId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table_id: tableId }),
    }).catch(() => fetchAll());
  };

  const addTable = async () => {
    const res = await fetch("/api/tables", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
    const t = await res.json();
    setTables((prev) => [...prev, t]);
  };

  const patchTable = async (id: number, data: { name?: string; capacity?: number }) => {
    setTables((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
    await fetch(`/api/tables/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  };

  const removeTable = async (id: number) => {
    const seated = seatedAt(id);
    if (!confirm(`¿Eliminar esta mesa?${seated.length ? ` Sus ${seated.length} personas volverán a "Sin asignar".` : ""}`)) return;
    setTables((prev) => prev.filter((t) => t.id !== id));
    setAttendees((prev) => prev.map((a) => (a.table_id === id ? { ...a, table_id: null } : a)));
    await fetch(`/api/tables/${id}`, { method: "DELETE" });
  };

  const totalSeated = attendees.filter((a) => a.table_id !== null).length;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-2xl">💍</span>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Gabriel &amp; Zayra · Dashboard</h1>
            <p className="text-xs text-gray-500">25 de julio 2026</p>
          </div>
          <nav className="ml-4 flex items-center gap-1">
            <Link href="/admin" className="text-sm px-3 py-1.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              Invitados
            </Link>
            <Link href="/admin/nombres" className="text-sm px-3 py-1.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              Nombres
            </Link>
            <span className="text-sm px-3 py-1.5 rounded-lg font-medium bg-gray-900 text-white">Mesas</span>
            <Link href="/admin/mesas-plan" className="text-sm px-3 py-1.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              Plan de mesas
            </Link>
            <Link href="/admin/merch" className="text-sm px-3 py-1.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              Merch
            </Link>
          </nav>
        </div>
        <button
          onClick={addTable}
          className="text-sm px-4 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors font-medium"
        >
          + Agregar mesa
        </button>
      </header>

      {loading ? (
        <div className="py-20 text-center text-gray-400 text-sm">Cargando...</div>
      ) : (
        <main className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Panel · Sin asignar */}
          <aside
            onDragOver={(e) => { e.preventDefault(); setOverTable("unassigned"); }}
            onDragLeave={() => setOverTable(null)}
            onDrop={(e) => { e.preventDefault(); const id = Number(e.dataTransfer.getData("text/plain")); if (id) assign(id, null); setOverTable(null); setDragId(null); }}
            className={`rounded-xl border p-4 h-fit lg:sticky lg:top-6 transition-colors ${
              overTable === "unassigned" ? "border-purple-400 bg-purple-50" : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900">Sin asignar</h2>
              <span className="text-xs text-gray-400">{unassigned.length}</span>
            </div>
            <p className="text-xs text-gray-400 mb-3">Arrastra a una mesa →</p>
            <div className="space-y-1.5">
              {unassigned.map((a) => (
                <div
                  key={a.id}
                  draggable
                  onDragStart={(e) => { e.dataTransfer.setData("text/plain", String(a.id)); setDragId(a.id); }}
                  onDragEnd={() => { setDragId(null); setOverTable(null); }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-grab active:cursor-grabbing bg-white hover:shadow-sm transition-all ${
                    dragId === a.id ? "opacity-40" : ""
                  }`}
                  style={{ borderColor: "#e5e7eb" }}
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: guestColor(a.guest_id) }} />
                  <span className="text-sm text-gray-800 truncate">{a.name}</span>
                  <span className="ml-auto text-[10px] text-gray-400 truncate max-w-[90px]">{guestName(a.guest_id)}</span>
                </div>
              ))}
              {unassigned.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-6">
                  Todos asignados 🎉<br />
                  <span className="text-gray-300">Agrega nombres en la pestaña Invitados.</span>
                </p>
              )}
            </div>
          </aside>

          {/* Mesas */}
          <section>
            <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
              <span><strong className="text-gray-800">{tables.length}</strong> mesas</span>
              <span><strong className="text-gray-800">{totalSeated}</strong> sentados</span>
              <span><strong className="text-gray-800">{unassigned.length}</strong> sin asignar</span>
            </div>

            {tables.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 py-20 text-center text-gray-400 text-sm">
                Aún no hay mesas. Haz clic en “+ Agregar mesa”.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {tables.map((t) => {
                  const seated = seatedAt(t.id);
                  const isFull = seated.length >= t.capacity;
                  const isOver = overTable === t.id;
                  return (
                    <div
                      key={t.id}
                      onDragOver={(e) => { e.preventDefault(); setOverTable(t.id); }}
                      onDragLeave={() => setOverTable((o) => (o === t.id ? null : o))}
                      onDrop={(e) => { e.preventDefault(); const id = Number(e.dataTransfer.getData("text/plain")); if (id) assign(id, t.id); setOverTable(null); setDragId(null); }}
                      className={`rounded-xl border p-4 transition-colors ${
                        isOver ? "border-purple-400 bg-purple-50" : isFull ? "border-emerald-200 bg-emerald-50/40" : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <input
                          defaultValue={t.name}
                          onBlur={(e) => { const v = e.target.value.trim(); if (v && v !== t.name) patchTable(t.id, { name: v }); }}
                          className="text-sm font-semibold text-gray-900 bg-transparent outline-none border-b border-transparent focus:border-gray-300 transition-colors w-32"
                        />
                        <button onClick={() => removeTable(t.id)} title="Eliminar mesa" className="text-gray-300 hover:text-red-500 transition-colors text-sm">🗑️</button>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isFull ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
                          {seated.length}/{t.capacity}
                        </span>
                        <label className="text-[11px] text-gray-400 flex items-center gap-1">
                          cap.
                          <input
                            type="number" min={1} max={30} defaultValue={t.capacity}
                            onBlur={(e) => { const v = Number(e.target.value); if (v >= 1 && v !== t.capacity) patchTable(t.id, { capacity: v }); }}
                            className="w-12 px-1 py-0.5 rounded border border-gray-200 text-center outline-none focus:border-gray-400"
                          />
                        </label>
                      </div>

                      <div className="space-y-1 min-h-[40px]">
                        {seated.map((a) => (
                          <div key={a.id}
                            draggable
                            onDragStart={(e) => { e.dataTransfer.setData("text/plain", String(a.id)); setDragId(a.id); }}
                            onDragEnd={() => { setDragId(null); setOverTable(null); }}
                            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white border border-gray-100 cursor-grab active:cursor-grabbing ${dragId === a.id ? "opacity-40" : ""}`}
                          >
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: guestColor(a.guest_id) }} />
                            <span className="text-sm text-gray-800 truncate">{a.name}</span>
                            <button onClick={() => assign(a.id, null)} title="Quitar de la mesa" className="ml-auto text-gray-300 hover:text-red-500 transition-colors text-xs">✕</button>
                          </div>
                        ))}
                        {seated.length === 0 && (
                          <p className="text-xs text-gray-300 text-center py-3 border border-dashed border-gray-200 rounded-lg">Arrastra personas aquí</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </main>
      )}
    </div>
  );
}
