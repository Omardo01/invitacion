import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";

// El gate se evalúa en cada request (nunca cacheado).
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAuthed())) redirect("/admin-login");

  return (
    <>
      {/* Botón de cerrar sesión, flotante para no estorbar el panel. */}
      <form action="/api/admin/logout" method="post" className="fixed top-3 right-3 z-[60]">
        <button
          type="submit"
          className="rounded-full px-3 py-1.5 text-xs uppercase tracking-wider text-white shadow transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#8a6cb8" }}
        >
          Cerrar sesión
        </button>
      </form>
      {children}
    </>
  );
}
