import { db } from "./db";

/* Plan de mesas ficticio: sandbox de planeación a nivel invitado (familia con
   sus `seats`), independiente del acomodo real por persona (tables/attendees). */

export type MockTable = {
  id: number;
  name: string;
  capacity: number;
  /* posición en el plano de Plan de mesas (% del lienzo); null = sin acomodar */
  pos_x: number | null;
  pos_y: number | null;
  /* posición en el plano de la Vista de asientos (recinto propio, independiente) */
  seat_pos_x: number | null;
  seat_pos_y: number | null;
  created_at: string;
};

export type MockSeat = {
  guest_id: number;
  mock_table_id: number;
};

/* Acomodo por persona en el plan (sandbox): en qué mesa ficticia está sentado
   cada asistente registrado, y en qué silla exacta (seat_index, 0..capacity-1;
   null = en la mesa pero aún sin silla). Copia editable, no toca el acomodo real. */
export type MockAttendeeSeat = {
  attendee_id: number;
  mock_table_id: number;
  seat_index: number | null;
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
  data: {
    name?: string;
    capacity?: number;
    pos_x?: number | null;
    pos_y?: number | null;
    seat_pos_x?: number | null;
    seat_pos_y?: number | null;
  },
): Promise<MockTable> {
  const sql = db();
  const fields: string[] = [];
  const values: unknown[] = [];
  let i = 1;
  if (data.name !== undefined) { fields.push(`name = $${i++}`); values.push(data.name); }
  if (data.capacity !== undefined) { fields.push(`capacity = $${i++}`); values.push(data.capacity); }
  if (data.pos_x !== undefined) { fields.push(`pos_x = $${i++}`); values.push(data.pos_x); }
  if (data.pos_y !== undefined) { fields.push(`pos_y = $${i++}`); values.push(data.pos_y); }
  if (data.seat_pos_x !== undefined) { fields.push(`seat_pos_x = $${i++}`); values.push(data.seat_pos_x); }
  if (data.seat_pos_y !== undefined) { fields.push(`seat_pos_y = $${i++}`); values.push(data.seat_pos_y); }
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

/* ── Acomodo por persona (sandbox del plan) ── */

export async function getMockAttendeeSeating(): Promise<MockAttendeeSeat[]> {
  const sql = db();
  return (await sql`
    SELECT attendee_id, mock_table_id, seat_index FROM mock_attendee_seating
  `) as MockAttendeeSeat[];
}

/* Sienta (o levanta con null) a una persona en una mesa ficticia del plan.
   Es la herramienta "gruesa" (nivel mesa): al mover de mesa se olvida la silla
   exacta (seat_index vuelve a NULL); la vista de asientos la vuelve a fijar. */
export async function assignAttendeeToMockTable(
  attendeeId: number,
  mockTableId: number | null,
): Promise<void> {
  const sql = db();
  if (mockTableId === null) {
    await sql`DELETE FROM mock_attendee_seating WHERE attendee_id = ${attendeeId}`;
  } else {
    await sql`
      INSERT INTO mock_attendee_seating (attendee_id, mock_table_id, seat_index)
      VALUES (${attendeeId}, ${mockTableId}, NULL)
      ON CONFLICT (attendee_id) DO UPDATE SET mock_table_id = EXCLUDED.mock_table_id, seat_index = NULL
    `;
  }
}

/* Sienta a una persona en una silla exacta (mesa + seat_index). Antes libera esa
   silla si estaba ocupada por alguien más (queda en la mesa, sin silla). */
export async function assignAttendeeToSeat(
  attendeeId: number,
  mockTableId: number,
  seatIndex: number,
): Promise<void> {
  const sql = db();
  await sql`
    UPDATE mock_attendee_seating SET seat_index = NULL
    WHERE mock_table_id = ${mockTableId} AND seat_index = ${seatIndex} AND attendee_id <> ${attendeeId}
  `;
  await sql`
    INSERT INTO mock_attendee_seating (attendee_id, mock_table_id, seat_index)
    VALUES (${attendeeId}, ${mockTableId}, ${seatIndex})
    ON CONFLICT (attendee_id) DO UPDATE SET mock_table_id = EXCLUDED.mock_table_id, seat_index = EXCLUDED.seat_index
  `;
}

/* Levanta a una persona de su silla pero la deja asignada a su mesa. */
export async function clearAttendeeSeat(attendeeId: number): Promise<void> {
  const sql = db();
  await sql`
    UPDATE mock_attendee_seating SET seat_index = NULL WHERE attendee_id = ${attendeeId}
  `;
}

/* Copia el acomodo real (tables/attendees) al sandbox por persona del plan.
   - Reutiliza las mesas ficticias que coincidan por nombre con las reales; crea
     las que falten (mismo nombre y capacidad) para no perder el plano existente.
   - Reemplaza por completo el acomodo por persona previo del plan.
   No toca el acomodo real ni el modo por familia. */
export async function importRealSeatingToPlan(): Promise<{
  people: number;
  tablesCreated: number;
  tablesTotal: number;
}> {
  const sql = db();
  const realTables = (await sql`
    SELECT id, name, capacity FROM tables ORDER BY id ASC
  `) as { id: number; name: string; capacity: number }[];
  const mockTables = (await sql`SELECT id, name FROM mock_tables`) as {
    id: number;
    name: string;
  }[];

  const mockByName = new Map(mockTables.map((t) => [t.name.trim().toLowerCase(), t.id]));
  const realToMock = new Map<number, number>();
  let tablesCreated = 0;
  for (const rt of realTables) {
    const key = rt.name.trim().toLowerCase();
    let mockId = mockByName.get(key);
    if (mockId === undefined) {
      const rows = (await sql`
        INSERT INTO mock_tables (name, capacity) VALUES (${rt.name}, ${rt.capacity}) RETURNING id
      `) as { id: number }[];
      mockId = rows[0].id;
      mockByName.set(key, mockId);
      tablesCreated++;
    }
    realToMock.set(rt.id, mockId);
  }

  const seated = (await sql`
    SELECT id, table_id FROM attendees WHERE table_id IS NOT NULL
  `) as { id: number; table_id: number }[];

  // Reemplaza el sandbox por persona con el acomodo real.
  await sql`DELETE FROM mock_attendee_seating`;
  let people = 0;
  for (const a of seated) {
    const mockId = realToMock.get(a.table_id);
    if (mockId === undefined) continue;
    await sql`
      INSERT INTO mock_attendee_seating (attendee_id, mock_table_id)
      VALUES (${a.id}, ${mockId})
      ON CONFLICT (attendee_id) DO UPDATE SET mock_table_id = EXCLUDED.mock_table_id
    `;
    people++;
  }

  return { people, tablesCreated, tablesTotal: realTables.length };
}
