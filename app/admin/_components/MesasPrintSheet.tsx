"use client";

import { PrintSheetHeader, PrintSheetFooter } from "./PrintOverlay";
import type { TableRow } from "@/lib/tables";
import type { Attendee } from "@/lib/attendees";
import type { Guest } from "@/lib/guests";

/* Lista de invitados por mesa para imprimir y usar en la ENTRADA: cada persona
   con una casilla grande para palomear al llegar (check-in). Fuente del acomodo:
   attendees.table_id (pestaña Mesas). */
export default function MesasPrintSheet({
  tables,
  attendees,
  guests,
}: {
  tables: TableRow[];
  attendees: Attendee[];
  guests: Guest[];
}) {
  const guestName = (id: number) => guests.find((g) => g.id === id)?.name ?? "";
  const seatedAt = (tableId: number) =>
    attendees.filter((a) => a.table_id === tableId).sort((a, b) => a.id - b.id);
  const unassigned = attendees.filter((a) => a.table_id === null).sort((a, b) => a.id - b.id);
  const totalSeated = attendees.filter((a) => a.table_id !== null).length;

  // Ordena por el número de mesa que aparece en el nombre (no por orden de
  // creación): al renumerar mesas, el id ya no coincide con el número visible.
  // Las mesas sin número van al final, ordenadas por nombre.
  const tableNumber = (name: string) => {
    const m = name.match(/\d+/);
    return m ? parseInt(m[0], 10) : Number.MAX_SAFE_INTEGER;
  };
  const sortedTables = [...tables].sort(
    (a, b) => tableNumber(a.name) - tableNumber(b.name) || a.name.localeCompare(b.name),
  );

  const rows = (list: Attendee[]) => (
    <ul>
      {list.map((a, i) => {
        const fam = guestName(a.guest_id);
        const showFam = fam && fam !== a.name;
        return (
          <li
            key={a.id}
            className="flex items-center gap-3 py-1.5 border-b border-gray-200 last:border-b-0"
          >
            {/* Casilla de entrada */}
            <span className="w-6 h-6 rounded border-2 border-gray-700 shrink-0" aria-hidden />
            <span className="w-6 text-right text-sm text-gray-400 shrink-0">{i + 1}</span>
            <span className="text-[17px] leading-snug text-gray-900 flex-1">
              {a.name}
              {showFam && <span className="text-xs text-gray-400 ml-2">· {fam}</span>}
            </span>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div style={{ fontFamily: "var(--font-sans), system-ui, sans-serif" }}>
      <PrintSheetHeader title="Lista de entrada · por mesa" subtitle="Palomea a cada invitado al llegar" />

      <p className="text-center text-sm text-gray-500 mb-6">
        <strong className="text-gray-800">{tables.length}</strong> mesas ·{" "}
        <strong className="text-gray-800">{totalSeated}</strong> invitados
        {unassigned.length > 0 && (
          <>
            {" "}· <strong className="text-gray-800">{unassigned.length}</strong> sin asignar
          </>
        )}
      </p>

      {tables.length === 0 ? (
        <p className="text-center text-sm text-gray-400 py-10">Aún no hay mesas.</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
          {sortedTables.map((t) => {
            const seated = seatedAt(t.id);
            return (
              <section key={t.id} className="print-break border border-gray-300 rounded-md overflow-hidden">
                <div className="flex items-baseline justify-between px-3 py-2 bg-gray-700 text-white">
                  <h2 className="text-lg font-semibold" style={{ fontFamily: "var(--font-deco), serif" }}>
                    {t.name}
                  </h2>
                  <span className="text-xs opacity-80 shrink-0 ml-2">
                    {seated.length}/{t.capacity}
                  </span>
                </div>
                <div className="px-3 py-1.5">
                  {seated.length === 0 ? (
                    <p className="text-sm text-gray-400 italic py-1">Sin invitados asignados.</p>
                  ) : (
                    rows(seated)
                  )}
                </div>
              </section>
            );
          })}

          {unassigned.length > 0 && (
            <section className="print-break border border-gray-300 rounded-md overflow-hidden">
              <div className="flex items-baseline justify-between px-3 py-2 bg-gray-400 text-white">
                <h2 className="text-lg font-semibold" style={{ fontFamily: "var(--font-deco), serif" }}>
                  Sin asignar
                </h2>
                <span className="text-xs opacity-80 shrink-0 ml-2">{unassigned.length}</span>
              </div>
              <div className="px-3 py-1.5">{rows(unassigned)}</div>
            </section>
          )}
        </div>
      )}

      <PrintSheetFooter />
    </div>
  );
}
