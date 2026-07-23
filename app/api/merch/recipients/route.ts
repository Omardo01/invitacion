import { NextResponse } from "next/server";
import { createRecipients, createRecipientsBulk } from "@/lib/merch";
import { requireAdmin } from "@/lib/auth";

type PersonInput = { guest_id?: number | null; name?: string; group_name?: string | null };

// Alta de personas al merch. Dos formas:
//   1) `names[]` bajo un mismo `guest_id`/`group_name` (una familia entra junta).
//   2) `people[]` con su propia familia y grupo (nombres registrados de varias
//      familias que se juntan en un mismo grupo de merch).
export async function POST(req: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const body = await req.json().catch(() => ({}));
  const { guest_id, group_name, names, notes, people } = body as {
    guest_id?: number | null;
    group_name?: string | null;
    names?: string[];
    notes?: string;
    people?: PersonInput[];
  };

  if (Array.isArray(people) && people.length > 0) {
    const clean = people
      .filter((p) => p?.name?.trim())
      .map((p) => ({
        guest_id: p.guest_id != null ? Number(p.guest_id) : null,
        name: p.name!.trim(),
        group_name: p.group_name ?? null,
      }));
    if (clean.length === 0) {
      return NextResponse.json({ error: "Falta al menos un nombre" }, { status: 400 });
    }
    await createRecipientsBulk(clean, notes);
    return NextResponse.json({ ok: true }, { status: 201 });
  }

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
