// Fija o cambia la contraseña del panel de administración (guardada en la BD).
// Uso:  node --env-file=.env.local scripts/set-admin-password.mjs "TuContraseña"
//   o:  npm run admin:password -- "TuContraseña"
import { neon } from "@neondatabase/serverless";
import crypto from "node:crypto";

const password = process.argv[2];
if (!password) {
  console.error('✗ Falta la contraseña.  Uso: npm run admin:password -- "TuContraseña"');
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error("✗ Falta DATABASE_URL (usa --env-file=.env.local).");
  process.exit(1);
}

// Debe coincidir con hashPassword() de lib/auth.ts (pbkdf2-sha256, 100k, 32 bytes).
const salt = crypto.randomBytes(16).toString("hex");
const hash = crypto.pbkdf2Sync(password, salt, 100_000, 32, "sha256").toString("hex");
const stored = `${salt}:${hash}`;

const sql = neon(process.env.DATABASE_URL);
await sql`CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)`;
await sql`
  INSERT INTO settings (key, value) VALUES ('admin_password', ${stored})
  ON CONFLICT (key) DO UPDATE SET value = ${stored}
`;
console.log("✓ Contraseña del admin actualizada.");
