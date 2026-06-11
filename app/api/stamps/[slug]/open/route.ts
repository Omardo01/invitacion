import { NextResponse } from "next/server";
import { getGuestBySlug } from "@/lib/guests";
import { openPack } from "@/lib/stamps";

/**
 * Abre un sobre: el servidor sortea la estampa, la registra y la devuelve.
 * El cliente solo anima el resultado — nunca decide qué salió.
 */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const guest = await getGuestBySlug(slug);
  if (!guest) {
    return NextResponse.json({ error: "Invitado no encontrado" }, { status: 404 });
  }

  const result = await openPack(guest.id);

  if (!result.ok) {
    if (result.reason === "limit") {
      return NextResponse.json(
        {
          error: "Ya abriste tus sobres de hoy. ¡Vuelve mañana!",
          openedToday: result.openedToday,
          dailyLimit: result.dailyLimit,
          remainingToday: 0,
        },
        { status: 429 },
      );
    }
    return NextResponse.json({ error: "No hay estampas configuradas" }, { status: 503 });
  }

  return NextResponse.json({
    stamp: result.stamp,
    isNew: result.isNew,
    openedToday: result.openedToday,
    dailyLimit: result.dailyLimit,
    remainingToday: Math.max(0, result.dailyLimit - result.openedToday),
  });
}
