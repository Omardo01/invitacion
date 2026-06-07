import db from "./db";

export type Attendee = {
  id: number;
  guest_id: number;
  name: string;
  table_id: number | null;
  created_at: string;
};

export function getAllAttendees(): Attendee[] {
  return db
    .prepare("SELECT * FROM attendees ORDER BY id ASC")
    .all() as Attendee[];
}

export function getAttendeesByGuest(guestId: number): Attendee[] {
  return db
    .prepare("SELECT * FROM attendees WHERE guest_id = ? ORDER BY id ASC")
    .all(guestId) as Attendee[];
}

export function createAttendee(data: { guest_id: number; name: string }): Attendee {
  return db
    .prepare("INSERT INTO attendees (guest_id, name) VALUES (?, ?) RETURNING *")
    .get(data.guest_id, data.name) as Attendee;
}

export function updateAttendee(
  id: number,
  data: { name?: string; table_id?: number | null }
): Attendee {
  const fields: string[] = [];
  const values: unknown[] = [];
  if (data.name !== undefined) { fields.push("name = ?"); values.push(data.name); }
  if (data.table_id !== undefined) { fields.push("table_id = ?"); values.push(data.table_id); }
  values.push(id);
  return db
    .prepare(`UPDATE attendees SET ${fields.join(", ")} WHERE id = ? RETURNING *`)
    .get(...values) as Attendee;
}

export function deleteAttendee(id: number): void {
  db.prepare("DELETE FROM attendees WHERE id = ?").run(id);
}
