import { NextResponse } from "next/server";
import { confirmRSVP } from "@/lib/guests";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = await req.json();
  const { confirmed, notes } = body as { confirmed: boolean; notes?: string };

  const guest = confirmRSVP(slug, confirmed, notes);
  if (!guest) {
    return NextResponse.json(
      { error: "Invitado no encontrado" },
      { status: 404 }
    );
  }
  return NextResponse.json(guest);
}
