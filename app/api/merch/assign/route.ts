import { NextResponse } from "next/server";
import { setRecipientItem } from "@/lib/merch";
import { requireAdmin } from "@/lib/auth";

// Fija la cantidad de un artículo dentro de un paquete (qty 0 lo quita).
export async function POST(req: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const body = await req.json().catch(() => ({}));
  const { recipient_id, item_id, qty } = body as {
    recipient_id?: number;
    item_id?: number;
    qty?: number;
  };
  if (!recipient_id || !item_id || qty === undefined) {
    return NextResponse.json({ error: "Faltan recipient_id, item_id o qty" }, { status: 400 });
  }
  await setRecipientItem(Number(recipient_id), Number(item_id), Number(qty));
  return NextResponse.json({ ok: true });
}
