"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Guest, GuestSide } from "@/lib/guests";
import type { Attendee } from "@/lib/attendees";

const SIDE_META: Record<GuestSide, { label: string; style: string }> = {
  novio: { label: "🤵 Novio", style: "bg-blue-50 text-blue-700 border-blue-200" },
  novia: { label: "👰 Novia", style: "bg-pink-50 text-pink-700 border-pink-200" },
  ambos: { label: "💞 Ambos", style: "bg-violet-50 text-violet-700 border-violet-200" },
};

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`rounded-xl border p-4 ${color}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm font-medium mt-0.5">{label}</p>
    </div>
  );
}

/* ── Tarjeta de una invitación con sus nombres editables ── */
function InvitationCard({
  guest,
  rows,
  onAdd,
  onRename,
  onRemove,
}: {
  guest: Guest;
  rows: Attendee[];
  onAdd: (guestId: number, name: string) => Promise<void>;
  onRename: (id: number, name: string) => Promise<void>;
  onRemove: (id: number) => Promise<void>;
}) {
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const full = rows.length >= guest.seats;
  const side = SIDE_META[guest.side ?? "ambos"];

  const add = async () => {
    const name = draft.trim();
    if (!name || full || busy) return;
    setBusy(true);
    await onAdd(guest.id, name);
    setDraft("");
    setBusy(false);
  };

  const complete = rows.length >= guest.seats;

  return (
    <div
      className={`bg-white rounded-xl border overflow-hidden ${
        complete ? "border-emerald-200" : "border-gray-200"
      }`}
    >
      <div
        className={`px-4 py-3 border-b flex items-start gap-2 ${
          complete ? "bg-emerald-50/60 border-emerald-100" : "bg-gray-50/60 border-gray-100"
        }`}
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 break-words">{guest.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${side.style}`}
            >
              {side.label}
            </span>
            <span className="text-xs text-gray-400">
              {rows.length}/{guest.seats} {guest.seats === 1 ? "nombre" : "nombres"}
            </span>
          </div>
        </div>
        {complete && (
          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-700 border border-emerald-200 shrink-0">
            ✅ Completo
          </span>
        )}
      </div>

      <div className="p-3 space-y-2">
        {rows.map((a, i) => (
          <div key={a.id} className="flex items-center gap-2">
            <span className="w-5 text-center text-[11px] text-gray-300 shrink-0">{i + 1}</span>
            <input
              defaultValue={a.name}
              onBlur={(e) => {
                const v = e.target.value.trim();
                if (v && v !== a.name) onRename(a.id, v);
                else if (!v) e.target.value = a.name; // no permitir vaciar
              }}
              onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-400 transition-colors"
            />
            <button
              onClick={() => onRemove(a.id)}
              title="Quitar nombre"
              className="p-2 rounded-lg text-red-300 hover:bg-red-50 hover:text-red-500 transition-colors text-sm shrink-0"
            >
              🗑️
            </button>
          </div>
        ))}

        {rows.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-1">Sin nombres aún.</p>
        )}

        {!full ? (
          <div className="flex items-center gap-2 pt-1">
            <span className="w-5 text-center text-[11px] text-gray-300 shrink-0">
              {rows.length + 1}
            </span>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
              placeholder={`Agregar nombre (lugar ${rows.length + 1})`}
              className="flex-1 px-3 py-2 rounded-lg border border-dashed border-gray-300 text-sm outline-none focus:border-gray-400 transition-colors"
            />
            <button
              onClick={add}
              disabled={busy || !draft.trim()}
              className="px-3 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-40 shrink-0"
            >
              +
            </button>
          </div>
        ) : (
          <p className="text-[11px] text-emerald-600 text-center pt-1">
            Ya registraste los {guest.seats} lugares.
          </p>
        )}
      </div>
    </div>
  );
}

export default function NombresPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [onlyIncomplete, setOnlyIncomplete] = useState(false);

  const fetchData = useCallback(async () => {
    const [gRes, aRes] = await Promise.all([fetch("/api/guests"), fetch("/api/attendees")]);
    setGuests((await gRes.json()).guests ?? []);
    setAttendees((await aRes.json()).attendees ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const rowsOf = useCallback(
    (guestId: number) =>
      attendees.filter((a) => a.guest_id === guestId).sort((a, b) => a.id - b.id),
    [attendees],
  );

  const addName = async (guestId: number, name: string) => {
    const res = await fetch("/api/attendees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guest_id: guestId, name }),
    });
    const a = (await res.json()) as Attendee;
    setAttendees((prev) => [...prev, a]);
  };

  const renameName = async (id: number, name: string) => {
    setAttendees((prev) => prev.map((a) => (a.id === id ? { ...a, name } : a)));
    await fetch(`/api/attendees/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
  };

  const removeName = async (id: number) => {
    setAttendees((prev) => prev.filter((a) => a.id !== id));
    await fetch(`/api/attendees/${id}`, { method: "DELETE" });
  };

  // Orden: por creación (los más recientes primero, como en Invitados).
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return guests.filter((g) => {
      const rows = rowsOf(g.id);
      const matchesSearch =
        !q ||
        g.name.toLowerCase().includes(q) ||
        rows.some((a) => a.name.toLowerCase().includes(q));
      const incomplete = rows.length < g.seats;
      return matchesSearch && (!onlyIncomplete || incomplete);
    });
  }, [guests, rowsOf, search, onlyIncomplete]);

  const totalSeats = guests.reduce((s, g) => s + g.seats, 0);
  const registered = attendees.length;
  const completeCount = guests.filter((g) => rowsOf(g.id).length >= g.seats).length;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-2xl">📝</span>
          <div>
            <h1 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">
              Nombres · por invitación
            </h1>
            <p className="text-xs text-gray-500">Edita los nombres de cada asistente</p>
          </div>
          <nav className="flex items-center gap-1 sm:ml-2 flex-wrap">
            <Link href="/admin" className="text-sm px-3 py-1.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              Invitados
            </Link>
            <span className="text-sm px-3 py-1.5 rounded-lg font-medium bg-gray-900 text-white">
              Nombres
            </span>
            <Link href="/admin/mesas" className="text-sm px-3 py-1.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              Mesas
            </Link>
            <Link href="/admin/mesas-plan" className="text-sm px-3 py-1.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              Plan de mesas
            </Link>
            <Link href="/admin/asientos" className="text-sm px-3 py-1.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              Asientos
            </Link>
            <Link href="/admin/merch" className="text-sm px-3 py-1.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              Merch
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard label="Invitaciones" value={guests.length} color="bg-white border-gray-200 text-gray-900" />
          <StatCard label="Lugares totales" value={totalSeats} color="bg-blue-50 border-blue-200 text-blue-800" />
          <StatCard label="Nombres registrados" value={registered} color="bg-purple-50 border-purple-200 text-purple-800" />
          <StatCard label="Invitaciones completas" value={completeCount} color="bg-emerald-50 border-emerald-200 text-emerald-800" />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center mb-5">
          <input
            type="text"
            placeholder="Buscar invitación o nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm px-3 py-2 rounded-lg border border-gray-200 outline-none focus:border-gray-400 transition-colors bg-white"
          />
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none whitespace-nowrap">
            <input
              type="checkbox"
              checked={onlyIncomplete}
              onChange={(e) => setOnlyIncomplete(e.target.checked)}
              className="accent-gray-900"
            />
            Solo incompletas
          </label>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-400 text-sm bg-white rounded-xl border border-gray-200">
            Cargando...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-gray-400 text-sm bg-white rounded-xl border border-gray-200">
            {guests.length === 0
              ? "Aún no hay invitaciones. Agrégalas en la pestaña Invitados."
              : "Sin resultados para esa búsqueda."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((g) => (
              <InvitationCard
                key={g.id}
                guest={g}
                rows={rowsOf(g.id)}
                onAdd={addName}
                onRename={renameName}
                onRemove={removeName}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
