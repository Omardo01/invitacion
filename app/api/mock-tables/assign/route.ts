import { NextResponse } from "next/server";
import { assignGuestToMockTable } from "@/lib/mock-tables";
import { requireAdmin } from "@/lib/auth";

export async function PUT(req: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const body = await req.json().catch(() => ({}));
  const { guest_id, mock_table_id } = body as { guest_id?: number; mock_table_id?: number | null };
  if (!guest_id || typeof guest_id !== "number") {
    return NextResponse.json({ error: "Falta guest_id" }, { status: 400 });
  }
  await assignGuestToMockTable(guest_id, mock_table_id ?? null);
  return NextResponse.json({ ok: true });
}
