"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { useRef } from "react";
import { wedding } from "@/lib/wedding";
import { BlurFade, useCountdown } from "@/components/magic";

/* ─── Cinemático · tipografía dirigida por scroll ─── */
const C = {
  bg: "#fdfcfb", ink: "#17151c", mid: "#6f6a78", faint: "#a7a2b0", line: "#eceaef", accent: "#8f7bb3",
};

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center px-5">
      <div className="text-3xl md:text-4xl font-medium tabular-nums">{String(value).padStart(2, "0")}</div>
      <div className="text-[10px] uppercase tracking-[0.3em] mt-1.5" style={{ color: C.faint }}>{label}</div>
    </div>
  );
}

export default function Opcion17() {
  const t = useCountdown("2026-07-25T17:00:00");
  const wrap = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 30, restDelta: 0.001 });

  const groomX = useTransform(p, [0, 0.5], ["-26vw", "0vw"]);
  const brideX = useTransform(p, [0, 0.5], ["26vw", "0vw"]);
  const namesScale = useTransform(p, [0, 0.5], [1.12, 1]);
  const ampO = useTransform(p, [0.32, 0.55], [0, 1]);
  const ampScale = useTransform(p, [0.32, 0.55], [0.5, 1]);
  const metaO = useTransform(p, [0.6, 0.85], [0, 1]);
  const metaY = useTransform(p, [0.6, 0.85], [30, 0]);
  const hintO = useTransform(p, [0, 0.12], [1, 0]);

  return (
    <div style={{ backgroundColor: C.bg, color: C.ink, fontFamily: "var(--font-syne)" }} className="min-h-screen">
      <Link href="/" className="fixed top-5 left-5 z-50 text-xs uppercase tracking-widest" style={{ color: C.mid }}>← volver</Link>

      {/* HERO scroll-driven */}
      <section ref={wrap} style={{ height: "280vh" }} className="relative">
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden px-6">
          <motion.div style={{ scale: namesScale }} className="flex flex-col items-center leading-[0.82]">
            <motion.h1 style={{ x: groomX }} className="text-[17vw] md:text-[12vw] font-medium tracking-tight">{wedding.groom}</motion.h1>
            <motion.span style={{ opacity: ampO, scale: ampScale, color: C.accent }} className="text-[7vw] md:text-[4vw] italic my-1">&amp;</motion.span>
            <motion.h1 style={{ x: brideX }} className="text-[17vw] md:text-[12vw] font-medium tracking-tight">{wedding.bride}</motion.h1>
          </motion.div>
          <motion.p style={{ opacity: metaO, y: metaY, color: C.mid }} className="mt-10 text-xs uppercase tracking-[0.4em]">
            {wedding.dateShort} · {wedding.city}
          </motion.p>
          <motion.div style={{ opacity: hintO, color: C.faint }} className="absolute bottom-10 text-[10px] uppercase tracking-[0.3em]">
            scroll para descubrir ↓
          </motion.div>
        </div>
      </section>

      {/* Countdown */}
      <section className="py-20 px-6 border-t flex justify-center" style={{ borderColor: C.line }}>
        <div className="flex divide-x" style={{ borderColor: C.line }}>
          <Stat value={t.d} label="días" /><Stat value={t.h} label="hrs" /><Stat value={t.m} label="min" /><Stat value={t.s} label="seg" />
        </div>
      </section>

      {/* Historia */}
      <section className="py-28 px-6 border-t" style={{ borderColor: C.line }}>
        <BlurFade className="max-w-xl mx-auto text-center">
          <p className="text-[11px] uppercase tracking-[0.35em] mb-8" style={{ color: C.accent }}>Nuestra historia</p>
          <p className="text-xl leading-relaxed font-light" style={{ color: C.mid }}>{wedding.story}</p>
        </BlurFade>
      </section>

      {/* Eventos */}
      <section className="py-28 px-6 border-t" style={{ borderColor: C.line }}>
        <BlurFade><p className="text-center text-[11px] uppercase tracking-[0.35em] mb-16" style={{ color: C.accent }}>El gran día</p></BlurFade>
        <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-px" style={{ backgroundColor: C.line }}>
          {[wedding.ceremony, wedding.reception].map((ev, i) => (
            <BlurFade key={ev.title} delay={i * 0.12}>
              <div className="p-10 text-center h-full" style={{ backgroundColor: C.bg }}>
                <p className="text-[10px] uppercase tracking-[0.3em] mb-4" style={{ color: C.faint }}>{ev.title}</p>
                <p className="text-5xl font-medium mb-4 tracking-tight" style={{ color: C.accent }}>{ev.time}</p>
                <p className="text-base font-medium mb-1">{ev.place}</p>
                <p className="text-sm mb-7 font-light" style={{ color: C.mid }}>{ev.address}</p>
                <a href={`https://maps.google.com/?q=${encodeURIComponent(ev.mapsQuery)}`} target="_blank" rel="noopener noreferrer"
                  className="inline-block text-[11px] uppercase tracking-[0.25em] border-b pb-0.5 transition-opacity hover:opacity-60" style={{ borderColor: C.ink }}>
                  Ver mapa
                </a>
              </div>
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

      {/* Regalos */}
      <section className="py-24 px-6 border-t" style={{ borderColor: C.line }}>
        <BlurFade className="max-w-md mx-auto text-center">
          <p className="text-[11px] uppercase tracking-[0.35em] mb-3" style={{ color: C.accent }}>Mesa de regalos</p>
          <p className="text-sm font-light mb-10" style={{ color: C.mid }}>Tu presencia es nuestro mayor regalo</p>
          <div className="divide-y" style={{ borderColor: C.line }}>
            {wedding.gifts.map((g) => (
              <a key={g.store} href={g.url} target="_blank" rel="noopener noreferrer" className="flex justify-between items-center py-4 transition-opacity hover:opacity-60">
                <span className="font-medium text-sm">{g.store}</span>
                <span className="text-xs uppercase tracking-widest" style={{ color: C.faint }}>{g.code} →</span>
              </a>
            ))}
          </div>
        </BlurFade>
      </section>

      {/* RSVP */}
      <section className="py-32 px-6 border-t text-center" style={{ borderColor: C.line }}>
        <BlurFade className="max-w-md mx-auto">
          <h2 className="text-4xl font-medium tracking-tight mb-5" style={{ color: C.accent }}>¿Nos acompañas?</h2>
          <p className="mb-10 text-sm font-light" style={{ color: C.mid }}>Confirma antes del {wedding.rsvpDeadline}</p>
          <div className="inline-block px-10 py-3.5 text-[11px] uppercase tracking-[0.3em] rounded-full text-white" style={{ backgroundColor: C.accent }}>Confirmar asistencia</div>
          <p className="mt-6 text-xs font-light" style={{ color: C.faint }}>Tu invitación personalizada tiene tu link de confirmación</p>
        </BlurFade>
      </section>

      <footer className="py-12 text-center border-t" style={{ borderColor: C.line }}>
        <p className="text-sm uppercase tracking-[0.3em]" style={{ color: C.faint }}>{wedding.groom} &amp; {wedding.bride} · {wedding.dateShort}</p>
      </footer>
    </div>
  );
}
