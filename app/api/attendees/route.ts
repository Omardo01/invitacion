import { NextResponse } from "next/server";
import { getAllAttendees, createAttendee } from "@/lib/attendees";

export async function GET() {
  return NextResponse.json({ attendees: getAllAttendees() });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { guest_id, name } = body as { guest_id: number; name: string };
  if (!guest_id || !name?.trim()) {
    return NextResponse.json(
      { error: "guest_id y name son requeridos" },
      { status: 400 }
    );
  }
  const attendee = createAttendee({ guest_id: Number(guest_id), name: name.trim() });
  return NextResponse.json(attendee, { status: 201 });
}
