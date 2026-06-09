import { NextResponse } from "next/server";
import { getAllGuests, createGuest, getStats } from "@/lib/guests";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;
  const guests = await getAllGuests();
  const stats = await getStats();
  return NextResponse.json({ guests, stats });
}

export async function POST(req: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;
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
  const guest = await createGuest({ name, seats: Number(seats), phone });
  return NextResponse.json(guest, { status: 201 });
}
