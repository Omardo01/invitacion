import { db } from "./db";

/* Plan de mesas ficticio: sandbox de planeación a nivel invitado (familia con
   sus `seats`), independiente del acomodo real por persona (tables/attendees). */

export type MockTable = {
  id: number;
  name: string;
  capacity: number;
  /* posición en el plano del salón (% del lienzo); null = sin acomodar */
  pos_x: number | null;
  pos_y: number | null;
  created_at: string;
};

export type MockSeat = {
  guest_id: number;
  mock_table_id: number;
};

/* Invitado de logística: existe solo en el plan (staff, proveedores, cortesías),
   sin invitación ni RSVP; sirve para contar lugares en las mesas. */
export type MockGuest = {
  id: number;
  name: string;
  seats: number;
  mock_table_id: number | null;
  created_at: string;
};

export async function getAllMockTables(): Promise<MockTable[]> {
  const sql = db();
  return (await sql`SELECT * FROM mock_tables ORDER BY id ASC`) as MockTable[];
}

export async function getMockSeating(): Promise<MockSeat[]> {
  const sql = db();
  return (await sql`SELECT guest_id, mock_table_id FROM mock_seating`) as MockSeat[];
}

export async function createMockTable(data: { name?: string; capacity?: number }): Promise<MockTable> {
  const sql = db();
  const countRows = (await sql`SELECT COUNT(*)::int AS n FROM mock_tables`) as { n: number }[];
  const name = data.name?.trim() || `Mesa ${countRows[0].n + 1}`;
  const capacity = data.capacity && data.capacity > 0 ? data.capacity : 12;
  const rows = (await sql`
    INSERT INTO mock_tables (name, capacity) VALUES (${name}, ${capacity}) RETURNING *
  `) as MockTable[];
  return rows[0];
}

export async function updateMockTable(
  id: number,
  data: { name?: string; capacity?: number; pos_x?: number | null; pos_y?: number | null },
): Promise<MockTable> {
  const sql = db();
  const fields: string[] = [];
  const values: unknown[] = [];
  let i = 1;
  if (data.name !== undefined) { fields.push(`name = $${i++}`); values.push(data.name); }
  if (data.capacity !== undefined) { fields.push(`capacity = $${i++}`); values.push(data.capacity); }
  if (data.pos_x !== undefined) { fields.push(`pos_x = $${i++}`); values.push(data.pos_x); }
  if (data.pos_y !== undefined) { fields.push(`pos_y = $${i++}`); values.push(data.pos_y); }
  values.push(id);
  const rows = (await sql.query(
    `UPDATE mock_tables SET ${fields.join(", ")} WHERE id = $${i} RETURNING *`,
    values,
  )) as MockTable[];
  return rows[0];
}

export async function deleteMockTable(id: number): Promise<void> {
  const sql = db();
  await sql`DELETE FROM mock_tables WHERE id = ${id}`;
}

export async function getAllMockGuests(): Promise<MockGuest[]> {
  const sql = db();
  return (await sql`SELECT * FROM mock_guests ORDER BY id ASC`) as MockGuest[];
}

export async function createMockGuest(data: { name: string; seats?: number }): Promise<MockGuest> {
  const sql = db();
  const seats = data.seats && data.seats > 0 ? data.seats : 1;
  const rows = (await sql`
    INSERT INTO mock_guests (name, seats) VALUES (${data.name.trim()}, ${seats}) RETURNING *
  `) as MockGuest[];
  return rows[0];
}

export async function updateMockGuest(
  id: number,
  data: { name?: string; seats?: number; mock_table_id?: number | null },
): Promise<MockGuest> {
  const sql = db();
  const fields: string[] = [];
  const values: unknown[] = [];
  let i = 1;
  if (data.name !== undefined) { fields.push(`name = $${i++}`); values.push(data.name); }
  if (data.seats !== undefined) { fields.push(`seats = $${i++}`); values.push(data.seats); }
  if (data.mock_table_id !== undefined) { fields.push(`mock_table_id = $${i++}`); values.push(data.mock_table_id); }
  values.push(id);
  const rows = (await sql.query(
    `UPDATE mock_guests SET ${fields.join(", ")} WHERE id = $${i} RETURNING *`,
    values,
  )) as MockGuest[];
  return rows[0];
}

export async function deleteMockGuest(id: number): Promise<void> {
  const sql = db();
  await sql`DELETE FROM mock_guests WHERE id = ${id}`;
}

/* Etiqueta (o des-etiqueta con null) a un invitado en una mesa ficticia. */
export async function assignGuestToMockTable(
  guestId: number,
  mockTableId: number | null,
): Promise<void> {
  const sql = db();
  if (mockTableId === null) {
    await sql`DELETE FROM mock_seating WHERE guest_id = ${guestId}`;
  } else {
    await sql`
      INSERT INTO mock_seating (guest_id, mock_table_id)
      VALUES (${guestId}, ${mockTableId})
      ON CONFLICT (guest_id) DO UPDATE SET mock_table_id = EXCLUDED.mock_table_id
    `;
  }
}
