"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type { PointerEvent } from "react";
import { wedding } from "@/lib/wedding";
import { BlurFade, useCountdown } from "@/components/magic";
import { PetalRain, WatercolorBouquet } from "@/components/floral";

/* ─── Tarjeta Floral Enmarcada · plata + lila + blanco · animada ─── */
const C = {
  bg: "#f4f3f7",
  bg2: "#ebe9f0",
  paper: "#ffffff",
  ink: "#332b3f",
  mid: "#6e6480",
  faint: "#a8a2b4",
  line: "#e4e1ea",
  silver: "#a9a7b8",
  silverDeep: "#7c7a90",
  accent: "#9b7cc7",
};

// ramo en tonos lila
const LILAC = ["#c9b3e0", "#b89ad6", "#d9c7ee", "#9b7cc7"];

function SilverRule({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <span className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${C.silver})` }} />
      <motion.span
        className="text-sm" style={{ color: C.silverDeep }}
        animate={{ rotate: [0, 180, 360], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >✦</motion.span>
      <span className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${C.silver})` }} />
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center px-3 sm:px-4">
      <div className="text-3xl md:text-4xl tabular-nums" style={{ fontFamily: "var(--font-fraunces)", color: C.silverDeep }}>
        {String(value).padStart(2, "0")}
      </div>
      <div className="text-[9px] uppercase tracking-[0.25em] mt-1" style={{ color: C.faint }}>{label}</div>
    </div>
  );
}

/* Tarjeta con tilt 3D + flotación suave */
function FloatingTilt({ children }: { children: React.ReactNode }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 150, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), { stiffness: 150, damping: 18 });
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.div
        onPointerMove={(e: PointerEvent<HTMLDivElement>) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width - 0.5);
          my.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onPointerLeave={() => { mx.set(0); my.set(0); }}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="relative"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default function Opcion25() {
  const t = useCountdown("2026-07-25T17:00:00");

  return (
    <div style={{ backgroundColor: C.bg, color: C.ink, fontFamily: "var(--font-syne)" }} className="min-h-screen overflow-x-hidden">
      <Link href="/" className="fixed top-5 left-5 z-50 text-xs uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur"
        style={{ color: C.silverDeep, backgroundColor: "rgba(255,255,255,0.7)" }}>← volver</Link>
      <PetalRain count={12} colors={["#d9c7ee", "#c9b3e0", "#e8def4", "#b89ad6", "#cfc9dc"]} />

      {/* HERO — tarjeta de invitación flotante */}
      <section className="min-h-screen flex items-center justify-center px-5 py-16" style={{ perspective: 1200 }}>
        <BlurFade y={36}>
          <FloatingTilt>
            <div
              className="relative w-[min(92vw,440px)] rounded-[6px] px-7 pt-10 pb-9"
              style={{
                backgroundColor: C.paper,
                boxShadow: "0 40px 80px -20px rgba(60,55,80,0.32), 0 8px 20px rgba(60,55,80,0.12)",
              }}
            >
              {/* brillo plateado que recorre la tarjeta (recortado a la tarjeta) */}
              <div className="pointer-events-none absolute inset-0 rounded-[6px] overflow-hidden">
                <motion.div
                  aria-hidden
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(115deg, transparent 38%, rgba(255,255,255,0.65) 50%, transparent 62%)", backgroundSize: "260% 100%" }}
                  animate={{ backgroundPositionX: ["210%", "-60%"] }}
                  transition={{ duration: 6.5, repeat: Infinity, ease: "linear" }}
                />
              </div>

              {/* doble marco plata */}
              <div className="pointer-events-none absolute inset-3 rounded-[3px]" style={{ border: `1px solid ${C.silver}` }} />
              <div className="pointer-events-none absolute inset-[14px] rounded-[2px]" style={{ border: `1px solid ${C.silver}55` }} />

              {/* ramos lila en las esquinas */}
              <WatercolorBouquet className="absolute -top-6 -left-5 w-32 z-10" delay={0.3} petals={LILAC.slice(0, 3)} centers="#9b7cc7" />
              <WatercolorBouquet className="absolute -bottom-7 -right-5 w-32 z-10" mirror delay={0.5} petals={LILAC.slice(0, 3)} centers="#9b7cc7" />

              <div className="relative z-[5] flex flex-col items-center text-center" style={{ transform: "translateZ(40px)" }}>
                <p className="text-[10px] uppercase tracking-[0.45em] mb-5" style={{ color: C.silverDeep }}>Nos casamos</p>

                {/* foto en arco con marco plata */}
                <div className="relative mb-6">
                  <div className="relative w-44 sm:w-48 aspect-[3/4] rounded-t-[999px] overflow-hidden"
                    style={{ boxShadow: `0 0 0 3px ${C.paper}, 0 0 0 4px ${C.silver}` }}>
                    <motion.div
                      className="absolute inset-0"
                      initial={{ scale: 1.08 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Image
                        src="/1.jpg"
                        alt={`${wedding.groom} y ${wedding.bride}`}
                        fill
                        priority
                        sizes="200px"
                        className="object-cover select-none pointer-events-none"
                      />
                    </motion.div>
                  </div>
                </div>

                <h1 className="text-5xl sm:text-6xl leading-[0.95]" style={{ fontFamily: "var(--font-great-vibes)", color: C.ink }}>
                  {wedding.groom}
                </h1>
                <span className="text-3xl my-0.5" style={{ fontFamily: "var(--font-great-vibes)", color: C.accent }}>&amp;</span>
                <h1 className="text-5xl sm:text-6xl leading-[0.95]" style={{ fontFamily: "var(--font-great-vibes)", color: C.ink }}>
                  {wedding.bride}
                </h1>

                <SilverRule className="my-6" />

                <div className="flex items-stretch gap-4">
                  <div className="text-right pr-4 flex flex-col justify-center" style={{ borderRight: `1px solid ${C.silver}66` }}>
                    <p className="text-[10px] uppercase tracking-[0.3em]" style={{ color: C.mid }}>Sábado</p>
                    <p className="text-[10px] uppercase tracking-[0.3em]" style={{ color: C.mid }}>Julio</p>
                  </div>
                  <p className="text-6xl tabular-nums" style={{ fontFamily: "var(--font-fraunces)", color: C.silverDeep }}>25</p>
                  <div className="text-left pl-4 flex flex-col justify-center" style={{ borderLeft: `1px solid ${C.silver}66` }}>
                    <p className="text-[10px] uppercase tracking-[0.3em]" style={{ color: C.mid }}>2026</p>
                    <p className="text-[10px] uppercase tracking-[0.3em]" style={{ color: C.mid }}>17:00 h</p>
                  </div>
                </div>

                <p className="mt-5 text-xs uppercase tracking-[0.3em]" style={{ color: C.faint }}>{wedding.city}</p>
              </div>
            </div>
          </FloatingTilt>
        </BlurFade>
      </section>

      {/* Countdown */}
      <section className="py-10 flex justify-center">
        <div className="flex divide-x" style={{ borderColor: C.line }}>
          <Stat value={t.d} label="días" /><Stat value={t.h} label="hrs" /><Stat value={t.m} label="min" /><Stat value={t.s} label="seg" />
        </div>
      </section>

      {/* Historia */}
      <section className="py-20 px-6 border-t" style={{ borderColor: C.line, backgroundColor: C.bg2 }}>
        <SilverRule className="mb-10" />
        <BlurFade className="max-w-xl mx-auto text-center">
          <p className="text-[11px] uppercase tracking-[0.4em] mb-7" style={{ color: C.silverDeep }}>Nuestra historia</p>
          <p className="text-xl md:text-2xl leading-relaxed italic font-light" style={{ fontFamily: "var(--font-fraunces)", color: C.mid }}>
            {wedding.story}
          </p>
        </BlurFade>
      </section>

      {/* Eventos */}
      <section className="py-20 px-6 border-t" style={{ borderColor: C.line }}>
        <BlurFade><p className="text-center text-[11px] uppercase tracking-[0.4em] mb-14" style={{ color: C.silverDeep }}>El gran día</p></BlurFade>
        <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
          {[wedding.ceremony, wedding.reception].map((ev, i) => (
            <BlurFade key={ev.title} delay={i * 0.12}>
              <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}
                className="relative rounded-[6px] p-8 text-center h-full" style={{ backgroundColor: C.paper, boxShadow: "0 12px 30px -12px rgba(60,55,80,0.18)" }}>
                <div className="pointer-events-none absolute inset-2.5 rounded-[3px]" style={{ border: `1px solid ${C.silver}77` }} />
                <div className="relative">
                  <p className="text-[10px] uppercase tracking-[0.3em] mb-3" style={{ color: C.faint }}>{ev.title}</p>
                  <p className="text-5xl mb-3" style={{ fontFamily: "var(--font-great-vibes)", color: C.accent }}>{ev.time}</p>
                  <p className="text-lg font-medium mb-1">{ev.place}</p>
                  <p className="text-sm mb-5" style={{ color: C.mid }}>{ev.address}</p>
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(ev.mapsQuery)}`} target="_blank" rel="noopener noreferrer"
                    className="inline-block text-[11px] uppercase tracking-[0.25em] px-6 py-2.5 rounded-full text-white transition-opacity hover:opacity-85"
                    style={{ backgroundColor: C.accent }}>
                    Ver mapa
                  </a>
                </div>
              </motion.div>
            </BlurFade>
          ))}
        </div>
      </section>

      {/* Dress code */}
      <section className="py-16 px-6 border-t text-center" style={{ borderColor: C.line, backgroundColor: C.bg2 }}>
        <BlurFade className="max-w-md mx-auto">
          <p className="text-[11px] uppercase tracking-[0.4em] mb-3" style={{ color: C.silverDeep }}>Código de vestimenta</p>
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

      {/* RSVP */}
      <section className="py-24 px-6 border-t text-center" style={{ borderColor: C.line }}>
        <BlurFade className="max-w-md mx-auto">
          <SilverRule className="mb-8" />
          <h2 className="text-5xl md:text-6xl mb-6" style={{ fontFamily: "var(--font-great-vibes)", color: C.accent }}>¿Nos acompañas?</h2>
          <p className="mb-10" style={{ color: C.mid }}>
            Confirma antes del <strong style={{ color: C.accent }}>{wedding.rsvpDeadline}</strong>.
          </p>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            className="inline-block px-10 py-4 rounded-full text-white text-sm uppercase tracking-[0.25em] cursor-pointer"
            style={{ backgroundColor: C.accent }}>
            Confirmar asistencia
          </motion.div>
        </BlurFade>
      </section>

      <footer className="py-12 text-center border-t" style={{ borderColor: C.line, backgroundColor: C.bg2 }}>
        <p className="text-4xl mb-2" style={{ fontFamily: "var(--font-great-vibes)", color: C.accent }}>
          {wedding.groom} &amp; {wedding.bride}
        </p>
        <p className="text-[10px] uppercase tracking-[0.4em]" style={{ color: C.faint }}>{wedding.dateShort} · {wedding.city}</p>
      </footer>
    </div>
  );
}
