// Crea las tablas del plan de mesas ficticio (independiente de tables/attendees).
// Uso:  node --env-file=.env.local scripts/init-mock-tables.mjs
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("✗ Falta DATABASE_URL. Córrelo con: node --env-file=.env.local scripts/init-mock-tables.mjs");
  process.exit(1);
}
const sql = neon(url);

/* Mesas ficticias: un sandbox de planeación a nivel invitado (familia completa
   con sus `seats`), separado del acomodo real por persona en `tables`/`attendees`. */
await sql`CREATE TABLE IF NOT EXISTS mock_tables (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  capacity    INTEGER NOT NULL DEFAULT 12,
  created_at  TEXT NOT NULL DEFAULT (now()::text)
)`;

/* Cada invitado (familia) puede estar etiquetado en una sola mesa ficticia. */
await sql`CREATE TABLE IF NOT EXISTS mock_seating (
  guest_id       INTEGER PRIMARY KEY REFERENCES guests(id) ON DELETE CASCADE,
  mock_table_id  INTEGER NOT NULL REFERENCES mock_tables(id) ON DELETE CASCADE,
  created_at     TEXT NOT NULL DEFAULT (now()::text)
)`;

/* Invitados de logística: existen solo en el plan (staff, proveedores, cortesías)
   para contar lugares en mesas; no tienen invitación ni RSVP. */
await sql`CREATE TABLE IF NOT EXISTS mock_guests (
  id             SERIAL PRIMARY KEY,
  name           TEXT NOT NULL,
  seats          INTEGER NOT NULL DEFAULT 1,
  mock_table_id  INTEGER REFERENCES mock_tables(id) ON DELETE SET NULL,
  created_at     TEXT NOT NULL DEFAULT (now()::text)
)`;

/* Posición de cada mesa en el plano del salón (porcentaje 0–100 del lienzo).
   NULL = aún no acomodada; el plano le asigna un lugar por defecto. */
await sql`ALTER TABLE mock_tables ADD COLUMN IF NOT EXISTS pos_x REAL`;
await sql`ALTER TABLE mock_tables ADD COLUMN IF NOT EXISTS pos_y REAL`;

/* Estructuras del salón dibujadas en el plano (pilares, mesa de merch, barra,
   entrada...). Posición del vértice superior izquierdo y tamaño, en % del lienzo. */
await sql`CREATE TABLE IF NOT EXISTS plan_structures (
  id          SERIAL PRIMARY KEY,
  label       TEXT NOT NULL,
  pos_x       REAL NOT NULL DEFAULT 15,
  pos_y       REAL NOT NULL DEFAULT 40,
  w           REAL NOT NULL DEFAULT 10,
  h           REAL NOT NULL DEFAULT 16,
  created_at  TEXT NOT NULL DEFAULT (now()::text)
)`;

/* Acomodo por PERSONA en el plan (sandbox): copia editable, independiente del
   acomodo real por persona (attendees.table_id) y del modo por familia
   (mock_seating). Cada asistente registrado puede estar en una sola mesa
   ficticia. Se llena con el botón "Importar de Mesas" o arrastrando a mano. */
await sql`CREATE TABLE IF NOT EXISTS mock_attendee_seating (
  attendee_id    INTEGER PRIMARY KEY REFERENCES attendees(id) ON DELETE CASCADE,
  mock_table_id  INTEGER NOT NULL REFERENCES mock_tables(id) ON DELETE CASCADE,
  created_at     TEXT NOT NULL DEFAULT (now()::text)
)`;

console.log("✓ Esquema listo (mock_tables, mock_seating, mock_guests, mock_attendee_seating, pos_x/pos_y, plan_structures)");
