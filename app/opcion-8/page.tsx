"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { wedding } from "@/lib/wedding";

/* ─── Paleta Terraco ─── */
const C = {
  bg: "#f7efe5",
  paper: "#fff9f4",
  fg: "#2a1a0e",
  accent: "#c1694f",
  accentDark: "#8b3e28",
  accentLight: "#e8c4b4",
  gold: "#c9952a",
};

function FlowerSVG({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none">
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <ellipse
          key={angle}
          cx="60" cy="60" rx="10" ry="28"
          fill={C.accentLight}
          style={{ transformOrigin: "60px 60px", transform: `rotate(${angle}deg) translateY(-18px)` }}
          opacity="0.7"
        />
      ))}
      <circle cx="60" cy="60" r="14" fill={C.accent} />
      <circle cx="60" cy="60" r="6" fill={C.gold} />
    </svg>
  );
}

function WaxSeal({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <circle cx="40" cy="40" r="38" fill={C.accentDark} />
      <circle cx="40" cy="40" r="32" fill={C.accent} />
      <text x="40" y="46" textAnchor="middle" fontSize="22" fill={C.bg} style={{ fontFamily: "serif", fontStyle: "italic" }}>
        G&amp;Z
      </text>
    </svg>
  );
}

function Countdown({ target }: { target: string }) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const update = () => {
      const s = Math.max(0, Math.floor((new Date(target).getTime() - Date.now()) / 1000));
      setT({ d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 });
    };
    update(); const id = setInterval(update, 1000); return () => clearInterval(id);
  }, [target]);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="flex gap-6 justify-center">
      {[["d","días"],["h","hrs"],["m","min"],["s","seg"]].map(([k, label]) => (
        <div key={k} className="text-center">
          <div className="text-4xl md:text-5xl font-bold" style={{ fontFamily: "var(--font-display)", color: C.accent }}>{pad(t[k as keyof typeof t])}</div>
          <div className="text-[10px] uppercase tracking-[0.3em] mt-1" style={{ color: `${C.fg}60` }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

export default function Opcion8() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ backgroundColor: C.bg, color: C.fg, fontFamily: "var(--font-serif)" }} className="min-h-screen overflow-x-hidden">

      {/* Back */}
      <Link href="/" className="fixed top-4 left-4 z-50 text-xs uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-sm" style={{ backgroundColor: `${C.bg}cc`, color: C.fg }}>
        ← volver
      </Link>

      {/* ── SOBRE ANIMADO ── */}
      <AnimatePresence>
        {!open && (
          <motion.section
            key="envelope"
            exit={{ opacity: 0, y: -40, scale: 0.92 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center"
            style={{ backgroundColor: C.bg }}
          >
            <motion.p initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="text-xs uppercase tracking-[0.4em] mb-8" style={{ color: `${C.fg}70` }}>
              el día más importante de nuestras vidas ha llegado
            </motion.p>

            <motion.button
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 180 }}
              whileHover={{ scale: 1.04, y: -4 }}
              onClick={() => setOpen(true)}
              className="relative cursor-pointer"
            >
              {/* Envelope body */}
              <div className="relative w-72 h-44 rounded-lg shadow-2xl overflow-hidden" style={{ backgroundColor: C.accent }}>
                {/* Flap */}
                <motion.div
                  animate={{ rotateX: open ? -180 : 0 }}
                  style={{ transformOrigin: "top", background: `linear-gradient(135deg, ${C.accentDark} 0%, ${C.accent} 100%)` }}
                  className="absolute top-0 left-0 right-0 h-24"
                >
                  <svg viewBox="0 0 288 96" className="w-full h-full" preserveAspectRatio="none">
                    <polygon points="0,0 288,0 144,80" fill={C.accentDark} opacity="0.5" />
                  </svg>
                </motion.div>
                {/* V sides */}
                <div className="absolute bottom-0 left-0 right-0 h-28" style={{ background: `linear-gradient(to top, ${C.accentDark}60, transparent)` }} />
                {/* Seal */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <WaxSeal size={72} />
                </div>
              </div>
              <p className="mt-2 text-center text-2xl md:text-3xl" style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: C.fg }}>
                {wedding.groom} &amp; {wedding.bride}
              </p>
            </motion.button>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-8 text-sm"
              style={{ color: `${C.fg}60` }}
            >
              Clic aquí para abrir
            </motion.p>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── CONTENIDO DE LA INVITACIÓN ── */}
      {open && (
        <>
          {/* Hero */}
          <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-28 relative overflow-hidden">
            <div className="absolute -top-8 -left-8 w-48 h-48 opacity-20"><FlowerSVG /></div>
            <div className="absolute -top-8 -right-8 w-48 h-48 opacity-20" style={{ transform: "scaleX(-1)" }}><FlowerSVG /></div>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-32 h-32 opacity-10"><FlowerSVG /></div>

            <motion.p initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-xs uppercase tracking-[0.5em] mb-6" style={{ color: C.accent }}>
              ✦ Nos casamos ✦
            </motion.p>

            <motion.h1 initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.9 }}
              className="text-7xl md:text-[9rem] leading-[0.82] italic" style={{ fontFamily: "var(--font-display)" }}>
              {wedding.groom}
            </motion.h1>

            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="text-5xl my-3" style={{ fontFamily: "var(--font-script)", color: C.accent }}>&amp;</motion.span>

            <motion.h1 initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.9 }}
              className="text-7xl md:text-[9rem] leading-[0.82] italic" style={{ fontFamily: "var(--font-display)" }}>
              {wedding.bride}
            </motion.h1>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="mt-10 space-y-2">
              <p className="text-xs uppercase tracking-[0.4em]" style={{ color: `${C.fg}60` }}>{wedding.city}</p>
              <p className="text-3xl" style={{ fontFamily: "var(--font-script)", color: C.accent }}>{wedding.dateLabel} · 2026</p>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-12">
              <Countdown target="2026-07-25T17:00:00" />
            </motion.div>

            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
              className="absolute bottom-8 text-xs uppercase tracking-widest" style={{ color: `${C.fg}40` }}>
              ↓ scroll
            </motion.div>
          </section>

          {/* Nuestra historia */}
          <section className="py-20 px-6" style={{ backgroundColor: C.paper }}>
            <div className="max-w-2xl mx-auto text-center">
              <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="text-xs uppercase tracking-[0.4em] mb-4" style={{ color: C.accent }}>Nuestra historia</motion.p>
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                className="text-lg leading-relaxed" style={{ color: `${C.fg}cc` }}>{wedding.story}</motion.p>
              <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-8 h-px max-w-xs mx-auto" style={{ backgroundColor: C.accentLight }} />
            </div>
          </section>

          {/* Eventos */}
          <section className="py-20 px-6">
            <div className="max-w-2xl mx-auto">
              <p className="text-center text-xs uppercase tracking-[0.4em] mb-12" style={{ color: C.accent }}>El gran día</p>
              <div className="grid md:grid-cols-2 gap-6">
                {[wedding.ceremony, wedding.reception].map((ev, i) => (
                  <motion.div key={ev.title}
                    initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                    className="rounded-2xl p-7 text-center" style={{ backgroundColor: C.paper, border: `1px solid ${C.accentLight}` }}>
                    <div className="w-12 h-12 mx-auto mb-4"><FlowerSVG /></div>
                    <p className="text-xs uppercase tracking-widest mb-2" style={{ color: C.accent }}>{ev.title}</p>
                    <p className="text-5xl font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: C.fg }}>{ev.time}</p>
                    <p className="text-lg font-semibold mb-1">{ev.place}</p>
                    <p className="text-sm mb-5" style={{ color: `${C.fg}70` }}>{ev.address}</p>
                    <a href={`https://maps.google.com/?q=${encodeURIComponent(ev.mapsQuery)}`} target="_blank" rel="noopener noreferrer"
                      className="inline-block text-xs uppercase tracking-widest px-6 py-2.5 rounded-full text-white transition-opacity hover:opacity-85"
                      style={{ backgroundColor: C.accent }}>
                      Ver mapa
                    </a>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Código vestimenta */}
          <section className="py-16 px-6 text-center" style={{ backgroundColor: C.accentLight + "44" }}>
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-sm mx-auto">
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: C.accent }}>Código de vestimenta</p>
              <p className="text-3xl font-semibold italic" style={{ fontFamily: "var(--font-display)" }}>{wedding.dressCode}</p>
              <p className="mt-2 text-sm" style={{ color: `${C.fg}70` }}>{wedding.dressCodeNotes?.ellas ?? ""}</p>
              <p className="text-sm" style={{ color: `${C.fg}70` }}>{wedding.dressCodeNotes?.ellos ?? ""}</p>
            </motion.div>
          </section>

          {/* Padrinos */}
          <section className="py-20 px-6" style={{ backgroundColor: C.paper }}>
            <div className="max-w-2xl mx-auto">
              <p className="text-center text-xs uppercase tracking-[0.4em] mb-10" style={{ color: C.accent }}>Padrinos</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {wedding.godparents.map((gp) => (
                  <motion.div key={gp.role} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="rounded-xl p-5 text-center" style={{ border: `1px solid ${C.accentLight}` }}>
                    <p className="text-xs uppercase tracking-widest mb-2" style={{ color: C.accent }}>{gp.role}</p>
                    <p className="text-sm font-medium" style={{ color: C.fg }}>{gp.names}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Mesa de regalos */}
          <section className="py-20 px-6">
            <div className="max-w-lg mx-auto text-center">
              <p className="text-xs uppercase tracking-[0.4em] mb-3" style={{ color: C.accent }}>Mesa de regalos</p>
              <p className="text-lg italic mb-8" style={{ color: `${C.fg}80` }}>Tu presencia es nuestro mayor regalo, pero si deseas obsequiarnos algo…</p>
              <div className="space-y-3">
                {wedding.gifts.map((g) => (
                  <a key={g.store} href={g.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-between px-5 py-4 rounded-2xl transition-opacity hover:opacity-80"
                    style={{ backgroundColor: C.paper, border: `1px solid ${C.accentLight}` }}>
                    <span className="font-semibold text-sm">{g.store}</span>
                    <span className="text-xs" style={{ color: `${C.fg}60` }}>{g.code}</span>
                    <span className="text-xs uppercase tracking-widest" style={{ color: C.accent }}>Ver →</span>
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* RSVP (placeholder en la versión diseño) */}
          <section className="py-20 px-6 text-center" style={{ backgroundColor: C.paper }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="max-w-md mx-auto">
              <WaxSeal size={56} />
              <h2 className="text-5xl italic mt-6 mb-4" style={{ fontFamily: "var(--font-display)" }}>¿Vienes?</h2>
              <p className="text-stone-500 mb-8">Confirma antes del <strong style={{ color: C.accent }}>{wedding.rsvpDeadline}</strong>. Cada respuesta hace este día más nuestro.</p>
              <div className="inline-block px-8 py-3 rounded-full text-white text-sm uppercase tracking-widest" style={{ backgroundColor: C.accent }}>
                Confirmar asistencia
              </div>
              <p className="mt-4 text-xs" style={{ color: `${C.fg}40` }}>En tu invitación personalizada podrás confirmar</p>
            </motion.div>
          </section>

          <footer className="py-8 text-center text-xs uppercase tracking-widest" style={{ color: `${C.fg}30` }}>
            {wedding.hashtag} · {wedding.dateShort}
          </footer>
        </>
      )}
    </div>
  );
}
