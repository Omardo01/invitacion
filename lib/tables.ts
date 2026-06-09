import { db } from "./db";

export type TableRow = {
  id: number;
  name: string;
  capacity: number;
  created_at: string;
};

export async function getAllTables(): Promise<TableRow[]> {
  const sql = db();
  return (await sql`SELECT * FROM tables ORDER BY id ASC`) as TableRow[];
}

export async function createTable(data: { name?: string; capacity?: number }): Promise<TableRow> {
  const sql = db();
  const countRows = (await sql`SELECT COUNT(*)::int AS n FROM tables`) as { n: number }[];
  const name = data.name?.trim() || `Mesa ${countRows[0].n + 1}`;
  const capacity = data.capacity && data.capacity > 0 ? data.capacity : 12;
  const rows = (await sql`
    INSERT INTO tables (name, capacity) VALUES (${name}, ${capacity}) RETURNING *
  `) as TableRow[];
  return rows[0];
}

export async function updateTable(
  id: number,
  data: { name?: string; capacity?: number },
): Promise<TableRow> {
  const sql = db();
  const fields: string[] = [];
  const values: unknown[] = [];
  let i = 1;
  if (data.name !== undefined) { fields.push(`name = $${i++}`); values.push(data.name); }
  if (data.capacity !== undefined) { fields.push(`capacity = $${i++}`); values.push(data.capacity); }
  values.push(id);
  const rows = (await sql.query(
    `UPDATE tables SET ${fields.join(", ")} WHERE id = $${i} RETURNING *`,
    values,
  )) as TableRow[];
  return rows[0];
}

export async function deleteTable(id: number): Promise<void> {
  const sql = db();
  await sql`DELETE FROM tables WHERE id = ${id}`;
}
