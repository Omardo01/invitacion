"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useState, useEffect, type ReactNode } from "react";
import { wedding } from "@/lib/wedding";
import { useCountdown } from "@/components/magic";

/* ─── Wipe · cortina de apertura + revelados por máscara ─── */
const C = {
  bg: "#f7f6f4", ink: "#111110", mid: "#6c6a66", faint: "#a3a09a", line: "#e4e2dd", accent: "#8f7bb3",
};

/* palabra que se revela tras una máscara */
function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <span className={`inline-block overflow-hidden align-bottom ${className}`}>
      <motion.span
        className="inline-block"
        initial={{ y: "115%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.85, delay, ease: [0.76, 0, 0.24, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/* línea que se traza */
function WipeLine({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, delay, ease: [0.76, 0, 0.24, 1] }}
      className="h-px origin-left"
      style={{ backgroundColor: C.ink }}
    />
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden mb-10">
      <Reveal><span className="text-[11px] uppercase tracking-[0.4em]" style={{ color: C.accent }}>{children}</span></Reveal>
    </div>
  );
}

export default function Opcion19() {
  const t = useCountdown("2026-07-25T17:00:00");
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setRevealed(true), 650);
    return () => clearTimeout(id);
  }, []);

  return (
    <div style={{ backgroundColor: C.bg, color: C.ink, fontFamily: "var(--font-syne)" }} className="min-h-screen overflow-x-hidden">

      {/* Cortina de apertura */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: revealed ? "-100%" : 0 }}
        transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        className="fixed inset-0 z-[80] flex items-center justify-center"
        style={{ backgroundColor: C.accent }}
      >
        <motion.span
          initial={{ opacity: 0, letterSpacing: "0.5em" }}
          animate={{ opacity: revealed ? 0 : 1, letterSpacing: "0.15em" }}
          transition={{ duration: 0.8 }}
          className="text-4xl italic text-white"
          style={{ fontFamily: "var(--font-fraunces)" }}
        >
          {wedding.groom[0]}&amp;{wedding.bride[0]}
        </motion.span>
      </motion.div>

      <Link href="/" className="fixed top-5 left-5 z-50 text-xs uppercase tracking-widest" style={{ color: C.mid }}>← volver</Link>

      {/* HERO */}
      <section className="min-h-screen flex flex-col justify-center px-6 md:px-12 max-w-6xl mx-auto">
        <div className="overflow-hidden">
          <motion.p initial={{ y: "115%" }} animate={{ y: revealed ? "0%" : "115%" }} transition={{ duration: 0.8, delay: 1, ease: [0.76, 0, 0.24, 1] }}
            className="text-[11px] uppercase tracking-[0.45em] mb-8" style={{ color: C.accent }}>
            Nos casamos · {wedding.dateShort}
          </motion.p>
        </div>
        <h1 className="text-[16vw] md:text-[13vw] leading-[0.82] font-medium tracking-tight">
          <div className="overflow-hidden"><motion.div initial={{ y: "115%" }} animate={{ y: revealed ? "0%" : "115%" }} transition={{ duration: 0.9, delay: 1.05, ease: [0.76, 0, 0.24, 1] }}>{wedding.groom}</motion.div></div>
          <div className="overflow-hidden text-right italic" style={{ color: C.accent }}><motion.div initial={{ y: "115%" }} animate={{ y: revealed ? "0%" : "115%" }} transition={{ duration: 0.9, delay: 1.18, ease: [0.76, 0, 0.24, 1] }}>{wedding.bride}</motion.div></div>
        </h1>
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: revealed ? 1 : 0 }} transition={{ duration: 1, delay: 1.4, ease: [0.76, 0, 0.24, 1] }}
          className="h-px origin-left mt-10" style={{ backgroundColor: C.ink }} />
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: revealed ? 1 : 0 }} transition={{ duration: 0.8, delay: 1.7 }}
          className="mt-6 text-sm uppercase tracking-[0.3em] tabular-nums" style={{ color: C.mid }}>
          {wedding.city} — faltan {t.d} días
        </motion.p>
      </section>

      {/* Historia */}
      <section className="py-28 px-6 md:px-12 max-w-4xl mx-auto">
        <SectionLabel>Nuestra historia</SectionLabel>
        <p className="text-3xl md:text-4xl leading-snug italic font-light" style={{ fontFamily: "var(--font-fraunces)" }}>
          {wedding.story.split(" ").map((w, i) => (
            <Reveal key={i} delay={i * 0.01}>{w + " "}</Reveal>
          ))}
        </p>
      </section>

      {/* Eventos */}
      <section className="py-20 px-6 md:px-12 max-w-5xl mx-auto">
        <SectionLabel>El gran día</SectionLabel>
        <div className="space-y-0">
          {[wedding.ceremony, wedding.reception].map((ev, i) => (
            <div key={ev.title}>
              <WipeLine delay={i * 0.1} />
              <div className="grid md:grid-cols-[1fr_auto] gap-4 items-center py-10">
                <div>
                  <div className="overflow-hidden"><Reveal delay={0.1}><span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: C.faint }}>{ev.title}</span></Reveal></div>
                  <h3 className="text-4xl md:text-6xl tracking-tight mt-2" style={{ fontFamily: "var(--font-fraunces)" }}>
                    <Reveal delay={0.15}>{ev.place}</Reveal>
                  </h3>
                  <p className="text-sm mt-2" style={{ color: C.mid }}>{ev.address}</p>
                </div>
                <div className="text-right">
                  <p className="text-5xl md:text-6xl tracking-tight" style={{ color: C.accent, fontFamily: "var(--font-fraunces)" }}>{ev.time}</p>
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(ev.mapsQuery)}`} target="_blank" rel="noopener noreferrer"
                    className="inline-block mt-2 text-[11px] uppercase tracking-[0.25em] border-b pb-0.5 transition-opacity hover:opacity-60" style={{ borderColor: C.ink }}>Ver mapa</a>
                </div>
              </div>
            </div>
          ))}
          <WipeLine delay={0.2} />
        </div>
      </section>

      {/* Dress code */}
      <section className="py-24 px-6 md:px-12 max-w-5xl mx-auto text-center">
        <SectionLabel>Código de vestimenta</SectionLabel>
        <p className="text-5xl md:text-7xl tracking-tight" style={{ fontFamily: "var(--font-fraunces)", color: C.accent }}>
          <Reveal>{wedding.dressCode}</Reveal>
        </p>
      </section>

      {/* Regalos */}
      <section className="py-20 px-6 md:px-12 max-w-3xl mx-auto">
        <SectionLabel>Mesa de regalos</SectionLabel>
        <div>
          {wedding.gifts.map((g, i) => (
            <div key={g.store}>
              <WipeLine delay={i * 0.08} />
              <a href={g.url} target="_blank" rel="noopener noreferrer" className="flex justify-between items-center py-6 transition-opacity hover:opacity-60">
                <span className="text-3xl tracking-tight" style={{ fontFamily: "var(--font-fraunces)" }}>{g.store}</span>
                <span className="text-xs uppercase tracking-widest" style={{ color: C.faint }}>{g.code} →</span>
              </a>
            </div>
          ))}
          <WipeLine delay={0.1} />
        </div>
      </section>

      {/* RSVP */}
      <section className="py-32 px-6 md:px-12 max-w-5xl mx-auto text-center">
        <h2 className="text-6xl md:text-8xl tracking-tight mb-8" style={{ fontFamily: "var(--font-fraunces)" }}>
          <Reveal>¿Nos acompañas?</Reveal>
        </h2>
        <p className="mb-10 text-sm uppercase tracking-[0.3em]" style={{ color: C.mid }}>Confirma antes del {wedding.rsvpDeadline}</p>
        <div className="inline-block px-12 py-4 text-[11px] uppercase tracking-[0.3em] text-white" style={{ backgroundColor: C.accent }}>Confirmar asistencia</div>
        <p className="mt-6 text-xs" style={{ color: C.faint }}>Tu invitación personalizada tiene tu link de confirmación</p>
      </section>

      <footer className="py-12 text-center border-t" style={{ borderColor: C.line }}>
        <p className="text-2xl italic" style={{ fontFamily: "var(--font-fraunces)" }}>{wedding.groom} <span style={{ color: C.accent }}>&amp;</span> {wedding.bride}</p>
      </footer>
    </div>
  );
}
