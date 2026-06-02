"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { wedding } from "@/lib/wedding";

/* ─── Paleta Navy & Oro ─── */
const C = {
  navy: "#0d1b3e",
  navyMid: "#162347",
  navyLight: "#1e2f5e",
  gold: "#c9a253",
  goldLight: "#e8c97a",
  cream: "#f5ede0",
  creamDark: "#e8ddd0",
  fg: "#f8f3ec",
  fgMid: "#c8bfb0",
};

function FloralSVG({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none">
      {/* Hojas */}
      <ellipse cx="100" cy="100" rx="8" ry="60" fill={C.navyLight} style={{ transformOrigin: "100px 100px", transform: "rotate(-30deg)" }} opacity="0.8" />
      <ellipse cx="100" cy="100" rx="8" ry="60" fill={C.navyLight} style={{ transformOrigin: "100px 100px", transform: "rotate(30deg)" }} opacity="0.8" />
      <ellipse cx="100" cy="100" rx="8" ry="50" fill="#1a3070" style={{ transformOrigin: "100px 100px", transform: "rotate(0deg)" }} opacity="0.6" />
      {/* Flores */}
      {[0, 72, 144, 216, 288].map((a) => (
        <g key={a} style={{ transformOrigin: "100px 100px", transform: `rotate(${a}deg)` }}>
          <ellipse cx="100" cy="48" rx="7" ry="18" fill={C.navyMid} />
        </g>
      ))}
      <circle cx="100" cy="100" r="16" fill={C.gold} opacity="0.3" />
      <circle cx="100" cy="100" r="8" fill={C.goldLight} opacity="0.5" />
    </svg>
  );
}

function WaxSeal() {
  return (
    <div className="relative w-24 h-24 mx-auto">
      <svg viewBox="0 0 96 96" className="w-full h-full">
        {/* Outer ring */}
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i / 24) * Math.PI * 2;
          const x = 48 + 40 * Math.cos(a);
          const y = 48 + 40 * Math.sin(a);
          const x2 = 48 + 44 * Math.cos(a);
          const y2 = 48 + 44 * Math.sin(a);
          return <line key={i} x1={x} y1={y} x2={x2} y2={y2} stroke={C.gold} strokeWidth="2" />;
        })}
        <circle cx="48" cy="48" r="38" fill={C.navyLight} />
        <circle cx="48" cy="48" r="32" fill={C.navy} />
        {/* Lotus */}
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <g key={a} style={{ transformOrigin: "48px 48px", transform: `rotate(${a}deg)` }}>
            <ellipse cx="48" cy="28" rx="5" ry="13" fill={C.gold} opacity="0.5" />
          </g>
        ))}
        <circle cx="48" cy="48" r="10" fill={C.gold} opacity="0.4" />
        <text x="48" y="53" textAnchor="middle" fontSize="12" fill={C.gold} style={{ fontFamily: "serif", fontStyle: "italic" }}>G&amp;Z</text>
      </svg>
    </div>
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
    <div className="flex gap-6 justify-center">
      {[["d", "días"], ["h", "hrs"], ["m", "min"], ["s", "seg"]].map(([k, lbl]) => (
        <div key={k} className="text-center">
          <div className="text-3xl font-bold" style={{ fontFamily: "var(--font-deco)", color: C.gold }}>{pad(t[k as keyof typeof t])}</div>
          <div className="text-[10px] uppercase tracking-[0.3em] mt-1" style={{ color: C.fgMid }}>{lbl}</div>
        </div>
      ))}
    </div>
  );
}

export default function Opcion10() {
  const [sealBroken, setSealBroken] = useState(false);

  return (
    <div style={{ backgroundColor: C.navy, color: C.fg, fontFamily: "var(--font-marcellus)" }} className="min-h-screen overflow-x-hidden">

      <Link href="/" className="fixed top-4 left-4 z-50 text-xs uppercase tracking-widest px-3 py-1.5 rounded-full border text-xs"
        style={{ borderColor: `${C.gold}40`, color: C.gold, backgroundColor: `${C.navy}cc` }}>
        ← volver
      </Link>

      {/* Floral corners fixed */}
      <div className="fixed top-0 left-0 w-32 h-32 opacity-30 pointer-events-none z-0"><FloralSVG /></div>
      <div className="fixed top-0 right-0 w-32 h-32 opacity-30 pointer-events-none z-0" style={{ transform: "scaleX(-1)" }}><FloralSVG /></div>

      {/* SOBRE LACRADO */}
      <AnimatePresence>
        {!sealBroken && (
          <motion.section key="seal"
            exit={{ opacity: 0, scale: 0.88 }}
            transition={{ duration: 0.7 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center px-6"
            style={{ backgroundColor: C.navy }}>

            <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="absolute top-0 left-0 w-48 h-48 opacity-20"><FloralSVG /></motion.div>
            <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="absolute top-0 right-0 w-48 h-48 opacity-20" style={{ transform: "scaleX(-1)" }}><FloralSVG /></motion.div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-48 opacity-20"><FloralSVG /></motion.div>

            {/* Sobre */}
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.6, type: "spring" }}
              className="relative w-80 h-52 rounded-lg overflow-hidden cursor-pointer group"
              style={{ backgroundColor: C.navyMid, border: `1px solid ${C.gold}30`, boxShadow: `0 20px 60px rgba(0,0,0,0.5)` }}
              onClick={() => setSealBroken(true)}>
              {/* Sobre: flap */}
              <svg viewBox="0 0 320 208" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <polygon points="0,0 320,0 160,100" fill={C.navyLight} opacity="0.6" />
                <polygon points="0,208 160,120 320,208" fill={C.navyLight} opacity="0.4" />
              </svg>
              {/* Sello */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div whileHover={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 0.4 }}>
                  <WaxSeal />
                </motion.div>
              </div>
              {/* Iniciales */}
              <p className="absolute bottom-4 right-6 text-sm tracking-[0.3em]" style={{ color: C.gold, fontFamily: "var(--font-deco)", opacity: 0.7 }}>
                {wedding.groom[0]}&amp;{wedding.bride[0]}
              </p>
            </motion.div>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
              className="mt-8 text-sm" style={{ color: C.fgMid }}>
              Toca el sello para abrir tu invitación
            </motion.p>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── CONTENIDO ── */}
      {sealBroken && (
        <div className="relative z-10">

          {/* Hero */}
          <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-28">
            <motion.p initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-[10px] uppercase tracking-[0.6em] mb-8" style={{ color: C.gold }}>
              ✦ Nos casamos ✦
            </motion.p>

            <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.9 }}
              className="text-6xl md:text-[8rem] leading-[0.82]" style={{ fontFamily: "var(--font-deco)" }}>
              {wedding.groom}
            </motion.h1>

            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.6, duration: 0.8 }}
              className="my-4 h-px w-48 mx-auto" style={{ backgroundColor: C.gold, opacity: 0.5 }} />

            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="text-3xl my-1" style={{ fontFamily: "var(--font-script)", color: C.gold }}>&amp;</motion.span>

            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.7, duration: 0.8 }}
              className="my-4 h-px w-48 mx-auto" style={{ backgroundColor: C.gold, opacity: 0.5 }} />

            <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.9 }}
              className="text-6xl md:text-[8rem] leading-[0.82]" style={{ fontFamily: "var(--font-deco)" }}>
              {wedding.bride}
            </motion.h1>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="mt-10 space-y-1">
              <p className="text-xs uppercase tracking-[0.5em]" style={{ color: C.fgMid }}>{wedding.city}</p>
              <p className="text-2xl" style={{ fontFamily: "var(--font-script)", color: C.gold }}>{wedding.dateLabel} · 2026</p>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="mt-12">
              <Countdown target="2026-07-25T17:00:00" />
            </motion.div>
          </section>

          {/* Gold divider */}
          <div className="px-12 py-2"><div className="h-px" style={{ background: `linear-gradient(to right, transparent, ${C.gold}60, transparent)` }} /></div>

          {/* Nuestra historia */}
          <section className="py-20 px-6 text-center max-w-2xl mx-auto">
            <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-xs uppercase tracking-[0.5em] mb-6" style={{ color: C.gold }}>Nuestra historia</motion.p>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="text-base leading-relaxed" style={{ color: C.fgMid }}>{wedding.story}</motion.p>
          </section>

          <div className="px-12"><div className="h-px" style={{ background: `linear-gradient(to right, transparent, ${C.gold}40, transparent)` }} /></div>

          {/* Eventos */}
          <section className="py-20 px-6">
            <div className="max-w-2xl mx-auto">
              <p className="text-center text-[10px] uppercase tracking-[0.6em] mb-12" style={{ color: C.gold }}>El gran día</p>
              <div className="grid md:grid-cols-2 gap-6">
                {[wedding.ceremony, wedding.reception].map((ev, i) => (
                  <motion.div key={ev.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }}
                    className="rounded-xl p-7 text-center relative overflow-hidden"
                    style={{ backgroundColor: C.navyMid, border: `1px solid ${C.gold}30` }}>
                    {/* Floral top left */}
                    <div className="absolute -top-4 -left-4 w-20 h-20 opacity-20"><FloralSVG /></div>

                    <p className="text-[10px] uppercase tracking-[0.5em] mb-3" style={{ color: C.gold }}>{ev.title}</p>
                    <p className="text-5xl font-bold mb-2" style={{ fontFamily: "var(--font-deco)", color: C.gold }}>{ev.time}</p>
                    <p className="text-lg font-semibold mb-1">{ev.place}</p>
                    <p className="text-sm mb-5" style={{ color: C.fgMid }}>{ev.address}</p>
                    <div className="h-px mb-5" style={{ backgroundColor: `${C.gold}25` }} />
                    <a href={`https://maps.google.com/?q=${encodeURIComponent(ev.mapsQuery)}`} target="_blank" rel="noopener noreferrer"
                      className="inline-block text-xs uppercase tracking-[0.3em] px-5 py-2 rounded-full transition-opacity hover:opacity-80"
                      style={{ border: `1px solid ${C.gold}60`, color: C.gold }}>
                      Ver mapa
                    </a>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Código vestimenta */}
          <section className="py-16 px-6 text-center" style={{ backgroundColor: C.navyMid }}>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-sm mx-auto">
              <div className="flex justify-center gap-8 text-4xl mb-6 opacity-60">👗🤵</div>
              <p className="text-[10px] uppercase tracking-[0.6em] mb-3" style={{ color: C.gold }}>Código de vestimenta</p>
              <p className="text-2xl font-semibold" style={{ fontFamily: "var(--font-deco)", color: C.fg }}>{wedding.dressCode}</p>
              <p className="mt-2 text-sm" style={{ color: C.fgMid }}>Que su elegancia acompañe la belleza del día</p>
            </motion.div>
          </section>

          {/* Padrinos */}
          <section className="py-20 px-6">
            <div className="max-w-2xl mx-auto">
              <p className="text-center text-[10px] uppercase tracking-[0.6em] mb-10" style={{ color: C.gold }}>Padrinos</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {wedding.godparents.map((gp) => (
                  <motion.div key={gp.role} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="px-5 py-4 rounded-xl text-center" style={{ border: `1px solid ${C.gold}25` }}>
                    <p className="text-[10px] uppercase tracking-[0.4em] mb-2" style={{ color: C.gold }}>{gp.role}</p>
                    <p className="text-sm">{gp.names}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Regalos */}
          <section className="py-20 px-6 text-center" style={{ backgroundColor: C.navyMid }}>
            <div className="max-w-lg mx-auto">
              <div className="mb-3 text-3xl">🎁</div>
              <p className="text-[10px] uppercase tracking-[0.6em] mb-3" style={{ color: C.gold }}>Mesa de regalos</p>
              <p className="italic mb-8 text-sm" style={{ color: C.fgMid }}>Tu presencia es nuestro mayor regalo, pero si deseas obsequiarnos algo…</p>
              <div className="space-y-3">
                {wedding.gifts.map((g) => (
                  <a key={g.store} href={g.url} target="_blank" rel="noopener noreferrer"
                    className="flex justify-between items-center px-5 py-4 rounded-xl hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: C.navy, border: `1px solid ${C.gold}25` }}>
                    <span className="font-semibold text-sm" style={{ color: C.fg }}>{g.store}</span>
                    <span className="text-xs" style={{ color: C.fgMid }}>{g.code}</span>
                    <span className="text-xs uppercase tracking-widest" style={{ color: C.gold }}>Ver →</span>
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* RSVP */}
          <section className="py-24 px-6 text-center">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="max-w-md mx-auto">
              <WaxSeal />
              <h2 className="text-4xl mt-6 mb-3" style={{ fontFamily: "var(--font-deco)", color: C.gold }}>¿Nos acompañas?</h2>
              <p className="mb-2 text-sm" style={{ color: C.fgMid }}>Por favor confirmar asistencia antes del</p>
              <p className="text-2xl font-bold mb-8" style={{ color: C.fg }}>{wedding.rsvpDeadline}</p>
              <div className="inline-block px-8 py-3 rounded-full text-sm uppercase tracking-[0.3em] cursor-pointer hover:opacity-80 transition-opacity"
                style={{ border: `1px solid ${C.gold}`, color: C.gold }}>
                Confirmar asistencia
              </div>
              <p className="mt-5 text-xs" style={{ color: `${C.fgMid}80` }}>Tu invitación personalizada tiene tu link único de confirmación</p>
            </motion.div>
          </section>

          {/* Footer */}
          <footer className="py-12 text-center border-t" style={{ borderColor: `${C.gold}20` }}>
            <p className="text-3xl mb-2" style={{ fontFamily: "var(--font-script)", color: C.gold }}>{wedding.groom} &amp; {wedding.bride}</p>
            <p className="text-[10px] uppercase tracking-[0.5em]" style={{ color: C.fgMid }}>{wedding.dateShort} · {wedding.city}</p>
          </footer>
        </div>
      )}
    </div>
  );
}
