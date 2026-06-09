import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";

// El gate se evalúa en cada request (nunca cacheado).
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAuthed())) redirect("/admin-login");

  return (
    <>
      {/* Barra superior de admin (en flujo, no flotante → no choca con el header). */}
      <div
        className="flex items-center justify-between gap-3 px-4 py-1.5 text-white"
        style={{ backgroundColor: "#2a2440" }}
      >
        <span className="text-[11px] uppercase tracking-[0.2em] opacity-80">
          Panel<span className="hidden sm:inline"> · Gabriel &amp; Zayra</span>
        </span>
        <form action="/api/admin/logout" method="post">
          <button
            type="submit"
            className="text-[11px] uppercase tracking-[0.15em] rounded-full px-3 py-1 transition-colors hover:bg-white/15"
          >
            Cerrar sesión →
          </button>
        </form>
      </div>
      {children}
    </>
  );
}
