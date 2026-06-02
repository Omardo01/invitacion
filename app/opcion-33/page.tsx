"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { wedding } from "@/lib/wedding";
import { BlurFade, useCountdown } from "@/components/magic";
import { PetalRain, FloralCorner, FloralDivider, Blossom } from "@/components/floral";

/* ─── La Definitiva · lila · blanco · plata · combinación de 24+11+13+9+1 ─── */
const C = {
  bg: "#faf8fd",
  paper: "#ffffff",
  paper2: "#f1ecf9",
  ink: "#352c4e",
  mid: "#6c628a",
  faint: "#a79ec0",
  line: "#e8e2f3",
  lila: "#b89ad6",
  lilaDeep: "#8a6cb8",
  plata: "#c4c0d6",
  plataDeep: "#8e8aa6",
};

/* padres (no están en wedding.ts) */
const parents = {
  novia: { label: "Padres de la novia", names: ["Edith Guamán Tinoco", "Humberto Benito González"] },
  novio: { label: "Padres del novio", names: ["Catalina Núñez Martínez", "Alfredo Maldonado Reyes"] },
};

/* programa / itinerario */
const itinerary = [
  { time: "17:00", label: "Ceremonia religiosa", sub: "Parroquia de San Agustín" },
  { time: "18:30", label: "Cóctel de bienvenida", sub: "Jardín principal" },
  { time: "19:30", label: "Recepción", sub: "Hacienda Los Laureles" },
  { time: "21:00", label: "Cena", sub: "Salón principal" },
  { time: "22:30", label: "Baile", sub: "¡A celebrar!" },
  { time: "02:00", label: "Despedida", sub: "Hasta pronto" },
];

/* ── revelado de letras (de la opción 24) ── */
function LetterReveal({ text, delay = 0, className = "", style = {} }: { text: string; delay?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <span className={className} style={style} aria-label={text}>
      {[...text].map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block"
          initial={{ opacity: 0, y: "0.5em", filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: delay + i * 0.05, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {ch === " " ? " " : ch}
        </motion.span>
      ))}
    </span>
  );
}

function SectionTitle({ children, kicker }: { children: React.ReactNode; kicker?: string }) {
  return (
    <div className="text-center mb-10">
      {kicker && <p className="text-[11px] uppercase tracking-[0.4em] mb-3" style={{ color: C.lilaDeep }}>{kicker}</p>}
      <h2 className="text-4xl md:text-5xl" style={{ fontFamily: "var(--font-great-vibes)", color: C.lilaDeep }}>{children}</h2>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center px-3 sm:px-5">
      <div className="text-3xl md:text-4xl tabular-nums" style={{ fontFamily: "var(--font-fraunces)", color: C.lilaDeep }}>
        {String(value).padStart(2, "0")}
      </div>
      <div className="text-[9px] uppercase tracking-[0.25em] mt-1" style={{ color: C.faint }}>{label}</div>
    </div>
  );
}

/* ── Calendario julio 2026, día 25 marcado (de la opción 28) ── */
function Calendar() {
  const year = 2026, month = 6, highlight = 25;
  const startDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const total = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(startDay).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)];
  return (
    <div className="max-w-[320px] mx-auto">
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
          <div key={i} className="text-[10px] uppercase tracking-wide text-center" style={{ color: C.faint }}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((n, i) => (
          <div key={i} className="aspect-square flex items-center justify-center text-sm tabular-nums">
            {n === highlight ? (
              <motion.span
                initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.3 }}
                className="relative w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: C.lilaDeep }}
              >
                {n}
                <motion.span
                  className="absolute inset-0 rounded-full"
                  style={{ border: `1px solid ${C.lila}` }}
                  animate={{ scale: [1, 1.35, 1], opacity: [0.7, 0, 0.7] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.span>
            ) : (
              <span style={{ color: n ? C.mid : "transparent" }}>{n ?? "·"}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Itinerario con línea que avanza conforme al scroll ── */
function Itinerary() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 65%"] });
  const lineScale = useSpring(scrollYProgress, { stiffness: 80, damping: 26, restDelta: 0.001 });
  return (
    <div ref={ref} className="relative max-w-md mx-auto">
      {/* riel base */}
      <div className="absolute left-1/2 -translate-x-1/2 top-2 bottom-2 w-px" style={{ backgroundColor: C.line }} />
      {/* progreso */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 top-2 w-px origin-top"
        style={{ height: "calc(100% - 1rem)", scaleY: lineScale, background: `linear-gradient(to bottom, ${C.lila}, ${C.lilaDeep})` }}
      />
      <div className="space-y-10">
        {itinerary.map((it, i) => (
          <div key={it.label} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            {/* lado izquierdo */}
            <div className={i % 2 === 0 ? "text-right pr-2" : ""}>
              {i % 2 === 0 && (
                <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6 }}>
                  <p className="text-lg font-semibold" style={{ fontFamily: "var(--font-fraunces)", color: C.ink }}>{it.time}</p>
                  <p className="text-sm" style={{ color: C.lilaDeep }}>{it.label}</p>
                  <p className="text-xs" style={{ color: C.faint }}>{it.sub}</p>
                </motion.div>
              )}
            </div>
            {/* punto central */}
            <motion.span
              initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true, margin: "-60px" }}
              transition={{ type: "spring", stiffness: 240, damping: 14 }}
              className="relative z-10 w-3.5 h-3.5 rounded-full"
              style={{ backgroundColor: C.lilaDeep, boxShadow: `0 0 0 4px ${C.paper}` }}
            />
            {/* lado derecho */}
            <div className={i % 2 === 1 ? "text-left pl-2" : ""}>
              {i % 2 === 1 && (
                <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.6 }}>
                  <p className="text-lg font-semibold" style={{ fontFamily: "var(--font-fraunces)", color: C.ink }}>{it.time}</p>
                  <p className="text-sm" style={{ color: C.lilaDeep }}>{it.label}</p>
                  <p className="text-xs" style={{ color: C.faint }}>{it.sub}</p>
                </motion.div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Opcion33() {
  const t = useCountdown("2026-07-25T17:00:00");

  return (
    <div style={{ backgroundColor: C.bg, color: C.ink, fontFamily: "var(--font-syne)" }} className="min-h-screen overflow-x-hidden relative">
      {/* textura de puntos (de la opción 1) — aplicada globalmente y reforzada por sección */}
      <style>{`
        .grain {
          background-image:
            radial-gradient(rgba(138,108,184,0.07) 1px, transparent 1px),
            radial-gradient(rgba(138,108,184,0.05) 1px, transparent 1px);
          background-size: 3px 3px, 7px 7px;
          background-position: 0 0, 1.5px 1.5px;
        }
      `}</style>

      <Link href="/" className="fixed top-5 left-5 z-50 text-xs uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur"
        style={{ color: C.lilaDeep, backgroundColor: "rgba(255,255,255,0.7)" }}>← volver</Link>

      {/* pétalos en TODA la página */}
      <PetalRain count={18} colors={["#d9c7ee", "#c9b3e0", "#e8def4", "#b89ad6", "#cbb6e6", "#cfc9dc"]} />

      {/* ░░ HERO — fecha gigante detrás + nombres con revelado de letras (de la 9 y la 24) ░░ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden grain">
        <FloralCorner className="absolute -top-2 -left-2 w-32 h-32 md:w-52 md:h-52 z-0" color={C.lilaDeep} soft={C.lila} />
        <FloralCorner className="absolute -top-2 -right-2 w-32 h-32 md:w-52 md:h-52 z-0" color={C.lilaDeep} soft={C.lila} mirror />
        <FloralCorner className="absolute -bottom-2 -left-2 w-28 h-28 md:w-44 md:h-44 z-0 rotate-180" color={C.lilaDeep} soft={C.lila} mirror />
        <FloralCorner className="absolute -bottom-2 -right-2 w-28 h-28 md:w-44 md:h-44 z-0 rotate-180" color={C.lilaDeep} soft={C.lila} />

        {/* fecha gigante translúcida de fondo */}
        <div className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none z-0 leading-[0.8]">
          <motion.span initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4 }}
            className="text-[34vw]" style={{ fontFamily: "var(--font-fraunces)", color: "rgba(138,108,184,0.07)" }}>25</motion.span>
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.4, delay: 0.2 }}
            className="text-[16vw] -mt-4" style={{ fontFamily: "var(--font-great-vibes)", color: "rgba(138,108,184,0.1)" }}>julio</motion.span>
          <motion.span initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4, delay: 0.1 }}
            className="text-[20vw]" style={{ fontFamily: "var(--font-fraunces)", color: "rgba(138,108,184,0.07)" }}>2026</motion.span>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          {/* foto de los novios en óvalo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-40 sm:w-48 aspect-[4/5] rounded-[50%] overflow-hidden mb-7"
            style={{ boxShadow: `0 0 0 1px ${C.paper}, 0 0 0 2px ${C.lila}, 0 18px 40px -16px rgba(120,90,170,0.5)` }}
          >
            <motion.div className="absolute inset-0" initial={{ scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}>
              <Image src="/1.jpg" alt={`${wedding.groom} y ${wedding.bride}`} fill priority sizes="200px" className="object-cover select-none pointer-events-none" />
            </motion.div>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-[11px] uppercase tracking-[0.5em] mb-7" style={{ color: C.lilaDeep }}>Nuestra boda</motion.p>

          <h1 className="text-5xl sm:text-7xl md:text-8xl leading-[0.95]" style={{ fontFamily: "var(--font-great-vibes)", color: C.ink }}>
            <LetterReveal text={wedding.groom} delay={0.5} />
          </h1>
          <motion.span initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1, type: "spring" }}
            className="block text-3xl sm:text-5xl my-1" style={{ fontFamily: "var(--font-great-vibes)", color: C.lila }}>&amp;</motion.span>
          <h1 className="text-5xl sm:text-7xl md:text-8xl leading-[0.95]" style={{ fontFamily: "var(--font-great-vibes)", color: C.ink }}>
            <LetterReveal text={wedding.bride} delay={1.2} />
          </h1>

          <BlurFade delay={1.8}>
            <FloralDivider className="my-7" color={C.lilaDeep} soft={C.lila} />
            <p className="text-sm uppercase tracking-[0.35em]" style={{ color: C.mid }}>25 de Julio · 2026</p>
            <p className="text-xs uppercase tracking-[0.3em] mt-1" style={{ color: C.faint }}>{wedding.city}</p>
          </BlurFade>
        </div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-6 z-10 text-[10px] uppercase tracking-[0.3em]" style={{ color: C.faint }}>↓ desliza</motion.div>
      </section>

      {/* ░░ PADRES ░░ */}
      <section className="py-20 px-6 border-t" style={{ borderColor: C.line }}>
        <SectionTitle kicker="Con la bendición de">Nuestros padres</SectionTitle>
        <div className="max-w-2xl mx-auto grid sm:grid-cols-2 gap-6">
          {[parents.novia, parents.novio].map((p, i) => (
            <BlurFade key={p.label} delay={i * 0.12}>
              <div className="rounded-3xl p-7 text-center h-full" style={{ backgroundColor: C.paper, border: `1px solid ${C.line}`, boxShadow: "0 10px 30px -16px rgba(120,90,170,0.25)" }}>
                <p className="text-[10px] uppercase tracking-[0.3em] mb-3" style={{ color: C.lilaDeep }}>{p.label}</p>
                {p.names.map((n) => <p key={n} className="text-base" style={{ color: C.ink }}>{n}</p>)}
              </div>
            </BlurFade>
          ))}
        </div>
      </section>

      {/* ░░ HISTORIA ░░ */}
      <section className="py-20 px-6 border-t grain" style={{ borderColor: C.line, backgroundColor: C.paper2 }}>
        <SectionTitle kicker="Cómo empezó todo">Nuestra historia</SectionTitle>
        <BlurFade className="max-w-xl mx-auto text-center">
          <p className="text-xl md:text-2xl leading-relaxed italic font-light" style={{ fontFamily: "var(--font-fraunces)", color: C.mid }}>
            {wedding.story}
          </p>
        </BlurFade>
      </section>

      {/* ░░ CONTADOR ░░ */}
      <section className="py-16 px-6 border-t" style={{ borderColor: C.line }}>
        <BlurFade><p className="text-center text-[11px] uppercase tracking-[0.4em] mb-8" style={{ color: C.lilaDeep }}>Falta poco</p></BlurFade>
        <div className="mx-auto w-fit flex divide-x rounded-2xl px-4 py-5"
          style={{ borderColor: C.line, backgroundColor: "rgba(255,255,255,0.55)", boxShadow: "0 10px 30px -16px rgba(120,90,170,0.25)", backdropFilter: "blur(6px)" }}>
          <Stat value={t.d} label="días" /><Stat value={t.h} label="hrs" /><Stat value={t.m} label="min" /><Stat value={t.s} label="seg" />
        </div>
      </section>

      {/* ░░ CALENDARIO ░░ */}
      <section className="py-20 px-6 border-t grain" style={{ borderColor: C.line, backgroundColor: C.paper2 }}>
        <SectionTitle kicker="Reserva la fecha">El gran día</SectionTitle>
        <BlurFade><p className="text-center text-xs uppercase tracking-[0.3em] mb-8" style={{ color: C.faint }}>Sábado · Julio 2026</p></BlurFade>
        <BlurFade><Calendar /></BlurFade>
      </section>

      {/* ░░ LUGAR / UBICACIÓN ░░ */}
      <section className="py-20 px-6 border-t" style={{ borderColor: C.line }}>
        <SectionTitle kicker="Dónde celebraremos">Lugar</SectionTitle>
        <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
          {[wedding.ceremony, wedding.reception].map((ev, i) => (
            <BlurFade key={ev.title} delay={i * 0.12}>
              <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}
                className="rounded-3xl p-8 text-center h-full" style={{ backgroundColor: C.paper, border: `1px solid ${C.line}`, boxShadow: "0 12px 30px -14px rgba(120,90,170,0.22)" }}>
                <p className="text-[10px] uppercase tracking-[0.3em] mb-2" style={{ color: C.faint }}>{ev.title}</p>
                <p className="text-5xl mb-3" style={{ fontFamily: "var(--font-great-vibes)", color: C.lilaDeep }}>{ev.time}</p>
                <p className="text-lg font-medium mb-1">{ev.place}</p>
                <p className="text-sm mb-5" style={{ color: C.mid }}>{ev.address}</p>
                <a href={`https://maps.google.com/?q=${encodeURIComponent(ev.mapsQuery)}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] px-6 py-2.5 rounded-full text-white transition-opacity hover:opacity-85"
                  style={{ backgroundColor: C.lilaDeep }}>
                  📍 Ver ubicación
                </a>
              </motion.div>
            </BlurFade>
          ))}
        </div>
      </section>

      {/* ░░ DRESS CODE ░░ */}
      <section className="py-20 px-6 border-t grain text-center" style={{ borderColor: C.line, backgroundColor: C.paper2 }}>
        <SectionTitle kicker="Etiqueta">Código de vestimenta</SectionTitle>
        <BlurFade className="max-w-md mx-auto">
          <p className="text-2xl italic mb-2" style={{ fontFamily: "var(--font-fraunces)", color: C.ink }}>{wedding.dressCode}</p>
          <div className="text-sm mb-7 space-y-1" style={{ color: C.mid }}>
            <p><strong style={{ color: C.ink }}>Ellas:</strong> {wedding.dressCodeNotes.ellas}</p>
            <p><strong style={{ color: C.ink }}>Ellos:</strong> {wedding.dressCodeNotes.ellos}</p>
          </div>

          <p className="text-[10px] uppercase tracking-[0.3em] mb-3" style={{ color: C.lilaDeep }}>Paleta sugerida</p>
          <div className="flex justify-center gap-2 mb-8">
            {wedding.dressCodePalette.map((c, i) => (
              <motion.span key={c.hex} title={c.name} className="w-8 h-8 rounded-full" style={{ backgroundColor: c.hex, border: `1px solid ${C.line}` }}
                initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08, type: "spring", stiffness: 200, damping: 12 }} />
            ))}
          </div>

          <p className="text-[10px] uppercase tracking-[0.3em] mb-3" style={{ color: C.lilaDeep }}>Colores reservados · por favor evítalos</p>
          <div className="flex justify-center gap-5">
            {[{ n: "Blanco", h: "#ffffff" }, { n: "Marfil", h: "#f3ecdd" }, { n: "Beige", h: "#e3d6c3" }].map((c) => (
              <div key={c.n} className="flex flex-col items-center gap-1">
                <span className="relative w-9 h-9 rounded-full grid place-items-center" style={{ backgroundColor: c.h, border: `1px solid ${C.line}` }}>
                  <span className="absolute w-full h-px rotate-45" style={{ backgroundColor: "#d24a4a" }} />
                </span>
                <span className="text-[10px]" style={{ color: C.faint }}>{c.n}</span>
              </div>
            ))}
          </div>
        </BlurFade>
      </section>

      {/* ░░ ITINERARIO / PROGRAMA ░░ */}
      <section className="py-20 px-6 border-t" style={{ borderColor: C.line }}>
        <SectionTitle kicker="Programa del día">Itinerario</SectionTitle>
        <Itinerary />
        <BlurFade><div className="flex justify-center mt-10"><svg width="40" height="26" viewBox="0 0 48 32" fill="none" stroke={C.lila} strokeWidth="1.2"><path d="M4 22h40M8 22l3-9h18l7 9M14 13v9M22 13v9" /><circle cx="14" cy="24" r="3" /><circle cx="34" cy="24" r="3" /></svg></div></BlurFade>
      </section>

      {/* ░░ MESA DE REGALOS ░░ */}
      <section className="py-20 px-6 border-t grain" style={{ borderColor: C.line, backgroundColor: C.paper2 }}>
        <SectionTitle kicker="Si deseas obsequiarnos algo">Mesa de regalos</SectionTitle>
        <BlurFade className="max-w-lg mx-auto text-center">
          <p className="italic text-lg mb-8" style={{ fontFamily: "var(--font-fraunces)", color: C.mid }}>
            Tu presencia es nuestro mayor regalo, pero si deseas tener un detalle con nosotros, aquí te dejamos algunas opciones.
          </p>
          <div className="space-y-3">
            {wedding.gifts.map((g, i) => (
              <BlurFade key={g.store} delay={i * 0.08}>
                <a href={g.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between px-5 py-4 rounded-2xl transition-transform hover:scale-[1.02]"
                  style={{ backgroundColor: C.paper, border: `1px solid ${C.line}` }}>
                  <span className="font-medium text-sm">{g.store}</span>
                  <span className="text-xs" style={{ color: C.faint }}>{g.code}</span>
                  <span className="text-xs uppercase tracking-widest" style={{ color: C.lilaDeep }}>Ver →</span>
                </a>
              </BlurFade>
            ))}
          </div>
        </BlurFade>
      </section>

      {/* ░░ CONFIRMAR ASISTENCIA ░░ */}
      <section className="relative py-24 px-6 border-t text-center overflow-hidden" style={{ borderColor: C.line }}>
        <svg className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-64 opacity-60" viewBox="0 0 220 60" fill="none">
          <Blossom cx={110} cy={30} r={9} petalR={6} color={C.lila} center={C.lilaDeep} delay={0.2} />
          <Blossom cx={80} cy={36} r={6} petalR={4} color={C.lila} center={C.lilaDeep} delay={0.35} />
          <Blossom cx={140} cy={36} r={6} petalR={4} color={C.lila} center={C.lilaDeep} delay={0.45} />
        </svg>
        <BlurFade className="max-w-md mx-auto relative">
          <SectionTitle kicker="Te esperamos">¿Nos acompañas?</SectionTitle>
          <p className="mb-10" style={{ color: C.mid }}>
            Tu respuesta hace este día más nuestro. Confirma antes del <strong style={{ color: C.lilaDeep }}>{wedding.rsvpDeadline}</strong>.
          </p>
          <motion.a href="#" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            className="inline-block px-10 py-4 rounded-full text-white text-sm uppercase tracking-[0.25em]"
            style={{ backgroundColor: C.lilaDeep }}>
            Confirmar asistencia
          </motion.a>
          <p className="mt-5 text-xs" style={{ color: C.faint }}>En tu invitación personalizada tendrás tu enlace único</p>
        </BlurFade>
      </section>

      <footer className="py-12 text-center border-t grain" style={{ borderColor: C.line, backgroundColor: C.paper2 }}>
        <p className="text-4xl mb-2" style={{ fontFamily: "var(--font-great-vibes)", color: C.lilaDeep }}>{wedding.groom} &amp; {wedding.bride}</p>
        <p className="text-[10px] uppercase tracking-[0.4em]" style={{ color: C.faint }}>{wedding.dateShort} · {wedding.city}</p>
        <p className="text-[10px] uppercase tracking-[0.3em] mt-2" style={{ color: C.lila }}>{wedding.hashtag}</p>
      </footer>
    </div>
  );
}
