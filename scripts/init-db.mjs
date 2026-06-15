// Crea el esquema en Neon (Postgres) y migra los datos de prueba.
// Uso:  node --env-file=.env.local scripts/init-db.mjs   (o: npm run db:setup)
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("✗ Falta DATABASE_URL. Córrelo con: node --env-file=.env.local scripts/init-db.mjs");
  process.exit(1);
}
const sql = neon(url);

/* ── 1) Esquema (timestamps como TEXT para igualar el comportamiento previo) ── */
await sql`CREATE TABLE IF NOT EXISTS guests (
  id            SERIAL PRIMARY KEY,
  slug          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  seats         INTEGER NOT NULL DEFAULT 1,
  phone         TEXT,
  confirmed     SMALLINT DEFAULT NULL,        -- NULL=pendiente, 1=sí, 0=no
  confirmed_at  TEXT DEFAULT NULL,
  notes         TEXT DEFAULT NULL,
  created_at    TEXT NOT NULL DEFAULT (now()::text)
)`;
await sql`CREATE TABLE IF NOT EXISTS tables (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  capacity    INTEGER NOT NULL DEFAULT 12,
  created_at  TEXT NOT NULL DEFAULT (now()::text)
)`;
await sql`CREATE TABLE IF NOT EXISTS attendees (
  id          SERIAL PRIMARY KEY,
  guest_id    INTEGER NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  table_id    INTEGER REFERENCES tables(id) ON DELETE SET NULL,
  created_at  TEXT NOT NULL DEFAULT (now()::text)
)`;

/* Etiqueta de invitado: de qué lado viene (novio | novia | ambos).
   Idempotente, corre siempre, así que es seguro re-ejecutar el script
   sobre una base que ya tiene datos. */
await sql`ALTER TABLE guests ADD COLUMN IF NOT EXISTS side TEXT NOT NULL DEFAULT 'ambos'`;
await sql`ALTER TABLE guests DROP CONSTRAINT IF EXISTS guests_side_check`;
await sql`ALTER TABLE guests ADD CONSTRAINT guests_side_check CHECK (side IN ('novio','novia','ambos'))`;

/* Estado de la invitación (ciclo de envío): pendiente → enviado → confirmado.
   - pendiente: creada, aún no se manda (default)
   - enviado:   se marca a mano cuando se envía
   - confirmado: automático cuando el invitado confirma su RSVP
   Idempotente; el backfill solo toca filas aún en el default para no pisar
   valores ya ajustados a mano. */
await sql`ALTER TABLE guests ADD COLUMN IF NOT EXISTS invite_status TEXT NOT NULL DEFAULT 'pendiente'`;
await sql`ALTER TABLE guests DROP CONSTRAINT IF EXISTS guests_invite_status_check`;
await sql`ALTER TABLE guests ADD CONSTRAINT guests_invite_status_check CHECK (invite_status IN ('pendiente','enviado','confirmado'))`;
await sql`UPDATE guests SET invite_status = 'confirmado' WHERE confirmed = 1 AND invite_status = 'pendiente'`;
await sql`UPDATE guests SET invite_status = 'enviado'    WHERE confirmed = 0 AND invite_status = 'pendiente'`;

/* Auth del admin: contraseña (hasheada) en `settings` y sesiones por cookie. */
await sql`CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
)`;
await sql`CREATE TABLE IF NOT EXISTS admin_sessions (
  token      TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL
)`;
console.log("✓ Esquema listo (guests, tables, attendees, settings, admin_sessions)");

/* ── 2) Seed (solo si la tabla guests está vacía, para no duplicar) ── */
const [{ n }] = await sql`SELECT COUNT(*)::int AS n FROM guests`;
if (n > 0) {
  console.log(`• guests ya tiene ${n} fila(s); se omite el seed.`);
} else {
  const guests = [
    { id: 1, slug: "familia-garcia-lmoj", name: "Familia García", seats: 4, phone: "5215512345678", confirmed: 1, confirmed_at: "2026-06-02T04:32:32.816Z", notes: "¡Con mucho gusto!", created_at: "2026-06-01 22:32:31" },
    { id: 2, slug: "familia-dominguez-bwpf", name: "Familia dominguez", seats: 4, phone: "9931125772", confirmed: 1, confirmed_at: "2026-06-08T02:27:50.398Z", notes: "Asistirán 2 de 4 lugares", created_at: "2026-06-02 12:09:01" },
    { id: 4, slug: "famirlia-hernand-l32j", name: "Familia Hernandez", seats: 3, phone: null, confirmed: 1, confirmed_at: "2026-06-07T20:50:24.970Z", notes: "Asistirán 3 de 3 lugares", created_at: "2026-06-07 14:49:38" },
    { id: 5, slug: "familia-valencia-dkdd", name: "Familia valencia", seats: 3, phone: "", confirmed: null, confirmed_at: null, notes: null, created_at: "2026-06-07 20:28:24" },
  ];
  const tables = [
    { id: 3, name: "Mesa 1", capacity: 12, created_at: "2026-06-06 16:37:46" },
  ];
  const attendees = [
    { id: 6, guest_id: 2, name: "Omar", table_id: 3, created_at: "2026-06-06 16:38:10" },
    { id: 7, guest_id: 2, name: "Miguel", table_id: 3, created_at: "2026-06-06 16:38:14" },
    { id: 8, guest_id: 2, name: "Papa", table_id: 3, created_at: "2026-06-06 16:38:17" },
    { id: 9, guest_id: 2, name: "Mama", table_id: 3, created_at: "2026-06-06 16:38:23" },
  ];

  for (const g of guests)
    await sql`INSERT INTO guests (id, slug, name, seats, phone, confirmed, confirmed_at, notes, created_at)
      VALUES (${g.id}, ${g.slug}, ${g.name}, ${g.seats}, ${g.phone}, ${g.confirmed}, ${g.confirmed_at}, ${g.notes}, ${g.created_at})`;
  for (const t of tables)
    await sql`INSERT INTO tables (id, name, capacity, created_at)
      VALUES (${t.id}, ${t.name}, ${t.capacity}, ${t.created_at})`;
  for (const a of attendees)
    await sql`INSERT INTO attendees (id, guest_id, name, table_id, created_at)
      VALUES (${a.id}, ${a.guest_id}, ${a.name}, ${a.table_id}, ${a.created_at})`;

  // Las secuencias deben continuar después del MAX(id) insertado manualmente.
  await sql`SELECT setval(pg_get_serial_sequence('guests','id'),    (SELECT MAX(id) FROM guests))`;
  await sql`SELECT setval(pg_get_serial_sequence('tables','id'),    (SELECT MAX(id) FROM tables))`;
  await sql`SELECT setval(pg_get_serial_sequence('attendees','id'), (SELECT MAX(id) FROM attendees))`;

  console.log(`✓ Datos migrados: ${guests.length} invitados, ${tables.length} mesa(s), ${attendees.length} asistentes`);
}

console.log("Listo ✅  La base Neon está configurada.");
