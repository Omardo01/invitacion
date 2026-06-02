"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { useRef } from "react";
import { wedding } from "@/lib/wedding";
import { BlurFade, useCountdown } from "@/components/magic";
import { PetalRain, FloralCorner, FloralDivider } from "@/components/floral";

/* ─── Parallax · capas a distintas velocidades, elegante ─── */
const C = {
  bg: "#fbfaf8", ink: "#1c1a22", mid: "#6e6a76", faint: "#a8a3ad", line: "#ebe8ee", accent: "#8f7bb3",
};

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center px-5">
      <div className="text-3xl md:text-4xl font-medium tabular-nums">{String(value).padStart(2, "0")}</div>
      <div className="text-[10px] uppercase tracking-[0.3em] mt-1.5" style={{ color: C.faint }}>{label}</div>
    </div>
  );
}

export default function Opcion21() {
  const t = useCountdown("2026-07-25T17:00:00");
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const bgY = useTransform(p, [0, 1], ["0%", "40%"]);
  const bgScale = useTransform(p, [0, 1], [1, 1.15]);
  const namesY = useTransform(p, [0, 1], ["0%", "-30%"]);
  const namesOpacity = useTransform(p, [0, 0.7], [1, 0]);
  const metaY = useTransform(p, [0, 1], ["0%", "-120%"]);

  const galRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: galP } = useScroll({ target: galRef, offset: ["start end", "end start"] });
  const colA = useTransform(galP, [0, 1], ["8%", "-8%"]);
  const colB = useTransform(galP, [0, 1], ["-10%", "10%"]);

  return (
    <div style={{ backgroundColor: C.bg, color: C.ink, fontFamily: "var(--font-syne)" }} className="min-h-screen overflow-x-hidden">
      <Link href="/" className="fixed top-5 left-5 z-50 text-xs uppercase tracking-widest" style={{ color: C.mid }}>← volver</Link>
      <PetalRain count={13} />

      {/* HERO con capas parallax */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <FloralCorner className="absolute -top-2 -left-2 w-36 h-36 md:w-56 md:h-56 z-0 opacity-80" color="#8f7bb3" soft="#c4aee0" />
        <FloralCorner className="absolute -top-2 -right-2 w-36 h-36 md:w-56 md:h-56 z-0 opacity-80" color="#8f7bb3" soft="#c4aee0" mirror />
        {/* Capa de fondo: iniciales gigantes */}
        <motion.div style={{ y: bgY, scale: bgScale }} className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="text-[60vw] font-bold leading-none" style={{ color: C.line, fontFamily: "var(--font-fraunces)" }}>
            {wedding.groom[0]}{wedding.bride[0]}
          </span>
        </motion.div>

        {/* Capa media: nombres */}
        <motion.div style={{ y: namesY, opacity: namesOpacity }} className="relative z-10 text-center">
          <p className="text-[11px] uppercase tracking-[0.5em] mb-6" style={{ color: C.accent }}>Nos casamos</p>
          <h1 className="text-6xl md:text-8xl font-medium tracking-tight leading-[0.95]">{wedding.groom}</h1>
          <span className="block text-4xl italic my-2" style={{ fontFamily: "var(--font-fraunces)", color: C.accent }}>&amp;</span>
          <h1 className="text-6xl md:text-8xl font-medium tracking-tight leading-[0.95]">{wedding.bride}</h1>
        </motion.div>

        {/* Capa frontal: meta */}
        <motion.p style={{ y: metaY }} className="absolute bottom-12 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.4em]" {...{}} >
          <span style={{ color: C.mid }}>{wedding.dateShort} · {wedding.city}</span>
        </motion.p>
      </section>

      {/* Countdown */}
      <section className="py-20 px-6 flex justify-center border-t" style={{ borderColor: C.line }}>
        <div className="flex divide-x" style={{ borderColor: C.line }}>
          <Stat value={t.d} label="días" /><Stat value={t.h} label="hrs" /><Stat value={t.m} label="min" /><Stat value={t.s} label="seg" />
        </div>
      </section>

      {/* Historia */}
      <section className="py-28 px-6 border-t" style={{ borderColor: C.line }}>
        <FloralDivider className="mb-14" color="#8f7bb3" soft="#c4aee0" />
        <BlurFade className="max-w-xl mx-auto text-center">
          <p className="text-[11px] uppercase tracking-[0.35em] mb-8" style={{ color: C.accent }}>Nuestra historia</p>
          <p className="text-xl leading-relaxed font-light" style={{ color: C.mid }}>{wedding.story}</p>
        </BlurFade>
      </section>

      {/* Galería parallax */}
      <section ref={galRef} className="py-20 px-6 border-t overflow-hidden" style={{ borderColor: C.line }}>
        <BlurFade><p className="text-center text-[11px] uppercase tracking-[0.35em] mb-12" style={{ color: C.accent }}>Momentos</p></BlurFade>
        <div className="max-w-3xl mx-auto grid grid-cols-2 gap-4">
          <motion.div style={{ y: colA }} className="space-y-4">
            {wedding.gallery.slice(0, 3).map((g, i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl flex flex-col items-center justify-center text-center p-4" style={{ backgroundColor: i % 2 ? C.line : "#f0ecf6" }}>
                <p className="text-[10px] uppercase tracking-widest" style={{ color: C.faint }}>{g.year}</p>
                <p className="text-lg italic mt-1" style={{ fontFamily: "var(--font-fraunces)" }}>{g.caption}</p>
              </div>
            ))}
          </motion.div>
          <motion.div style={{ y: colB }} className="space-y-4 pt-10">
            {wedding.gallery.slice(3, 6).map((g, i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl flex flex-col items-center justify-center text-center p-4" style={{ backgroundColor: i % 2 ? "#f0ecf6" : C.line }}>
                <p className="text-[10px] uppercase tracking-widest" style={{ color: C.faint }}>{g.year}</p>
                <p className="text-lg italic mt-1" style={{ fontFamily: "var(--font-fraunces)" }}>{g.caption}</p>
              </div>
            ))}
          </motion.div>
        </div>
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
                  className="inline-block text-[11px] uppercase tracking-[0.25em] border-b pb-0.5 transition-opacity hover:opacity-60" style={{ borderColor: C.ink }}>Ver mapa</a>
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

      {/* RSVP */}
      <section className="py-32 px-6 border-t text-center" style={{ borderColor: C.line }}>
        <BlurFade className="max-w-md mx-auto">
          <h2 className="text-4xl font-medium tracking-tight mb-5" style={{ color: C.accent }}>¿Nos acompañas?</h2>
          <p className="mb-10 text-sm font-light" style={{ color: C.mid }}>Confirma antes del {wedding.rsvpDeadline}</p>
          <div className="inline-block px-10 py-3.5 text-[11px] uppercase tracking-[0.3em] rounded-full text-white" style={{ backgroundColor: C.accent }}>Confirmar asistencia</div>
        </BlurFade>
      </section>

      <footer className="py-12 text-center border-t" style={{ borderColor: C.line }}>
        <p className="text-sm uppercase tracking-[0.3em]" style={{ color: C.faint }}>{wedding.groom} &amp; {wedding.bride} · {wedding.dateShort}</p>
      </footer>
    </div>
  );
}
