import db from "./db";

export type TableRow = {
  id: number;
  name: string;
  capacity: number;
  created_at: string;
};

export function getAllTables(): TableRow[] {
  return db
    .prepare("SELECT * FROM tables ORDER BY id ASC")
    .all() as TableRow[];
}

export function createTable(data: { name?: string; capacity?: number }): TableRow {
  const count = (db.prepare("SELECT COUNT(*) as n FROM tables").get() as { n: number }).n;
  const name = data.name?.trim() || `Mesa ${count + 1}`;
  const capacity = data.capacity && data.capacity > 0 ? data.capacity : 12;
  return db
    .prepare("INSERT INTO tables (name, capacity) VALUES (?, ?) RETURNING *")
    .get(name, capacity) as TableRow;
}

export function updateTable(
  id: number,
  data: { name?: string; capacity?: number }
): TableRow {
  const fields: string[] = [];
  const values: unknown[] = [];
  if (data.name !== undefined) { fields.push("name = ?"); values.push(data.name); }
  if (data.capacity !== undefined) { fields.push("capacity = ?"); values.push(data.capacity); }
  values.push(id);
  return db
    .prepare(`UPDATE tables SET ${fields.join(", ")} WHERE id = ? RETURNING *`)
    .get(...values) as TableRow;
}

export function deleteTable(id: number): void {
  db.prepare("DELETE FROM tables WHERE id = ?").run(id);
}
