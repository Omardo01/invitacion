import { db } from "./db";

/* Estructura del salón dibujada en el plano de mesas: pilares, mesa de merch,
   barra, entrada... Posición (vértice superior izquierdo) y tamaño en % del lienzo. */
export type PlanStructure = {
  id: number;
  label: string;
  pos_x: number;
  pos_y: number;
  w: number;
  h: number;
  created_at: string;
};

export async function getAllStructures(): Promise<PlanStructure[]> {
  const sql = db();
  return (await sql`SELECT * FROM plan_structures ORDER BY id ASC`) as PlanStructure[];
}

export async function createStructure(data: {
  label: string;
  pos_x?: number;
  pos_y?: number;
  w?: number;
  h?: number;
}): Promise<PlanStructure> {
  const sql = db();
  const rows = (await sql`
    INSERT INTO plan_structures (label, pos_x, pos_y, w, h)
    VALUES (${data.label}, ${data.pos_x ?? 15}, ${data.pos_y ?? 40}, ${data.w ?? 10}, ${data.h ?? 16})
    RETURNING *
  `) as PlanStructure[];
  return rows[0];
}

export async function updateStructure(
  id: number,
  data: { label?: string; pos_x?: number; pos_y?: number; w?: number; h?: number },
): Promise<PlanStructure> {
  const sql = db();
  const fields: string[] = [];
  const values: unknown[] = [];
  let i = 1;
  if (data.label !== undefined) { fields.push(`label = $${i++}`); values.push(data.label); }
  if (data.pos_x !== undefined) { fields.push(`pos_x = $${i++}`); values.push(data.pos_x); }
  if (data.pos_y !== undefined) { fields.push(`pos_y = $${i++}`); values.push(data.pos_y); }
  if (data.w !== undefined) { fields.push(`w = $${i++}`); values.push(data.w); }
  if (data.h !== undefined) { fields.push(`h = $${i++}`); values.push(data.h); }
  values.push(id);
  const rows = (await sql.query(
    `UPDATE plan_structures SET ${fields.join(", ")} WHERE id = $${i} RETURNING *`,
    values,
  )) as PlanStructure[];
  return rows[0];
}

export async function deleteStructure(id: number): Promise<void> {
  const sql = db();
  await sql`DELETE FROM plan_structures WHERE id = ${id}`;
}
