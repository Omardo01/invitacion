import { db } from "./db";

export type MerchItem = {
  id: number;
  name: string;
  emoji: string;
  stock: number | null;
  created_at: string;
  /** Piezas ya repartidas entre todos los paquetes (calculado). */
  assigned: number;
};

export type PackageEntry = {
  item_id: number;
  qty: number;
};

export type MerchRecipient = {
  id: number;
  guest_id: number | null;
  name: string;
  group_name: string | null;
  notes: string | null;
  delivered: boolean;
  delivered_at: string | null;
  created_at: string;
  /** Contenido del paquete (calculado). */
  items: PackageEntry[];
};

export async function getMerchItems(): Promise<MerchItem[]> {
  const sql = db();
  return (await sql`
    SELECT i.*, COALESCE(SUM(ri.qty), 0)::int AS assigned
    FROM merch_items i
    LEFT JOIN merch_recipient_items ri ON ri.item_id = i.id
    GROUP BY i.id
    ORDER BY i.id ASC
  `) as MerchItem[];
}

export async function getMerchRecipients(): Promise<MerchRecipient[]> {
  const sql = db();
  return (await sql`
    SELECT r.*,
      COALESCE(
        json_agg(json_build_object('item_id', ri.item_id, 'qty', ri.qty) ORDER BY ri.item_id)
          FILTER (WHERE ri.id IS NOT NULL),
        '[]'
      ) AS items
    FROM merch_recipients r
    LEFT JOIN merch_recipient_items ri ON ri.recipient_id = r.id
    GROUP BY r.id
    ORDER BY r.created_at DESC
  `) as MerchRecipient[];
}

/* ── Catálogo ── */

export async function createMerchItem(data: {
  name: string;
  emoji?: string;
  stock?: number | null;
}): Promise<MerchItem> {
  const sql = db();
  const rows = (await sql`
    INSERT INTO merch_items (name, emoji, stock)
    VALUES (${data.name}, ${data.emoji?.trim() || "🎁"}, ${data.stock ?? null})
    RETURNING *, 0 AS assigned
  `) as MerchItem[];
  return rows[0];
}

export async function updateMerchItem(
  id: number,
  data: { name?: string; emoji?: string; stock?: number | null },
): Promise<MerchItem> {
  const sql = db();
  const fields: string[] = [];
  const values: unknown[] = [];
  let i = 1;
  if (data.name !== undefined) { fields.push(`name = $${i++}`); values.push(data.name); }
  if (data.emoji !== undefined) { fields.push(`emoji = $${i++}`); values.push(data.emoji.trim() || "🎁"); }
  if (data.stock !== undefined) { fields.push(`stock = $${i++}`); values.push(data.stock); }
  values.push(id);
  const rows = (await sql.query(
    `UPDATE merch_items SET ${fields.join(", ")} WHERE id = $${i} RETURNING *`,
    values,
  )) as MerchItem[];
  return rows[0];
}

export async function deleteMerchItem(id: number): Promise<void> {
  const sql = db();
  await sql`DELETE FROM merch_items WHERE id = ${id}`;
}

/* ── Destinatarios (paquetes) ── */

/** Da de alta una o varias personas (p.ej. los miembros de una familia). */
export async function createRecipients(data: {
  guest_id?: number | null;
  group_name?: string | null;
  names: string[];
  notes?: string;
}): Promise<void> {
  const sql = db();
  const group = data.group_name?.trim() || null;
  const notes = data.notes?.trim() || null;
  for (const name of data.names) {
    await sql`
      INSERT INTO merch_recipients (guest_id, name, group_name, notes)
      VALUES (${data.guest_id ?? null}, ${name}, ${group}, ${notes})
    `;
  }
}

export async function updateRecipient(
  id: number,
  data: {
    name?: string;
    group_name?: string | null;
    notes?: string | null;
    delivered?: boolean;
  },
): Promise<void> {
  const sql = db();
  const fields: string[] = [];
  const values: unknown[] = [];
  let i = 1;
  if (data.name !== undefined) { fields.push(`name = $${i++}`); values.push(data.name); }
  if (data.group_name !== undefined) { fields.push(`group_name = $${i++}`); values.push(data.group_name?.trim() || null); }
  if (data.notes !== undefined) { fields.push(`notes = $${i++}`); values.push(data.notes || null); }
  if (data.delivered !== undefined) {
    fields.push(`delivered = $${i++}`); values.push(data.delivered);
    fields.push(`delivered_at = ${data.delivered ? "now()" : "NULL"}`);
  }
  values.push(id);
  await sql.query(
    `UPDATE merch_recipients SET ${fields.join(", ")} WHERE id = $${i}`,
    values,
  );
}

export async function deleteRecipient(id: number): Promise<void> {
  const sql = db();
  await sql`DELETE FROM merch_recipients WHERE id = ${id}`;
}

/* ── Contenido del paquete ── */

/** Fija la cantidad de un artículo en un paquete. qty <= 0 lo quita. */
export async function setRecipientItem(
  recipientId: number,
  itemId: number,
  qty: number,
): Promise<void> {
  const sql = db();
  if (qty <= 0) {
    await sql`
      DELETE FROM merch_recipient_items
      WHERE recipient_id = ${recipientId} AND item_id = ${itemId}
    `;
    return;
  }
  await sql`
    INSERT INTO merch_recipient_items (recipient_id, item_id, qty)
    VALUES (${recipientId}, ${itemId}, ${qty})
    ON CONFLICT (recipient_id, item_id) DO UPDATE SET qty = ${qty}
  `;
}
