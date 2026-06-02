import db from "./db";

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

export function getAllGuests(): Guest[] {
  return db
    .prepare("SELECT * FROM guests ORDER BY created_at DESC")
    .all() as Guest[];
}

export function getGuestBySlug(slug: string): Guest | null {
  return db
    .prepare("SELECT * FROM guests WHERE slug = ?")
    .get(slug) as Guest | null;
}

export function createGuest(data: {
  name: string;
  seats: number;
  phone?: string;
}): Guest {
  const slug = generateSlug(data.name);
  return db
    .prepare(
      "INSERT INTO guests (slug, name, seats, phone) VALUES (?, ?, ?, ?) RETURNING *"
    )
    .get(slug, data.name, data.seats, data.phone ?? null) as Guest;
}

export function updateGuest(
  id: number,
  data: { name?: string; seats?: number; phone?: string }
): Guest {
  const fields: string[] = [];
  const values: unknown[] = [];
  if (data.name !== undefined) { fields.push("name = ?"); values.push(data.name); }
  if (data.seats !== undefined) { fields.push("seats = ?"); values.push(data.seats); }
  if (data.phone !== undefined) { fields.push("phone = ?"); values.push(data.phone || null); }
  values.push(id);
  return db
    .prepare(`UPDATE guests SET ${fields.join(", ")} WHERE id = ? RETURNING *`)
    .get(...values) as Guest;
}

export function deleteGuest(id: number): void {
  db.prepare("DELETE FROM guests WHERE id = ?").run(id);
}

export function confirmRSVP(
  slug: string,
  confirmed: boolean,
  notes?: string
): Guest | null {
  const now = new Date().toISOString();
  return db
    .prepare(
      "UPDATE guests SET confirmed = ?, confirmed_at = ?, notes = ? WHERE slug = ? RETURNING *"
    )
    .get(confirmed ? 1 : 0, now, notes ?? null, slug) as Guest | null;
}

export function getStats() {
  const total = (db.prepare("SELECT COUNT(*) as n FROM guests").get() as { n: number }).n;
  const confirmed = (db.prepare("SELECT COUNT(*) as n FROM guests WHERE confirmed = 1").get() as { n: number }).n;
  const declined = (db.prepare("SELECT COUNT(*) as n FROM guests WHERE confirmed = 0").get() as { n: number }).n;
  const pending = (db.prepare("SELECT COUNT(*) as n FROM guests WHERE confirmed IS NULL").get() as { n: number }).n;
  const totalSeats = (db.prepare("SELECT COALESCE(SUM(seats),0) as n FROM guests").get() as { n: number }).n;
  const confirmedSeats = (db.prepare("SELECT COALESCE(SUM(seats),0) as n FROM guests WHERE confirmed = 1").get() as { n: number }).n;
  return { total, confirmed, declined, pending, totalSeats, confirmedSeats };
}
