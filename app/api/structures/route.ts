import { NextResponse } from "next/server";
import { getAllStructures, createStructure } from "@/lib/structures";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;
  return NextResponse.json({ structures: await getAllStructures() });
}

export async function POST(req: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;
  const body = await req.json().catch(() => ({}));
  const { label, pos_x, pos_y, w, h } = body as {
    label?: string;
    pos_x?: number;
    pos_y?: number;
    w?: number;
    h?: number;
  };
  if (!label?.trim()) {
    return NextResponse.json({ error: "Falta la etiqueta" }, { status: 400 });
  }
  const structure = await createStructure({ label: label.trim(), pos_x, pos_y, w, h });
  return NextResponse.json(structure, { status: 201 });
}
