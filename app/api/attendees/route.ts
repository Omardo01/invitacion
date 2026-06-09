import { NextResponse } from "next/server";
import { getAllAttendees, createAttendee } from "@/lib/attendees";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;
  return NextResponse.json({ attendees: await getAllAttendees() });
}

export async function POST(req: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const body = await req.json();
  const { guest_id, name } = body as { guest_id: number; name: string };
  if (!guest_id || !name?.trim()) {
    return NextResponse.json(
      { error: "guest_id y name son requeridos" },
      { status: 400 }
    );
  }
  const attendee = await createAttendee({ guest_id: Number(guest_id), name: name.trim() });
  return NextResponse.json(attendee, { status: 201 });
}
