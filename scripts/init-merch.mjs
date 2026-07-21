// Crea el esquema del sistema de merch (paquetes de regalos por invitado).
// Uso:  node --env-file=.env.local scripts/init-merch.mjs   (o: npm run db:merch)
//
// Idempotente: todas las tablas usan IF NOT EXISTS, es seguro re-ejecutarlo.
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("✗ Falta DATABASE_URL. Córrelo con: node --env-file=.env.local scripts/init-merch.mjs");
  process.exit(1);
}
const sql = neon(url);

// Catálogo de artículos de merch. `stock` NULL = sin límite definido.
await sql`CREATE TABLE IF NOT EXISTS merch_items (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  emoji       TEXT NOT NULL DEFAULT '🎁',
  stock       INTEGER DEFAULT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
)`;

// Quién recibe merch. Normalmente ligado a un invitado real (guest_id), pero
// `name` vive aparte para poder registrar externos (staff, proveedores) y para
// que el paquete sobreviva si el invitado se borra de la lista principal.
await sql`CREATE TABLE IF NOT EXISTS merch_recipients (
  id            SERIAL PRIMARY KEY,
  guest_id      INTEGER REFERENCES guests(id) ON DELETE SET NULL,
  name          TEXT NOT NULL,
  notes         TEXT DEFAULT NULL,
  delivered     BOOLEAN NOT NULL DEFAULT FALSE,
  delivered_at  TIMESTAMPTZ DEFAULT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
)`;

// Contenido de cada paquete: qué artículo y cuántas piezas le tocan.
await sql`CREATE TABLE IF NOT EXISTS merch_recipient_items (
  id            SERIAL PRIMARY KEY,
  recipient_id  INTEGER NOT NULL REFERENCES merch_recipients(id) ON DELETE CASCADE,
  item_id       INTEGER NOT NULL REFERENCES merch_items(id) ON DELETE CASCADE,
  qty           INTEGER NOT NULL DEFAULT 1 CHECK (qty > 0),
  UNIQUE (recipient_id, item_id)
)`;
await sql`CREATE INDEX IF NOT EXISTS merch_recipient_items_recipient_idx ON merch_recipient_items (recipient_id)`;
await sql`CREATE INDEX IF NOT EXISTS merch_recipient_items_item_idx ON merch_recipient_items (item_id)`;

// Agrupación visual de paquetes: normalmente el nombre de la familia (guest),
// pero es texto libre para poder reagrupar como se quiera.
await sql`ALTER TABLE merch_recipients ADD COLUMN IF NOT EXISTS group_name TEXT DEFAULT NULL`;

console.log("Listo ✅  Esquema de merch creado (merch_items, merch_recipients, merch_recipient_items).");
