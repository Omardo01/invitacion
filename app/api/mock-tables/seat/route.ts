import { NextResponse } from "next/server";
import { assignAttendeeToSeat, clearAttendeeSeat } from "@/lib/mock-tables";
import { requireAdmin } from "@/lib/auth";

// Vista de asientos: fija la silla exacta de una persona, o la libera.
//   { attendee_id, mock_table_id, seat_index }  → sienta en esa silla
//   { attendee_id, seat_index: null }           → la levanta (queda en la mesa)
export async function PUT(req: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const body = await req.json().catch(() => ({}));
  const { attendee_id, mock_table_id, seat_index } = body as {
    attendee_id?: number;
    mock_table_id?: number | null;
    seat_index?: number | null;
  };
  if (!attendee_id || typeof attendee_id !== "number") {
    return NextResponse.json({ error: "Falta attendee_id" }, { status: 400 });
  }
  if (seat_index === null || seat_index === undefined) {
    await clearAttendeeSeat(attendee_id);
    return NextResponse.json({ ok: true });
  }
  if (!mock_table_id || typeof mock_table_id !== "number" || typeof seat_index !== "number") {
    return NextResponse.json(
      { error: "mock_table_id y seat_index son requeridos para sentar" },
      { status: 400 },
    );
  }
  await assignAttendeeToSeat(attendee_id, mock_table_id, seat_index);
  return NextResponse.json({ ok: true });
}
