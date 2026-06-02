"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { wedding } from "@/lib/wedding";
import { BlurFade, useCountdown } from "@/components/magic";
import { EucalyptusSprig, PetalRain } from "@/components/floral";

/* ─── Acuarela Botánica Lila · lavanda · foto en óvalo · animada ─── */
const C = {
  bg: "#f7f5fb",
  paper: "#fffdff",
  ink: "#322a40",
  mid: "#6a6480",
  faint: "#a59eb8",
  line: "#e8e3f1",
  lila: "#b89ad6",
  lilaDeep: "#7d5fa8",
  plata: "#c8c4d8",
};

const LAV = ["#c9b3e0", "#b89ad6", "#d9c7ee", "#7d5fa8"];

function LilacRule({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <span className="h-px w-14" style={{ background: `linear-gradient(to right, transparent, ${C.lila})` }} />
      <motion.svg width="22" height="16" viewBox="0 0 22 16"
        animate={{ rotate: [0, 8, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
        <ellipse cx="11" cy="6" rx="3.5" ry="6" fill={C.lila} opacity="0.9" />
        <ellipse cx="6" cy="9" rx="3" ry="5" fill={C.lilaDeep} opacity="0.7" transform="rotate(-30 6 9)" />
        <ellipse cx="16" cy="9" rx="3" ry="5" fill={C.lilaDeep} opacity="0.7" transform="rotate(30 16 9)" />
      </motion.svg>
      <span className="h-px w-14" style={{ background: `linear-gradient(to left, transparent, ${C.lila})` }} />
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center px-3 sm:px-4">
      <div className="text-3xl md:text-4xl tabular-nums" style={{ fontFamily: "var(--font-fraunces)", color: C.lilaDeep }}>
        {String(value).padStart(2, "0")}
      </div>
      <div className="text-[9px] uppercase tracking-[0.25em] mt-1" style={{ color: C.faint }}>{label}</div>
    </div>
  );
}

export default function Opcion26() {
  const t = useCountdown("2026-07-25T17:00:00");

  return (
    <div
      style={{
        backgroundColor: C.bg,
        color: C.ink,
        fontFamily: "var(--font-syne)",
        backgroundImage: "radial-gradient(circle at 50% 0%, rgba(184,154,214,0.08), transparent 60%)",
      }}
      className="min-h-screen overflow-x-hidden"
    >
      <Link href="/" className="fixed top-5 left-5 z-50 text-xs uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur"
        style={{ color: C.lilaDeep, backgroundColor: "rgba(255,253,255,0.75)" }}>← volver</Link>
      <PetalRain count={14} colors={["#d9c7ee", "#c9b3e0", "#e8def4", "#b89ad6", "#cbb6e6"]} />

      {/* HERO — lavanda enmarcando + foto en óvalo */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden">
        {/* lavanda en esquinas con leve balanceo */}
        <motion.div className="absolute -top-6 -left-6 w-40 md:w-56 z-0"
          initial={{ opacity: 0 }} animate={{ opacity: 1, rotate: [0, 2, 0] }} transition={{ opacity: { duration: 1 }, rotate: { duration: 7, repeat: Infinity, ease: "easeInOut" } }}>
          <LavenderSprig className="w-full" purples={LAV} />
        </motion.div>
        <motion.div className="absolute -top-6 -right-6 w-40 md:w-56 z-0"
          initial={{ opacity: 0 }} animate={{ opacity: 1, rotate: [0, -2, 0] }} transition={{ opacity: { duration: 1 }, rotate: { duration: 7, repeat: Infinity, ease: "easeInOut" } }}>
          <LavenderSprig className="w-full" purples={LAV} mirror />
        </motion.div>
        <motion.div className="absolute -bottom-8 -left-6 w-36 md:w-48 z-0 rotate-180"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }}>
          <LavenderSprig className="w-full" purples={LAV} mirror />
        </motion.div>
        <motion.div className="absolute -bottom-8 -right-6 w-36 md:w-48 z-0 rotate-180"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }}>
          <LavenderSprig className="w-full" purples={LAV} />
        </motion.div>

        <div className="relative z-10 flex flex-col items-center">
          <BlurFade delay={0.1}>
            <p className="text-[11px] uppercase tracking-[0.5em] mb-7" style={{ color: C.lilaDeep }}>¡Nos casamos!</p>
          </BlurFade>

          {/* foto en óvalo con marco fino + flotación */}
          <BlurFade delay={0.25}>
            <motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-52 sm:w-60 aspect-[4/5] rounded-[50%] overflow-hidden mb-7"
              style={{ boxShadow: `0 0 0 1px ${C.paper}, 0 0 0 2px ${C.lila}, 0 18px 40px -16px rgba(90,70,130,0.5)` }}
            >
              <motion.div className="absolute inset-0" initial={{ scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}>
                <Image src="/1.jpg" alt={`${wedding.groom} y ${wedding.bride}`} fill priority sizes="240px" className="object-cover select-none pointer-events-none" />
              </motion.div>
            </motion.div>
          </BlurFade>

          <BlurFade delay={0.4} y={26}>
            <h1 className="text-5xl sm:text-7xl leading-[0.95]" style={{ fontFamily: "var(--font-great-vibes)", color: C.lilaDeep }}>
              {wedding.groom}
            </h1>
            <span className="block text-3xl sm:text-4xl my-0.5" style={{ fontFamily: "var(--font-great-vibes)", color: C.lila }}>&amp;</span>
            <h1 className="text-5xl sm:text-7xl leading-[0.95]" style={{ fontFamily: "var(--font-great-vibes)", color: C.lilaDeep }}>
              {wedding.bride}
            </h1>
          </BlurFade>

          <BlurFade delay={0.6}>
            <LilacRule className="my-6" />
            <p className="text-sm uppercase tracking-[0.3em]" style={{ color: C.mid }}>{wedding.dateLabel} · 2026</p>
            <p className="text-xs uppercase tracking-[0.3em] mt-1" style={{ color: C.faint }}>{wedding.city}</p>
          </BlurFade>

          <BlurFade delay={0.85}>
            <div className="mt-9 flex divide-x" style={{ borderColor: C.line }}>
              <Stat value={t.d} label="días" /><Stat value={t.h} label="hrs" /><Stat value={t.m} label="min" /><Stat value={t.s} label="seg" />
            </div>
          </BlurFade>
        </div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-6 z-10 text-[10px] uppercase tracking-[0.3em]" style={{ color: C.faint }}>↓ desliza</motion.div>
      </section>

      {/* Historia */}
      <section className="py-20 px-6 border-t" style={{ borderColor: C.line, backgroundColor: C.paper }}>
        <LilacRule className="mb-10" />
        <BlurFade className="max-w-xl mx-auto text-center">
          <p className="text-[11px] uppercase tracking-[0.4em] mb-7" style={{ color: C.lilaDeep }}>Nuestra historia</p>
          <p className="text-xl md:text-2xl leading-relaxed italic font-light" style={{ fontFamily: "var(--font-fraunces)", color: C.mid }}>
            {wedding.story}
          </p>
        </BlurFade>
      </section>

      {/* Eventos */}
      <section className="py-20 px-6 border-t relative overflow-hidden" style={{ borderColor: C.line }}>
        <BlurFade><p className="text-center text-[11px] uppercase tracking-[0.4em] mb-14" style={{ color: C.lilaDeep }}>El gran día</p></BlurFade>
        <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
          {[wedding.ceremony, wedding.reception].map((ev, i) => (
            <BlurFade key={ev.title} delay={i * 0.12}>
              <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}
                className="relative rounded-3xl p-8 text-center h-full overflow-hidden" style={{ backgroundColor: C.paper, border: `1px solid ${C.line}` }}>
                <div className="absolute -top-4 -right-4 w-20 opacity-80 pointer-events-none">
                  <LavenderSprig className="w-full" purples={LAV} mirror />
                </div>
                <div className="relative">
                  <p className="text-[10px] uppercase tracking-[0.3em] mb-3" style={{ color: C.faint }}>{ev.title}</p>
                  <p className="text-5xl mb-3" style={{ fontFamily: "var(--font-great-vibes)", color: C.lila }}>{ev.time}</p>
                  <p className="text-lg font-medium mb-1">{ev.place}</p>
                  <p className="text-sm mb-5" style={{ color: C.mid }}>{ev.address}</p>
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(ev.mapsQuery)}`} target="_blank" rel="noopener noreferrer"
                    className="inline-block text-[11px] uppercase tracking-[0.25em] px-6 py-2.5 rounded-full text-white transition-opacity hover:opacity-85"
                    style={{ backgroundColor: C.lilaDeep }}>
                    Ver mapa
                  </a>
                </div>
              </motion.div>
            </BlurFade>
          ))}
        </div>
      </section>

      {/* Dress code */}
      <section className="py-16 px-6 border-t text-center" style={{ borderColor: C.line, backgroundColor: C.paper }}>
        <BlurFade className="max-w-md mx-auto">
          <p className="text-[11px] uppercase tracking-[0.4em] mb-3" style={{ color: C.lilaDeep }}>Código de vestimenta</p>
          <p className="text-3xl italic" style={{ fontFamily: "var(--font-fraunces)" }}>{wedding.dressCode}</p>
          <div className="flex justify-center gap-2 mt-5">
            {wedding.dressCodePalette.map((c, i) => (
              <motion.span key={c.hex} className="w-7 h-7 rounded-full" style={{ backgroundColor: c.hex, border: `1px solid ${C.line}` }} title={c.name}
                initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08, type: "spring", stiffness: 200, damping: 12 }} />
            ))}
          </div>
        </BlurFade>
      </section>

      {/* Padrinos */}
      <section className="py-20 px-6 border-t" style={{ borderColor: C.line }}>
        <BlurFade><p className="text-center text-[11px] uppercase tracking-[0.4em] mb-12" style={{ color: C.lilaDeep }}>Padrinos</p></BlurFade>
        <div className="max-w-2xl mx-auto grid sm:grid-cols-2 gap-4">
          {wedding.godparents.map((gp, i) => (
            <BlurFade key={gp.role} delay={i * 0.08}>
              <div className="rounded-2xl px-5 py-4 text-center h-full" style={{ border: `1px solid ${C.line}`, backgroundColor: C.paper }}>
                <p className="text-[10px] uppercase tracking-[0.3em] mb-2" style={{ color: C.lilaDeep }}>{gp.role}</p>
                <p className="text-sm">{gp.names}</p>
              </div>
            </BlurFade>
          ))}
        </div>
      </section>

      {/* RSVP */}
      <section className="py-24 px-6 border-t text-center relative overflow-hidden" style={{ borderColor: C.line, backgroundColor: C.paper }}>
        <div className="absolute -bottom-8 -left-6 w-36 opacity-70 rotate-180 pointer-events-none"><LavenderSprig className="w-full" purples={LAV} mirror /></div>
        <div className="absolute -bottom-8 -right-6 w-36 opacity-70 rotate-180 pointer-events-none"><LavenderSprig className="w-full" purples={LAV} /></div>
        <BlurFade className="max-w-md mx-auto relative">
          <LilacRule className="mb-8" />
          <h2 className="text-5xl md:text-6xl mb-6" style={{ fontFamily: "var(--font-great-vibes)", color: C.lilaDeep }}>¡Te esperamos!</h2>
          <p className="mb-10" style={{ color: C.mid }}>
            Confirma antes del <strong style={{ color: C.lilaDeep }}>{wedding.rsvpDeadline}</strong>.
          </p>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            className="inline-block px-10 py-4 rounded-full text-white text-sm uppercase tracking-[0.25em] cursor-pointer"
            style={{ backgroundColor: C.lilaDeep }}>
            Confirmar asistencia
          </motion.div>
        </BlurFade>
      </section>

      <footer className="py-12 text-center border-t" style={{ borderColor: C.line }}>
        <p className="text-4xl mb-2" style={{ fontFamily: "var(--font-great-vibes)", color: C.lilaDeep }}>
          {wedding.groom} &amp; {wedding.bride}
        </p>
        <p className="text-[10px] uppercase tracking-[0.4em]" style={{ color: C.faint }}>{wedding.dateShort} · {wedding.city}</p>
      </footer>
    </div>
  );
}
