"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { wedding } from "@/lib/wedding";

/* ─── Lila Etéreo · glassmorphism + shimmer ─── */
const C = {
  bg: "#f6f3fb",
  bg2: "#efe9f7",
  fg: "#2e2440",
  fgMid: "#6b5f82",
  lila: "#b794d4",
  lilaDeep: "#8a5fb0",
  plata: "#c9c6d6",
  plataLight: "#e8e6f0",
  white: "#ffffff",
};

function Orb({ size, x, y, color, delay }: { size: number; x: string; y: string; color: string; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none blur-3xl"
      style={{ width: size, height: size, left: x, top: y, backgroundColor: color, opacity: 0.4 }}
      animate={{ y: [0, -30, 0], x: [0, 20, 0], scale: [1, 1.1, 1] }}
      transition={{ duration: 8 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

function Countdown({ target }: { target: string }) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const u = () => { const s = Math.max(0, Math.floor((new Date(target).getTime() - Date.now()) / 1000)); setT({ d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 }); };
    u(); const id = setInterval(u, 1000); return () => clearInterval(id);
  }, [target]);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="flex gap-4 justify-center">
      {[["d", "días"], ["h", "hrs"], ["m", "min"], ["s", "seg"]].map(([k, lbl]) => (
        <div key={k} className="text-center rounded-2xl px-5 py-3 backdrop-blur-xl"
          style={{ backgroundColor: "rgba(255,255,255,0.55)", border: `1px solid ${C.plataLight}`, boxShadow: "0 8px 32px rgba(138,95,176,0.12)" }}>
          <div className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "var(--font-display)", color: C.lilaDeep }}>{pad(t[k as keyof typeof t])}</div>
          <div className="text-[9px] uppercase tracking-[0.3em] mt-1" style={{ color: C.fgMid }}>{lbl}</div>
        </div>
      ))}
    </div>
  );
}

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl backdrop-blur-xl ${className}`}
      style={{ backgroundColor: "rgba(255,255,255,0.6)", border: `1px solid ${C.plataLight}`, boxShadow: "0 12px 40px rgba(138,95,176,0.1)" }}>
      {children}
    </div>
  );
}

export default function Opcion11() {
  return (
    <div className="min-h-screen overflow-x-hidden relative"
      style={{ background: `linear-gradient(160deg, ${C.bg} 0%, ${C.bg2} 50%, ${C.bg} 100%)`, color: C.fg, fontFamily: "var(--font-serif)" }}>

      {/* Floating orbs background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <Orb size={400} x="-10%" y="5%" color={C.lila} delay={0} />
        <Orb size={300} x="70%" y="20%" color={C.plata} delay={2} />
        <Orb size={350} x="20%" y="60%" color={C.lilaDeep} delay={4} />
        <Orb size={250} x="75%" y="70%" color={C.lila} delay={1} />
      </div>

      <Link href="/" className="fixed top-4 left-4 z-50 text-xs uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-xl"
        style={{ backgroundColor: "rgba(255,255,255,0.6)", border: `1px solid ${C.plataLight}`, color: C.fgMid }}>
        ← volver
      </Link>

      <div className="relative z-10">
        {/* HERO */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-28">
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}
            className="mb-8 text-4xl">✦</motion.div>

          <motion.p initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-xs uppercase tracking-[0.5em] mb-8" style={{ color: C.lilaDeep }}>
            Nos casamos
          </motion.p>

          <motion.h1 initial={{ opacity: 0, y: 30, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: 0.3, duration: 1 }}
            className="text-7xl md:text-[9rem] leading-[0.82] italic"
            style={{ fontFamily: "var(--font-display)", background: `linear-gradient(135deg, ${C.fg}, ${C.lilaDeep})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {wedding.groom}
          </motion.h1>

          <motion.span initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, type: "spring" }}
            className="text-6xl my-2" style={{ fontFamily: "var(--font-script)", color: C.lila }}>&amp;</motion.span>

          <motion.h1 initial={{ opacity: 0, y: 30, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: 0.45, duration: 1 }}
            className="text-7xl md:text-[9rem] leading-[0.82] italic"
            style={{ fontFamily: "var(--font-display)", background: `linear-gradient(135deg, ${C.lilaDeep}, ${C.fg})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {wedding.bride}
          </motion.h1>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="mt-10 space-y-2">
            <p className="text-xs uppercase tracking-[0.4em]" style={{ color: C.fgMid }}>{wedding.city}</p>
            <p className="text-3xl" style={{ fontFamily: "var(--font-script)", color: C.lilaDeep }}>{wedding.dateLabel} · 2026</p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="mt-12">
            <Countdown target="2026-07-25T17:00:00" />
          </motion.div>

          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-8 text-xs uppercase tracking-widest" style={{ color: C.fgMid }}>↓ scroll</motion.div>
        </section>

        {/* Historia */}
        <section className="py-20 px-6">
          <GlassCard className="max-w-2xl mx-auto p-10 text-center">
            <p className="text-xs uppercase tracking-[0.4em] mb-5" style={{ color: C.lilaDeep }}>Nuestra historia</p>
            <p className="text-lg leading-relaxed" style={{ color: C.fgMid }}>{wedding.story}</p>
          </GlassCard>
        </section>

        {/* Eventos */}
        <section className="py-16 px-6">
          <p className="text-center text-xs uppercase tracking-[0.4em] mb-12" style={{ color: C.lilaDeep }}>El gran día</p>
          <div className="max-w-2xl mx-auto grid md:grid-cols-2 gap-6">
            {[wedding.ceremony, wedding.reception].map((ev, i) => (
              <motion.div key={ev.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                <GlassCard className="p-7 text-center h-full">
                  <p className="text-xs uppercase tracking-widest mb-2" style={{ color: C.lilaDeep }}>{ev.title}</p>
                  <p className="text-5xl font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: C.lila }}>{ev.time}</p>
                  <p className="text-lg font-semibold mb-1">{ev.place}</p>
                  <p className="text-sm mb-5" style={{ color: C.fgMid }}>{ev.address}</p>
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(ev.mapsQuery)}`} target="_blank" rel="noopener noreferrer"
                    className="inline-block text-xs uppercase tracking-widest px-6 py-2.5 rounded-full text-white transition-transform hover:scale-105"
                    style={{ background: `linear-gradient(135deg, ${C.lila}, ${C.lilaDeep})` }}>
                    Ver mapa
                  </a>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Dress code */}
        <section className="py-16 px-6">
          <GlassCard className="max-w-sm mx-auto p-8 text-center">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: C.lilaDeep }}>Código de vestimenta</p>
            <p className="text-2xl font-semibold italic" style={{ fontFamily: "var(--font-display)" }}>{wedding.dressCode}</p>
            <div className="flex justify-center gap-2 mt-4">
              {[C.white, C.plataLight, C.lila, C.lilaDeep].map((c) => (
                <span key={c} className="w-6 h-6 rounded-full" style={{ backgroundColor: c, border: `1px solid ${C.plata}` }} />
              ))}
            </div>
          </GlassCard>
        </section>

        {/* Regalos */}
        <section className="py-16 px-6">
          <GlassCard className="max-w-lg mx-auto p-10 text-center">
            <div className="text-3xl mb-3">🎁</div>
            <p className="text-xs uppercase tracking-[0.4em] mb-3" style={{ color: C.lilaDeep }}>Mesa de regalos</p>
            <p className="italic text-sm mb-8" style={{ color: C.fgMid }}>Tu presencia es nuestro mayor regalo</p>
            <div className="space-y-3">
              {wedding.gifts.map((g) => (
                <a key={g.store} href={g.url} target="_blank" rel="noopener noreferrer"
                  className="flex justify-between items-center px-5 py-3.5 rounded-2xl transition-transform hover:scale-[1.02]"
                  style={{ backgroundColor: "rgba(255,255,255,0.7)", border: `1px solid ${C.plataLight}` }}>
                  <span className="font-semibold text-sm">{g.store}</span>
                  <span className="text-xs uppercase tracking-widest" style={{ color: C.lilaDeep }}>{g.code} →</span>
                </a>
              ))}
            </div>
          </GlassCard>
        </section>

        {/* RSVP */}
        <section className="py-24 px-6">
          <GlassCard className="max-w-md mx-auto p-10 text-center">
            <div className="text-4xl mb-4">✦</div>
            <h2 className="text-5xl italic mb-4" style={{ fontFamily: "var(--font-display)", color: C.lilaDeep }}>¿Vienes?</h2>
            <p className="mb-8 text-sm" style={{ color: C.fgMid }}>Confirma antes del <strong style={{ color: C.lilaDeep }}>{wedding.rsvpDeadline}</strong></p>
            <div className="inline-block px-8 py-3 rounded-full text-white text-sm uppercase tracking-widest"
              style={{ background: `linear-gradient(135deg, ${C.lila}, ${C.lilaDeep})` }}>
              Confirmar asistencia
            </div>
            <p className="mt-5 text-xs" style={{ color: C.fgMid }}>Tu invitación personalizada tiene tu link de confirmación</p>
          </GlassCard>
        </section>

        <footer className="py-12 text-center">
          <p className="text-3xl mb-2" style={{ fontFamily: "var(--font-script)", color: C.lilaDeep }}>{wedding.groom} &amp; {wedding.bride}</p>
          <p className="text-[10px] uppercase tracking-[0.5em]" style={{ color: C.fgMid }}>{wedding.dateShort}</p>
        </footer>
      </div>
    </div>
  );
}
