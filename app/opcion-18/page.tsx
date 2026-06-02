"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { wedding } from "@/lib/wedding";
import { BlurFade, useCountdown } from "@/components/magic";

/* ─── Índice Editorial · revista de moda, filas que se expanden ─── */
const C = {
  bg: "#faf8f4", ink: "#1b1814", mid: "#736d63", faint: "#a8a094", line: "#e6e1d7", accent: "#8f7bb3",
};

type Row = { n: string; title: string; detail: React.ReactNode };

export default function Opcion18() {
  const t = useCountdown("2026-07-25T17:00:00");
  const [open, setOpen] = useState<number | null>(0);

  const rows: Row[] = [
    {
      n: "01", title: "Ceremonia",
      detail: (
        <div>
          <p className="text-2xl" style={{ fontFamily: "var(--font-fraunces)" }}>{wedding.ceremony.time} · {wedding.ceremony.place}</p>
          <p className="text-sm mt-1" style={{ color: C.mid }}>{wedding.ceremony.address}</p>
          <a href={`https://maps.google.com/?q=${encodeURIComponent(wedding.ceremony.mapsQuery)}`} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-[11px] uppercase tracking-[0.25em] border-b pb-0.5" style={{ borderColor: C.ink }}>Ver mapa</a>
        </div>
      ),
    },
    {
      n: "02", title: "Recepción",
      detail: (
        <div>
          <p className="text-2xl" style={{ fontFamily: "var(--font-fraunces)" }}>{wedding.reception.time} · {wedding.reception.place}</p>
          <p className="text-sm mt-1" style={{ color: C.mid }}>{wedding.reception.address}</p>
          <a href={`https://maps.google.com/?q=${encodeURIComponent(wedding.reception.mapsQuery)}`} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-[11px] uppercase tracking-[0.25em] border-b pb-0.5" style={{ borderColor: C.ink }}>Ver mapa</a>
        </div>
      ),
    },
    {
      n: "03", title: "Código de vestimenta",
      detail: <p className="text-2xl" style={{ fontFamily: "var(--font-fraunces)" }}>{wedding.dressCode}</p>,
    },
    {
      n: "04", title: "Mesa de regalos",
      detail: (
        <div className="space-y-2">
          {wedding.gifts.map((g) => (
            <a key={g.store} href={g.url} target="_blank" rel="noopener noreferrer" className="flex justify-between items-center max-w-sm transition-opacity hover:opacity-60">
              <span className="text-lg" style={{ fontFamily: "var(--font-fraunces)" }}>{g.store}</span>
              <span className="text-xs uppercase tracking-widest" style={{ color: C.faint }}>{g.code} →</span>
            </a>
          ))}
        </div>
      ),
    },
    {
      n: "05", title: "Confirmar asistencia",
      detail: (
        <div>
          <p className="text-sm mb-3" style={{ color: C.mid }}>Antes del {wedding.rsvpDeadline}</p>
          <div className="inline-block px-8 py-3 text-[11px] uppercase tracking-[0.3em] text-white" style={{ backgroundColor: C.accent }}>Confirmar asistencia</div>
        </div>
      ),
    },
  ];

  return (
    <div style={{ backgroundColor: C.bg, color: C.ink, fontFamily: "var(--font-fraunces)" }} className="min-h-screen">
      <Link href="/" className="fixed top-5 left-5 z-50 text-xs uppercase tracking-widest" style={{ color: C.mid, fontFamily: "var(--font-syne)" }}>← volver</Link>

      {/* HERO */}
      <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 max-w-6xl mx-auto">
        <div className="flex items-baseline justify-between border-b pb-4" style={{ borderColor: C.ink }}>
          <BlurFade><span className="text-[11px] uppercase tracking-[0.4em]" style={{ fontFamily: "var(--font-syne)", color: C.mid }}>La boda — Edición 2026</span></BlurFade>
          <BlurFade delay={0.1}><span className="text-[11px] uppercase tracking-[0.4em]" style={{ fontFamily: "var(--font-syne)", color: C.mid }}>{wedding.city}</span></BlurFade>
        </div>
        <BlurFade delay={0.15} y={30}>
          <h1 className="text-[15vw] md:text-[12vw] leading-[0.85] tracking-tight mt-8">{wedding.groom}</h1>
          <h1 className="text-[15vw] md:text-[12vw] leading-[0.85] tracking-tight text-right italic" style={{ color: C.accent }}>&amp; {wedding.bride}</h1>
        </BlurFade>
        <BlurFade delay={0.4}>
          <div className="flex items-baseline justify-between border-t mt-8 pt-4" style={{ borderColor: C.ink }}>
            <span className="text-2xl">{wedding.dateShort}</span>
            <span className="text-[11px] uppercase tracking-[0.3em] tabular-nums" style={{ fontFamily: "var(--font-syne)", color: C.mid }}>
              faltan {t.d} días · {String(t.h).padStart(2, "0")}:{String(t.m).padStart(2, "0")}:{String(t.s).padStart(2, "0")}
            </span>
          </div>
        </BlurFade>
      </section>

      {/* Historia */}
      <section className="py-28 px-6 md:px-12 max-w-4xl mx-auto">
        <BlurFade>
          <p className="text-[11px] uppercase tracking-[0.4em] mb-8" style={{ fontFamily: "var(--font-syne)", color: C.accent }}>Editorial — Nuestra historia</p>
          <p className="text-3xl md:text-4xl leading-snug italic font-light">{wedding.story}</p>
        </BlurFade>
      </section>

      {/* Índice expandible */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto pb-28">
        <BlurFade><p className="text-[11px] uppercase tracking-[0.4em] mb-2" style={{ fontFamily: "var(--font-syne)", color: C.mid }}>Índice</p></BlurFade>
        <div>
          {rows.map((row, i) => (
            <BlurFade key={row.n} delay={i * 0.06}>
              <div
                className="border-t cursor-pointer group"
                style={{ borderColor: C.line }}
                onMouseEnter={() => setOpen(i)}
                onClick={() => setOpen(open === i ? null : i)}
              >
                <div className="flex items-center gap-6 py-6">
                  <span className="text-sm tabular-nums w-8" style={{ fontFamily: "var(--font-syne)", color: C.faint }}>{row.n}</span>
                  <h3 className="text-3xl md:text-5xl tracking-tight transition-colors flex-1" style={{ color: open === i ? C.accent : C.ink }}>{row.title}</h3>
                  <motion.span animate={{ rotate: open === i ? 45 : 0 }} className="text-2xl font-light" style={{ color: C.faint }}>+</motion.span>
                </div>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pl-14 pb-8">{row.detail}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </BlurFade>
          ))}
          <div className="border-t" style={{ borderColor: C.line }} />
        </div>
      </section>

      <footer className="py-12 text-center border-t" style={{ borderColor: C.line }}>
        <p className="text-2xl italic mb-1">{wedding.groom} <span style={{ color: C.accent }}>&amp;</span> {wedding.bride}</p>
        <p className="text-[10px] uppercase tracking-[0.4em]" style={{ fontFamily: "var(--font-syne)", color: C.faint }}>{wedding.dateShort}</p>
      </footer>
    </div>
  );
}
