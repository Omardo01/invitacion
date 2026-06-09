import crypto from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "./db";

export const ADMIN_COOKIE = "admin_session";
const SESSION_DAYS = 30;
const PBKDF2_ITERS = 100_000;

/* ── Hash de contraseña (formato "salt:hash", pbkdf2-sha256) ── */
export function hashPassword(password: string, salt = crypto.randomBytes(16).toString("hex")): string {
  const hash = crypto.pbkdf2Sync(password, salt, PBKDF2_ITERS, 32, "sha256").toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const test = crypto.pbkdf2Sync(password, salt, PBKDF2_ITERS, 32, "sha256").toString("hex");
  const a = Buffer.from(hash, "hex");
  const b = Buffer.from(test, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/* ── Contraseña guardada en `settings` ── */
export async function getAdminPasswordHash(): Promise<string | null> {
  const sql = db();
  const rows = (await sql`SELECT value FROM settings WHERE key = 'admin_password'`) as { value: string }[];
  return rows[0]?.value ?? null;
}

export async function setAdminPassword(password: string): Promise<void> {
  const sql = db();
  const stored = hashPassword(password);
  await sql`
    INSERT INTO settings (key, value) VALUES ('admin_password', ${stored})
    ON CONFLICT (key) DO UPDATE SET value = ${stored}
  `;
}

/* ── Sesiones (token opaco aleatorio, validado contra la BD) ── */
export async function createSession(): Promise<string> {
  const sql = db();
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + SESSION_DAYS * 86_400_000).toISOString();
  await sql`INSERT INTO admin_sessions (token, expires_at) VALUES (${token}, ${expires})`;
  return token;
}

export async function isValidSession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const sql = db();
  const rows = (await sql`
    SELECT 1 FROM admin_sessions WHERE token = ${token} AND expires_at > now()
  `) as unknown[];
  return rows.length > 0;
}

export async function destroySession(token: string | undefined): Promise<void> {
  if (!token) return;
  const sql = db();
  await sql`DELETE FROM admin_sessions WHERE token = ${token}`;
}

/* ── Helpers de alto nivel ── */

/** ¿La petición actual trae una sesión de admin válida? (lee la cookie) */
export async function isAuthed(): Promise<boolean> {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  return isValidSession(token);
}

/** Para Route Handlers: devuelve una respuesta 401 si no hay sesión, o `null` si sí la hay. */
export async function requireAdmin(): Promise<NextResponse | null> {
  if (await isAuthed()) return null;
  return NextResponse.json({ error: "No autorizado" }, { status: 401 });
}

export { SESSION_DAYS };
