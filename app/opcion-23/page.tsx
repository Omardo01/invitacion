"use client";

import Link from "next/link";
import { motion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";
import { wedding } from "@/lib/wedding";
import { BlurFade, useCountdown } from "@/components/magic";
import { PetalRain, FloralCorner, FloralDivider } from "@/components/floral";

/* ─── Línea de tiempo · una línea SVG que se dibuja con el scroll ─── */
const C = {
  bg: "#fcfbfe", ink: "#211c2e", mid: "#6f6880", faint: "#a8a2b6", line: "#ebe7f1", accent: "#8a5fb0",
};

const schedule = [
  { time: "17:00", title: "Ceremonia", place: wedding.ceremony.place, icon: "⛪" },
  { time: "19:30", title: "Recepción", place: wedding.reception.place, icon: "🥂" },
  { time: "21:00", title: "Cena", place: "Salón principal", icon: "🍽️" },
  { time: "22:30", title: "Fiesta", place: "¡A bailar!", icon: "🎶" },
  { time: "02:00", title: "Cierre", place: "Tornaboda", icon: "✨" },
];

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center px-5">
      <div className="text-3xl md:text-4xl font-medium tabular-nums">{String(value).padStart(2, "0")}</div>
      <div className="text-[10px] uppercase tracking-[0.3em] mt-1.5" style={{ color: C.faint }}>{label}</div>
    </div>
  );
}

export default function Opcion23() {
  const t = useCountdown("2026-07-25T17:00:00");
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ["start center", "end center"] });
  const pathLength = useSpring(scrollYProgress, { stiffness: 80, damping: 30, restDelta: 0.001 });

  return (
    <div style={{ backgroundColor: C.bg, color: C.ink, fontFamily: "var(--font-syne)" }} className="min-h-screen overflow-x-hidden">
      <Link href="/" className="fixed top-5 left-5 z-50 text-xs uppercase tracking-widest" style={{ color: C.mid }}>← volver</Link>
      <PetalRain count={13} />

      {/* HERO */}
      <section className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center text-center px-6">
        <FloralCorner className="absolute -top-2 -left-2 w-36 h-36 md:w-56 md:h-56 z-0 opacity-80" color="#8a5fb0" soft="#c4aee0" />
        <FloralCorner className="absolute -top-2 -right-2 w-36 h-36 md:w-56 md:h-56 z-0 opacity-80" color="#8a5fb0" soft="#c4aee0" mirror />
        <BlurFade delay={0.1}><p className="text-[11px] uppercase tracking-[0.5em] mb-10" style={{ color: C.accent }}>Nos casamos</p></BlurFade>
        <BlurFade delay={0.2} y={28}>
          <h1 className="text-6xl md:text-8xl font-medium tracking-tight leading-[0.95]">{wedding.groom}</h1>
          <span className="block text-4xl italic my-2" style={{ fontFamily: "var(--font-fraunces)", color: C.accent }}>&amp;</span>
          <h1 className="text-6xl md:text-8xl font-medium tracking-tight leading-[0.95]">{wedding.bride}</h1>
        </BlurFade>
        <BlurFade delay={0.4}><p className="mt-8 text-sm uppercase tracking-[0.35em]" style={{ color: C.mid }}>{wedding.dateShort} · {wedding.city}</p></BlurFade>
        <BlurFade delay={0.6}>
          <div className="mt-16 flex divide-x" style={{ borderColor: C.line }}>
            <Stat value={t.d} label="días" /><Stat value={t.h} label="hrs" /><Stat value={t.m} label="min" /><Stat value={t.s} label="seg" />
          </div>
        </BlurFade>
      </section>

      {/* Historia */}
      <section className="py-28 px-6 border-t" style={{ borderColor: C.line }}>
        <FloralDivider className="mb-14" color="#8a5fb0" soft="#c4aee0" />
        <BlurFade className="max-w-xl mx-auto text-center">
          <p className="text-[11px] uppercase tracking-[0.35em] mb-8" style={{ color: C.accent }}>Nuestra historia</p>
          <p className="text-xl leading-relaxed font-light" style={{ color: C.mid }}>{wedding.story}</p>
        </BlurFade>
      </section>

      {/* LÍNEA DE TIEMPO */}
      <section className="py-28 px-6 border-t" style={{ borderColor: C.line }}>
        <BlurFade><p className="text-center text-[11px] uppercase tracking-[0.35em] mb-20" style={{ color: C.accent }}>El itinerario del día</p></BlurFade>

        <div ref={timelineRef} className="relative max-w-xl mx-auto">
          {/* Línea base (gris) */}
          <div className="absolute left-[19px] top-2 bottom-2 w-px" style={{ backgroundColor: C.line }} />
          {/* Línea que se dibuja */}
          <svg className="absolute left-[15px] top-2 h-[calc(100%-1rem)] w-2 overflow-visible" viewBox="0 0 2 100" preserveAspectRatio="none">
            <motion.line x1="1" y1="0" x2="1" y2="100" stroke={C.accent} strokeWidth="2" style={{ pathLength }} />
          </svg>

          <div className="space-y-12">
            {schedule.map((item, i) => (
              <div key={i} className="relative pl-16">
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-40% 0px -40% 0px" }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="absolute left-[8px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px]"
                  style={{ backgroundColor: C.bg, border: `2px solid ${C.accent}` }}
                >
                  {item.icon}
                </motion.span>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-30% 0px -30% 0px" }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-[10px] uppercase tracking-[0.3em] tabular-nums" style={{ color: C.faint }}>{item.time}</p>
                  <h3 className="text-3xl tracking-tight mt-0.5" style={{ fontFamily: "var(--font-fraunces)", color: C.accent }}>{item.title}</h3>
                  <p className="text-sm mt-0.5" style={{ color: C.mid }}>{item.place}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-xl mx-auto mt-16 flex gap-3 justify-center pl-16">
          {[wedding.ceremony, wedding.reception].map((ev) => (
            <a key={ev.title} href={`https://maps.google.com/?q=${encodeURIComponent(ev.mapsQuery)}`} target="_blank" rel="noopener noreferrer"
              className="text-[11px] uppercase tracking-[0.25em] border-b pb-0.5 transition-opacity hover:opacity-60" style={{ borderColor: C.ink }}>
              Mapa · {ev.title}
            </a>
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

      {/* RSVP */}
      <section className="py-32 px-6 border-t text-center" style={{ borderColor: C.line }}>
        <BlurFade className="max-w-md mx-auto">
          <h2 className="text-4xl font-medium tracking-tight mb-5" style={{ color: C.accent }}>¿Nos acompañas?</h2>
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
