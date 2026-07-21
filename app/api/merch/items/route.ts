import { NextResponse } from "next/server";
import { createMerchItem } from "@/lib/merch";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const body = await req.json().catch(() => ({}));
  const { name, emoji, stock } = body as { name?: string; emoji?: string; stock?: number | null };
  if (!name?.trim()) {
    return NextResponse.json({ error: "Falta el nombre" }, { status: 400 });
  }
  const item = await createMerchItem({
    name: name.trim(),
    emoji,
    stock: stock === null || stock === undefined ? null : Number(stock),
  });
  return NextResponse.json(item, { status: 201 });
}
