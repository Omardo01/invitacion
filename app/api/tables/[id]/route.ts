import { NextResponse } from "next/server";
import { updateTable, deleteTable } from "@/lib/tables";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const table = updateTable(Number(id), body);
  return NextResponse.json(table);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  deleteTable(Number(id));
  return NextResponse.json({ ok: true });
}
