import { NextResponse } from "next/server";
import { importRealSeatingToPlan } from "@/lib/mock-tables";
import { requireAdmin } from "@/lib/auth";

// Copia el acomodo real de Mesas al sandbox por persona del plan.
// Reemplaza el acomodo por persona previo (no toca Mesas ni el modo por familia).
export async function POST() {
  const deny = await requireAdmin();
  if (deny) return deny;
  const summary = await importRealSeatingToPlan();
  return NextResponse.json({ ok: true, ...summary });
}
