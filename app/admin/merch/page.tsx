"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { MerchItem, MerchRecipient } from "@/lib/merch";
import type { Guest } from "@/lib/guests";
import type { Attendee } from "@/lib/attendees";

type DeliveredFilter = "todos" | "pendientes" | "entregados";
type ViewMode = "grupos" | "individual";

const SIN_GRUPO = "Sin grupo";

function groupOf(r: MerchRecipient): string {
  return r.group_name?.trim() || SIN_GRUPO;
}

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: number;
  sub?: string;
  color: string;
}) {
  return (
    <div className={`rounded-xl border p-4 ${color}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm font-medium mt-0.5">{label}</p>
      {sub && <p className="text-xs opacity-60 mt-0.5">{sub}</p>}
    </div>
  );
}

/* ── Modal de artículo del inventario (agregar / editar) ── */
function ItemModal({
  item,
  onClose,
  onSaved,
}: {
  item: MerchItem | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(item?.name ?? "");
  const [emoji, setEmoji] = useState(item?.emoji ?? "");
  const [stock, setStock] = useState(item?.stock != null ? String(item.stock) : "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!name.trim()) return;
    setSaving(true);
    const payload = {
      name: name.trim(),
      emoji: emoji.trim(),
      stock: stock.trim() === "" ? null : Number(stock),
    };
    if (item) {
      await fetch(`/api/merch/items/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/merch/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setSaving(false);
    onSaved();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-5">
          {item ? "Editar artículo" : "Agregar al inventario"}
        </h2>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-20">
              <label className="block text-xs font-medium text-gray-600 mb-1">Emoji</label>
              <input
                type="text"
                placeholder="🎁"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-center outline-none focus:border-gray-400 transition-colors"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">Nombre *</label>
              <input
                type="text"
                placeholder="Ej: Vasos, Geles, Playeras..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && save()}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-400 transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Cantidad en inventario
            </label>
            <input
              type="number"
              min={0}
              placeholder="Ej: 100 · vacío = sin límite"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-400 transition-colors"
            />
            <p className="text-xs text-gray-400 mt-1">
              Cuántas piezas tienes en total. Cada asignación va restando de aquí.
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={save}
            disabled={saving || !name.trim()}
            className="flex-1 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {saving ? "Guardando..." : item ? "Guardar cambios" : "Agregar"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Modal para agregar personas (familia completa, registradas o externos) ── */
type AddMode = "lista" | "registradas" | "externo";

function AddPeopleModal({
  guests,
  attendees,
  recipients,
  presetGroup,
  presetGuestId,
  onClose,
  onSaved,
}: {
  guests: Guest[];
  attendees: Attendee[];
  recipients: MerchRecipient[];
  /** Si viene, el modal solo agrega personas a ese grupo existente. */
  presetGroup?: string;
  presetGuestId?: number | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const toGroup = presetGroup !== undefined;
  // Al agregar a un grupo existente ya no tiene sentido elegir "una familia":
  // por defecto se buscan personas ya registradas.
  const [mode, setMode] = useState<AddMode>(toGroup ? "registradas" : "lista");
  const [guestId, setGuestId] = useState("");
  const [groupName, setGroupName] = useState(presetGroup === SIN_GRUPO ? "" : presetGroup ?? "");
  const [names, setNames] = useState<string[]>([""]);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  // Buscador de personas registradas (attendees) de cualquier familia.
  const [pickerSearch, setPickerSearch] = useState("");
  const [picked, setPicked] = useState<Set<number>>(new Set());

  const guestById = useMemo(() => new Map(guests.map((g) => [g.id, g])), [guests]);

  // Familias que aún no están en el merch (para no duplicarlas al agregarlas).
  const usedGuestIds = new Set(recipients.map((r) => r.guest_id).filter((x) => x !== null));
  const availableGuests = guests.filter((g) => !usedGuestIds.has(g.id));
  const existingGroups = [...new Set(recipients.map(groupOf).filter((g) => g !== SIN_GRUPO))];

  // Personas ya en merch (por familia+nombre) para marcarlas y no duplicar.
  const alreadyInMerch = useMemo(
    () =>
      new Set(
        recipients.map((r) => `${r.guest_id ?? ""}::${r.name.trim().toLowerCase()}`),
      ),
    [recipients],
  );
  const attKey = (a: Attendee) => `${a.guest_id}::${a.name.trim().toLowerCase()}`;

  // Attendees visibles en el buscador (filtrados por nombre o familia).
  const shownAttendees = useMemo(() => {
    const q = pickerSearch.trim().toLowerCase();
    return attendees.filter((a) => {
      const fam = guestById.get(a.guest_id)?.name ?? "";
      return !q || a.name.toLowerCase().includes(q) || fam.toLowerCase().includes(q);
    });
  }, [attendees, pickerSearch, guestById]);

  // Agrupadas por familia para mostrarlas ordenaditas.
  const attendeesByFamily = useMemo(() => {
    const map = new Map<number, Attendee[]>();
    for (const a of shownAttendees) {
      if (!map.has(a.guest_id)) map.set(a.guest_id, []);
      map.get(a.guest_id)!.push(a);
    }
    return [...map.entries()];
  }, [shownAttendees]);

  const togglePicked = (id: number) =>
    setPicked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  // Al elegir familia: una fila por lugar, con los nombres reales si ya se
  // registraron asistentes; si no, editable con placeholder de la familia.
  const pickGuest = (id: string) => {
    setGuestId(id);
    const g = guests.find((x) => x.id === Number(id));
    if (!g) return;
    setGroupName(g.name);
    const regs = attendees.filter((a) => a.guest_id === g.id).map((a) => a.name);
    setNames(
      Array.from({ length: g.seats }, (_, i) => regs[i] ?? `${g.name} · persona ${i + 1}`),
    );
  };

  const setNameAt = (i: number, v: string) =>
    setNames((ns) => ns.map((n, j) => (j === i ? v : n)));
  const removeNameAt = (i: number) => setNames((ns) => ns.filter((_, j) => j !== i));

  const cleanNames = names.map((n) => n.trim()).filter(Boolean);
  const canSave =
    mode === "registradas"
      ? picked.size > 0
      : cleanNames.length > 0 && (mode === "externo" || guestId !== "");
  const saveCount = mode === "registradas" ? picked.size : cleanNames.length;

  const save = async () => {
    if (!canSave || saving) return;
    setSaving(true);
    if (mode === "registradas") {
      // Cada persona conserva su familia (guest_id). El grupo: si estamos
      // agregando a un grupo existente, ese; si no, el que escriba el usuario, y
      // si lo deja vacío, la familia de cada quien.
      const override = groupName.trim();
      const groupFor = (a: Attendee) =>
        toGroup
          ? presetGroup === SIN_GRUPO
            ? null
            : presetGroup ?? null
          : override || guestById.get(a.guest_id)?.name || null;
      const people = attendees
        .filter((a) => picked.has(a.id))
        .map((a) => ({ guest_id: a.guest_id, name: a.name, group_name: groupFor(a) }));
      await fetch("/api/merch/recipients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ people, notes }),
      });
    } else {
      await fetch("/api/merch/recipients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guest_id: mode === "lista" ? Number(guestId) : presetGuestId ?? null,
          group_name: groupName,
          names: cleanNames,
          notes,
        }),
      });
    }
    setSaving(false);
    onSaved();
    onClose();
  };

  const modeOptions = (
    toGroup
      ? [
          { value: "registradas", label: "👤 Registrados" },
          { value: "externo", label: "✍️ Nombre libre" },
        ]
      : [
          { value: "lista", label: "👨‍👩‍👧 Familia" },
          { value: "registradas", label: "👤 Registrados" },
          { value: "externo", label: "✍️ Libre" },
        ]
  ) as { value: AddMode; label: string }[];

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-5">
          {toGroup ? `Agregar persona a «${presetGroup}»` : "Agregar a merch"}
        </h2>

        <div className="flex items-center gap-2 mb-4">
          {modeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setMode(opt.value)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === opt.value
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {mode === "lista" && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Familia *</label>
              <select
                value={guestId}
                onChange={(e) => pickGuest(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-400 transition-colors bg-white"
              >
                <option value="">Selecciona una familia...</option>
                {availableGuests.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} · {g.seats} {g.seats === 1 ? "lugar" : "lugares"}
                  </option>
                ))}
              </select>
              {availableGuests.length === 0 && (
                <p className="text-xs text-amber-600 mt-1">
                  Todas tus familias invitadas ya están en el merch.
                </p>
              )}
            </div>
          )}

          {/* ── Buscador de personas ya registradas (de cualquier familia) ── */}
          {mode === "registradas" && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Personas registradas ({picked.size} elegidas)
              </label>
              <input
                type="text"
                placeholder="Buscar por nombre o familia..."
                value={pickerSearch}
                onChange={(e) => setPickerSearch(e.target.value)}
                className="w-full px-3 py-2 mb-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-400 transition-colors"
              />
              {attendees.length === 0 ? (
                <p className="text-xs text-amber-600 py-2">
                  Aún no hay nombres registrados. Regístralos en Invitados (👤) al confirmar RSVP.
                </p>
              ) : attendeesByFamily.length === 0 ? (
                <p className="text-xs text-gray-400 py-2 text-center">Sin resultados.</p>
              ) : (
                <div className="max-h-64 overflow-y-auto pr-1 space-y-3 border border-gray-100 rounded-lg p-2">
                  {attendeesByFamily.map(([gid, people]) => (
                    <div key={gid}>
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide px-1 mb-1">
                        {guestById.get(gid)?.name ?? "Sin familia"}
                      </p>
                      <div className="space-y-0.5">
                        {people.map((a) => {
                          const dup = alreadyInMerch.has(attKey(a));
                          const on = picked.has(a.id);
                          return (
                            <button
                              key={a.id}
                              onClick={() => !dup && togglePicked(a.id)}
                              disabled={dup}
                              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left text-sm transition-colors ${
                                dup
                                  ? "opacity-50 cursor-not-allowed"
                                  : on
                                    ? "bg-purple-50 text-purple-800"
                                    : "hover:bg-gray-50 text-gray-700"
                              }`}
                            >
                              <span
                                className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] shrink-0 ${
                                  on
                                    ? "bg-purple-600 border-purple-600 text-white"
                                    : "border-gray-300 text-transparent"
                                }`}
                              >
                                ✓
                              </span>
                              <span className="flex-1 truncate">{a.name}</span>
                              {dup && <span className="text-[10px] text-gray-400">ya en merch</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Grupo destino: para modo libre o para agrupar a las registradas.
              (Al agregar a un grupo existente ya está definido, no se pide.) */}
          {!toGroup && (mode === "externo" || mode === "registradas" || guestId !== "") && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Grupo</label>
              <input
                type="text"
                list="merch-groups"
                placeholder={
                  mode === "registradas" ? "Vacío = la familia de cada quien" : "Ej: Familia García, Staff, DJ..."
                }
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-400 transition-colors"
              />
              <datalist id="merch-groups">
                {existingGroups.map((g) => (
                  <option key={g} value={g} />
                ))}
              </datalist>
              <p className="text-xs text-gray-400 mt-1">
                {mode === "registradas"
                  ? "Si lo dejas vacío, cada persona se agrupa bajo su familia."
                  : "Los paquetes se ven agrupados por esto. Puedes reutilizar un grupo existente."}
              </p>
            </div>
          )}

          {(mode === "externo" || (mode === "lista" && guestId !== "")) && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Personas ({cleanNames.length})
              </label>
              <div className="space-y-2">
                {names.map((n, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`Persona ${i + 1}`}
                      value={n}
                      onChange={(e) => setNameAt(i, e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-400 transition-colors"
                    />
                    {names.length > 1 && (
                      <button
                        onClick={() => removeNameAt(i)}
                        title="Quitar"
                        className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition-colors text-sm"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setNames((ns) => [...ns, ""])}
                className="mt-2 text-xs px-2.5 py-1 rounded-full border border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors"
              >
                + Otra persona
              </button>
              {mode === "lista" && (
                <p className="text-xs text-gray-400 mt-2">
                  Una fila por lugar de la familia. Quita a quien no le toque merch.
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Notas</label>
            <input
              type="text"
              placeholder="Ej: tallas, entregar en recepción..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-400 transition-colors"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={save}
            disabled={saving || !canSave}
            className="flex-1 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {saving
              ? "Guardando..."
              : saveCount > 1
                ? `Agregar ${saveCount} personas`
                : "Agregar"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Modal para editar una persona (nombre, grupo, notas) ── */
function EditPersonModal({
  recipient,
  recipients,
  onClose,
  onSaved,
}: {
  recipient: MerchRecipient;
  recipients: MerchRecipient[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(recipient.name);
  const [groupName, setGroupName] = useState(recipient.group_name ?? "");
  const [notes, setNotes] = useState(recipient.notes ?? "");
  const [saving, setSaving] = useState(false);
  const existingGroups = [...new Set(recipients.map(groupOf).filter((g) => g !== SIN_GRUPO))];

  const save = async () => {
    if (!name.trim()) return;
    setSaving(true);
    await fetch(`/api/merch/recipients/${recipient.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), group_name: groupName, notes }),
    });
    setSaving(false);
    onSaved();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-5">Editar persona</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Nombre *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-400 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Grupo</label>
            <input
              type="text"
              list="merch-groups-edit"
              placeholder="Sin grupo"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-400 transition-colors"
            />
            <datalist id="merch-groups-edit">
              {existingGroups.map((g) => (
                <option key={g} value={g} />
              ))}
            </datalist>
            <p className="text-xs text-gray-400 mt-1">
              Cámbialo para mover a esta persona a otro grupo.
            </p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Notas</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-400 transition-colors"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={save}
            disabled={saving || !name.trim()}
            className="flex-1 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Modal para armar el paquete de una persona ── */
function PackageModal({
  recipient,
  items,
  onClose,
  onChanged,
}: {
  recipient: MerchRecipient;
  items: MerchItem[];
  onClose: () => void;
  onChanged: () => void;
}) {
  const [qtys, setQtys] = useState<Record<number, number>>(
    Object.fromEntries(recipient.items.map((e) => [e.item_id, e.qty])),
  );

  const setQty = async (itemId: number, qty: number) => {
    const next = Math.max(0, qty);
    setQtys((q) => ({ ...q, [itemId]: next }));
    await fetch("/api/merch/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipient_id: recipient.id, item_id: itemId, qty: next }),
    });
  };

  // Piezas restantes por artículo, contando lo asignado a otros paquetes.
  const remaining = (item: MerchItem) => {
    if (item.stock == null) return null;
    const originallyMine = recipient.items.find((e) => e.item_id === item.id)?.qty ?? 0;
    const othersAssigned = item.assigned - originallyMine;
    return item.stock - othersAssigned - (qtys[item.id] ?? 0);
  };

  const total = Object.values(qtys).reduce((s, n) => s + n, 0);
  const close = () => { onChanged(); onClose(); };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-gray-900">Armar paquete</h2>
        <p className="text-sm text-gray-500 mb-1">
          {recipient.name}
          {recipient.group_name && (
            <span className="text-gray-400"> · {recipient.group_name}</span>
          )}
        </p>
        <p className="text-xs text-gray-400 mb-5">
          {total} {total === 1 ? "pieza" : "piezas"} en el paquete
        </p>

        {items.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">
            Primero agrega artículos al inventario.
          </p>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {items.map((item) => {
              const qty = qtys[item.id] ?? 0;
              const left = remaining(item);
              const outOfStock = left !== null && left <= 0;
              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-colors ${
                    qty > 0 ? "border-purple-200 bg-purple-50" : "border-gray-100"
                  }`}
                >
                  <span className="text-xl">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                    {item.stock != null && (
                      <p className={`text-xs ${outOfStock ? "text-red-500" : "text-gray-400"}`}>
                        quedan {left} de {item.stock}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setQty(item.id, qty - 1)}
                      disabled={qty === 0}
                      className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors font-semibold disabled:opacity-30"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm font-semibold text-gray-900">{qty}</span>
                    <button
                      onClick={() => setQty(item.id, qty + 1)}
                      disabled={outOfStock}
                      className="w-7 h-7 rounded-full bg-gray-900 text-white hover:bg-gray-700 transition-colors font-semibold disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={close}
          className="w-full mt-5 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          Listo
        </button>
      </div>
    </div>
  );
}

/* ── Chips del contenido de un paquete ── */
function PackageChips({
  recipient,
  itemById,
  onOpen,
}: {
  recipient: MerchRecipient;
  itemById: Map<number, MerchItem>;
  onOpen: () => void;
}) {
  if (recipient.items.length === 0) {
    return (
      <button
        onClick={onOpen}
        className="text-xs px-2.5 py-1 rounded-full border border-dashed border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors"
      >
        + Armar paquete
      </button>
    );
  }
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {recipient.items.map((e) => {
        const item = itemById.get(e.item_id);
        if (!item) return null;
        return (
          <button
            key={e.item_id}
            onClick={onOpen}
            title={`${item.name} — clic para editar el paquete`}
            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors"
          >
            {item.emoji}
            {e.qty > 1 && <span className="font-semibold">×{e.qty}</span>}
          </button>
        );
      })}
    </div>
  );
}

export default function MerchAdminPage() {
  const [items, setItems] = useState<MerchItem[]>([]);
  const [recipients, setRecipients] = useState<MerchRecipient[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<DeliveredFilter>("todos");
  const [view, setView] = useState<ViewMode>("grupos");
  const [showItemModal, setShowItemModal] = useState(false);
  const [editItem, setEditItem] = useState<MerchItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addToGroup, setAddToGroup] = useState<{ group: string; guestId: number | null } | null>(null);
  const [editPerson, setEditPerson] = useState<MerchRecipient | null>(null);
  const [packageRecipient, setPackageRecipient] = useState<MerchRecipient | null>(null);

  const fetchData = useCallback(async () => {
    const [mRes, gRes, aRes] = await Promise.all([
      fetch("/api/merch"),
      fetch("/api/guests"),
      fetch("/api/attendees"),
    ]);
    const mData = await mRes.json();
    const gData = await gRes.json();
    const aData = await aRes.json();
    setItems(mData.items ?? []);
    setRecipients(mData.recipients ?? []);
    setGuests(gData.guests ?? []);
    setAttendees(aData.attendees ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const itemById = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);

  const packageSize = (r: MerchRecipient) => r.items.reduce((s, e) => s + e.qty, 0);

  const toggleDelivered = async (r: MerchRecipient) => {
    const delivered = !r.delivered;
    setRecipients((rs) => rs.map((x) => (x.id === r.id ? { ...x, delivered } : x)));
    await fetch(`/api/merch/recipients/${r.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ delivered }),
    });
  };

  const deliverGroup = async (members: MerchRecipient[]) => {
    const pending = members.filter((m) => !m.delivered);
    if (pending.length === 0) return;
    setRecipients((rs) =>
      rs.map((x) => (pending.some((p) => p.id === x.id) ? { ...x, delivered: true } : x)),
    );
    await Promise.all(
      pending.map((m) =>
        fetch(`/api/merch/recipients/${m.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ delivered: true }),
        }),
      ),
    );
  };

  const deletePerson = async (r: MerchRecipient) => {
    if (!confirm(`¿Quitar a "${r.name}" del merch? Su paquete se desarma.`)) return;
    await fetch(`/api/merch/recipients/${r.id}`, { method: "DELETE" });
    fetchData();
  };

  const deleteGroup = async (groupName: string, members: MerchRecipient[]) => {
    if (members.length === 0) return;
    if (
      !confirm(
        `¿Eliminar el grupo «${groupName}» del merch?\n\n` +
          `Se quitan sus ${members.length} ${members.length === 1 ? "persona" : "personas"} y se desarman sus paquetes. ` +
          `No afecta al inventario ni a la lista de invitados.`,
      )
    )
      return;
    const ids = new Set(members.map((m) => m.id));
    setRecipients((rs) => rs.filter((x) => !ids.has(x.id)));
    await Promise.all(
      members.map((m) => fetch(`/api/merch/recipients/${m.id}`, { method: "DELETE" })),
    );
    fetchData();
  };

  const deleteItem = async (item: MerchItem) => {
    if (
      !confirm(
        `¿Eliminar "${item.name}" del inventario?${item.assigned > 0 ? ` Se quitará de los paquetes que lo incluyen (${item.assigned} piezas asignadas).` : ""}`,
      )
    )
      return;
    await fetch(`/api/merch/items/${item.id}`, { method: "DELETE" });
    fetchData();
  };

  const matches = (r: MerchRecipient) =>
    (r.name.toLowerCase().includes(search.toLowerCase()) ||
      groupOf(r).toLowerCase().includes(search.toLowerCase())) &&
    (filter === "todos" || (filter === "entregados" ? r.delivered : !r.delivered));

  const filtered = recipients.filter(matches);

  // Agrupado para la vista por grupos (conserva orden de creación).
  const groups = useMemo(() => {
    const map = new Map<string, MerchRecipient[]>();
    for (const r of filtered) {
      const key = groupOf(r);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    }
    return [...map.entries()];
  }, [filtered]);

  const delivered = recipients.filter((r) => r.delivered).length;
  const totalPieces = recipients.reduce((s, r) => s + packageSize(r), 0);
  const totalGroups = new Set(recipients.map(groupOf)).size;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-2xl">🎁</span>
          <div>
            <h1 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">
              Merch · Paquetes
            </h1>
            <p className="text-xs text-gray-500">Qué le toca a cada quien</p>
          </div>
          <nav className="flex items-center gap-1 sm:ml-2">
            <Link
              href="/admin"
              className="text-sm px-3 py-1.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Invitados
            </Link>
            <Link
              href="/admin/nombres"
              className="text-sm px-3 py-1.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Nombres
            </Link>
            <Link
              href="/admin/mesas"
              className="text-sm px-3 py-1.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Mesas
            </Link>
            <Link
              href="/admin/mesas-plan"
              className="text-sm px-3 py-1.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Plan de mesas
            </Link>
            <span className="text-sm px-3 py-1.5 rounded-lg font-medium bg-gray-900 text-white">
              Merch
            </span>
          </nav>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => { setEditItem(null); setShowItemModal(true); }}
            className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            + Inventario
          </button>
          <button
            onClick={() => { setAddToGroup(null); setShowAddModal(true); }}
            className="text-sm px-4 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors font-medium"
          >
            + Agregar a merch
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          <StatCard label="Grupos" value={totalGroups} color="bg-white border-gray-200 text-gray-900" />
          <StatCard label="Personas" value={recipients.length} color="bg-blue-50 border-blue-200 text-blue-800" />
          <StatCard label="Entregados" value={delivered} sub={`de ${recipients.length} paquetes`} color="bg-emerald-50 border-emerald-200 text-emerald-800" />
          <StatCard label="Pendientes" value={recipients.length - delivered} color="bg-amber-50 border-amber-200 text-amber-800" />
          <StatCard label="Piezas asignadas" value={totalPieces} color="bg-purple-50 border-purple-200 text-purple-800" />
        </div>

        {/* Inventario */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
            Inventario
          </h2>
          {items.length === 0 && !loading ? (
            <div className="bg-white rounded-xl border border-dashed border-gray-300 py-8 text-center text-sm text-gray-400">
              Aún no hay artículos. Captura tu inventario con «+ Inventario» (ej: 100 vasos, 50 geles).
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {items.map((item) => {
                const pct =
                  item.stock != null && item.stock > 0
                    ? Math.min(100, Math.round((item.assigned / item.stock) * 100))
                    : null;
                const left = item.stock != null ? item.stock - item.assigned : null;
                const over = left !== null && left < 0;
                return (
                  <div key={item.id} className="group bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{item.emoji}</span>
                      <p className="text-sm font-semibold text-gray-900 flex-1 truncate">{item.name}</p>
                      <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => { setEditItem(item); setShowItemModal(true); }}
                          title="Editar"
                          className="p-1 rounded-md text-gray-400 hover:bg-gray-100 transition-colors text-sm"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => deleteItem(item)}
                          title="Eliminar"
                          className="p-1 rounded-md text-red-400 hover:bg-red-50 transition-colors text-sm"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    {item.stock != null ? (
                      <>
                        <div className="mt-3 h-2 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              over ? "bg-red-500" : pct !== null && pct >= 90 ? "bg-amber-400" : "bg-emerald-400"
                            }`}
                            style={{ width: `${pct ?? 0}%` }}
                          />
                        </div>
                        <p className={`text-xs mt-1.5 ${over ? "text-red-500 font-medium" : "text-gray-500"}`}>
                          {over
                            ? `⚠️ Te faltan ${-left!} piezas (${item.assigned} asignadas de ${item.stock})`
                            : `${item.assigned} asignadas · quedan ${left} de ${item.stock}`}
                        </p>
                      </>
                    ) : (
                      <p className="text-xs mt-3 text-gray-400">
                        {item.assigned} asignadas · sin límite de stock
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Controles de paquetes */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center mb-4">
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
            {([
              { value: "grupos", label: "👨‍👩‍👧 Por grupo" },
              { value: "individual", label: "👤 Individual" },
            ] as const).map((v) => (
              <button
                key={v.value}
                onClick={() => setView(v.value)}
                className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
                  view === v.value ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Buscar persona o grupo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm px-3 py-1.5 rounded-lg border border-gray-200 outline-none focus:border-gray-400 transition-colors bg-white"
          />
          <div className="flex items-center gap-1.5 flex-wrap">
            {([
              { value: "todos", label: "Todos", count: recipients.length },
              { value: "pendientes", label: "📦 Pendientes", count: recipients.length - delivered },
              { value: "entregados", label: "✅ Entregados", count: delivered },
            ] as const).map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`text-xs px-2.5 py-1 rounded-full border font-medium transition-colors ${
                  filter === f.value
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {f.label} <span className="opacity-60">{f.count}</span>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-400 text-sm bg-white rounded-xl border border-gray-200">
            Cargando...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-gray-400 text-sm bg-white rounded-xl border border-gray-200">
            {recipients.length === 0
              ? "Aún no hay nadie en el merch. Agrega una familia con «+ Agregar a merch»."
              : "Sin resultados para esa búsqueda."}
          </div>
        ) : view === "grupos" ? (
          /* ── Vista por grupos ── */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {groups.map(([groupName, members]) => {
              const allDelivered = members.every((m) => m.delivered);
              const groupPieces = members.reduce((s, m) => s + packageSize(m), 0);
              const guestId = members.find((m) => m.guest_id !== null)?.guest_id ?? null;
              return (
                <div
                  key={groupName}
                  className={`bg-white rounded-xl border overflow-hidden ${
                    allDelivered ? "border-emerald-200" : "border-gray-200"
                  }`}
                >
                  <div
                    className={`px-4 py-3 flex items-center gap-2 border-b ${
                      allDelivered ? "bg-emerald-50/60 border-emerald-100" : "bg-gray-50/60 border-gray-100"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {guestId !== null ? "👨‍👩‍👧 " : ""}{groupName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {members.length} {members.length === 1 ? "persona" : "personas"} · {groupPieces}{" "}
                        {groupPieces === 1 ? "pieza" : "piezas"}
                      </p>
                    </div>
                    {allDelivered ? (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                        ✅ Entregado
                      </span>
                    ) : (
                      <button
                        onClick={() => deliverGroup(members)}
                        title="Marcar todo el grupo como entregado"
                        className="text-xs px-2 py-0.5 rounded-full font-medium bg-white text-gray-500 border border-gray-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-colors"
                      >
                        Entregar todo
                      </button>
                    )}
                    <button
                      onClick={() => deleteGroup(groupName, members)}
                      title="Eliminar el grupo completo del merch"
                      className="p-1 rounded-md text-red-300 hover:bg-red-50 hover:text-red-500 transition-colors text-sm shrink-0"
                    >
                      🗑️
                    </button>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {members.map((r) => (
                      <div key={r.id} className="px-4 py-2.5 flex items-center gap-2">
                        <button
                          onClick={() => toggleDelivered(r)}
                          title={r.delivered ? "Marcar pendiente" : "Marcar entregado"}
                          className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] transition-colors shrink-0 ${
                            r.delivered
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : "bg-white border-gray-300 text-transparent hover:border-emerald-400"
                          }`}
                        >
                          ✓
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm truncate ${r.delivered ? "text-gray-400 line-through" : "text-gray-900"}`}>
                            {r.name}
                          </p>
                          {r.notes && <p className="text-xs text-gray-400 truncate">{r.notes}</p>}
                        </div>
                        <PackageChips
                          recipient={r}
                          itemById={itemById}
                          onOpen={() => setPackageRecipient(r)}
                        />
                        <div className="flex items-center gap-0.5 shrink-0">
                          <button
                            onClick={() => setEditPerson(r)}
                            title="Editar / cambiar de grupo"
                            className="p-1 rounded-md text-gray-400 hover:bg-gray-100 transition-colors text-sm"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => deletePerson(r)}
                            title="Quitar"
                            className="p-1 rounded-md text-red-300 hover:bg-red-50 hover:text-red-400 transition-colors text-sm"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => { setAddToGroup({ group: groupName, guestId }); setShowAddModal(true); }}
                    className="w-full px-4 py-2 text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors text-left border-t border-gray-50"
                  >
                    + Agregar persona al grupo
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          /* ── Vista individual ── */
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[680px]">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-gray-400 border-b border-gray-100">
                    <th className="px-4 py-3 font-medium">Persona</th>
                    <th className="px-4 py-3 font-medium">Grupo</th>
                    <th className="px-4 py-3 font-medium">Paquete</th>
                    <th className="px-4 py-3 font-medium text-center">Piezas</th>
                    <th className="px-4 py-3 font-medium">Entrega</th>
                    <th className="px-4 py-3 font-medium hidden md:table-cell">Notas</th>
                    <th className="px-4 py-3 font-medium text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-900">{r.name}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                          {groupOf(r)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <PackageChips
                          recipient={r}
                          itemById={itemById}
                          onOpen={() => setPackageRecipient(r)}
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-700 font-semibold text-xs">
                          {packageSize(r)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleDelivered(r)}
                          title={r.delivered ? "Marcar como pendiente" : "Marcar como entregado"}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border transition-colors hover:brightness-95 ${
                            r.delivered
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-600 border-amber-200"
                          }`}
                        >
                          {r.delivered ? "✅ Entregado" : "📦 Pendiente"}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell max-w-[180px] truncate">
                        {r.notes || <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setPackageRecipient(r)}
                            title="Armar paquete"
                            className="p-1.5 rounded-lg text-purple-500 hover:bg-purple-50 transition-colors text-base"
                          >
                            🎁
                          </button>
                          <button
                            onClick={() => setEditPerson(r)}
                            title="Editar"
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors text-base"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => deletePerson(r)}
                            title="Quitar del merch"
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors text-base"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {showItemModal && (
        <ItemModal
          item={editItem}
          onClose={() => setShowItemModal(false)}
          onSaved={fetchData}
        />
      )}

      {showAddModal && (
        <AddPeopleModal
          guests={guests}
          attendees={attendees}
          recipients={recipients}
          presetGroup={addToGroup?.group}
          presetGuestId={addToGroup?.guestId}
          onClose={() => setShowAddModal(false)}
          onSaved={fetchData}
        />
      )}

      {editPerson && (
        <EditPersonModal
          recipient={editPerson}
          recipients={recipients}
          onClose={() => setEditPerson(null)}
          onSaved={fetchData}
        />
      )}

      {packageRecipient && (
        <PackageModal
          recipient={packageRecipient}
          items={items}
          onClose={() => setPackageRecipient(null)}
          onChanged={fetchData}
        />
      )}
    </div>
  );
}
