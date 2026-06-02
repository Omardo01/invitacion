"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { wedding } from "@/lib/wedding";
import { BlurFade, useCountdown } from "@/components/magic";
import { PetalRain, FloralCorner, FloralDivider } from "@/components/floral";

/* ─── Kinético · letras que entran una a una + palabra rotativa ─── */
const C = {
  bg: "#f7f5fb", panel: "#ffffff", ink: "#2a2440", mid: "#6d6685", faint: "#a8a1bd", line: "#e8e3f1", accent: "#8f7bb3",
};

function LetterReveal({ text, delay = 0, className = "", style = {} }: { text: string; delay?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <span className={className} style={style} aria-label={text}>
      {[...text].map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block"
          initial={{ opacity: 0, y: "0.45em", filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: delay + i * 0.045, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {ch === " " ? " " : ch}
        </motion.span>
      ))}
    </span>
  );
}

function RotatingWord({ words }: { words: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % words.length), 2400);
    return () => clearInterval(id);
  }, [words.length]);
  return (
    <span className="relative inline-block align-bottom" style={{ minWidth: "5ch" }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          initial={{ opacity: 0, y: "0.5em", filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: "-0.5em", filter: "blur(6px)" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block italic"
          style={{ fontFamily: "var(--font-fraunces)", color: C.accent }}
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
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

export default function Opcion24() {
  const t = useCountdown("2026-07-25T17:00:00");

  return (
    <div style={{ backgroundColor: C.bg, color: C.ink, fontFamily: "var(--font-syne)" }} className="min-h-screen overflow-x-hidden">
      <Link href="/" className="fixed top-5 left-5 z-50 text-xs uppercase tracking-widest" style={{ color: C.mid }}>← volver</Link>
      <PetalRain count={16} colors={["#d9c7ef", "#e8d5f0", "#cbb6e6", "#f0ecf6", "#c4aee0"]} />

      {/* HERO con letras escalonadas */}
      <section className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center text-center px-6">
        <FloralCorner className="absolute -top-2 -left-2 w-36 h-36 md:w-56 md:h-56 z-0 opacity-80" color="#8f7bb3" soft="#cbb6e6" />
        <FloralCorner className="absolute -top-2 -right-2 w-36 h-36 md:w-56 md:h-56 z-0 opacity-80" color="#8f7bb3" soft="#cbb6e6" mirror />
        <FloralCorner className="absolute -bottom-2 -left-2 w-32 h-32 md:w-48 md:h-48 z-0 opacity-60 rotate-180" color="#8f7bb3" soft="#cbb6e6" mirror />
        <FloralCorner className="absolute -bottom-2 -right-2 w-32 h-32 md:w-48 md:h-48 z-0 opacity-60 rotate-180" color="#8f7bb3" soft="#cbb6e6" />
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-[11px] uppercase tracking-[0.5em] mb-10" style={{ color: C.accent }}>Nos casamos</motion.p>

        <h1 className="text-6xl md:text-8xl font-medium tracking-tight leading-[0.95]">
          <LetterReveal text={wedding.groom} delay={0.3} />
        </h1>
        <motion.span initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7, type: "spring" }}
          className="block text-4xl italic my-2" style={{ fontFamily: "var(--font-fraunces)", color: C.accent }}>&amp;</motion.span>
        <h1 className="text-6xl md:text-8xl font-medium tracking-tight leading-[0.95]">
          <LetterReveal text={wedding.bride} delay={0.9} />
        </h1>

        <BlurFade delay={1.4}><p className="mt-8 text-sm uppercase tracking-[0.35em]" style={{ color: C.mid }}>{wedding.dateShort} · {wedding.city}</p></BlurFade>
        <BlurFade delay={1.6}>
          <div className="mt-16 flex divide-x" style={{ borderColor: C.line }}>
            <Stat value={t.d} label="días" /><Stat value={t.h} label="hrs" /><Stat value={t.m} label="min" /><Stat value={t.s} label="seg" />
          </div>
        </BlurFade>
      </section>

      {/* Frase con palabra rotativa */}
      <section className="py-28 px-6 border-t text-center" style={{ borderColor: C.line }}>
        <BlurFade>
          <p className="text-3xl md:text-5xl font-light tracking-tight leading-tight max-w-2xl mx-auto">
            Un día para celebrar el <RotatingWord words={["amor", "para siempre", "nosotros", "comienzo"]} />
          </p>
        </BlurFade>
      </section>

      {/* Historia */}
      <section className="py-24 px-6 border-t" style={{ borderColor: C.line }}>
        <FloralDivider className="mb-14" color="#8f7bb3" soft="#cbb6e6" />
        <BlurFade className="max-w-xl mx-auto text-center">
          <p className="text-[11px] uppercase tracking-[0.35em] mb-8" style={{ color: C.accent }}>Nuestra historia</p>
          <p className="text-xl leading-relaxed font-light" style={{ color: C.mid }}>{wedding.story}</p>
        </BlurFade>
      </section>

      {/* Eventos */}
      <section className="py-28 px-6 border-t" style={{ borderColor: C.line }}>
        <BlurFade><p className="text-center text-[11px] uppercase tracking-[0.35em] mb-16" style={{ color: C.accent }}>El gran día</p></BlurFade>
        <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
          {[wedding.ceremony, wedding.reception].map((ev, i) => (
            <BlurFade key={ev.title} delay={i * 0.12}>
              <div className="p-9 text-center h-full rounded-2xl" style={{ backgroundColor: C.panel, border: `1px solid ${C.line}` }}>
                <p className="text-[10px] uppercase tracking-[0.3em] mb-3" style={{ color: C.faint }}>{ev.title}</p>
                <p className="text-5xl font-medium mb-3 tracking-tight" style={{ color: C.accent }}>{ev.time}</p>
                <p className="text-base font-medium mb-1">{ev.place}</p>
                <p className="text-sm mb-6" style={{ color: C.mid }}>{ev.address}</p>
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
          <h2 className="text-4xl font-medium tracking-tight mb-5" style={{ color: C.accent }}>
            <LetterReveal text="¿Nos acompañas?" />
          </h2>
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
