"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useState } from "react";
import { wedding } from "@/lib/wedding";
import { BlurFade, TiltCard, useCountdown } from "@/components/magic";
import { PetalRain, FloralCorner, FloralDivider } from "@/components/floral";

/* ─── Perspectiva 3D · tilt + tarjetas que voltean ─── */
const C = {
  bg: "#ffffff", panel: "#faf9fc", ink: "#1a1722", mid: "#6c6678", faint: "#a8a2b4", line: "#ece9f1", accent: "#8f7bb3",
};

type EventInfo = { title: string; time: string; place: string; address: string; mapsQuery: string };

function FlipCard({ ev }: { ev: EventInfo }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="h-64 cursor-pointer" style={{ perspective: 1200 }} onClick={() => setFlipped((f) => !f)}>
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Frente */}
        <div className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center text-center p-8" style={{ backfaceVisibility: "hidden", backgroundColor: C.panel, border: `1px solid ${C.line}` }}>
          <p className="text-[10px] uppercase tracking-[0.3em] mb-3" style={{ color: C.faint }}>{ev.title}</p>
          <p className="text-6xl font-medium tracking-tight" style={{ color: C.accent }}>{ev.time}</p>
          <p className="text-sm mt-4" style={{ color: C.mid }}>toca para ver el lugar →</p>
        </div>
        {/* Reverso */}
        <div className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center text-center p-8 text-white" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", backgroundColor: C.accent }}>
          <p className="text-lg font-semibold mb-1">{ev.place}</p>
          <p className="text-sm opacity-80 mb-5">{ev.address}</p>
          <a href={`https://maps.google.com/?q=${encodeURIComponent(ev.mapsQuery)}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}
            className="text-[11px] uppercase tracking-[0.25em] border-b border-white pb-0.5">Abrir mapa</a>
        </div>
      </motion.div>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center px-5">
      <div className="text-3xl md:text-4xl font-medium tabular-nums">{String(value).padStart(2, "0")}</div>
      <div className="text-[10px] uppercase tracking-[0.3em] mt-1.5" style={{ color: C.faint }}>{label}</div>
    </div>
  );
}

export default function Opcion22() {
  const t = useCountdown("2026-07-25T17:00:00");

  return (
    <div style={{ backgroundColor: C.bg, color: C.ink, fontFamily: "var(--font-syne)" }} className="min-h-screen overflow-x-hidden">
      <Link href="/" className="fixed top-5 left-5 z-50 text-xs uppercase tracking-widest" style={{ color: C.mid }}>← volver</Link>
      <PetalRain count={13} />

      {/* HERO con entrada 3D */}
      <section className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center text-center px-6" style={{ perspective: 1000 }}>
        <FloralCorner className="absolute -top-2 -left-2 w-36 h-36 md:w-56 md:h-56 z-0 opacity-80" color="#8f7bb3" soft="#c4aee0" />
        <FloralCorner className="absolute -top-2 -right-2 w-36 h-36 md:w-56 md:h-56 z-0 opacity-80" color="#8f7bb3" soft="#c4aee0" mirror />
        <BlurFade delay={0.1}><p className="text-[11px] uppercase tracking-[0.5em] mb-10" style={{ color: C.accent }}>Nos casamos</p></BlurFade>
        <motion.h1 initial={{ opacity: 0, rotateX: 60, y: 40 }} animate={{ opacity: 1, rotateX: 0, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-6xl md:text-8xl font-medium tracking-tight leading-[0.95]" style={{ transformStyle: "preserve-3d" }}>{wedding.groom}</motion.h1>
        <motion.span initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, type: "spring" }}
          className="text-4xl italic my-2" style={{ fontFamily: "var(--font-fraunces)", color: C.accent }}>&amp;</motion.span>
        <motion.h1 initial={{ opacity: 0, rotateX: -60, y: 40 }} animate={{ opacity: 1, rotateX: 0, y: 0 }} transition={{ delay: 0.15, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-6xl md:text-8xl font-medium tracking-tight leading-[0.95]" style={{ transformStyle: "preserve-3d" }}>{wedding.bride}</motion.h1>
        <BlurFade delay={0.6}><p className="mt-8 text-sm uppercase tracking-[0.35em]" style={{ color: C.mid }}>{wedding.dateShort} · {wedding.city}</p></BlurFade>
        <BlurFade delay={0.8}>
          <div className="mt-16 flex divide-x" style={{ borderColor: C.line }}>
            <Stat value={t.d} label="días" /><Stat value={t.h} label="hrs" /><Stat value={t.m} label="min" /><Stat value={t.s} label="seg" />
          </div>
        </BlurFade>
      </section>

      {/* Historia con tarjeta tilt */}
      <section className="py-28 px-6 border-t" style={{ borderColor: C.line }}>
        <FloralDivider className="mb-14" color="#8f7bb3" soft="#c4aee0" />
        <BlurFade><p className="text-center text-[11px] uppercase tracking-[0.35em] mb-10" style={{ color: C.accent }}>Nuestra historia</p></BlurFade>
        <div style={{ perspective: 1200 }} className="max-w-xl mx-auto">
          <TiltCard className="rounded-3xl p-12 text-center" style={{ backgroundColor: C.panel, border: `1px solid ${C.line}` }}>
            <p className="text-xl leading-relaxed font-light" style={{ color: C.mid }}>{wedding.story}</p>
          </TiltCard>
        </div>
      </section>

      {/* Eventos flip */}
      <section className="py-28 px-6 border-t" style={{ borderColor: C.line }}>
        <BlurFade><p className="text-center text-[11px] uppercase tracking-[0.35em] mb-16" style={{ color: C.accent }}>El gran día · toca para voltear</p></BlurFade>
        <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
          {[wedding.ceremony, wedding.reception].map((ev, i) => (
            <BlurFade key={ev.title} delay={i * 0.12}><FlipCard ev={ev} /></BlurFade>
          ))}
        </div>
      </section>

      {/* Padrinos con tilt */}
      <section className="py-24 px-6 border-t" style={{ borderColor: C.line }}>
        <BlurFade><p className="text-center text-[11px] uppercase tracking-[0.35em] mb-12" style={{ color: C.accent }}>Padrinos</p></BlurFade>
        <div style={{ perspective: 1200 }} className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-5">
          {wedding.godparents.map((gp, i) => (
            <BlurFade key={gp.role} delay={i * 0.08}>
              <TiltCard className="rounded-2xl p-6 text-center" style={{ backgroundColor: C.panel, border: `1px solid ${C.line}` }}>
                <p className="text-[10px] uppercase tracking-[0.3em] mb-2" style={{ color: C.faint }}>{gp.role}</p>
                <p className="text-sm font-medium">{gp.names}</p>
              </TiltCard>
            </BlurFade>
          ))}
        </div>
      </section>

      {/* Dress code */}
      <section className="py-24 px-6 border-t text-center" style={{ borderColor: C.line }}>
        <BlurFade className="max-w-sm mx-auto">
          <p className="text-[11px] uppercase tracking-[0.35em] mb-4" style={{ color: C.faint }}>Código de vestimenta</p>
          <p className="text-2xl font-medium" style={{ color: C.accent }}>{wedding.dressCode}</p>
        </BlurFade>
      </section>

      {/* RSVP */}
      <section className="py-32 px-6 border-t text-center" style={{ borderColor: C.line }}>
        <BlurFade className="max-w-md mx-auto">
          <h2 className="text-4xl font-medium tracking-tight mb-5" style={{ color: C.accent }}>¿Nos acompañas?</h2>
          <p className="mb-10 text-sm font-light" style={{ color: C.mid }}>Confirma antes del {wedding.rsvpDeadline}</p>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-block px-10 py-3.5 text-[11px] uppercase tracking-[0.3em] rounded-full text-white cursor-pointer" style={{ backgroundColor: C.accent }}>
            Confirmar asistencia
          </motion.div>
        </BlurFade>
      </section>

      <footer className="py-12 text-center border-t" style={{ borderColor: C.line }}>
        <p className="text-sm uppercase tracking-[0.3em]" style={{ color: C.faint }}>{wedding.groom} &amp; {wedding.bride} · {wedding.dateShort}</p>
      </footer>
    </div>
  );
}
