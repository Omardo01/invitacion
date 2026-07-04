import { NextResponse } from "next/server";
import { updateMockGuest, deleteMockGuest } from "@/lib/mock-tables";
import { requireAdmin } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const body = await req.json();
  const guest = await updateMockGuest(Number(id), body);
  return NextResponse.json(guest);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  await deleteMockGuest(Number(id));
  return NextResponse.json({ ok: true });
}
