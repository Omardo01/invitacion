import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

/**
 * Cliente de Neon (Postgres serverless) sobre HTTP — ideal para Route Handlers
 * y Server Components, que hacen una consulta corta por request.
 *
 * Se inicializa de forma perezosa para no romper el build si `DATABASE_URL`
 * todavía no está configurada. Con la integración de Neon en el Marketplace de
 * Vercel, la variable se inyecta automáticamente; en local: `vercel env pull`.
 */
let cached: NeonQueryFunction<false, false> | undefined;

export function db(): NeonQueryFunction<false, false> {
  if (!cached) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error(
        "Falta DATABASE_URL. Crea la base Neon (Vercel → Storage → Neon) y corre `vercel env pull .env.local`.",
      );
    }
    cached = neon(url);
  }
  return cached;
}
