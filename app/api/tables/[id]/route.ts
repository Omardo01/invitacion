import { NextResponse } from "next/server";
import { updateTable, deleteTable } from "@/lib/tables";
import { requireAdmin } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const body = await req.json();
  const table = await updateTable(Number(id), body);
  return NextResponse.json(table);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  await deleteTable(Number(id));
  return NextResponse.json({ ok: true });
}
