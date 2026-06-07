import { NextResponse } from "next/server";
import { getAllTables, createTable } from "@/lib/tables";

export async function GET() {
  return NextResponse.json({ tables: getAllTables() });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { name, capacity } = body as { name?: string; capacity?: number };
  const table = createTable({ name, capacity: capacity ? Number(capacity) : undefined });
  return NextResponse.json(table, { status: 201 });
}
