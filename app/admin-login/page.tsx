"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.replace("/admin");
        router.refresh();
        return;
      }
    } catch {
      /* cae a error */
    }
    setError(true);
    setLoading(false);
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: "#faf8fd", color: "#352c4e" }}
    >
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-3xl p-8 text-center"
        style={{ backgroundColor: "#fff", border: "1px solid #e8e2f3", boxShadow: "0 30px 70px -30px rgba(120,90,170,0.5)" }}
      >
        <p className="text-[10px] uppercase tracking-[0.35em] mb-2" style={{ color: "#8a6cb8" }}>
          Panel de administración
        </p>
        <h1 className="text-4xl mb-6" style={{ fontFamily: "var(--font-great-vibes)", color: "#8a6cb8" }}>
          Acceso
        </h1>

        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          className="w-full rounded-full px-5 py-3 text-sm outline-none mb-3"
          style={{ backgroundColor: "#f7f5fb", border: `1px solid ${error ? "#d24a4a" : "#e8e2f3"}`, color: "#352c4e" }}
        />

        {error && (
          <p className="text-xs mb-3" style={{ color: "#d24a4a" }}>
            Contraseña incorrecta.
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          className="w-full py-3 rounded-full text-white text-sm uppercase tracking-[0.2em] transition-opacity disabled:opacity-60"
          style={{ backgroundColor: "#8a6cb8", boxShadow: "0 16px 30px -14px rgba(120,90,170,0.7)" }}
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}
