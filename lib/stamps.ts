import { randomInt } from "node:crypto";
import { db } from "./db";

/**
 * Sistema de estampas coleccionables.
 *
 * Reglas:
 * - El catálogo vive en `stamps` (data-driven: agregar filas amplía la colección).
 * - Cada invitado puede abrir hasta `stamp_settings.daily_limit` sobres por día
 *   (día de México, no UTC).
 * - El sorteo ocurre SIEMPRE en el servidor; `plata_chance` se afinará después.
 * - El tope diario es a prueba de carreras: UNIQUE (guest_id, opened_on, daily_seq)
 *   hace que dos aperturas simultáneas choquen y una reintente.
 */

export type Stamp = {
  id: number;
  num: number;
  name: string;
  emoji: string;
  image_url: string | null;
  plata: boolean;
  /** tipo de carta con el que se renderiza (diseños definitivos de components/stamp-card.tsx) */
  style: "clasica" | "mundial" | "editorial";
};

export type StampSettings = {
  daily_limit: number;
  plata_chance: number;
};

export type CollectionEntry = {
  stamp_id: number;
  count: number;
  first_at: string;
};

export type OpenResult =
  | { ok: true; stamp: Stamp; isNew: boolean; openedToday: number; dailyLimit: number }
  | { ok: false; reason: "limit"; openedToday: number; dailyLimit: number }
  | { ok: false; reason: "empty-catalog" };

/* el "día" del invitado es el de México, no el del servidor */
const MX_TODAY = "(now() AT TIME ZONE 'America/Mexico_City')::date";

export async function getActiveStamps(): Promise<Stamp[]> {
  const sql = db();
  return (await sql`
    SELECT id, num, name, emoji, image_url, plata, style
    FROM stamps WHERE active ORDER BY num
  `) as Stamp[];
}

export async function getStampSettings(): Promise<StampSettings> {
  const sql = db();
  const rows = (await sql`
    SELECT daily_limit, plata_chance FROM stamp_settings WHERE id = 1
  `) as StampSettings[];
  // si el singleton no existe aún, valores por defecto seguros
  return rows[0] ?? { daily_limit: 3, plata_chance: 0.05 };
}

export async function getGuestCollection(guestId: number): Promise<CollectionEntry[]> {
  const sql = db();
  return (await sql`
    SELECT stamp_id, COUNT(*)::int AS count, MIN(created_at)::text AS first_at
    FROM guest_stamps WHERE guest_id = ${guestId}
    GROUP BY stamp_id ORDER BY stamp_id
  `) as CollectionEntry[];
}

export async function getOpenedToday(guestId: number): Promise<number> {
  const sql = db();
  const rows = (await sql.query(
    `SELECT COUNT(*)::int AS n FROM guest_stamps WHERE guest_id = $1 AND opened_on = ${MX_TODAY}`,
    [guestId],
  )) as { n: number }[];
  return rows[0]?.n ?? 0;
}

/* sorteo en servidor: plata con probabilidad `plata_chance`, resto uniforme */
function drawStamp(stamps: Stamp[], plataChance: number): Stamp | null {
  if (stamps.length === 0) return null;
  const platas = stamps.filter((s) => s.plata);
  const normales = stamps.filter((s) => !s.plata);
  const wantPlata = platas.length > 0 && randomInt(1_000_000) < plataChance * 1_000_000;
  const pool = wantPlata ? platas : normales.length > 0 ? normales : platas;
  return pool[randomInt(pool.length)];
}

export async function openPack(guestId: number): Promise<OpenResult> {
  const sql = db();
  const [settings, stamps] = await Promise.all([getStampSettings(), getActiveStamps()]);

  const stamp = drawStamp(stamps, settings.plata_chance);
  if (!stamp) return { ok: false, reason: "empty-catalog" };

  // Inserta solo si el invitado aún tiene sobres hoy; daily_seq = MAX+1 dentro
  // de la misma sentencia. Si dos requests calculan el mismo seq, el UNIQUE
  // tira 23505 y reintentamos una vez con el conteo ya actualizado.
  const insert = async () =>
    (await sql.query(
      `INSERT INTO guest_stamps (guest_id, stamp_id, opened_on, daily_seq)
       SELECT $1, $2, ${MX_TODAY}, COALESCE(MAX(daily_seq), 0) + 1
       FROM guest_stamps
       WHERE guest_id = $1 AND opened_on = ${MX_TODAY}
       HAVING COALESCE(MAX(daily_seq), 0) + 1 <= $3
       RETURNING daily_seq`,
      [guestId, stamp.id, settings.daily_limit],
    )) as { daily_seq: number }[];

  let rows: { daily_seq: number }[];
  try {
    rows = await insert();
  } catch (e) {
    if ((e as { code?: string }).code === "23505") {
      rows = await insert();
    } else {
      throw e;
    }
  }

  if (rows.length === 0) {
    return { ok: false, reason: "limit", openedToday: settings.daily_limit, dailyLimit: settings.daily_limit };
  }

  const countRows = (await sql`
    SELECT COUNT(*)::int AS c FROM guest_stamps
    WHERE guest_id = ${guestId} AND stamp_id = ${stamp.id}
  `) as { c: number }[];

  return {
    ok: true,
    stamp,
    isNew: (countRows[0]?.c ?? 1) === 1,
    openedToday: rows[0].daily_seq,
    dailyLimit: settings.daily_limit,
  };
}
