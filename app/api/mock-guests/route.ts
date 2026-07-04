import { NextResponse } from "next/server";
import { createMockGuest } from "@/lib/mock-tables";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const body = await req.json().catch(() => ({}));
  const { name, seats } = body as { name?: string; seats?: number };
  if (!name?.trim()) {
    return NextResponse.json({ error: "Falta el nombre" }, { status: 400 });
  }
  const guest = await createMockGuest({ name, seats: seats ? Number(seats) : undefined });
  return NextResponse.json(guest, { status: 201 });
}
