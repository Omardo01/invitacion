import { NextResponse } from "next/server";
import { assignAttendeeToMockTable } from "@/lib/mock-tables";
import { requireAdmin } from "@/lib/auth";

// Sienta (o levanta con mock_table_id = null) a una persona en el plan por persona.
export async function PUT(req: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const body = await req.json().catch(() => ({}));
  const { attendee_id, mock_table_id } = body as {
    attendee_id?: number;
    mock_table_id?: number | null;
  };
  if (!attendee_id || typeof attendee_id !== "number") {
    return NextResponse.json({ error: "Falta attendee_id" }, { status: 400 });
  }
  await assignAttendeeToMockTable(attendee_id, mock_table_id ?? null);
  return NextResponse.json({ ok: true });
}
