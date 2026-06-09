import { NextResponse } from "next/server";
import { updateAttendee, deleteAttendee } from "@/lib/attendees";
import { requireAdmin } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  const body = await req.json();
  const attendee = await updateAttendee(Number(id), body);
  return NextResponse.json(attendee);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  await deleteAttendee(Number(id));
  return NextResponse.json({ ok: true });
}
