import { NextResponse } from "next/server";
import { updateStructure, deleteStructure } from "@/lib/structures";
import { requireAdmin } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const body = await req.json();
  const structure = await updateStructure(Number(id), body);
  return NextResponse.json(structure);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  await deleteStructure(Number(id));
  return NextResponse.json({ ok: true });
}
