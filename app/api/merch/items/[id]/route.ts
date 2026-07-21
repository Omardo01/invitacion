import { NextResponse } from "next/server";
import { updateMerchItem, deleteMerchItem } from "@/lib/merch";
import { requireAdmin } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const body = await req.json();
  const { name, emoji, stock } = body as { name?: string; emoji?: string; stock?: number | null };
  const item = await updateMerchItem(Number(id), {
    name,
    emoji,
    stock: stock === undefined ? undefined : stock === null ? null : Number(stock),
  });
  return NextResponse.json(item);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  await deleteMerchItem(Number(id));
  return NextResponse.json({ ok: true });
}
