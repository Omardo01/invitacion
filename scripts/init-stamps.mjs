// Crea el esquema del sistema de estampas y siembra el catálogo inicial.
// Uso:  node --env-file=.env.local scripts/init-stamps.mjs   (o: npm run db:stamps)
//
// Idempotente: las tablas usan IF NOT EXISTS y el seed solo corre si el
// catálogo está vacío, así que es seguro re-ejecutarlo.
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("✗ Falta DATABASE_URL. Córrelo con: node --env-file=.env.local scripts/init-stamps.mjs");
  process.exit(1);
}
const sql = neon(url);

/* ── 1) Esquema ── */

// Catálogo de estampas. Agregar filas aquí (o desde el admin) amplía la
// colección sin tocar código: el sorteo y el álbum son data-driven.
await sql`CREATE TABLE IF NOT EXISTS stamps (
  id          SERIAL PRIMARY KEY,
  num         INTEGER UNIQUE NOT NULL,        -- número en el álbum (1..N)
  name        TEXT NOT NULL,
  emoji       TEXT NOT NULL DEFAULT '✦',      -- placeholder hasta tener imágenes
  image_url   TEXT DEFAULT NULL,              -- p.ej. /estampas/01.png
  plata       BOOLEAN NOT NULL DEFAULT FALSE, -- las premiadas
  active      BOOLEAN NOT NULL DEFAULT TRUE,  -- permite retirar una sin borrar historial
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
)`;

// Cada fila = un sobre abierto por un invitado.
// El límite diario se garantiza con UNIQUE (guest_id, opened_on, daily_seq):
// dos aperturas simultáneas que calculen el mismo daily_seq chocan y una
// reintenta, así que nunca se rebasa el tope ni con condiciones de carrera.
// El "día" es el de México (America/Mexico_City), no UTC.
await sql`CREATE TABLE IF NOT EXISTS guest_stamps (
  id          SERIAL PRIMARY KEY,
  guest_id    INTEGER NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  stamp_id    INTEGER NOT NULL REFERENCES stamps(id),
  opened_on   DATE NOT NULL,
  daily_seq   SMALLINT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (guest_id, opened_on, daily_seq)
)`;
await sql`CREATE INDEX IF NOT EXISTS guest_stamps_guest_idx ON guest_stamps (guest_id)`;
await sql`CREATE INDEX IF NOT EXISTS guest_stamps_stamp_idx ON guest_stamps (stamp_id)`;

// Configuración del sorteo (singleton). plata_chance se afinará después.
await sql`CREATE TABLE IF NOT EXISTS stamp_settings (
  id            INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  daily_limit   INTEGER NOT NULL DEFAULT 3,
  plata_chance  REAL NOT NULL DEFAULT 0.05,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
)`;
await sql`INSERT INTO stamp_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING`;

// Tipo de carta con el que se renderiza cada estampa (diseños definitivos
// de /estampa): clasica (op. 1), mundial (op. 2) o editorial (op. 5).
await sql`ALTER TABLE stamps ADD COLUMN IF NOT EXISTS style TEXT NOT NULL DEFAULT 'clasica'`;

console.log("✓ Esquema listo (stamps, guest_stamps, stamp_settings)");

/* ── 2) Seed del catálogo (solo si está vacío) ── */
const [{ n }] = await sql`SELECT COUNT(*)::int AS n FROM stamps`;
if (n > 0) {
  console.log(`• stamps ya tiene ${n} fila(s); se omite el seed.`);
} else {
  const stamps = [
    { num: 1, name: "Los Novios", emoji: "💑" },
    { num: 2, name: "Los Anillos", emoji: "💍" },
    { num: 3, name: "El Ramo", emoji: "💐" },
    { num: 4, name: "El Pastel", emoji: "🎂" },
    { num: 5, name: "El Brindis", emoji: "🥂" },
    { num: 6, name: "El Primer Baile", emoji: "💃" },
    { num: 7, name: "La Pista", emoji: "🪩" },
    { num: 8, name: "La Serenata", emoji: "🎶" },
    { num: 9, name: "El Banquete", emoji: "🍽️" },
    { num: 10, name: "El Fotógrafo", emoji: "📸" },
    { num: 11, name: "Los Padrinos", emoji: "🎩" },
    { num: 12, name: "El Salón", emoji: "🏛️" },
    { num: 13, name: "Las Flores", emoji: "🌸" },
    { num: 14, name: "La Fiesta", emoji: "🎉" },
    { num: 15, name: "El Beso", emoji: "💋" },
    { num: 16, name: "La Carta", emoji: "💌" },
    { num: 17, name: "La Fecha", emoji: "📅" },
    { num: 18, name: "Corazón de Plata", emoji: "🤍", plata: true },
    { num: 19, name: "Estrella de Plata", emoji: "✨", plata: true },
    { num: 20, name: "Luna de Plata", emoji: "🌙", plata: true },
  ];
  for (const s of stamps)
    await sql`INSERT INTO stamps (num, name, emoji, plata)
      VALUES (${s.num}, ${s.name}, ${s.emoji}, ${s.plata ?? false})`;
  console.log(`✓ Catálogo sembrado: ${stamps.length} estampas (3 de plata)`);
}

/* ── 3) Asignación de tipos (idempotente, corre siempre) ──
   Normales: alternan clasica/mundial por número. Platas: editorial, que es
   la versión con el shimmer de lujo. Cambiar la repartición = re-ejecutar. */
await sql`UPDATE stamps SET style = CASE
  WHEN plata THEN 'editorial'
  WHEN num % 2 = 1 THEN 'clasica'
  ELSE 'mundial'
END`;
const styles = await sql`SELECT style, COUNT(*)::int AS n FROM stamps GROUP BY style ORDER BY style`;
console.log("✓ Tipos asignados:", styles.map((s) => `${s.style}=${s.n}`).join(" · "));

console.log("Listo ✅  El sistema de estampas está configurado.");
