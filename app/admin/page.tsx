"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import type { Guest, GuestSide, InviteStatus } from "@/lib/guests";
import type { Attendee } from "@/lib/attendees";

const SIDE_OPTIONS: { value: GuestSide; label: string }[] = [
  { value: "novio", label: "Novio" },
  { value: "novia", label: "Novia" },
  { value: "ambos", label: "Ambos" },
];

const INVITE_META: Record<InviteStatus, { label: string; style: string }> = {
  pendiente: { label: "⏳ Pendiente", style: "bg-amber-50 text-amber-600 border-amber-200" },
  enviado: { label: "📨 Enviado", style: "bg-blue-50 text-blue-700 border-blue-200" },
  confirmado: { label: "✓ Confirmado", style: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

function InviteStatusBadge({
  status,
  onSet,
}: {
  status: InviteStatus;
  onSet: (next: InviteStatus) => void;
}) {
  const meta = INVITE_META[status];
  // "confirmado" es automático (lo fija el RSVP): se muestra pero no se cambia a mano.
  if (status === "confirmado") {
    return (
      <span
        title="Se confirma automáticamente cuando el invitado responde su RSVP"
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${meta.style}`}
      >
        {meta.label}
      </span>
    );
  }
  // pendiente ⇄ enviado: clic para marcar/desmarcar el envío.
  const next: InviteStatus = status === "pendiente" ? "enviado" : "pendiente";
  return (
    <button
      onClick={() => onSet(next)}
      title={status === "pendiente" ? "Marcar como enviada" : "Marcar como pendiente"}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border transition-colors hover:brightness-95 ${meta.style}`}
    >
      {meta.label}
    </button>
  );
}

function sideBadge(side: GuestSide) {
  const styles: Record<GuestSide, string> = {
    novio: "bg-blue-50 text-blue-700 border-blue-200",
    novia: "bg-pink-50 text-pink-700 border-pink-200",
    ambos: "bg-violet-50 text-violet-700 border-violet-200",
  };
  const labels: Record<GuestSide, string> = {
    novio: "🤵 Novio",
    novia: "👰 Novia",
    ambos: "💞 Ambos",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${styles[side]}`}
    >
      {labels[side]}
    </span>
  );
}

type Stats = {
  total: number;
  confirmed: number;
  declined: number;
  pending: number;
  totalSeats: number;
  confirmedSeats: number;
};

const BASE_URL =
  typeof window !== "undefined" ? window.location.origin : "https://tudominio.com";

function statusBadge(confirmed: 1 | 0 | null) {
  if (confirmed === 1)
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
        ✓ Confirmado
      </span>
    );
  if (confirmed === 0)
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-200">
        ✗ No asiste
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-200">
      ⏳ Pendiente
    </span>
  );
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

function NamesModal({
  guest,
  initial,
  onClose,
  onChanged,
}: {
  guest: Guest;
  initial: Attendee[];
  onClose: () => void;
  onChanged: () => void;
}) {
  const [rows, setRows] = useState<Attendee[]>(initial);
  const [newName, setNewName] = useState("");
  const [busy, setBusy] = useState(false);
  const full = rows.length >= guest.seats;

  const add = async () => {
    if (!newName.trim() || full || busy) return;
    setBusy(true);
    const res = await fetch("/api/attendees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guest_id: guest.id, name: newName.trim() }),
    });
    const a = await res.json();
    setRows((r) => [...r, a]);
    setNewName("");
    setBusy(false);
  };

  const rename = async (id: number, name: string) => {
    await fetch(`/api/attendees/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
  };

  const remove = async (id: number) => {
    setRows((r) => r.filter((x) => x.id !== id));
    await fetch(`/api/attendees/${id}`, { method: "DELETE" });
  };

  const close = () => { onChanged(); onClose(); };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold text-gray-900">Nombres de asistentes</h2>
        <p className="text-sm text-gray-500 mb-1">{guest.name}</p>
        <p className="text-xs text-gray-400 mb-5">
          {rows.length} de {guest.seats} {guest.seats === 1 ? "lugar" : "lugares"} registrados
        </p>

        <div className="space-y-2 mb-4">
          {rows.map((a) => (
            <div key={a.id} className="flex items-center gap-2">
              <input
                defaultValue={a.name}
                onBlur={(e) => { if (e.target.value.trim() && e.target.value.trim() !== a.name) rename(a.id, e.target.value.trim()); }}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-400 transition-colors"
              />
              <button
                onClick={() => remove(a.id)}
                title="Quitar"
                className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition-colors text-sm"
              >
                🗑️
              </button>
            </div>
          ))}
          {rows.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-2">Aún no hay nombres. Agrégalos abajo.</p>
          )}
        </div>

        {!full && (
          <div className="flex items-center gap-2 mb-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
              placeholder={`Nombre del asistente ${rows.length + 1}`}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-400 transition-colors"
            />
            <button
              onClick={add}
              disabled={busy || !newName.trim()}
              className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              + Agregar
            </button>
          </div>
        )}
        {full && (
          <p className="text-xs text-purple-600 mb-2">Ya registraste los {guest.seats} lugares asignados.</p>
        )}

        <button
          onClick={close}
          className="w-full mt-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Listo
        </button>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editGuest, setEditGuest] = useState<Guest | null>(null);
  const [namesGuest, setNamesGuest] = useState<Guest | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [form, setForm] = useState<{
    name: string;
    seats: string;
    phone: string;
    side: GuestSide;
  }>({ name: "", seats: "1", phone: "", side: "ambos" });
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [gRes, aRes] = await Promise.all([fetch("/api/guests"), fetch("/api/attendees")]);
    const gData = await gRes.json();
    const aData = await aRes.json();
    setGuests(gData.guests);
    setStats(gData.stats);
    setAttendees(aData.attendees ?? []);
    setLoading(false);
  }, []);

  const attendeesOf = useCallback(
    (guestId: number) => attendees.filter((a) => a.guest_id === guestId),
    [attendees]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openAdd = () => {
    setEditGuest(null);
    setForm({ name: "", seats: "1", phone: "", side: "ambos" });
    setShowModal(true);
  };

  const openEdit = (g: Guest) => {
    setEditGuest(g);
    setForm({
      name: g.name,
      seats: String(g.seats),
      phone: g.phone ?? "",
      side: g.side ?? "ambos",
    });
    setShowModal(true);
  };

  const saveGuest = async () => {
    if (!form.name.trim() || !form.seats) return;
    setSaving(true);
    if (editGuest) {
      await fetch(`/api/guests/${editGuest.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          seats: Number(form.seats),
          phone: form.phone,
          side: form.side,
        }),
      });
    } else {
      await fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          seats: Number(form.seats),
          phone: form.phone,
          side: form.side,
        }),
      });
    }
    setSaving(false);
    setShowModal(false);
    fetchData();
  };

  const deleteGuest = async (id: number, name: string) => {
    if (!confirm(`¿Eliminar a "${name}"?`)) return;
    await fetch(`/api/guests/${id}`, { method: "DELETE" });
    fetchData();
  };

  const setInviteStatus = async (g: Guest, invite_status: InviteStatus) => {
    setGuests((gs) => gs.map((x) => (x.id === g.id ? { ...x, invite_status } : x)));
    await fetch(`/api/guests/${g.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invite_status }),
    });
  };

  const copyLink = (slug: string) => {
    const url = `${BASE_URL}/i/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const copyWhatsApp = (guest: Guest) => {
    const url = `${BASE_URL}/i/${guest.slug}`;
    const text = `Hola ${guest.name} 💍 Te invitamos a celebrar nuestra boda. Aquí está tu invitación personal (${guest.seats} ${guest.seats === 1 ? "lugar" : "lugares"}): ${url}`;
    const phone = guest.phone?.replace(/\D/g, "") ?? "";
    const wa = phone
      ? `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(wa, "_blank");
  };

  const exportCSV = () => {
    const header = "Nombre,Lugares,Etiqueta,Invitación,Teléfono,Estado,Confirmado el,Notas";
    const sideLabel: Record<GuestSide, string> = { novio: "Novio", novia: "Novia", ambos: "Ambos" };
    const inviteLabel: Record<InviteStatus, string> = { pendiente: "Pendiente", enviado: "Enviado", confirmado: "Confirmado" };
    const rows = guests.map((g) =>
      [
        `"${g.name}"`,
        g.seats,
        sideLabel[g.side ?? "ambos"],
        inviteLabel[g.invite_status ?? "pendiente"],
        g.phone ?? "",
        g.confirmed === 1 ? "Confirmado" : g.confirmed === 0 ? "No asiste" : "Pendiente",
        g.confirmed_at ?? "",
        `"${g.notes ?? ""}"`,
      ].join(",")
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "invitados.csv";
    a.click();
  };

  const filtered = guests.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-2xl">💍</span>
          <div>
            <h1 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">
              Gabriel &amp; Zayra · Dashboard
            </h1>
            <p className="text-xs text-gray-500">25 de julio 2026</p>
          </div>
          <nav className="flex items-center gap-1 sm:ml-2">
            <span className="text-sm px-3 py-1.5 rounded-lg font-medium bg-gray-900 text-white">
              Invitados
            </span>
            <Link href="/admin/mesas" className="text-sm px-3 py-1.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              Mesas
            </Link>
          </nav>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={exportCSV}
            className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            ↓ Exportar CSV
          </button>
          <button
            onClick={openAdd}
            className="text-sm px-4 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors font-medium"
          >
            + Agregar invitado
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            <StatCard label="Total invitados" value={stats.total} color="bg-white border-gray-200 text-gray-900" />
            <StatCard label="Confirmados" value={stats.confirmed} color="bg-emerald-50 border-emerald-200 text-emerald-800" />
            <StatCard label="No asisten" value={stats.declined} color="bg-red-50 border-red-200 text-red-800" />
            <StatCard label="Pendientes" value={stats.pending} color="bg-amber-50 border-amber-200 text-amber-800" />
            <StatCard label="Lugares totales" value={stats.totalSeats} sub="asignados" color="bg-blue-50 border-blue-200 text-blue-800" />
            <StatCard label="Lugares confirm." value={stats.confirmedSeats} sub="confirmados" color="bg-purple-50 border-purple-200 text-purple-800" />
          </div>
        )}

        {/* Search & Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
            <input
              type="text"
              placeholder="Buscar invitado..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-sm px-3 py-1.5 rounded-lg border border-gray-200 outline-none focus:border-gray-400 transition-colors"
            />
            <span className="text-xs text-gray-400">{filtered.length} invitados</span>
          </div>

          {loading ? (
            <div className="py-20 text-center text-gray-400 text-sm">Cargando...</div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-gray-400 text-sm">
              {guests.length === 0
                ? "Aún no hay invitados. ¡Agrega el primero!"
                : "Sin resultados para esa búsqueda."}
            </div>
          ) : (
            <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-gray-400 border-b border-gray-100">
                  <th className="px-4 py-3 font-medium">Nombre</th>
                  <th className="px-4 py-3 font-medium text-center">Lugares</th>
                  <th className="px-4 py-3 font-medium">Etiqueta</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Teléfono</th>
                  <th className="px-4 py-3 font-medium">Invitación</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3 font-medium hidden lg:table-cell">Confirmó el</th>
                  <th className="px-4 py-3 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((g) => (
                  <tr key={g.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{g.name}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-700 font-semibold text-xs">
                        {g.seats}
                      </span>
                    </td>
                    <td className="px-4 py-3">{sideBadge(g.side ?? "ambos")}</td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                      {g.phone || <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <InviteStatusBadge
                        status={g.invite_status ?? "pendiente"}
                        onSet={(next) => setInviteStatus(g, next)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {statusBadge(g.confirmed)}
                        {g.confirmed === 1 && (
                          <button
                            onClick={() => setNamesGuest(g)}
                            title="Registrar nombres de los asistentes"
                            className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
                              attendeesOf(g.id).length >= g.seats
                                ? "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            👤 {attendeesOf(g.id).length}/{g.seats}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs hidden lg:table-cell">
                      {g.confirmed_at
                        ? new Date(g.confirmed_at).toLocaleDateString("es-MX", {
                            day: "2-digit",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => copyWhatsApp(g)}
                          title="Enviar por WhatsApp"
                          className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors text-base"
                        >
                          📲
                        </button>
                        <button
                          onClick={() => copyLink(g.slug)}
                          title="Copiar link"
                          className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors text-base"
                        >
                          {copiedSlug === g.slug ? "✓" : "🔗"}
                        </button>
                        <button
                          onClick={() => openEdit(g)}
                          title="Editar"
                          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors text-base"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => deleteGuest(g.id, g.name)}
                          title="Eliminar"
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
          )}
        </div>
      </main>

      {/* Modal agregar/editar */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">
              {editGuest ? "Editar invitado" : "Agregar invitado"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Familia García"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Lugares asignados *
                </label>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <button
                      key={n}
                      onClick={() => setForm({ ...form, seats: String(n) })}
                      className={`w-9 h-9 rounded-full text-sm font-semibold transition-colors ${
                        form.seats === String(n)
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Etiqueta
                </label>
                <div className="flex items-center gap-2">
                  {SIDE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setForm({ ...form, side: opt.value })}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                        form.side === opt.value
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  WhatsApp (con código de país)
                </label>
                <input
                  type="text"
                  placeholder="Ej: 5215512345678"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-gray-400 transition-colors"
                />
                <p className="text-xs text-gray-400 mt-1">
                  México: 521 + 10 dígitos. Se usa para abrir WhatsApp directo.
                </p>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={saveGuest}
                disabled={saving || !form.name.trim()}
                className="flex-1 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                {saving ? "Guardando..." : editGuest ? "Guardar cambios" : "Agregar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de nombres de asistentes */}
      {namesGuest && (
        <NamesModal
          guest={namesGuest}
          initial={attendeesOf(namesGuest.id)}
          onClose={() => setNamesGuest(null)}
          onChanged={fetchData}
        />
      )}
    </div>
  );
}
