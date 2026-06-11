import { NextResponse } from "next/server";
import { getGuestBySlug } from "@/lib/guests";
import { getActiveStamps, getGuestCollection, getOpenedToday, getStampSettings } from "@/lib/stamps";

/** Estado de la colección del invitado: catálogo, álbum y sobres restantes hoy. */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const guest = await getGuestBySlug(slug);
  if (!guest) {
    return NextResponse.json({ error: "Invitado no encontrado" }, { status: 404 });
  }

  const [stamps, collection, openedToday, settings] = await Promise.all([
    getActiveStamps(),
    getGuestCollection(guest.id),
    getOpenedToday(guest.id),
    getStampSettings(),
  ]);

  return NextResponse.json({
    guest: { name: guest.name, slug: guest.slug },
    stamps,
    collection,
    openedToday,
    dailyLimit: settings.daily_limit,
    remainingToday: Math.max(0, settings.daily_limit - openedToday),
  });
}
