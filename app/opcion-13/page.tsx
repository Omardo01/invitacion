"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { wedding } from "@/lib/wedding";

/* ─── Lavanda Romántica · blanco perla, lavanda suave, plata, floral ─── */
const C = {
  bg: "#fdfcff",
  bg2: "#f4f0fa",
  fg: "#3a3050",
  fgMid: "#7a6f95",
  lavanda: "#c4aee0",
  lavandaDeep: "#9b7ec4",
  plata: "#cfcadd",
  plataLight: "#e9e5f2",
  rosa: "#e8d5f0",
};

function Sprig({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 100 200" className={className} fill="none" style={{ transform: flip ? "scaleX(-1)" : undefined }}>
      {/* tallo */}
      <path d="M50,200 Q45,120 50,40" stroke={C.lavandaDeep} strokeWidth="1.5" opacity="0.5" />
      {/* florecitas lavanda */}
      {[50, 75, 100, 125, 150, 175].map((y, i) => (
        <g key={y}>
          <ellipse cx={i % 2 === 0 ? 38 : 62} cy={y} rx="7" ry="11" fill={C.lavanda} opacity="0.8" style={{ transformOrigin: `${i % 2 === 0 ? 38 : 62}px ${y}px`, transform: `rotate(${i % 2 === 0 ? -25 : 25}deg)` }} />
          <circle cx={i % 2 === 0 ? 38 : 62} cy={y} r="3" fill={C.lavandaDeep} opacity="0.6" />
        </g>
      ))}
      {/* hojas */}
      <ellipse cx="42" cy="90" rx="5" ry="16" fill={C.plata} opacity="0.5" style={{ transformOrigin: "42px 90px", transform: "rotate(-40deg)" }} />
      <ellipse cx="58" cy="130" rx="5" ry="16" fill={C.plata} opacity="0.5" style={{ transformOrigin: "58px 130px", transform: "rotate(40deg)" }} />
    </svg>
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
        <div key={k} className="text-center w-16 h-20 rounded-full flex flex-col items-center justify-center"
          style={{ border: `1px solid ${C.lavanda}`, backgroundColor: C.bg }}>
          <div className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: C.lavandaDeep }}>{pad(t[k as keyof typeof t])}</div>
          <div className="text-[8px] uppercase tracking-[0.2em] mt-0.5" style={{ color: C.fgMid }}>{lbl}</div>
        </div>
      ))}
    </div>
  );
}

export default function Opcion13() {
  return (
    <div className="min-h-screen overflow-x-hidden relative"
      style={{ backgroundColor: C.bg, color: C.fg, fontFamily: "var(--font-serif)" }}>

      <Link href="/" className="fixed top-4 left-4 z-50 text-xs uppercase tracking-widest px-3 py-1.5 rounded-full"
        style={{ backgroundColor: `${C.bg}dd`, border: `1px solid ${C.plataLight}`, color: C.fgMid }}>
        ← volver
      </Link>

      {/* HERO */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-28 relative overflow-hidden">
        {/* Sprigs decorativos */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 0.9, y: 0 }} transition={{ duration: 1.2 }}
          className="absolute top-0 left-0 w-28 md:w-40"><Sprig /></motion.div>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 0.9, y: 0 }} transition={{ duration: 1.2 }}
          className="absolute top-0 right-0 w-28 md:w-40"><Sprig flip /></motion.div>

        <motion.p initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="text-xs uppercase tracking-[0.5em] mb-6" style={{ color: C.lavandaDeep }}>Nuestra boda</motion.p>

        <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 1 }}
          className="text-7xl md:text-9xl leading-[0.9]" style={{ fontFamily: "var(--font-great-vibes)", color: C.lavandaDeep }}>
          {wedding.groom}
        </motion.h1>

        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="text-5xl my-1" style={{ fontFamily: "var(--font-great-vibes)", color: C.lavanda }}>&amp;</motion.span>

        <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 1 }}
          className="text-7xl md:text-9xl leading-[0.9]" style={{ fontFamily: "var(--font-great-vibes)", color: C.lavandaDeep }}>
          {wedding.bride}
        </motion.h1>

        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.8, duration: 0.8 }}
          className="my-8 h-px w-40" style={{ background: `linear-gradient(to right, transparent, ${C.lavanda}, transparent)` }} />

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="space-y-2">
          <p className="text-xs uppercase tracking-[0.4em]" style={{ color: C.fgMid }}>{wedding.city}</p>
          <p className="text-2xl tracking-wide" style={{ fontFamily: "var(--font-display)", color: C.fg }}>{wedding.dateLabel} · 2026</p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mt-12">
          <Countdown target="2026-07-25T17:00:00" />
        </motion.div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 text-xs uppercase tracking-widest" style={{ color: C.fgMid }}>↓</motion.div>
      </section>

      {/* Historia */}
      <section className="py-20 px-6" style={{ backgroundColor: C.bg2 }}>
        <div className="max-w-2xl mx-auto text-center relative">
          <p className="text-xs uppercase tracking-[0.4em] mb-5" style={{ color: C.lavandaDeep }}>Nuestra historia</p>
          <p className="text-lg leading-relaxed italic" style={{ color: C.fgMid, fontFamily: "var(--font-display)" }}>{wedding.story}</p>
        </div>
      </section>

      {/* Eventos */}
      <section className="py-20 px-6">
        <p className="text-center text-xs uppercase tracking-[0.4em] mb-12" style={{ color: C.lavandaDeep }}>El gran día</p>
        <div className="max-w-2xl mx-auto grid md:grid-cols-2 gap-6">
          {[wedding.ceremony, wedding.reception].map((ev, i) => (
            <motion.div key={ev.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              className="rounded-3xl p-8 text-center relative overflow-hidden"
              style={{ backgroundColor: C.bg, border: `1px solid ${C.plataLight}`, boxShadow: "0 8px 30px rgba(155,126,196,0.08)" }}>
              <div className="absolute -top-2 -right-2 w-16 opacity-40"><Sprig flip /></div>
              <p className="text-xs uppercase tracking-widest mb-2" style={{ color: C.lavandaDeep }}>{ev.title}</p>
              <p className="text-5xl mb-2" style={{ fontFamily: "var(--font-great-vibes)", color: C.lavanda }}>{ev.time}</p>
              <p className="text-lg font-semibold mb-1">{ev.place}</p>
              <p className="text-sm mb-5" style={{ color: C.fgMid }}>{ev.address}</p>
              <a href={`https://maps.google.com/?q=${encodeURIComponent(ev.mapsQuery)}`} target="_blank" rel="noopener noreferrer"
                className="inline-block text-xs uppercase tracking-widest px-6 py-2.5 rounded-full text-white transition-transform hover:scale-105"
                style={{ backgroundColor: C.lavandaDeep }}>
                Ver mapa
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Dress code */}
      <section className="py-16 px-6 text-center" style={{ backgroundColor: C.bg2 }}>
        <div className="max-w-sm mx-auto">
          <p className="text-xs uppercase tracking-widest mb-3" style={{ color: C.lavandaDeep }}>Código de vestimenta</p>
          <p className="text-3xl" style={{ fontFamily: "var(--font-great-vibes)", color: C.fg }}>{wedding.dressCode}</p>
          <div className="flex justify-center gap-2 mt-5">
            {[C.bg, C.plataLight, C.rosa, C.lavanda, C.lavandaDeep].map((c) => (
              <span key={c} className="w-6 h-6 rounded-full" style={{ backgroundColor: c, border: `1px solid ${C.plata}` }} />
            ))}
          </div>
        </div>
      </section>

      {/* Padrinos */}
      <section className="py-20 px-6">
        <p className="text-center text-xs uppercase tracking-[0.4em] mb-10" style={{ color: C.lavandaDeep }}>Padrinos</p>
        <div className="max-w-2xl mx-auto grid sm:grid-cols-2 gap-4">
          {wedding.godparents.map((gp) => (
            <motion.div key={gp.role} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="rounded-2xl px-5 py-4 text-center" style={{ border: `1px solid ${C.plataLight}` }}>
              <p className="text-[10px] uppercase tracking-[0.3em] mb-2" style={{ color: C.lavandaDeep }}>{gp.role}</p>
              <p className="text-sm">{gp.names}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Regalos */}
      <section className="py-20 px-6 text-center" style={{ backgroundColor: C.bg2 }}>
        <div className="max-w-lg mx-auto">
          <div className="text-3xl mb-3">🎁</div>
          <p className="text-xs uppercase tracking-[0.4em] mb-3" style={{ color: C.lavandaDeep }}>Mesa de regalos</p>
          <p className="italic text-sm mb-8" style={{ color: C.fgMid }}>Tu presencia es nuestro mayor regalo</p>
          <div className="space-y-3">
            {wedding.gifts.map((g) => (
              <a key={g.store} href={g.url} target="_blank" rel="noopener noreferrer"
                className="flex justify-between items-center px-5 py-3.5 rounded-2xl transition-transform hover:scale-[1.02]"
                style={{ backgroundColor: C.bg, border: `1px solid ${C.plataLight}` }}>
                <span className="font-semibold text-sm">{g.store}</span>
                <span className="text-xs uppercase tracking-widest" style={{ color: C.lavandaDeep }}>{g.code} →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section className="py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-24 opacity-40"><Sprig /></div>
        <div className="absolute bottom-0 right-0 w-24 opacity-40"><Sprig flip /></div>
        <div className="max-w-md mx-auto relative">
          <h2 className="text-6xl mb-4" style={{ fontFamily: "var(--font-great-vibes)", color: C.lavandaDeep }}>¿Nos acompañas?</h2>
          <p className="mb-8 text-sm" style={{ color: C.fgMid }}>Confirma antes del <strong style={{ color: C.lavandaDeep }}>{wedding.rsvpDeadline}</strong></p>
          <div className="inline-block px-8 py-3 rounded-full text-white text-sm uppercase tracking-widest" style={{ backgroundColor: C.lavandaDeep }}>
            Confirmar asistencia
          </div>
          <p className="mt-5 text-xs" style={{ color: C.fgMid }}>Tu invitación personalizada tiene tu link de confirmación</p>
        </div>
      </section>

      <footer className="py-12 text-center" style={{ backgroundColor: C.bg2 }}>
        <p className="text-4xl mb-2" style={{ fontFamily: "var(--font-great-vibes)", color: C.lavandaDeep }}>{wedding.groom} &amp; {wedding.bride}</p>
        <p className="text-[10px] uppercase tracking-[0.5em]" style={{ color: C.fgMid }}>{wedding.dateShort}</p>
      </footer>
    </div>
  );
}
