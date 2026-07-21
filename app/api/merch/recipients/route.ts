import { NextResponse } from "next/server";
import { createRecipients } from "@/lib/merch";
import { requireAdmin } from "@/lib/auth";

// Alta de una o varias personas (los miembros de una familia entran juntos).
export async function POST(req: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const body = await req.json().catch(() => ({}));
  const { guest_id, group_name, names, notes } = body as {
    guest_id?: number | null;
    group_name?: string | null;
    names?: string[];
    notes?: string;
  };
  const clean = (names ?? []).map((n) => n?.trim()).filter(Boolean) as string[];
  if (clean.length === 0) {
    return NextResponse.json({ error: "Falta al menos un nombre" }, { status: 400 });
  }
  await createRecipients({
    guest_id: guest_id ? Number(guest_id) : null,
    group_name,
    names: clean,
    notes,
  });
  return NextResponse.json({ ok: true }, { status: 201 });
}
