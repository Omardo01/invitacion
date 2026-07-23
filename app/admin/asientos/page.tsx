"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Guest, GuestSide } from "@/lib/guests";
import type { Attendee } from "@/lib/attendees";
import type { MockTable, MockAttendeeSeat } from "@/lib/mock-tables";

/* misma paleta que Plan de mesas, para que los colores por familia coincidan */
const FAMILY_COLORS = [
  "#8a6cb8", "#c1694f", "#3f7f6f", "#b8862c", "#5f7bb0",
  "#a14f7a", "#4f8a5f", "#7a5fb0", "#b05f5f", "#5fa1a1",
];

const SIDE_LABEL: Record<GuestSide, string> = {
  novio: "🤵 Novio",
  novia: "👰 Novia",
  ambos: "💞 Ambos",
};

type PickerTarget = { table: MockTable; seatIndex: number } | null;

/* Posiciones por defecto de las mesas en el plano (mismas que Plan de mesas). */
const DEFAULT_SLOTS = [
  { x: 12, y: 25 }, { x: 12, y: 50 }, { x: 12, y: 75 },
  { x: 88, y: 25 }, { x: 88, y: 50 }, { x: 88, y: 75 },
  { x: 30, y: 85 }, { x: 50, y: 85 }, { x: 70, y: 85 },
  { x: 30, y: 65 }, { x: 70, y: 65 }, { x: 50, y: 68 },
];

/* Reparte `cap` sillas SIMÉTRICAS en los 4 lados de una mesa cuadrada
   (medio-lado = H). Se equilibran arriba/abajo e izquierda/derecha, y quedan
   centradas en cada lado (sin sillas en las esquinas). */
function seatOffsets(cap: number, H: number): { dx: number; dy: number }[] {
  const counts = [0, 0, 0, 0]; // arriba, derecha, abajo, izquierda
  const order = [0, 2, 1, 3]; // llena arriba/abajo primero → conserva la simetría
  for (let k = 0; k < cap; k++) counts[order[k % 4]]++;
  // n sillas en un lado: repartidas uniformemente y centradas en [-H, H].
  const spread = (n: number, j: number) => -H + (2 * H * (j + 1)) / (n + 1);
  const res: { dx: number; dy: number }[] = [];
  for (let j = 0; j < counts[0]; j++) res.push({ dx: spread(counts[0], j), dy: -H }); // arriba: izq→der
  for (let j = 0; j < counts[1]; j++) res.push({ dx: H, dy: spread(counts[1], j) }); // derecha: arriba→abajo
  for (let j = 0; j < counts[2]; j++) res.push({ dx: -spread(counts[2], j), dy: H }); // abajo: der→izq
  for (let j = 0; j < counts[3]; j++) res.push({ dx: -H, dy: -spread(counts[3], j) }); // izq: abajo→arriba
  return res;
}

/* ── Modal: elegir a quién sentar en una silla ── */
function SeatPicker({
  target,
  attendees,
  seating,
  tables,
  guestById,
  occupant,
  onPick,
  onClear,
  onClose,
}: {
  target: { table: MockTable; seatIndex: number };
  attendees: Attendee[];
  seating: MockAttendeeSeat[];
  tables: MockTable[];
  guestById: Map<number, Guest>;
  occupant: Attendee | null;
  onPick: (attendeeId: number) => void;
  onClear: () => void;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const tableName = (id: number) => tables.find((t) => t.id === id)?.name ?? "—";

  const statusOf = (attId: number): string => {
    const s = seating.find((x) => x.attendee_id === attId);
    if (!s) return "sin acomodar";
    if (s.mock_table_id === target.table.id && s.seat_index === null) return "en esta mesa, sin silla";
    if (s.seat_index === null) return `${tableName(s.mock_table_id)} · sin silla`;
    return `${tableName(s.mock_table_id)} · silla ${s.seat_index + 1}`;
  };

  const query = q.trim().toLowerCase();
  const list = useMemo(() => {
    const withMeta = attendees
      .filter((a) => a.id !== occupant?.id)
      .map((a) => {
        const g = guestById.get(a.guest_id);
        const s = seating.find((x) => x.attendee_id === a.id);
        // Prioridad: los de esta mesa sin silla → sin acomodar → el resto.
        const rank =
          s && s.mock_table_id === target.table.id && s.seat_index === null
            ? 0
            : !s
              ? 1
              : 2;
        return { a, familyName: g?.name ?? "", rank };
      })
      .filter(
        (r) =>
          !query ||
          r.a.name.toLowerCase().includes(query) ||
          r.familyName.toLowerCase().includes(query),
      );
    withMeta.sort((x, y) => x.rank - y.rank || x.a.name.localeCompare(y.a.name));
    return withMeta;
  }, [attendees, seating, guestById, occupant, target.table.id, query]);

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 flex flex-col max-h-[85vh]">
        <h2 className="text-lg font-semibold text-gray-900">
          {target.table.name} · Silla {target.seatIndex + 1}
        </h2>
        {occupant ? (
          <div className="mt-2 flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100">
            <span className="text-sm text-gray-700 truncate">
              Ahora: <span className="font-medium">{occupant.name}</span>
            </span>
            <button
              onClick={onClear}
              className="text-xs px-2.5 py-1 rounded-lg border border-gray-200 text-gray-600 hover:bg-white transition-colors shrink-0"
            >
              Vaciar silla
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-500 mt-1">Elige a quién sentar aquí.</p>
        )}

        <input
          type="text"
          autoFocus
          placeholder="Buscar persona o familia..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full mt-4 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-400 transition-colors"
        />

        <div className="mt-2 overflow-y-auto flex-1 -mx-1 px-1">
          {list.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Sin resultados.</p>
          ) : (
            <div className="space-y-0.5">
              {list.map(({ a, familyName }) => (
                <button
                  key={a.id}
                  onClick={() => onPick(a.id)}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left hover:bg-purple-50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-800 truncate">{a.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{familyName}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0">{statusOf(a.id)}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors shrink-0"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

/* ── Tarjeta de una mesa con sus sillas alrededor ── */
function TableCard({
  table,
  seating,
  attendees,
  guestById,
  colorOf,
  onOpenSeat,
  onRename,
  onCapacity,
  onAutoSeat,
  onSeatNext,
  onRemoveFromTable,
}: {
  table: MockTable;
  seating: MockAttendeeSeat[];
  attendees: Attendee[];
  guestById: Map<number, Guest>;
  colorOf: (guestId: number) => string;
  onOpenSeat: (seatIndex: number) => void;
  onRename: (name: string) => void;
  onCapacity: (cap: number) => void;
  onAutoSeat: () => void;
  onSeatNext: (attendeeId: number) => void;
  onRemoveFromTable: (attendeeId: number) => void;
}) {
  const cap = table.capacity;
  const attById = useMemo(() => new Map(attendees.map((a) => [a.id, a])), [attendees]);
  const here = seating.filter((s) => s.mock_table_id === table.id);
  const occupantAt = (i: number) => {
    const s = here.find((x) => x.seat_index === i);
    return s ? attById.get(s.attendee_id) ?? null : null;
  };
  const unseated = here
    .filter((s) => s.seat_index === null)
    .map((s) => attById.get(s.attendee_id))
    .filter((a): a is Attendee => a !== undefined);
  const seatedCount = here.filter((s) => s.seat_index !== null).length;

  // geometría: sillas repartidas en el perímetro de una mesa CUADRADA
  const SIZE = 236;
  const c = SIZE / 2;
  const H = 96; // medio anillo (distancia del centro a cada lado del cuadrado)
  const chairSize = cap > 14 ? 22 : 30;
  const offsets = seatOffsets(cap, H);
  const seatPos = (i: number) => ({ x: c + offsets[i].dx, y: c + offsets[i].dy });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      {/* Encabezado editable */}
      <div className="flex items-center gap-2 mb-1">
        <input
          defaultValue={table.name}
          onBlur={(e) => {
            const v = e.target.value.trim();
            if (v && v !== table.name) onRename(v);
            else if (!v) e.target.value = table.name;
          }}
          onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
          className="text-sm font-semibold text-gray-900 bg-transparent outline-none border-b border-transparent focus:border-gray-300 transition-colors flex-1 min-w-0"
        />
        <div className="flex items-center gap-1 shrink-0" title="Número de asientos">
          <button
            onClick={() => onCapacity(cap - 1)}
            disabled={cap <= 1}
            className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors font-semibold disabled:opacity-30 text-xs"
          >
            −
          </button>
          <span className="w-9 text-center text-xs text-gray-600">{seatedCount}/{cap}</span>
          <button
            onClick={() => onCapacity(cap + 1)}
            disabled={cap >= 30}
            className="w-6 h-6 rounded-full bg-gray-900 text-white hover:bg-gray-700 transition-colors font-semibold disabled:opacity-30 text-xs"
          >
            +
          </button>
        </div>
      </div>

      {/* Diagrama: mesa cuadrada con sillas en su perímetro */}
      <div className="relative mx-auto" style={{ width: SIZE, height: SIZE }}>
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg border-2 border-gray-300 bg-gray-50 flex items-center justify-center text-center px-2"
          style={{ width: 104, height: 104 }}
        >
          <span className="text-xs font-semibold text-gray-500 break-words leading-tight">
            {table.name}
          </span>
        </div>
        {Array.from({ length: cap }, (_, i) => {
          const { x, y } = seatPos(i);
          const occ = occupantAt(i);
          const color = occ ? colorOf(occ.guest_id) : undefined;
          return (
            <button
              key={i}
              onClick={() => onOpenSeat(i)}
              className={`group absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center text-[10px] font-semibold transition-transform hover:scale-110 hover:z-20 ${
                occ ? "text-white border-2 border-white shadow-sm" : "text-gray-400 border-2 border-dashed border-gray-300 bg-white hover:border-gray-400"
              }`}
              style={{ left: x, top: y, width: chairSize, height: chairSize, backgroundColor: color }}
            >
              {i + 1}
              <span className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 rounded-md bg-gray-900 text-white text-[10px] font-normal whitespace-nowrap z-30 pointer-events-none shadow-lg">
                {occ ? occ.name : `Silla ${i + 1} · vacía`}
              </span>
            </button>
          );
        })}
      </div>

      {/* Lista silla → nombre (legible) */}
      <div className="mt-2 space-y-0.5">
        {Array.from({ length: cap }, (_, i) => {
          const occ = occupantAt(i);
          return (
            <button
              key={i}
              onClick={() => onOpenSeat(i)}
              className="w-full flex items-center gap-2 px-2 py-1 rounded-md text-left hover:bg-gray-50 transition-colors"
            >
              <span className="w-5 text-center text-[11px] text-gray-400 shrink-0">{i + 1}</span>
              {occ ? (
                <>
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: colorOf(occ.guest_id) }}
                  />
                  <span className="text-sm text-gray-800 truncate flex-1">{occ.name}</span>
                </>
              ) : (
                <span className="text-sm text-gray-300 flex-1">Silla vacía</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Por acomodar (en la mesa pero sin silla) */}
      {unseated.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[11px] font-medium text-amber-600">
              Por acomodar ({unseated.length})
            </p>
            <button
              onClick={onAutoSeat}
              className="text-[11px] px-2 py-0.5 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              ⚡ Acomodar todos
            </button>
          </div>
          <div className="flex flex-wrap gap-1">
            {unseated.map((a) => (
              <span
                key={a.id}
                className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-full text-xs bg-amber-50 text-amber-700 border border-amber-200"
              >
                <button onClick={() => onSeatNext(a.id)} title="Sentar en la siguiente silla libre" className="truncate max-w-[120px]">
                  {a.name}
                </button>
                <button
                  onClick={() => onRemoveFromTable(a.id)}
                  title="Quitar de la mesa"
                  className="text-amber-400 hover:text-red-500 transition-colors"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AsientosPage() {
  const [tables, setTables] = useState<MockTable[]>([]);
  const [seating, setSeating] = useState<MockAttendeeSeat[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [picker, setPicker] = useState<PickerTarget>(null);
  const [showPlano, setShowPlano] = useState(true);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const planoRef = useRef<HTMLDivElement>(null);
  const dragPos = useRef<{ x: number; y: number } | null>(null);

  const fetchAll = useCallback(async () => {
    const [mRes, gRes, aRes] = await Promise.all([
      fetch("/api/mock-tables"),
      fetch("/api/guests"),
      fetch("/api/attendees"),
    ]);
    const mData = await mRes.json();
    setTables(mData.tables ?? []);
    setSeating(mData.attendeeSeating ?? []);
    setGuests((await gRes.json()).guests ?? []);
    setAttendees((await aRes.json()).attendees ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const guestById = useMemo(() => new Map(guests.map((g) => [g.id, g])), [guests]);
  const attById = useMemo(() => new Map(attendees.map((a) => [a.id, a])), [attendees]);
  const colorOf = useCallback(
    (guestId: number) =>
      FAMILY_COLORS[guests.findIndex((g) => g.id === guestId) % FAMILY_COLORS.length] ?? "#8a6cb8",
    [guests],
  );

  const seatEntry = (attId: number) => seating.find((s) => s.attendee_id === attId);
  const chairOccupant = (tableId: number, i: number): Attendee | null => {
    const s = seating.find((x) => x.mock_table_id === tableId && x.seat_index === i);
    return s ? attById.get(s.attendee_id) ?? null : null;
  };

  /* ── Plano del recinto (posiciones propias, aparte de Plan de mesas) ── */
  const posOf = (t: MockTable) => {
    if (t.seat_pos_x !== null && t.seat_pos_y !== null) return { x: t.seat_pos_x, y: t.seat_pos_y };
    const idx = tables
      .filter((o) => o.seat_pos_x === null || o.seat_pos_y === null)
      .findIndex((o) => o.id === t.id);
    return DEFAULT_SLOTS[idx % DEFAULT_SLOTS.length];
  };

  const patchSeatPos = async (id: number, x: number, y: number) => {
    setTables((prev) => prev.map((t) => (t.id === id ? { ...t, seat_pos_x: x, seat_pos_y: y } : t)));
    await fetch(`/api/mock-tables/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ seat_pos_x: x, seat_pos_y: y }),
    });
  };

  const startDrag = (e: React.PointerEvent, id: number) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragPos.current = null;
    setDraggingId(id);
  };
  const moveDrag = (e: React.PointerEvent, id: number) => {
    if (draggingId !== id) return;
    const rect = planoRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clamp = (v: number, mn: number, mx: number) => Math.min(mx, Math.max(mn, v));
    const x = clamp(((e.clientX - rect.left) / rect.width) * 100, 5, 95);
    const y = clamp(((e.clientY - rect.top) / rect.height) * 100, 7, 93);
    dragPos.current = { x, y };
    setTables((prev) => prev.map((t) => (t.id === id ? { ...t, seat_pos_x: x, seat_pos_y: y } : t)));
  };
  const endDrag = (id: number) => {
    if (draggingId !== id) return;
    setDraggingId(null);
    if (dragPos.current) {
      const { x, y } = dragPos.current;
      dragPos.current = null;
      patchSeatPos(id, Math.round(x * 10) / 10, Math.round(y * 10) / 10);
    }
  };

  /* ── Acciones (optimistas) ── */
  const assignSeat = async (attId: number, tableId: number, seatIndex: number) => {
    setSeating((prev) => {
      let next = prev.filter((s) => s.attendee_id !== attId);
      // libera la silla destino si estaba ocupada (esa persona queda sin silla)
      next = next.map((s) =>
        s.mock_table_id === tableId && s.seat_index === seatIndex ? { ...s, seat_index: null } : s,
      );
      next.push({ attendee_id: attId, mock_table_id: tableId, seat_index: seatIndex });
      return next;
    });
    await fetch("/api/mock-tables/seat", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attendee_id: attId, mock_table_id: tableId, seat_index: seatIndex }),
    }).catch(() => fetchAll());
  };

  const clearSeat = async (attId: number) => {
    setSeating((prev) => prev.map((s) => (s.attendee_id === attId ? { ...s, seat_index: null } : s)));
    await fetch("/api/mock-tables/seat", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attendee_id: attId, seat_index: null }),
    }).catch(() => fetchAll());
  };

  const removeFromTable = async (attId: number) => {
    setSeating((prev) => prev.filter((s) => s.attendee_id !== attId));
    await fetch("/api/mock-tables/assign-attendee", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attendee_id: attId, mock_table_id: null }),
    }).catch(() => fetchAll());
  };

  const nextFreeChair = (table: MockTable) => {
    const occ = new Set(
      seating.filter((s) => s.mock_table_id === table.id && s.seat_index !== null).map((s) => s.seat_index),
    );
    for (let i = 0; i < table.capacity; i++) if (!occ.has(i)) return i;
    return null;
  };

  const seatNext = (table: MockTable, attId: number) => {
    const i = nextFreeChair(table);
    if (i === null) {
      alert(`${table.name} ya tiene todas las sillas ocupadas. Sube el número de asientos.`);
      return;
    }
    assignSeat(attId, table.id, i);
  };

  const autoSeat = (table: MockTable) => {
    const occupied = new Set(
      seating.filter((s) => s.mock_table_id === table.id && s.seat_index !== null).map((s) => s.seat_index),
    );
    const free: number[] = [];
    for (let i = 0; i < table.capacity; i++) if (!occupied.has(i)) free.push(i);
    const toSeat = seating
      .filter((s) => s.mock_table_id === table.id && s.seat_index === null)
      .map((s) => s.attendee_id);
    const pairs = toSeat.slice(0, free.length).map((attId, k) => ({ attId, seat: free[k] }));
    if (pairs.length === 0) return;
    setSeating((prev) =>
      prev.map((s) => {
        const p = pairs.find((p) => p.attId === s.attendee_id);
        return p ? { ...s, seat_index: p.seat } : s;
      }),
    );
    Promise.all(
      pairs.map((p) =>
        fetch("/api/mock-tables/seat", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ attendee_id: p.attId, mock_table_id: table.id, seat_index: p.seat }),
        }),
      ),
    ).catch(() => fetchAll());
  };

  const renameTable = async (id: number, name: string) => {
    setTables((prev) => prev.map((t) => (t.id === id ? { ...t, name } : t)));
    await fetch(`/api/mock-tables/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
  };

  const setCapacity = async (table: MockTable, cap: number) => {
    const next = Math.max(1, Math.min(30, cap));
    if (next === table.capacity) return;
    // Si se reduce, las personas en sillas que desaparecen quedan sin silla.
    const bumped = seating.filter(
      (s) => s.mock_table_id === table.id && s.seat_index !== null && s.seat_index >= next,
    );
    setSeating((prev) =>
      prev.map((s) =>
        s.mock_table_id === table.id && s.seat_index !== null && s.seat_index >= next
          ? { ...s, seat_index: null }
          : s,
      ),
    );
    setTables((prev) => prev.map((t) => (t.id === table.id ? { ...t, capacity: next } : t)));
    await Promise.all([
      ...bumped.map((s) =>
        fetch("/api/mock-tables/seat", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ attendee_id: s.attendee_id, seat_index: null }),
        }),
      ),
      fetch(`/api/mock-tables/${table.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ capacity: next }),
      }),
    ]).catch(() => fetchAll());
  };

  const addTable = async () => {
    const res = await fetch("/api/mock-tables", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });
    const t = await res.json();
    setTables((prev) => [...prev, t]);
  };

  const importFromReal = async () => {
    if (importing) return;
    if (
      !confirm(
        "Importar el acomodo REAL de Mesas al plan por persona.\n\n" +
          "• Reemplaza a las personas del plan por persona (y sus sillas).\n" +
          "• NO toca el acomodo real de Mesas.\n\n¿Continuar?",
      )
    )
      return;
    setImporting(true);
    const res = await fetch("/api/mock-tables/import", { method: "POST" });
    const data = await res.json().catch(() => ({}));
    await fetchAll();
    setImporting(false);
    if (data?.ok) alert(`Importado: ${data.people} personas. Usa «⚡ Acomodar todos» en cada mesa para asignar sillas.`);
  };

  /* ── Datos derivados ── */
  const totalSeats = tables.reduce((s, t) => s + t.capacity, 0);
  const seatedCount = seating.filter((s) => s.seat_index !== null).length;
  const unseatedCount = seating.filter((s) => s.seat_index === null).length;

  const pickerOccupant: Attendee | null = useMemo(() => {
    if (!picker) return null;
    const s = seating.find(
      (x) => x.mock_table_id === picker.table.id && x.seat_index === picker.seatIndex,
    );
    return s ? attById.get(s.attendee_id) ?? null : null;
  }, [picker, seating, attById]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-2xl">🪑</span>
          <div>
            <h1 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">
              Asientos · lugar exacto
            </h1>
            <p className="text-xs text-gray-500">La silla de cada persona por nombre</p>
          </div>
          <nav className="flex items-center gap-1 sm:ml-2 flex-wrap">
            <Link href="/admin" className="text-sm px-3 py-1.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              Invitados
            </Link>
            <Link href="/admin/nombres" className="text-sm px-3 py-1.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              Nombres
            </Link>
            <Link href="/admin/mesas" className="text-sm px-3 py-1.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              Mesas
            </Link>
            <Link href="/admin/mesas-plan" className="text-sm px-3 py-1.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              Plan de mesas
            </Link>
            <span className="text-sm px-3 py-1.5 rounded-lg font-medium bg-gray-900 text-white">
              Asientos
            </span>
            <Link href="/admin/merch" className="text-sm px-3 py-1.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              Merch
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={importFromReal}
            disabled={importing}
            title="Copiar el acomodo real de Mesas al plan por persona"
            className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {importing ? "Importando..." : "⬇️ Importar de Mesas"}
          </button>
          <button
            onClick={addTable}
            className="text-sm px-4 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors font-medium"
          >
            + Agregar mesa
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-6 text-sm text-gray-500 flex-wrap">
          <span><strong className="text-gray-800">{tables.length}</strong> mesas</span>
          <span><strong className="text-gray-800">{totalSeats}</strong> sillas</span>
          <span><strong className="text-emerald-700">{seatedCount}</strong> sentados</span>
          <span><strong className="text-amber-600">{unseatedCount}</strong> por acomodar</span>
          <span className="text-xs text-gray-400 sm:ml-auto">
            Clic en una silla para sentar a alguien · edita nombre y número de asientos en cada mesa
          </span>
        </div>

        {/* Plano del recinto completo (acomodo propio, aparte de Plan de mesas) */}
        {!loading && tables.length > 0 && (
          <section className="mb-6">
            <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
              <h2 className="text-sm font-semibold text-gray-900">🗺️ Recinto · asientos</h2>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-gray-400 hidden sm:inline">
                  Arrastra las mesas para acomodar el recinto · clic en una silla para sentar a alguien
                </span>
                <button
                  onClick={() => setShowPlano((v) => !v)}
                  className="text-xs px-2.5 py-1 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  {showPlano ? "Ocultar" : "Mostrar"} plano
                </button>
              </div>
            </div>
            {showPlano && (
              <div
                ref={planoRef}
                className="relative w-full aspect-[16/10] rounded-xl border-2 border-gray-300 bg-white select-none"
              >
                {/* Mesa de novios (fija) */}
                <div className="absolute left-1/2 top-[3%] -translate-x-1/2 px-3 py-1 rounded-lg border-2 border-gray-800 bg-gray-900 text-white text-[10px] font-semibold">
                  💍 Novios
                </div>
                {/* Pista (fija) */}
                <div className="absolute left-[56%] top-[32%] -translate-x-1/2 w-[18%] h-[28.8%] rounded-lg border-2 border-gray-300 bg-gray-50 flex items-center justify-center">
                  <span className="text-gray-300 font-bold tracking-[0.3em] text-xs sm:text-base">PISTA</span>
                </div>

                {tables.map((t) => {
                  const p = posOf(t);
                  const seatedHere = seating.filter(
                    (s) => s.mock_table_id === t.id && s.seat_index !== null,
                  ).length;
                  const BOX = 92; // lienzo de la mesa en el plano
                  const half = BOX / 2;
                  const PH = 30; // medio anillo de sillas (pequeño)
                  const mini = t.capacity > 16 ? 10 : 13;
                  const offsets = seatOffsets(t.capacity, PH);
                  return (
                    <div
                      key={t.id}
                      onPointerDown={(e) => startDrag(e, t.id)}
                      onPointerMove={(e) => moveDrag(e, t.id)}
                      onPointerUp={() => endDrag(t.id)}
                      onPointerCancel={() => endDrag(t.id)}
                      style={{ left: `${p.x}%`, top: `${p.y}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 touch-none cursor-grab active:cursor-grabbing ${
                        draggingId === t.id ? "z-10" : ""
                      }`}
                    >
                      <div className="relative" style={{ width: BOX, height: BOX }}>
                        {/* mesa cuadrada */}
                        <div
                          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md border-2 bg-white shadow-sm flex flex-col items-center justify-center px-1"
                          style={{
                            width: 46,
                            height: 46,
                            borderColor: draggingId === t.id ? "#a78bfa" : "#d1d5db",
                          }}
                        >
                          <span className="text-[9px] font-semibold text-gray-700 leading-tight text-center break-words max-w-[42px]">
                            {t.name}
                          </span>
                          <span className="text-[8px] text-gray-400 leading-none">
                            {seatedHere}/{t.capacity}
                          </span>
                        </div>
                        {/* sillas */}
                        {Array.from({ length: t.capacity }, (_, i) => {
                          const { dx, dy } = offsets[i];
                          const occ = chairOccupant(t.id, i);
                          return (
                            <button
                              key={i}
                              onPointerDown={(e) => e.stopPropagation()}
                              onClick={() => setPicker({ table: t, seatIndex: i })}
                              className={`group absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform hover:scale-125 hover:z-20 ${
                                occ ? "border border-white shadow-sm" : "border border-dashed border-gray-300 bg-white"
                              }`}
                              style={{
                                left: half + dx,
                                top: half + dy,
                                width: mini,
                                height: mini,
                                backgroundColor: occ ? colorOf(occ.guest_id) : undefined,
                              }}
                            >
                              <span className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 rounded-md bg-gray-900 text-white text-[10px] whitespace-nowrap z-30 pointer-events-none shadow-lg">
                                {occ ? occ.name : `Silla ${i + 1} · vacía`}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {loading ? (
          <div className="py-20 text-center text-gray-400 text-sm bg-white rounded-xl border border-gray-200">
            Cargando...
          </div>
        ) : tables.length === 0 ? (
          <div className="py-20 text-center text-gray-400 text-sm bg-white rounded-xl border border-gray-200">
            Aún no hay mesas. Agrega una con «+ Agregar mesa» o importa el acomodo de Mesas.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {tables.map((t) => (
              <TableCard
                key={t.id}
                table={t}
                seating={seating}
                attendees={attendees}
                guestById={guestById}
                colorOf={colorOf}
                onOpenSeat={(seatIndex) => setPicker({ table: t, seatIndex })}
                onRename={(name) => renameTable(t.id, name)}
                onCapacity={(cap) => setCapacity(t, cap)}
                onAutoSeat={() => autoSeat(t)}
                onSeatNext={(attId) => seatNext(t, attId)}
                onRemoveFromTable={(attId) => removeFromTable(attId)}
              />
            ))}
          </div>
        )}
      </main>

      {picker && (
        <SeatPicker
          target={picker}
          attendees={attendees}
          seating={seating}
          tables={tables}
          guestById={guestById}
          occupant={pickerOccupant}
          onPick={(attId) => {
            assignSeat(attId, picker.table.id, picker.seatIndex);
            setPicker(null);
          }}
          onClear={() => {
            if (pickerOccupant) clearSeat(pickerOccupant.id);
            setPicker(null);
          }}
          onClose={() => setPicker(null)}
        />
      )}
    </div>
  );
}
