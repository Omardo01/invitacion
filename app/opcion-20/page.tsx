"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring, useMotionTemplate } from "motion/react";
import { useState, type ReactNode } from "react";
import confetti from "canvas-confetti";
import { wedding } from "@/lib/wedding";
import { BlurFade, useCountdown } from "@/components/magic";

/* ─── Spotlight · oscuro mate que se vuelve claro y alegre al confirmar ─── */
const dark = {
  bg: "#0e0d12", panel: "#16151c", fg: "#f3f1f7", mid: "#9b96a8", faint: "#615c70", line: "#23212c", accent: "#b9a3e0", glow: "rgba(185,163,224,0.14)",
};
const light = {
  bg: "#faf7ff", panel: "#ffffff", fg: "#241d33", mid: "#6f6880", faint: "#aaa3bb", line: "#ece7f3", accent: "#8a5fb0", glow: "rgba(160,120,210,0.18)",
};

function Magnetic({ children, className = "", strength = 0.4 }: { children: ReactNode; className?: string; strength?: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 14 });
  const sy = useSpring(y, { stiffness: 180, damping: 14 });
  return (
    <motion.div
      style={{ x: sx, y: sy }}
      className={className}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center px-5">
      <div className="text-3xl md:text-4xl font-light tabular-nums" style={{ color: "var(--fg)" }}>{String(value).padStart(2, "0")}</div>
      <div className="text-[10px] uppercase tracking-[0.3em] mt-1.5" style={{ color: "var(--faint)" }}>{label}</div>
    </div>
  );
}

export default function Opcion20() {
  const t = useCountdown("2026-07-25T17:00:00");
  const [confirmed, setConfirmed] = useState<null | boolean>(null);
  const c = confirmed === true ? light : dark;

  const mx = useMotionValue(-400);
  const my = useMotionValue(-400);
  const bg = useMotionTemplate`radial-gradient(550px circle at ${mx}px ${my}px, ${c.glow}, transparent 65%)`;

  const cssVars = {
    "--bg": c.bg, "--panel": c.panel, "--fg": c.fg, "--mid": c.mid,
    "--faint": c.faint, "--line": c.line, "--accent": c.accent,
  } as unknown as React.CSSProperties;

  const celebrate = () => {
    setConfirmed(true);
    const end = Date.now() + 1300;
    const colors = ["#b9a3e0", "#8a5fb0", "#e8d5f0", "#d9c7ef", "#ffffff"];
    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0, y: 0.65 }, colors, scalar: 0.9 });
      confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1, y: 0.65 }, colors, scalar: 0.9 });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };

  return (
    <div
      style={cssVars}
      onMouseMove={(e) => { mx.set(e.clientX); my.set(e.clientY); }}
      className="theme20 min-h-screen relative overflow-x-hidden"
    >
      <style>{`.theme20, .theme20 *{ transition: background-color .7s ease, color .7s ease, border-color .7s ease, box-shadow .7s ease; }`}</style>

      <div className="min-h-screen" style={{ backgroundColor: "var(--bg)", color: "var(--fg)", fontFamily: "var(--font-syne)" }}>
        {/* Spotlight que sigue el cursor */}
        <motion.div className="fixed inset-0 pointer-events-none z-0" style={{ background: bg }} />

        <Link href="/" className="fixed top-5 left-5 z-50 text-xs uppercase tracking-widest" style={{ color: "var(--mid)" }}>← volver</Link>

        <div className="relative z-10">
          {/* HERO */}
          <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
            <BlurFade delay={0.1}><p className="text-[11px] uppercase tracking-[0.5em] mb-12" style={{ color: "var(--accent)" }}>Nos casamos</p></BlurFade>
            <BlurFade delay={0.2} y={28}>
              <h1 className="text-6xl md:text-8xl font-light tracking-tight leading-[1.05]">
                {wedding.groom}<span style={{ color: "var(--faint)" }}> &amp; </span>{wedding.bride}
              </h1>
            </BlurFade>
            <BlurFade delay={0.4}>
              <p className="mt-8 text-sm uppercase tracking-[0.35em]" style={{ color: "var(--mid)" }}>{wedding.dateShort} · {wedding.city}</p>
            </BlurFade>
            <BlurFade delay={0.6}>
              <div className="mt-16 flex divide-x" style={{ borderColor: "var(--line)" }}>
                <Stat value={t.d} label="días" /><Stat value={t.h} label="hrs" /><Stat value={t.m} label="min" /><Stat value={t.s} label="seg" />
              </div>
            </BlurFade>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-8 text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--faint)" }}>↓</motion.div>
          </section>

          {/* Historia */}
          <section className="py-28 px-6 border-t" style={{ borderColor: "var(--line)" }}>
            <BlurFade className="max-w-xl mx-auto text-center">
              <p className="text-[11px] uppercase tracking-[0.35em] mb-8" style={{ color: "var(--accent)" }}>Nuestra historia</p>
              <p className="text-xl leading-relaxed font-light" style={{ color: "var(--mid)" }}>{wedding.story}</p>
            </BlurFade>
          </section>

          {/* Eventos */}
          <section className="py-28 px-6 border-t" style={{ borderColor: "var(--line)" }}>
            <BlurFade><p className="text-center text-[11px] uppercase tracking-[0.35em] mb-16" style={{ color: "var(--accent)" }}>El gran día</p></BlurFade>
            <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
              {[wedding.ceremony, wedding.reception].map((ev, i) => (
                <BlurFade key={ev.title} delay={i * 0.12}>
                  <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 200, damping: 18 }}
                    className="p-9 text-center h-full rounded-2xl" style={{ backgroundColor: "var(--panel)", border: "1px solid var(--line)" }}>
                    <p className="text-[10px] uppercase tracking-[0.3em] mb-3" style={{ color: "var(--faint)" }}>{ev.title}</p>
                    <p className="text-5xl font-light mb-3 tracking-tight" style={{ color: "var(--accent)" }}>{ev.time}</p>
                    <p className="text-base font-medium mb-1">{ev.place}</p>
                    <p className="text-sm mb-6" style={{ color: "var(--mid)" }}>{ev.address}</p>
                    <a href={`https://maps.google.com/?q=${encodeURIComponent(ev.mapsQuery)}`} target="_blank" rel="noopener noreferrer"
                      className="inline-block text-[11px] uppercase tracking-[0.25em] border-b pb-0.5 transition-opacity hover:opacity-60" style={{ borderColor: "var(--fg)" }}>Ver mapa</a>
                  </motion.div>
                </BlurFade>
              ))}
            </div>
          </section>

          {/* Dress code */}
          <section className="py-24 px-6 border-t text-center" style={{ borderColor: "var(--line)" }}>
            <BlurFade className="max-w-sm mx-auto">
              <p className="text-[11px] uppercase tracking-[0.35em] mb-4" style={{ color: "var(--faint)" }}>Código de vestimenta</p>
              <p className="text-2xl font-light" style={{ color: "var(--accent)" }}>{wedding.dressCode}</p>
            </BlurFade>
          </section>

          {/* Regalos */}
          <section className="py-24 px-6 border-t" style={{ borderColor: "var(--line)" }}>
            <BlurFade className="max-w-md mx-auto text-center">
              <p className="text-[11px] uppercase tracking-[0.35em] mb-3" style={{ color: "var(--accent)" }}>Mesa de regalos</p>
              <p className="text-sm font-light mb-10" style={{ color: "var(--mid)" }}>Tu presencia es nuestro mayor regalo</p>
              <div className="divide-y" style={{ borderColor: "var(--line)" }}>
                {wedding.gifts.map((g) => (
                  <a key={g.store} href={g.url} target="_blank" rel="noopener noreferrer" className="flex justify-between items-center py-4 transition-opacity hover:opacity-60">
                    <span className="font-medium text-sm">{g.store}</span>
                    <span className="text-xs uppercase tracking-widest" style={{ color: "var(--faint)" }}>{g.code} →</span>
                  </a>
                ))}
              </div>
            </BlurFade>
          </section>

          {/* RSVP — transforma el tema al confirmar */}
          <section className="py-32 px-6 border-t text-center" style={{ borderColor: "var(--line)" }}>
            <div className="max-w-md mx-auto min-h-[260px] flex flex-col items-center justify-center">
              {confirmed === null && (
                <BlurFade>
                  <h2 className="text-4xl font-light tracking-tight mb-5" style={{ color: "var(--accent)" }}>¿Nos acompañas?</h2>
                  <p className="mb-12 text-sm font-light" style={{ color: "var(--mid)" }}>Confirma antes del {wedding.rsvpDeadline}</p>
                  <Magnetic className="inline-block">
                    <button onClick={celebrate} className="px-12 py-4 text-[11px] uppercase tracking-[0.3em] rounded-full font-medium" style={{ backgroundColor: "var(--accent)", color: "var(--bg)" }}>
                      ¡Asistiré! 🎉
                    </button>
                  </Magnetic>
                  <button onClick={() => setConfirmed(false)} className="block mx-auto mt-6 text-xs hover:opacity-70 transition-opacity" style={{ color: "var(--faint)" }}>
                    No podré asistir
                  </button>
                </BlurFade>
              )}

              {confirmed === true && (
                <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                  <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }} className="text-6xl mb-4">🥂</motion.div>
                  <h2 className="text-5xl font-light tracking-tight mb-4" style={{ color: "var(--accent)" }}>¡Qué alegría!</h2>
                  <p className="text-lg font-light mb-2" style={{ color: "var(--fg)" }}>Tu asistencia está confirmada.</p>
                  <p className="text-sm" style={{ color: "var(--mid)" }}>Nos vemos el {wedding.dateLabel} ✨</p>
                  <button onClick={() => setConfirmed(null)} className="mt-8 text-xs underline hover:opacity-70 transition-opacity" style={{ color: "var(--faint)" }}>
                    Cambiar respuesta
                  </button>
                </motion.div>
              )}

              {confirmed === false && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                  <div className="text-5xl mb-4">🌙</div>
                  <h2 className="text-4xl font-light tracking-tight mb-3" style={{ color: "var(--accent)" }}>Te vamos a extrañar</h2>
                  <p className="text-sm font-light" style={{ color: "var(--mid)" }}>Gracias por avisarnos. ¡Te mandamos un abrazo!</p>
                  <button onClick={() => setConfirmed(null)} className="mt-8 text-xs underline hover:opacity-70 transition-opacity" style={{ color: "var(--faint)" }}>
                    Cambiar respuesta
                  </button>
                </motion.div>
              )}
            </div>
          </section>

          <footer className="py-12 text-center border-t" style={{ borderColor: "var(--line)" }}>
            <p className="text-sm uppercase tracking-[0.3em]" style={{ color: "var(--faint)" }}>{wedding.groom} &amp; {wedding.bride} · {wedding.dateShort}</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
