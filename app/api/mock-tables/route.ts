import { NextResponse } from "next/server";
import {
  getAllMockTables,
  getMockSeating,
  getAllMockGuests,
  getMockAttendeeSeating,
  createMockTable,
} from "@/lib/mock-tables";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;
  const [tables, seating, extras, attendeeSeating] = await Promise.all([
    getAllMockTables(),
    getMockSeating(),
    getAllMockGuests(),
    getMockAttendeeSeating(),
  ]);
  return NextResponse.json({ tables, seating, extras, attendeeSeating });
}

export async function POST(req: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const body = await req.json().catch(() => ({}));
  const { name, capacity } = body as { name?: string; capacity?: number };
  const table = await createMockTable({ name, capacity: capacity ? Number(capacity) : undefined });
  return NextResponse.json(table, { status: 201 });
}
