"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/* Overlay de vista de impresión. Se monta como hijo directo de <body>
   (portal) para que las reglas @media print de globals.css puedan ocultar
   toda la app y dejar solo la hoja (.print-area). La barra de acciones lleva
   .no-print, así que no aparece en el papel ni en el PDF. */
export default function PrintOverlay({
  label,
  onClose,
  children,
}: {
  label: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // evita doble scroll detrás del overlay
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <div className="print-portal fixed inset-0 z-[200] overflow-auto bg-neutral-300 font-sans">
      {/* Barra de acciones — no se imprime */}
      <div
        className="no-print sticky top-0 z-10 flex items-center justify-between gap-3 px-4 sm:px-6 py-2.5 text-white shadow-md"
        style={{ backgroundColor: "#2a2440" }}
      >
        <span className="text-xs sm:text-sm font-medium truncate">
          Vista de impresión · <span className="opacity-70">{label}</span>
        </span>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => window.print()}
            className="text-sm px-4 py-1.5 rounded-lg bg-white text-gray-900 font-medium hover:bg-gray-100 transition-colors"
          >
            🖨️ Imprimir / Guardar PDF
          </button>
          <button
            onClick={onClose}
            className="text-sm px-3 py-1.5 rounded-lg border border-white/30 hover:bg-white/15 transition-colors"
          >
            Cerrar ✕
          </button>
        </div>
      </div>

      {/* Hoja imprimible */}
      <div className="print-area text-gray-900">{children}</div>
    </div>,
    document.body,
  );
}

/* ── Encabezado común de las hojas (monograma + título + fecha) ── */
export function PrintSheetHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="text-center border-b border-gray-300 pb-5 mb-6">
      <p
        className="text-4xl leading-none text-gray-800"
        style={{ fontFamily: "var(--font-great-vibes), cursive" }}
      >
        Gabriel &amp; Zayra
      </p>
      <h1
        className="mt-3 text-lg uppercase tracking-[0.35em] text-gray-700"
        style={{ fontFamily: "var(--font-deco), serif" }}
      >
        {title}
      </h1>
      {subtitle && (
        <p className="mt-1.5 text-sm text-gray-500" style={{ fontFamily: "var(--font-serif), serif" }}>
          {subtitle}
        </p>
      )}
      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gray-400">
        25 de julio 2026
      </p>
    </header>
  );
}

/* ── Pie común de las hojas ── */
export function PrintSheetFooter() {
  return (
    <footer className="mt-8 pt-4 border-t border-gray-200 text-center text-[10px] uppercase tracking-[0.25em] text-gray-400">
      Gabriel &amp; Zayra · #GabrielYZayra2026
    </footer>
  );
}
