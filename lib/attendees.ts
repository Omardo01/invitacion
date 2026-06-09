import { db } from "./db";

export type Attendee = {
  id: number;
  guest_id: number;
  name: string;
  table_id: number | null;
  created_at: string;
};

export async function getAllAttendees(): Promise<Attendee[]> {
  const sql = db();
  return (await sql`SELECT * FROM attendees ORDER BY id ASC`) as Attendee[];
}

export async function getAttendeesByGuest(guestId: number): Promise<Attendee[]> {
  const sql = db();
  return (await sql`SELECT * FROM attendees WHERE guest_id = ${guestId} ORDER BY id ASC`) as Attendee[];
}

export async function createAttendee(data: { guest_id: number; name: string }): Promise<Attendee> {
  const sql = db();
  const rows = (await sql`
    INSERT INTO attendees (guest_id, name) VALUES (${data.guest_id}, ${data.name}) RETURNING *
  `) as Attendee[];
  return rows[0];
}

export async function updateAttendee(
  id: number,
  data: { name?: string; table_id?: number | null },
): Promise<Attendee> {
  const sql = db();
  const fields: string[] = [];
  const values: unknown[] = [];
  let i = 1;
  if (data.name !== undefined) { fields.push(`name = $${i++}`); values.push(data.name); }
  if (data.table_id !== undefined) { fields.push(`table_id = $${i++}`); values.push(data.table_id); }
  values.push(id);
  const rows = (await sql.query(
    `UPDATE attendees SET ${fields.join(", ")} WHERE id = $${i} RETURNING *`,
    values,
  )) as Attendee[];
  return rows[0];
}

export async function deleteAttendee(id: number): Promise<void> {
  const sql = db();
  await sql`DELETE FROM attendees WHERE id = ${id}`;
}
