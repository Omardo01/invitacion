"use client";

import Link from "next/link";
import { useEffect, useState, useCallback, useRef } from "react";
import type { Guest, GuestSide } from "@/lib/guests";
import type { MockTable, MockSeat, MockGuest } from "@/lib/mock-tables";
import type { PlanStructure } from "@/lib/structures";

/* misma paleta que el acomodo real, para distinguir familias */
const FAMILY_COLORS = [
  "#8a6cb8", "#c1694f", "#3f7f6f", "#b8862c", "#5f7bb0",
  "#a14f7a", "#4f8a5f", "#7a5fb0", "#b05f5f", "#5fa1a1",
];

/* Figura por lado: cuadrado = novio, círculo = novia, triángulo = ambos,
   rombo = logística (no tiene lado). El color sigue siendo por familia. */
type SeatSide = GuestSide | "extra";

function SeatShape({ side, color, size, title }: { side: SeatSide; color: string; size: number; title?: string }) {
  const style: React.CSSProperties = { backgroundColor: color, width: size, height: size };
  if (side === "novia") style.borderRadius = "9999px";
  else if (side === "novio") style.borderRadius = size >= 14 ? 4 : 2;
  else if (side === "ambos") style.clipPath = "polygon(50% 0%, 0% 100%, 100% 100%)";
  else style.clipPath = "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)";
  return <span className="inline-block shrink-0" style={style} title={title} />;
}

export default function MesasPlanPage() {
  const [tables, setTables] = useState<MockTable[]>([]);
  const [seating, setSeating] = useState<MockSeat[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [onlyUnassigned, setOnlyUnassigned] = useState(false);
  const [sideFilter, setSideFilter] = useState<GuestSide | "todos">("todos");
  const [extras, setExtras] = useState<MockGuest[]>([]);
  const [extraForm, setExtraForm] = useState({ name: "", seats: "1" });
  const [addingExtra, setAddingExtra] = useState(false);
  const [structures, setStructures] = useState<PlanStructure[]>([]);
  const [showStructForm, setShowStructForm] = useState(false);
  const [structLabel, setStructLabel] = useState("");

  const fetchAll = useCallback(async () => {
    const [mRes, gRes, sRes] = await Promise.all([
      fetch("/api/mock-tables"),
      fetch("/api/guests"),
      fetch("/api/structures"),
    ]);
    const mData = await mRes.json();
    setTables(mData.tables ?? []);
    setSeating(mData.seating ?? []);
    setExtras(mData.extras ?? []);
    setGuests((await gRes.json()).guests ?? []);
    setStructures((await sRes.json()).structures ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const guestColor = (id: number) =>
    FAMILY_COLORS[guests.findIndex((g) => g.id === id) % FAMILY_COLORS.length] ?? "#8a6cb8";
  const tableOf = (guestId: number) =>
    seating.find((s) => s.guest_id === guestId)?.mock_table_id ?? null;
  const guestsAt = (tableId: number) =>
    seating
      .filter((s) => s.mock_table_id === tableId)
      .map((s) => guests.find((g) => g.id === s.guest_id))
      .filter((g): g is Guest => g !== undefined);
  const extrasAt = (tableId: number) => extras.filter((x) => x.mock_table_id === tableId);
  const extraColor = (id: number) =>
    FAMILY_COLORS[(guests.length + extras.findIndex((x) => x.id === id)) % FAMILY_COLORS.length] ?? "#64748b";
  const seatsUsed = (tableId: number) =>
    guestsAt(tableId).reduce((sum, g) => sum + g.seats, 0) +
    extrasAt(tableId).reduce((sum, x) => sum + x.seats, 0);

  /* etiquetar invitado a una mesa (o quitar con null) — optimista */
  const assign = async (guestId: number, tableId: number | null) => {
    setSeating((prev) => {
      const rest = prev.filter((s) => s.guest_id !== guestId);
      return tableId === null ? rest : [...rest, { guest_id: guestId, mock_table_id: tableId }];
    });
    await fetch("/api/mock-tables/assign", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guest_id: guestId, mock_table_id: tableId }),
    }).catch(() => fetchAll());
  };

  /* invitados de logística: solo existen en el plan, sin invitación */
  const assignExtra = async (extraId: number, tableId: number | null) => {
    setExtras((prev) => prev.map((x) => (x.id === extraId ? { ...x, mock_table_id: tableId } : x)));
    await fetch(`/api/mock-guests/${extraId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mock_table_id: tableId }),
    }).catch(() => fetchAll());
  };

  const addExtra = async () => {
    const name = extraForm.name.trim();
    if (!name || addingExtra) return;
    setAddingExtra(true);
    const res = await fetch("/api/mock-guests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, seats: Number(extraForm.seats) || 1 }),
    });
    const x = await res.json();
    setExtras((prev) => [...prev, x]);
    setExtraForm({ name: "", seats: "1" });
    setAddingExtra(false);
  };

  const removeExtra = async (x: MockGuest) => {
    if (!confirm(`¿Eliminar a "${x.name}" de logística?`)) return;
    setExtras((prev) => prev.filter((e) => e.id !== x.id));
    await fetch(`/api/mock-guests/${x.id}`, { method: "DELETE" });
  };

  const addTable = async () => {
    const res = await fetch("/api/mock-tables", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
    const t = await res.json();
    setTables((prev) => [...prev, t]);
  };

  const patchTable = async (id: number, data: { name?: string; capacity?: number; pos_x?: number; pos_y?: number }) => {
    setTables((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
    await fetch(`/api/mock-tables/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  };

  const removeTable = async (id: number) => {
    const occupants = guestsAt(id).length + extrasAt(id).length;
    if (!confirm(`¿Eliminar esta mesa del plan?${occupants ? ` Sus ${occupants} asignado(s) quedarán sin mesa.` : ""}`)) return;
    setTables((prev) => prev.filter((t) => t.id !== id));
    setSeating((prev) => prev.filter((s) => s.mock_table_id !== id));
    setExtras((prev) => prev.map((x) => (x.mock_table_id === id ? { ...x, mock_table_id: null } : x)));
    await fetch(`/api/mock-tables/${id}`, { method: "DELETE" });
  };

  /* ── Plano del salón ──
     Cada mesa vive en % del lienzo (pos_x/pos_y). Las que aún no se acomodan
     reciben un lugar por defecto alrededor de la pista. */
  const DEFAULT_SLOTS = [
    { x: 12, y: 25 }, { x: 12, y: 50 }, { x: 12, y: 75 },
    { x: 88, y: 25 }, { x: 88, y: 50 }, { x: 88, y: 75 },
    { x: 30, y: 85 }, { x: 50, y: 85 }, { x: 70, y: 85 },
    { x: 30, y: 65 }, { x: 70, y: 65 }, { x: 50, y: 68 },
  ];
  const posOf = (t: MockTable) => {
    if (t.pos_x !== null && t.pos_y !== null) return { x: t.pos_x, y: t.pos_y };
    const idx = tables.filter((o) => o.pos_x === null || o.pos_y === null).findIndex((o) => o.id === t.id);
    return DEFAULT_SLOTS[idx % DEFAULT_SLOTS.length];
  };

  const planoRef = useRef<HTMLDivElement>(null);
  const dragPos = useRef<{ x: number; y: number } | null>(null);
  const [draggingId, setDraggingId] = useState<number | null>(null);

  const startDrag = (e: React.PointerEvent, id: number) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragPos.current = null;
    setDraggingId(id);
  };
  const moveDrag = (e: React.PointerEvent, id: number) => {
    if (draggingId !== id) return;
    const rect = planoRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
    const x = clamp(((e.clientX - rect.left) / rect.width) * 100, 4, 96);
    const y = clamp(((e.clientY - rect.top) / rect.height) * 100, 6, 94);
    dragPos.current = { x, y };
    setTables((prev) => prev.map((t) => (t.id === id ? { ...t, pos_x: x, pos_y: y } : t)));
  };
  const endDrag = (id: number) => {
    if (draggingId !== id) return;
    setDraggingId(null);
    if (dragPos.current) {
      const { x, y } = dragPos.current;
      dragPos.current = null;
      patchTable(id, { pos_x: Math.round(x * 10) / 10, pos_y: Math.round(y * 10) / 10 });
    }
  };

  /* ── Estructuras del salón (pilares, merch, barra...) ──
     Cajas libres en el plano: se arrastran desde el cuerpo y se redimensionan
     desde la esquina inferior derecha. Todo en % del lienzo. */
  const addStructure = async () => {
    const label = structLabel.trim();
    if (!label) return;
    // Se van escalonando del lado izquierdo, donde el plano tiene más espacio.
    const n = structures.length;
    const res = await fetch("/api/structures", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label, pos_x: 6 + (n % 3) * 6, pos_y: 30 + (n % 4) * 12 }),
    });
    const s = await res.json();
    setStructures((prev) => [...prev, s]);
    setStructLabel("");
    setShowStructForm(false);
  };

  const patchStructure = async (
    id: number,
    data: { label?: string; pos_x?: number; pos_y?: number; w?: number; h?: number },
  ) => {
    setStructures((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
    await fetch(`/api/structures/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  const removeStructure = async (s: PlanStructure) => {
    if (!confirm(`¿Quitar "${s.label}" del plano?`)) return;
    setStructures((prev) => prev.filter((o) => o.id !== s.id));
    await fetch(`/api/structures/${s.id}`, { method: "DELETE" });
  };

  const structAct = useRef<{ id: number; mode: "move" | "resize"; offX: number; offY: number } | null>(null);
  const structLast = useRef<{ pos_x: number; pos_y: number; w: number; h: number } | null>(null);
  const [activeStructId, setActiveStructId] = useState<number | null>(null);

  const planoPct = (e: React.PointerEvent) => {
    const rect = planoRef.current!.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    };
  };

  const startStruct = (e: React.PointerEvent, s: PlanStructure, mode: "move" | "resize") => {
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const p = planoPct(e);
    structAct.current = { id: s.id, mode, offX: p.x - s.pos_x, offY: p.y - s.pos_y };
    structLast.current = null;
    setActiveStructId(s.id);
  };
  const moveStruct = (e: React.PointerEvent, s: PlanStructure) => {
    const act = structAct.current;
    if (!act || act.id !== s.id) return;
    const p = planoPct(e);
    const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
    const next =
      act.mode === "move"
        ? {
            pos_x: clamp(p.x - act.offX, 0, 100 - s.w),
            pos_y: clamp(p.y - act.offY, 0, 100 - s.h),
            w: s.w,
            h: s.h,
          }
        : {
            pos_x: s.pos_x,
            pos_y: s.pos_y,
            w: clamp(p.x - s.pos_x, 3, 100 - s.pos_x),
            h: clamp(p.y - s.pos_y, 4, 100 - s.pos_y),
          };
    structLast.current = next;
    setStructures((prev) => prev.map((o) => (o.id === s.id ? { ...o, ...next } : o)));
  };
  const endStruct = (s: PlanStructure) => {
    const act = structAct.current;
    if (!act || act.id !== s.id) return;
    structAct.current = null;
    setActiveStructId(null);
    if (structLast.current) {
      const r = (v: number) => Math.round(v * 10) / 10;
      const { pos_x, pos_y, w, h } = structLast.current;
      structLast.current = null;
      patchStructure(s.id, { pos_x: r(pos_x), pos_y: r(pos_y), w: r(w), h: r(h) });
    }
  };

  const filteredGuests = guests.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) &&
      (sideFilter === "todos" || (g.side ?? "ambos") === sideFilter) &&
      (!onlyUnassigned || tableOf(g.id) === null)
  );

  const sideCount = (side: GuestSide) =>
    guests.filter((g) => (g.side ?? "ambos") === side).length;

  const assignedSeats =
    seating.reduce((sum, s) => sum + (guests.find((g) => g.id === s.guest_id)?.seats ?? 0), 0) +
    extras.reduce((sum, x) => sum + (x.mock_table_id !== null ? x.seats : 0), 0);
  const totalSeats =
    guests.reduce((sum, g) => sum + g.seats, 0) + extras.reduce((sum, x) => sum + x.seats, 0);

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
            <Link href="/admin/mesas" className="text-sm px-3 py-1.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              Mesas
            </Link>
            <span className="text-sm px-3 py-1.5 rounded-lg font-medium bg-gray-900 text-white">Plan de mesas</span>
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
        <main className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Panel · Lista de invitados para taguear */}
          <aside className="rounded-xl border border-gray-200 bg-white p-4 h-fit lg:sticky lg:top-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900">Invitados</h2>
              <span className="text-xs text-gray-400">{filteredGuests.length}</span>
            </div>
            <input
              type="text"
              placeholder="Buscar familia..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-sm px-3 py-1.5 mb-2 rounded-lg border border-gray-200 outline-none focus:border-gray-400 transition-colors"
            />
            <div className="flex items-center gap-1.5 flex-wrap mb-2">
              {([
                { value: "todos", label: "Todos", count: guests.length },
                { value: "novio", label: "🤵 Novio", count: sideCount("novio") },
                { value: "novia", label: "👰 Novia", count: sideCount("novia") },
                { value: "ambos", label: "💞 Ambos", count: sideCount("ambos") },
              ] as const).map((f) => (
                <button
                  key={f.value}
                  onClick={() => setSideFilter(f.value)}
                  className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-colors ${
                    sideFilter === f.value
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {f.label} <span className="opacity-60">{f.count}</span>
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-xs text-gray-500 mb-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyUnassigned}
                onChange={(e) => setOnlyUnassigned(e.target.checked)}
                className="accent-gray-900"
              />
              Solo sin mesa
            </label>
            <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
              {filteredGuests.map((g) => (
                <div key={g.id} className="flex items-center gap-2 px-2.5 py-2 rounded-lg border border-gray-100 bg-white">
                  <SeatShape side={g.side ?? "ambos"} color={guestColor(g.id)} size={10} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-800 break-words leading-tight">{g.name}</p>
                    <p className="text-[10px] text-gray-400">{g.seats} {g.seats === 1 ? "lugar" : "lugares"}</p>
                  </div>
                  <select
                    value={tableOf(g.id) ?? ""}
                    onChange={(e) => assign(g.id, e.target.value === "" ? null : Number(e.target.value))}
                    className={`text-xs px-1.5 py-1 rounded-lg border outline-none max-w-[110px] transition-colors ${
                      tableOf(g.id) === null
                        ? "border-gray-200 text-gray-400 bg-gray-50"
                        : "border-gray-300 text-gray-800 bg-white font-medium"
                    }`}
                  >
                    <option value="">Sin mesa</option>
                    {tables.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              ))}
              {filteredGuests.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-6">Sin resultados.</p>
              )}
            </div>

            {/* Logística: solo existen en el plan, sin invitación */}
            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-gray-900">📋 Logística</h3>
                <span className="text-xs text-gray-400">{extras.length}</span>
              </div>
              <p className="text-[11px] text-gray-400 mb-2">
                Sin invitación — solo para contar lugares (staff, proveedores, cortesías).
              </p>
              <div className="flex gap-1.5 mb-2">
                <input
                  type="text"
                  placeholder="Nombre (ej. DJ, Fotógrafo)"
                  value={extraForm.name}
                  onChange={(e) => setExtraForm((f) => ({ ...f, name: e.target.value }))}
                  onKeyDown={(e) => { if (e.key === "Enter") addExtra(); }}
                  className="flex-1 min-w-0 text-xs px-2 py-1.5 rounded-lg border border-gray-200 outline-none focus:border-gray-400 transition-colors"
                />
                <input
                  type="number" min={1} max={30}
                  value={extraForm.seats}
                  onChange={(e) => setExtraForm((f) => ({ ...f, seats: e.target.value }))}
                  title="Lugares"
                  className="w-12 text-xs px-1 py-1.5 rounded-lg border border-gray-200 text-center outline-none focus:border-gray-400"
                />
                <button
                  onClick={addExtra}
                  disabled={addingExtra || !extraForm.name.trim()}
                  className="text-xs px-2.5 rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors font-medium disabled:opacity-40"
                >
                  +
                </button>
              </div>
              <div className="space-y-1.5">
                {extras.map((x) => (
                  <div key={x.id} className="flex items-center gap-2 px-2.5 py-2 rounded-lg border border-dashed border-gray-200 bg-gray-50/60">
                    <SeatShape side="extra" color={extraColor(x.id)} size={10} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-800 break-words leading-tight">{x.name}</p>
                      <p className="text-[10px] text-gray-400">{x.seats} {x.seats === 1 ? "lugar" : "lugares"} · logística</p>
                    </div>
                    <select
                      value={x.mock_table_id ?? ""}
                      onChange={(e) => assignExtra(x.id, e.target.value === "" ? null : Number(e.target.value))}
                      className={`text-xs px-1.5 py-1 rounded-lg border outline-none max-w-[110px] transition-colors ${
                        x.mock_table_id === null
                          ? "border-gray-200 text-gray-400 bg-gray-50"
                          : "border-gray-300 text-gray-800 bg-white font-medium"
                      }`}
                    >
                      <option value="">Sin mesa</option>
                      {tables.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                    <button onClick={() => removeExtra(x)} title="Eliminar" className="text-gray-300 hover:text-red-500 transition-colors text-xs">✕</button>
                  </div>
                ))}
                {extras.length === 0 && (
                  <p className="text-[11px] text-gray-300 text-center py-2">Nada aún.</p>
                )}
              </div>
            </div>
          </aside>

          {/* Mesas ficticias · gráficos cuadrados */}
          <section>
            <div className="flex items-center gap-4 mb-4 text-xs text-gray-500 flex-wrap">
              <span><strong className="text-gray-800">{tables.length}</strong> mesas</span>
              <span><strong className="text-gray-800">{assignedSeats}</strong> lugares asignados</span>
              <span><strong className="text-gray-800">{totalSeats - assignedSeats}</strong> lugares sin asignar</span>
              <span className="sm:ml-auto flex items-center gap-3 text-gray-400">
                <span className="flex items-center gap-1"><SeatShape side="novio" color="#9ca3af" size={10} /> Novio</span>
                <span className="flex items-center gap-1"><SeatShape side="novia" color="#9ca3af" size={10} /> Novia</span>
                <span className="flex items-center gap-1"><SeatShape side="ambos" color="#9ca3af" size={10} /> Ambos</span>
                <span className="flex items-center gap-1"><SeatShape side="extra" color="#9ca3af" size={10} /> Logística</span>
              </span>
            </div>

            {/* Plano del salón: arrastra las mesas para acomodarlas como en tu lugar */}
            {tables.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                  <h2 className="text-sm font-semibold text-gray-900">🗺️ Plano del lugar</h2>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-400 hidden sm:inline">Arrastra las mesas para acomodarlas como en tu salón</span>
                    <button
                      onClick={() => setShowStructForm((v) => !v)}
                      className="text-xs px-2.5 py-1 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      + Estructura
                    </button>
                  </div>
                </div>
                {showStructForm && (
                  <div className="mb-2 p-3 rounded-xl border border-gray-200 bg-white flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Nombre de la estructura (ej: Pilar, Merch, Barra...)"
                        value={structLabel}
                        onChange={(e) => setStructLabel(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addStructure()}
                        autoFocus
                        className="flex-1 text-sm px-3 py-1.5 rounded-lg border border-gray-200 outline-none focus:border-gray-400 transition-colors"
                      />
                      <button
                        onClick={addStructure}
                        disabled={!structLabel.trim()}
                        className="text-sm px-3 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors font-medium disabled:opacity-50"
                      >
                        Agregar
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {["🏛️ Pilar", "🎁 Merch", "🍹 Barra", "🍽️ Buffet", "🎶 DJ", "🚪 Entrada", "📸 Fotos", "🍰 Pastel"].map((s) => (
                        <button
                          key={s}
                          onClick={() => setStructLabel(s)}
                          className="text-xs px-2 py-0.5 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-gray-400">
                      La caja aparece en el plano: arrástrala para moverla y estira su esquina inferior derecha para cambiar el tamaño.
                    </p>
                  </div>
                )}
                <div
                  ref={planoRef}
                  className="relative w-full aspect-[16/10] rounded-xl border-2 border-gray-300 bg-white select-none"
                >
                  {/* Mesa de novios (fija, arriba al centro) */}
                  <div className="absolute left-1/2 top-[3%] -translate-x-1/2 px-4 py-1.5 rounded-lg border-2 border-gray-800 bg-gray-900 text-white text-xs font-semibold">
                    💍 Novios
                  </div>
                  {/* Pista (fija, cuadrada y ligeramente a la derecha para dejar
                      más espacio libre del lado izquierdo). En el lienzo 16:10,
                      h = 1.6 × w hace que se vea como cuadrado real. */}
                  <div className="absolute left-[56%] top-[32%] -translate-x-1/2 w-[18%] h-[28.8%] rounded-lg border-2 border-gray-300 bg-gray-50 flex items-center justify-center">
                    <span className="text-gray-300 font-bold tracking-[0.3em] text-sm sm:text-lg">PISTA</span>
                  </div>

                  {/* Estructuras del salón (debajo de las mesas en z-order) */}
                  {structures.map((s) => (
                    <div
                      key={`st-${s.id}`}
                      onPointerDown={(e) => startStruct(e, s, "move")}
                      onPointerMove={(e) => moveStruct(e, s)}
                      onPointerUp={() => endStruct(s)}
                      onPointerCancel={() => endStruct(s)}
                      style={{ left: `${s.pos_x}%`, top: `${s.pos_y}%`, width: `${s.w}%`, height: `${s.h}%` }}
                      className={`absolute group rounded-md border-2 bg-gray-100/90 cursor-grab active:cursor-grabbing touch-none flex items-center justify-center ${
                        activeStructId === s.id ? "border-purple-400 shadow-lg z-10" : "border-gray-300"
                      }`}
                    >
                      <input
                        defaultValue={s.label}
                        onPointerDown={(e) => e.stopPropagation()}
                        onBlur={(e) => {
                          const v = e.target.value.trim();
                          if (v && v !== s.label) patchStructure(s.id, { label: v });
                        }}
                        className="w-full bg-transparent text-center text-[10px] font-semibold text-gray-500 uppercase tracking-wider outline-none px-1"
                      />
                      <button
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => removeStructure(s)}
                        title="Quitar del plano"
                        className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white border border-gray-200 text-[10px] items-center justify-center text-red-400 hover:bg-red-50 transition-colors shadow-sm hidden group-hover:flex"
                      >
                        ✕
                      </button>
                      <span
                        onPointerDown={(e) => startStruct(e, s, "resize")}
                        onPointerMove={(e) => moveStruct(e, s)}
                        onPointerUp={() => endStruct(s)}
                        onPointerCancel={() => endStruct(s)}
                        title="Cambiar tamaño"
                        className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-sm bg-gray-300 border border-white cursor-nwse-resize touch-none opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  ))}

                  {tables.map((t) => {
                    const p = posOf(t);
                    const used = seatsUsed(t.id);
                    const tFam = guestsAt(t.id);
                    const tExt = extrasAt(t.id);
                    const miniSquares: { color: string; side: SeatSide; name: string }[] = [];
                    for (const g of tFam)
                      for (let s = 0; s < g.seats; s++) miniSquares.push({ color: guestColor(g.id), side: g.side ?? "ambos", name: g.name });
                    for (const x of tExt)
                      for (let s = 0; s < x.seats; s++) miniSquares.push({ color: extraColor(x.id), side: "extra", name: `📋 ${x.name}` });
                    return (
                      <div
                        key={t.id}
                        onPointerDown={(e) => startDrag(e, t.id)}
                        onPointerMove={(e) => moveDrag(e, t.id)}
                        onPointerUp={() => endDrag(t.id)}
                        onPointerCancel={() => endDrag(t.id)}
                        style={{ left: `${p.x}%`, top: `${p.y}%` }}
                        className={`absolute group/mesa -translate-x-1/2 -translate-y-1/2 w-[88px] p-1.5 rounded-lg border-2 bg-white shadow-sm cursor-grab active:cursor-grabbing touch-none ${
                          draggingId === t.id ? "border-purple-400 shadow-lg z-10" : "border-gray-300"
                        }`}
                      >
                        <button
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={() => removeTable(t.id)}
                          title="Eliminar mesa"
                          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white border border-gray-200 text-[10px] items-center justify-center text-red-400 hover:bg-red-50 transition-colors shadow-sm hidden group-hover/mesa:flex z-20"
                        >
                          ✕
                        </button>
                        <p className="text-[10px] font-semibold text-gray-800 break-words text-center leading-tight mb-0.5">{t.name}</p>
                        <p className="text-[9px] text-center mb-1 text-gray-400">
                          {used} {used === 1 ? "lugar" : "lugares"}
                        </p>
                        <div className="flex flex-wrap gap-[2px] justify-center">
                          {miniSquares.map((sq, i) => (
                            <span key={i} className="relative group inline-flex">
                              <SeatShape side={sq.side} color={sq.color} size={7} />
                              {draggingId === null && (
                                <span className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 rounded-md bg-gray-900 text-white text-[10px] whitespace-nowrap z-20 pointer-events-none shadow-lg">
                                  {sq.name}
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {tables.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 py-20 text-center text-gray-400 text-sm">
                Aún no hay mesas en el plan. Haz clic en “+ Agregar mesa”.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {tables.map((t) => {
                  const families = guestsAt(t.id);
                  const tableExtras = extrasAt(t.id);
                  const used = seatsUsed(t.id);
                  /* una figura por lugar ocupado: color por familia, forma por lado */
                  const squares: { color: string; name: string; side: SeatSide }[] = [];
                  for (const g of families)
                    for (let s = 0; s < g.seats; s++)
                      squares.push({ color: guestColor(g.id), name: g.name, side: g.side ?? "ambos" });
                  for (const x of tableExtras)
                    for (let s = 0; s < x.seats; s++)
                      squares.push({ color: extraColor(x.id), name: `📋 ${x.name}`, side: "extra" });
                  return (
                    <div
                      key={t.id}
                      className="rounded-xl border border-gray-200 bg-white p-4 transition-colors"
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
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          {used} {used === 1 ? "lugar" : "lugares"}
                        </span>
                      </div>

                      {/* gráfico: una figura por lugar ocupado (forma = lado, color = familia) */}
                      {squares.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {squares.map((sq, i) => (
                            <span key={i} className="relative group inline-flex">
                              <SeatShape side={sq.side} color={sq.color} size={20} />
                              <span className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 rounded-md bg-gray-900 text-white text-[10px] whitespace-nowrap z-10 pointer-events-none shadow-lg">
                                {sq.name}
                              </span>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* familias en la mesa */}
                      <div className="space-y-1 min-h-[24px]">
                        {families.map((g) => (
                          <div key={g.id} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white border border-gray-100">
                            <SeatShape side={g.side ?? "ambos"} color={guestColor(g.id)} size={10} />
                            <span className="text-sm text-gray-800 break-words min-w-0 flex-1">{g.name} <span className="text-[10px] text-gray-400">({g.seats})</span></span>
                            <button onClick={() => assign(g.id, null)} title="Quitar de la mesa" className="ml-auto text-gray-300 hover:text-red-500 transition-colors text-xs">✕</button>
                          </div>
                        ))}
                        {tableExtras.map((x) => (
                          <div key={`x-${x.id}`} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-gray-50/60 border border-dashed border-gray-200">
                            <SeatShape side="extra" color={extraColor(x.id)} size={10} />
                            <span className="text-sm text-gray-800 break-words min-w-0 flex-1">📋 {x.name} <span className="text-[10px] text-gray-400">({x.seats})</span></span>
                            <button onClick={() => assignExtra(x.id, null)} title="Quitar de la mesa" className="ml-auto text-gray-300 hover:text-red-500 transition-colors text-xs">✕</button>
                          </div>
                        ))}
                        {families.length === 0 && tableExtras.length === 0 && (
                          <p className="text-xs text-gray-300 text-center py-2 border border-dashed border-gray-200 rounded-lg">
                            Etiqueta familias desde la lista ←
                          </p>
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
