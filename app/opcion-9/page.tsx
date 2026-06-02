"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { wedding } from "@/lib/wedding";

/* ─── Paleta Blanco & Plata ─── */
const C = {
  bg: "#ffffff",
  bg2: "#f8f7f5",
  fg: "#111111",
  fgMid: "#444444",
  fgLight: "#999999",
  accent: "#111111",
  accentLine: "#dddddd",
  red: "#c0392b",
};

function TornEdge({ flip = false }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 800 40" preserveAspectRatio="none" className={`w-full h-10 ${flip ? "rotate-180" : ""}`} style={{ color: C.fg }}>
      <path d="M0,40 L0,20 C40,28 80,12 120,20 C160,28 200,8 240,16 C280,24 320,10 360,18 C400,26 440,6 480,14 C520,22 560,10 600,18 C640,26 680,12 720,20 C760,28 790,16 800,20 L800,40 Z" fill="currentColor" />
    </svg>
  );
}

function MusicButton() {
  const [playing, setPlaying] = useState(false);
  return (
    <motion.button
      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
      onClick={() => setPlaying(!playing)}
      className="flex items-center gap-3 px-6 py-3 rounded-full border mx-auto text-sm font-medium transition-colors"
      style={{ borderColor: C.accentLine, color: playing ? C.fg : C.fgMid, backgroundColor: playing ? C.bg2 : "transparent" }}
    >
      <motion.span animate={{ rotate: playing ? 360 : 0 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="text-xl">
        {playing ? "🎵" : "🎶"}
      </motion.span>
      {playing ? `${wedding.music.title} · ${wedding.music.artist}` : "Dale play a la música"}
    </motion.button>
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
    <div className="flex gap-8 justify-center">
      {[["d", "días"], ["h", "hrs"], ["m", "min"], ["s", "seg"]].map(([k, lbl]) => (
        <div key={k} className="text-center">
          <div className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{pad(t[k as keyof typeof t])}</div>
          <div className="text-[10px] uppercase tracking-widest mt-1" style={{ color: C.fgLight }}>{lbl}</div>
        </div>
      ))}
    </div>
  );
}

export default function Opcion9() {
  return (
    <div style={{ backgroundColor: C.bg, color: C.fg, fontFamily: "var(--font-serif)" }} className="min-h-screen overflow-x-hidden">

      <Link href="/" className="fixed top-4 left-4 z-50 text-xs uppercase tracking-widest px-3 py-1.5 rounded-full border" style={{ borderColor: C.accentLine, backgroundColor: C.bg }}>
        ← volver
      </Link>

      {/* HERO — nombres enormes con fecha numérica superpuesta */}
      <section className="min-h-screen relative flex flex-col items-center justify-center px-6 py-28 overflow-hidden">
        {/* Fecha enorme en fondo */}
        <div className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none">
          <span className="text-[28vw] leading-none font-bold" style={{ fontFamily: "var(--font-display)", color: "#f0f0f0" }}>07</span>
          <span className="text-[18vw] leading-none font-light" style={{ fontFamily: "var(--font-script)", color: "#ebebeb" }}>julio</span>
          <span className="text-[20vw] leading-none font-bold" style={{ fontFamily: "var(--font-display)", color: "#f0f0f0" }}>2026</span>
        </div>

        <div className="relative z-10 text-center">
          <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-xs uppercase tracking-[0.5em] mb-8" style={{ color: C.fgLight }}>
            Acompáñanos · 07.02.26
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}>
            <h1 className="text-7xl md:text-[10rem] leading-[0.82] italic" style={{ fontFamily: "var(--font-display)" }}>
              {wedding.groom}
            </h1>
            <p className="text-4xl my-1" style={{ fontFamily: "var(--font-script)", color: C.fgMid }}>&amp;</p>
            <h1 className="text-7xl md:text-[10rem] leading-[0.82] italic" style={{ fontFamily: "var(--font-display)" }}>
              {wedding.bride}
            </h1>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-10">
            <p className="text-sm uppercase tracking-[0.3em] mb-6" style={{ color: C.fgLight }}>{wedding.dateShort}</p>
            <MusicButton />
          </motion.div>
        </div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 text-xs uppercase tracking-widest" style={{ color: C.fgLight }}>↓</motion.div>
      </section>

      {/* Countdown */}
      <section className="py-16 px-6 text-center border-y" style={{ borderColor: C.accentLine }}>
        <Countdown target="2026-07-25T17:00:00" />
      </section>

      {/* Nuestra historia */}
      <section className="py-24 px-6 max-w-2xl mx-auto text-center">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-5xl italic mb-8" style={{ fontFamily: "var(--font-display)" }}>
          Cómo empezó todo
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
          className="text-lg leading-relaxed" style={{ color: C.fgMid }}>
          {wedding.story}
        </motion.p>
      </section>

      {/* Foto collage (torn paper effect) */}
      <section className="relative py-0">
        <TornEdge />
        <div className="py-16 px-6" style={{ backgroundColor: C.fg }}>
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-3">
            {wedding.gallery.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="aspect-square rounded-lg overflow-hidden relative"
                style={{ backgroundColor: "#222", border: "1px solid #333" }}>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                  <p className="text-white text-xs uppercase tracking-widest mb-1" style={{ color: "#aaa" }}>{item.year}</p>
                  <p className="text-white text-sm italic" style={{ fontFamily: "var(--font-display)" }}>{item.caption}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-center mt-8 text-xs uppercase tracking-[0.4em]" style={{ color: "#666" }}>{wedding.hashtag}</p>
        </div>
        <TornEdge flip />
      </section>

      {/* Padres */}
      <section className="py-24 px-6" style={{ backgroundColor: C.bg2 }}>
        <div className="max-w-lg mx-auto">
          <p className="text-center text-xs uppercase tracking-[0.4em] mb-12" style={{ color: C.fgLight }}>Con la bendición de sus padres</p>
          <div className="space-y-5">
            {[
              { rol: "Padres de la novia", icon: "👠", names: `${wedding.bride}'s familia` },
              { rol: "Padres del novio", icon: "👞", names: `${wedding.groom}'s familia` },
            ].map((item) => (
              <motion.div key={item.rol} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="flex items-center gap-5 px-6 py-5 rounded-2xl" style={{ backgroundColor: C.bg, border: `1px solid ${C.accentLine}` }}>
                <span className="text-4xl">{item.icon}</span>
                <div>
                  <p className="text-xs uppercase tracking-widest mb-1" style={{ color: C.fgLight }}>{item.rol}</p>
                  <p className="font-semibold text-sm">{item.names}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline del día */}
      <section className="py-24 px-6">
        <div className="max-w-md mx-auto">
          <p className="text-center text-xs uppercase tracking-[0.4em] mb-12" style={{ color: C.fgLight }}>El programa del día</p>
          {[
            { time: wedding.ceremony.time, event: "Ceremonia", place: wedding.ceremony.place, icon: "⛪" },
            { time: wedding.reception.time, event: "Recepción", place: wedding.reception.place, icon: "🥂" },
            { time: "23:30", event: "Pastel", place: "¡El gran momento!", icon: "🎂" },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              className="flex gap-5 mb-8">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{ backgroundColor: C.bg2, border: `1px solid ${C.accentLine}` }}>{item.icon}</div>
                {i < 2 && <div className="w-px flex-1 mt-2" style={{ backgroundColor: C.accentLine }} />}
              </div>
              <div className="pb-8">
                <p className="text-xs uppercase tracking-widest mb-1" style={{ color: C.fgLight }}>{item.time}</p>
                <p className="text-xl font-semibold italic" style={{ fontFamily: "var(--font-display)" }}>{item.event}</p>
                <p className="text-sm mt-0.5" style={{ color: C.fgMid }}>{item.place}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Código de vestimenta */}
      <section className="py-20 px-6 text-center" style={{ backgroundColor: C.bg2, borderTop: `1px solid ${C.accentLine}` }}>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-sm mx-auto">
          <div className="flex justify-center gap-8 text-5xl mb-6">
            <span>👗</span>
            <span>🤵</span>
          </div>
          <p className="text-xs uppercase tracking-[0.4em] mb-3" style={{ color: C.fgLight }}>Código de vestimenta</p>
          <p className="text-3xl font-bold italic" style={{ fontFamily: "var(--font-display)" }}>{wedding.dressCode}</p>
          <p className="mt-3 text-sm" style={{ color: C.fgMid }}>Que su elegancia acompañe la belleza del día</p>
        </motion.div>
      </section>

      {/* RSVP */}
      <section className="py-24 px-6 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="max-w-md mx-auto">
          <p className="text-xs uppercase tracking-[0.4em] mb-4" style={{ color: C.fgLight }}>Por favor confirmar asistencia</p>
          <h2 className="text-5xl italic mb-3" style={{ fontFamily: "var(--font-display)" }}>antes del</h2>
          <p className="text-3xl font-bold mb-8">{wedding.rsvpDeadline}</p>
          <div className="inline-block border-b-2 pb-1 text-xl font-semibold uppercase tracking-widest cursor-pointer hover:opacity-70 transition-opacity" style={{ borderColor: C.fg }}>
            Confirmar
          </div>
          <p className="mt-6 text-xs" style={{ color: C.fgLight }}>En tu invitación personalizada podrás confirmar tu asistencia</p>
        </motion.div>
      </section>

      {/* Regalos */}
      <section className="py-20 px-6 text-center" style={{ backgroundColor: C.bg2, borderTop: `1px solid ${C.accentLine}` }}>
        <p className="text-xs uppercase tracking-[0.4em] mb-3" style={{ color: C.fgLight }}>Mesa de regalos</p>
        <p className="italic text-lg mb-8" style={{ color: C.fgMid }}>Tu presencia es nuestro mayor regalo</p>
        <div className="max-w-sm mx-auto space-y-3">
          {wedding.gifts.map((g) => (
            <a key={g.store} href={g.url} target="_blank" rel="noopener noreferrer"
              className="flex justify-between items-center px-5 py-3.5 rounded-xl hover:opacity-80 transition-opacity"
              style={{ backgroundColor: C.bg, border: `1px solid ${C.accentLine}` }}>
              <span className="font-semibold">{g.store}</span>
              <span className="text-xs" style={{ color: C.fgLight }}>{g.code} →</span>
            </a>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center">
        <p className="text-4xl mb-4 italic" style={{ fontFamily: "var(--font-script)" }}>{wedding.groom} &amp; {wedding.bride}</p>
        <p className="text-xs uppercase tracking-[0.4em]" style={{ color: C.fgLight }}>Esperamos con el corazón que nos acompañes</p>
      </footer>
    </div>
  );
}
