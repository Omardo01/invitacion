import { NextResponse } from "next/server";
import { updateGuest, deleteGuest } from "@/lib/guests";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const guest = updateGuest(Number(id), body);
  return NextResponse.json(guest);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  deleteGuest(Number(id));
  return NextResponse.json({ ok: true });
}
