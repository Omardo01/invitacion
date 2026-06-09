import { NextResponse } from "next/server";
import { getAllTables, createTable } from "@/lib/tables";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;
  return NextResponse.json({ tables: await getAllTables() });
}

export async function POST(req: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const body = await req.json().catch(() => ({}));
  const { name, capacity } = body as { name?: string; capacity?: number };
  const table = await createTable({ name, capacity: capacity ? Number(capacity) : undefined });
  return NextResponse.json(table, { status: 201 });
}
