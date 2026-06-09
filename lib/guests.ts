import { db } from "./db";

export type Guest = {
  id: number;
  slug: string;
  name: string;
  seats: number;
  phone: string | null;
  confirmed: 1 | 0 | null;
  confirmed_at: string | null;
  notes: string | null;
  created_at: string;
};

function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 25);
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}-${suffix}`;
}

export async function getAllGuests(): Promise<Guest[]> {
  const sql = db();
  return (await sql`SELECT * FROM guests ORDER BY created_at DESC`) as Guest[];
}

export async function getGuestBySlug(slug: string): Promise<Guest | null> {
  const sql = db();
  const rows = (await sql`SELECT * FROM guests WHERE slug = ${slug}`) as Guest[];
  return rows[0] ?? null;
}

export async function createGuest(data: {
  name: string;
  seats: number;
  phone?: string;
}): Promise<Guest> {
  const sql = db();
  const slug = generateSlug(data.name);
  const rows = (await sql`
    INSERT INTO guests (slug, name, seats, phone)
    VALUES (${slug}, ${data.name}, ${data.seats}, ${data.phone ?? null})
    RETURNING *
  `) as Guest[];
  return rows[0];
}

export async function updateGuest(
  id: number,
  data: { name?: string; seats?: number; phone?: string },
): Promise<Guest> {
  const sql = db();
  const fields: string[] = [];
  const values: unknown[] = [];
  let i = 1;
  if (data.name !== undefined) { fields.push(`name = $${i++}`); values.push(data.name); }
  if (data.seats !== undefined) { fields.push(`seats = $${i++}`); values.push(data.seats); }
  if (data.phone !== undefined) { fields.push(`phone = $${i++}`); values.push(data.phone || null); }
  values.push(id);
  const rows = (await sql.query(
    `UPDATE guests SET ${fields.join(", ")} WHERE id = $${i} RETURNING *`,
    values,
  )) as Guest[];
  return rows[0];
}

export async function deleteGuest(id: number): Promise<void> {
  const sql = db();
  await sql`DELETE FROM guests WHERE id = ${id}`;
}

export async function confirmRSVP(
  slug: string,
  confirmed: boolean,
  notes?: string,
): Promise<Guest | null> {
  const sql = db();
  const now = new Date().toISOString();
  const rows = (await sql`
    UPDATE guests
    SET confirmed = ${confirmed ? 1 : 0}, confirmed_at = ${now}, notes = ${notes ?? null}
    WHERE slug = ${slug}
    RETURNING *
  `) as Guest[];
  return rows[0] ?? null;
}

export async function getStats() {
  const sql = db();
  const rows = (await sql`
    SELECT
      COUNT(*)::int                                          AS total,
      COUNT(*) FILTER (WHERE confirmed = 1)::int             AS confirmed,
      COUNT(*) FILTER (WHERE confirmed = 0)::int             AS declined,
      COUNT(*) FILTER (WHERE confirmed IS NULL)::int         AS pending,
      COALESCE(SUM(seats), 0)::int                           AS "totalSeats",
      COALESCE(SUM(seats) FILTER (WHERE confirmed = 1), 0)::int AS "confirmedSeats"
    FROM guests
  `) as {
    total: number; confirmed: number; declined: number;
    pending: number; totalSeats: number; confirmedSeats: number;
  }[];
  return rows[0];
}
