import { NextResponse } from "next/server";
import { getAllGuests, createGuest, getStats } from "@/lib/guests";

export async function GET() {
  const guests = getAllGuests();
  const stats = getStats();
  return NextResponse.json({ guests, stats });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, seats, phone } = body as {
    name: string;
    seats: number;
    phone?: string;
  };
  if (!name || !seats) {
    return NextResponse.json(
      { error: "name y seats son requeridos" },
      { status: 400 }
    );
  }
  const guest = createGuest({ name, seats: Number(seats), phone });
  return NextResponse.json(guest, { status: 201 });
}
