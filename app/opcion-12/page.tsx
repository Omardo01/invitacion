"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { wedding } from "@/lib/wedding";

/* ─── Cristal & Plata · art déco, lila metálico, dramático ─── */
const C = {
  bg: "#1a1426",
  bg2: "#241a35",
  panel: "#2d2142",
  fg: "#f3eefb",
  fgMid: "#c9bce0",
  lila: "#c9a4ec",
  lilaDeep: "#9d6fd1",
  plata: "#d8d4e8",
  plataMetal: "#b8b3d0",
  white: "#ffffff",
};

function ArtDecoFrame({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 60" className={className} fill="none">
      <path d="M10,30 L70,30 M85,30 L100,15 L115,30 M130,30 L190,30" stroke={C.lila} strokeWidth="1" />
      <circle cx="100" cy="30" r="4" fill="none" stroke={C.lila} strokeWidth="1" />
      <path d="M75,30 L80,25 L80,35 Z M125,30 L120,25 L120,35 Z" fill={C.lila} />
    </svg>
  );
}

function Shimmer() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{ background: `linear-gradient(105deg, transparent 40%, ${C.lila}22 50%, transparent 60%)` }}
      animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
      transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
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
    <div className="flex gap-5 justify-center">
      {[["d", "días"], ["h", "hrs"], ["m", "min"], ["s", "seg"]].map(([k, lbl]) => (
        <div key={k} className="text-center">
          <div className="text-4xl font-bold tracking-wider" style={{ fontFamily: "var(--font-deco)", color: C.lila }}>{pad(t[k as keyof typeof t])}</div>
          <div className="text-[9px] uppercase tracking-[0.3em] mt-2" style={{ color: C.fgMid }}>{lbl}</div>
        </div>
      ))}
    </div>
  );
}

export default function Opcion12() {
  const [entered, setEntered] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden relative"
      style={{ background: `radial-gradient(ellipse at top, ${C.bg2}, ${C.bg})`, color: C.fg, fontFamily: "var(--font-marcellus)" }}>

      <Link href="/" className="fixed top-4 left-4 z-50 text-xs uppercase tracking-widest px-3 py-1.5 rounded-full"
        style={{ border: `1px solid ${C.lila}40`, color: C.lila, backgroundColor: `${C.bg}cc` }}>
        ← volver
      </Link>

      {/* INTRO: cortinas que se abren */}
      <AnimatePresence>
        {!entered && (
          <motion.section key="intro" exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
            className="fixed inset-0 z-40 flex items-center justify-center" style={{ backgroundColor: C.bg }}>
            {/* Cortina izq */}
            <motion.div initial={{ x: 0 }} exit={{ x: "-100%" }} transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
              className="absolute inset-y-0 left-0 w-1/2" style={{ background: `linear-gradient(90deg, ${C.bg}, ${C.panel})` }} />
            <motion.div initial={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
              className="absolute inset-y-0 right-0 w-1/2" style={{ background: `linear-gradient(270deg, ${C.bg}, ${C.panel})` }} />

            <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
              onClick={() => setEntered(true)} className="relative z-10 text-center cursor-pointer">
              <ArtDecoFrame className="w-48 mx-auto mb-4" />
              <p className="text-5xl md:text-7xl tracking-wider" style={{ fontFamily: "var(--font-deco)", color: C.lila }}>
                {wedding.groom[0]} &amp; {wedding.bride[0]}
              </p>
              <ArtDecoFrame className="w-48 mx-auto mt-4 rotate-180" />
              <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}
                className="mt-8 text-xs uppercase tracking-[0.4em]" style={{ color: C.fgMid }}>
                Toca para entrar
              </motion.p>
            </motion.button>
          </motion.section>
        )}
      </AnimatePresence>

      {entered && (
        <div className="relative z-10">
          {/* HERO */}
          <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-28 relative">
            <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ duration: 0.8 }}>
              <ArtDecoFrame className="w-56 mx-auto mb-6" />
            </motion.div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="text-xs uppercase tracking-[0.6em] mb-8" style={{ color: C.lila }}>Nos casamos</motion.p>

            <motion.h1 initial={{ opacity: 0, letterSpacing: "0.5em" }} animate={{ opacity: 1, letterSpacing: "0.02em" }} transition={{ delay: 0.3, duration: 1.2 }}
              className="text-6xl md:text-[8rem] leading-[0.85] tracking-wider" style={{ fontFamily: "var(--font-deco)", color: C.plata }}>
              {wedding.groom}
            </motion.h1>

            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="text-5xl my-3 block" style={{ fontFamily: "var(--font-script)", color: C.lila }}>&amp;</motion.span>

            <motion.h1 initial={{ opacity: 0, letterSpacing: "0.5em" }} animate={{ opacity: 1, letterSpacing: "0.02em" }} transition={{ delay: 0.45, duration: 1.2 }}
              className="text-6xl md:text-[8rem] leading-[0.85] tracking-wider" style={{ fontFamily: "var(--font-deco)", color: C.plata }}>
              {wedding.bride}
            </motion.h1>

            <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.8 }}>
              <ArtDecoFrame className="w-56 mx-auto mt-6 rotate-180" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="mt-8 space-y-1">
              <p className="text-xs uppercase tracking-[0.5em]" style={{ color: C.fgMid }}>{wedding.city}</p>
              <p className="text-2xl" style={{ fontFamily: "var(--font-script)", color: C.lila }}>{wedding.dateLabel} · 2026</p>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mt-12">
              <Countdown target="2026-07-25T17:00:00" />
            </motion.div>
          </section>

          {/* Historia */}
          <section className="py-20 px-6 relative overflow-hidden" style={{ backgroundColor: C.bg2 }}>
            <Shimmer />
            <div className="max-w-2xl mx-auto text-center relative">
              <ArtDecoFrame className="w-40 mx-auto mb-6" />
              <p className="text-xs uppercase tracking-[0.5em] mb-5" style={{ color: C.lila }}>Nuestra historia</p>
              <p className="text-base leading-relaxed" style={{ color: C.fgMid }}>{wedding.story}</p>
            </div>
          </section>

          {/* Eventos */}
          <section className="py-20 px-6">
            <p className="text-center text-xs uppercase tracking-[0.6em] mb-12" style={{ color: C.lila }}>El gran día</p>
            <div className="max-w-2xl mx-auto grid md:grid-cols-2 gap-6">
              {[wedding.ceremony, wedding.reception].map((ev, i) => (
                <motion.div key={ev.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                  className="rounded-sm p-8 text-center relative overflow-hidden"
                  style={{ backgroundColor: C.panel, border: `1px solid ${C.lila}30` }}>
                  <Shimmer />
                  <div className="relative">
                    <p className="text-xs uppercase tracking-[0.4em] mb-3" style={{ color: C.lila }}>{ev.title}</p>
                    <p className="text-5xl font-bold mb-2 tracking-wider" style={{ fontFamily: "var(--font-deco)", color: C.plata }}>{ev.time}</p>
                    <p className="text-lg mb-1">{ev.place}</p>
                    <p className="text-sm mb-5" style={{ color: C.fgMid }}>{ev.address}</p>
                    <a href={`https://maps.google.com/?q=${encodeURIComponent(ev.mapsQuery)}`} target="_blank" rel="noopener noreferrer"
                      className="inline-block text-xs uppercase tracking-[0.3em] px-6 py-2.5 transition-colors"
                      style={{ border: `1px solid ${C.lila}`, color: C.lila }}>
                      Ver mapa
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Dress code */}
          <section className="py-16 px-6 text-center" style={{ backgroundColor: C.bg2 }}>
            <div className="max-w-sm mx-auto">
              <ArtDecoFrame className="w-40 mx-auto mb-4" />
              <p className="text-xs uppercase tracking-[0.5em] mb-3" style={{ color: C.lila }}>Código de vestimenta</p>
              <p className="text-2xl tracking-wider" style={{ fontFamily: "var(--font-deco)", color: C.plata }}>{wedding.dressCode}</p>
            </div>
          </section>

          {/* Padrinos */}
          <section className="py-20 px-6">
            <p className="text-center text-xs uppercase tracking-[0.6em] mb-10" style={{ color: C.lila }}>Padrinos</p>
            <div className="max-w-2xl mx-auto grid sm:grid-cols-2 gap-4">
              {wedding.godparents.map((gp) => (
                <motion.div key={gp.role} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  className="px-5 py-4 text-center" style={{ border: `1px solid ${C.lila}25` }}>
                  <p className="text-[10px] uppercase tracking-[0.4em] mb-2" style={{ color: C.lila }}>{gp.role}</p>
                  <p className="text-sm">{gp.names}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Regalos */}
          <section className="py-20 px-6 text-center" style={{ backgroundColor: C.bg2 }}>
            <div className="max-w-lg mx-auto">
              <ArtDecoFrame className="w-40 mx-auto mb-4" />
              <p className="text-xs uppercase tracking-[0.5em] mb-3" style={{ color: C.lila }}>Mesa de regalos</p>
              <p className="italic text-sm mb-8" style={{ color: C.fgMid }}>Tu presencia es nuestro mayor regalo</p>
              <div className="space-y-3">
                {wedding.gifts.map((g) => (
                  <a key={g.store} href={g.url} target="_blank" rel="noopener noreferrer"
                    className="flex justify-between items-center px-5 py-4 transition-colors"
                    style={{ backgroundColor: C.panel, border: `1px solid ${C.lila}25` }}>
                    <span className="text-sm" style={{ color: C.plata }}>{g.store}</span>
                    <span className="text-xs uppercase tracking-widest" style={{ color: C.lila }}>{g.code} →</span>
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* RSVP */}
          <section className="py-24 px-6 text-center">
            <div className="max-w-md mx-auto">
              <ArtDecoFrame className="w-48 mx-auto mb-6" />
              <h2 className="text-4xl tracking-wider mb-4" style={{ fontFamily: "var(--font-deco)", color: C.lila }}>¿Nos acompañas?</h2>
              <p className="mb-8 text-sm" style={{ color: C.fgMid }}>Confirma antes del <strong style={{ color: C.plata }}>{wedding.rsvpDeadline}</strong></p>
              <div className="inline-block px-8 py-3 text-sm uppercase tracking-[0.3em] cursor-pointer transition-colors"
                style={{ border: `1px solid ${C.lila}`, color: C.lila }}>Confirmar asistencia</div>
              <ArtDecoFrame className="w-48 mx-auto mt-6 rotate-180" />
            </div>
          </section>

          <footer className="py-12 text-center border-t" style={{ borderColor: `${C.lila}20` }}>
            <p className="text-3xl mb-2" style={{ fontFamily: "var(--font-script)", color: C.lila }}>{wedding.groom} &amp; {wedding.bride}</p>
            <p className="text-[10px] uppercase tracking-[0.5em]" style={{ color: C.fgMid }}>{wedding.dateShort} · {wedding.city}</p>
          </footer>
        </div>
      )}
    </div>
  );
}
