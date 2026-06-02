"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { wedding } from "@/lib/wedding";
import { Customizer, type Palette, type FontChoice } from "@/components/customizer";

const palettes: Palette[] = [
  {
    id: "rosa-mexicano",
    name: "Rosa Mexicano",
    swatch: ["#fff5d6", "#e4007c", "#003f88", "#006b3c"],
    tokens: {
      "--c-bg": "#fff5d6",
      "--c-paper": "#fffbe8",
      "--c-fg": "#1a1a1a",
      "--c-accent": "#e4007c",
      "--c-accent-2": "#003f88",
      "--c-accent-3": "#006b3c",
    } as Record<string, string>,
  },
  {
    id: "talavera",
    name: "Talavera",
    swatch: ["#fffbf2", "#2563eb", "#f59e0b", "#dc2626"],
    tokens: {
      "--c-bg": "#fffbf2",
      "--c-paper": "#ffffff",
      "--c-fg": "#0e1a2e",
      "--c-accent": "#2563eb",
      "--c-accent-2": "#f59e0b",
      "--c-accent-3": "#dc2626",
    } as Record<string, string>,
  },
  {
    id: "selva",
    name: "Selva",
    swatch: ["#f4f1e8", "#006b3c", "#c4623d", "#7c1d1d"],
    tokens: {
      "--c-bg": "#f4f1e8",
      "--c-paper": "#fbf8ee",
      "--c-fg": "#1a2e1a",
      "--c-accent": "#006b3c",
      "--c-accent-2": "#c4623d",
      "--c-accent-3": "#7c1d1d",
    } as Record<string, string>,
  },
  {
    id: "atardecer",
    name: "Atardecer",
    swatch: ["#fff1e6", "#d62828", "#f77f00", "#003049"],
    tokens: {
      "--c-bg": "#fff1e6",
      "--c-paper": "#fffaf5",
      "--c-fg": "#3a0d0d",
      "--c-accent": "#d62828",
      "--c-accent-2": "#f77f00",
      "--c-accent-3": "#003049",
    } as Record<string, string>,
  },
  {
    id: "lila-blanco",
    name: "Lila & Blanco",
    swatch: ["#ffffff", "#9b7cc7", "#c8c4d8", "#f0ecf8"],
    tokens: {
      "--c-bg": "#ffffff",
      "--c-paper": "#faf8ff",
      "--c-fg": "#1e1830",
      "--c-accent": "#9b7cc7",
      "--c-accent-2": "#c8c4d8",
      "--c-accent-3": "#7a5da8",
    } as Record<string, string>,
  },
  {
    id: "plata-lila",
    name: "Plata & Lila",
    swatch: ["#f0eef6", "#7a6daa", "#b8b4cc", "#1e1830"],
    tokens: {
      "--c-bg": "#f0eef6",
      "--c-paper": "#f8f6fc",
      "--c-fg": "#1e1830",
      "--c-accent": "#7a6daa",
      "--c-accent-2": "#b8b4cc",
      "--c-accent-3": "#5d5090",
    } as Record<string, string>,
  },
];

const fonts: FontChoice[] = [
  {
    id: "editorial",
    name: "Editorial",
    sample: "Ag",
    tokens: {
      "--c-display": "var(--font-dm-serif)",
      "--c-script": "var(--font-script)",
      "--c-body": "var(--font-sans)",
    } as Record<string, string>,
  },
  {
    id: "clasica",
    name: "Clásica",
    sample: "Ag",
    tokens: {
      "--c-display": "var(--font-display)",
      "--c-script": "var(--font-great-vibes)",
      "--c-body": "var(--font-serif)",
    } as Record<string, string>,
  },
  {
    id: "refinada",
    name: "Refinada",
    sample: "Ag",
    tokens: {
      "--c-display": "var(--font-bodoni)",
      "--c-script": "var(--font-script)",
      "--c-body": "var(--font-serif)",
    } as Record<string, string>,
  },
  {
    id: "elegante",
    name: "Elegante",
    sample: "Ag",
    tokens: {
      "--c-display": "var(--font-marcellus)",
      "--c-script": "var(--font-great-vibes)",
      "--c-body": "var(--font-sans)",
    } as Record<string, string>,
  },
];

function PapelPicado() {
  return (
    <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20 md:h-28 text-current">
      <defs>
        <pattern id="flag" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
          <path
            d="M0,0 L120,0 L120,60 L60,100 L0,60 Z"
            fill="currentColor"
          />
          <circle cx="30" cy="30" r="6" fill="var(--c-bg)" />
          <circle cx="90" cy="30" r="6" fill="var(--c-bg)" />
          <circle cx="60" cy="50" r="8" fill="var(--c-bg)" />
          <path
            d="M40,60 Q60,75 80,60 Q60,85 40,60"
            fill="var(--c-bg)"
          />
          <circle cx="20" cy="70" r="3" fill="var(--c-bg)" />
          <circle cx="100" cy="70" r="3" fill="var(--c-bg)" />
        </pattern>
      </defs>
      <line x1="0" y1="2" x2="1200" y2="2" stroke="currentColor" strokeWidth="1" />
      <rect width="1200" height="120" fill="url(#flag)" />
    </svg>
  );
}

function Confetti() {
  const items = Array.from({ length: 30 }, (_, i) => ({
    left: (i * 37) % 100,
    delay: (i * 0.2) % 4,
    duration: 6 + ((i * 0.7) % 4),
    color: ["var(--c-accent)", "var(--c-accent-2)", "var(--c-accent-3)"][i % 3],
    shape: i % 3,
  }));
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((c, i) => (
        <motion.span
          key={i}
          className="absolute top-0"
          style={{ left: `${c.left}%`, color: c.color }}
          initial={{ y: -20, opacity: 0, rotate: 0 }}
          animate={{
            y: ["0vh", "110vh"],
            opacity: [0, 1, 1, 0],
            rotate: [0, 360, 720],
          }}
          transition={{
            duration: c.duration,
            delay: c.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {c.shape === 0 ? (
            <span className="block w-2 h-3" style={{ backgroundColor: "currentColor" }} />
          ) : c.shape === 1 ? (
            <span className="block w-2 h-2 rounded-full" style={{ backgroundColor: "currentColor" }} />
          ) : (
            <svg width="12" height="12" viewBox="0 0 10 10" fill="currentColor">
              <path d="M5,0 L6,4 L10,5 L6,6 L5,10 L4,6 L0,5 L4,4 Z" />
            </svg>
          )}
        </motion.span>
      ))}
    </div>
  );
}

function Marquee({ children, speed = 28 }: { children: React.ReactNode; speed?: number }) {
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
        className="inline-flex gap-12 will-change-transform"
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="inline-flex items-center gap-12">{children}</span>
        ))}
      </motion.div>
    </div>
  );
}

export default function MexicanoFolk() {
  return (
    <Customizer themeId="opcion-4" palettes={palettes} fonts={fonts}>
      {({ styleVars }) => (
        <div
          style={styleVars}
          className="min-h-screen overflow-hidden"
        >
          <div
            className="min-h-screen"
            style={{
              backgroundColor: "var(--c-bg)",
              color: "var(--c-fg)",
              fontFamily: "var(--c-body)",
            }}
          >
            <nav
              className="fixed top-0 left-0 right-0 z-40 px-6 py-4 flex justify-between items-center backdrop-blur-sm"
              style={{ backgroundColor: "color-mix(in srgb, var(--c-bg) 75%, transparent)", borderBottom: "1px solid color-mix(in srgb, var(--c-fg) 12%, transparent)" }}
            >
              <Link
                href="/"
                className="text-xs tracking-[0.3em] uppercase transition-colors hover:opacity-70"
                style={{ color: "var(--c-accent)" }}
              >
                ← Volver
              </Link>
              <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "var(--c-fg)" }}>
                ¡Viva el amor!
              </span>
            </nav>

            {/* Papel picado top */}
            <motion.div
              initial={{ y: -120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-12 left-0 right-0 z-30 pointer-events-none"
              style={{ color: "var(--c-accent)" }}
            >
              <PapelPicado />
            </motion.div>

            {/* HERO */}
            <section
              className="relative min-h-screen flex items-center justify-center px-6 pt-32 pb-20"
              style={{ backgroundColor: "var(--c-paper)" }}
            >
              <Confetti />

              <div className="relative z-10 text-center max-w-4xl">
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
                  className="inline-block px-5 py-1.5 mb-8 text-[11px] tracking-[0.4em] uppercase"
                  style={{
                    border: "2px solid var(--c-accent)",
                    color: "var(--c-accent)",
                    fontFamily: "var(--c-body)",
                  }}
                >
                  ✿ Una fiesta de amor ✿
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="text-7xl md:text-[11rem] leading-[0.85] tracking-tight"
                  style={{ fontFamily: "var(--c-display)", color: "var(--c-fg)" }}
                >
                  {wedding.groom}
                </motion.h1>

                <motion.p
                  initial={{ scale: 0, rotate: 30 }}
                  animate={{ scale: 1, rotate: -8 }}
                  transition={{ duration: 0.8, delay: 1.3, type: "spring" }}
                  className="my-2 text-7xl md:text-9xl inline-block"
                  style={{ fontFamily: "var(--c-script)", color: "var(--c-accent)" }}
                >
                  &amp;
                </motion.p>

                <motion.h1
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, delay: 1, ease: [0.22, 1, 0.36, 1] }}
                  className="text-7xl md:text-[11rem] leading-[0.85] tracking-tight"
                  style={{ fontFamily: "var(--c-display)", color: "var(--c-fg)" }}
                >
                  {wedding.bride}
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 1.6 }}
                  className="mt-10 inline-flex items-center gap-4 px-6 py-3"
                  style={{
                    border: "2px dashed var(--c-accent-2)",
                    color: "var(--c-accent-2)",
                  }}
                >
                  <span className="text-2xl">✦</span>
                  <span className="text-sm md:text-base tracking-[0.4em] uppercase font-bold">
                    25 · julio · 2026
                  </span>
                  <span className="text-2xl">✦</span>
                </motion.div>
              </div>
            </section>

            {/* MARQUEE */}
            <section
              className="py-6 overflow-hidden"
              style={{ backgroundColor: "var(--c-accent)", color: "var(--c-bg)" }}
            >
              <Marquee speed={32}>
                <span className="text-3xl md:text-5xl" style={{ fontFamily: "var(--c-display)" }}>
                  Gabriel &amp; Zayra
                </span>
                <span className="text-2xl">✿</span>
                <span className="text-3xl md:text-5xl" style={{ fontFamily: "var(--c-script)" }}>
                  ¡nos casamos!
                </span>
                <span className="text-2xl">✦</span>
                <span className="text-3xl md:text-5xl" style={{ fontFamily: "var(--c-display)" }}>
                  25.07.2026
                </span>
                <span className="text-2xl">✿</span>
              </Marquee>
            </section>

            {/* STORY */}
            <section className="py-32 px-6">
              <div className="max-w-4xl mx-auto grid md:grid-cols-12 gap-8 items-end">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.9 }}
                  className="md:col-span-5"
                >
                  <p
                    className="text-xs tracking-[0.4em] uppercase mb-3"
                    style={{ color: "var(--c-accent)" }}
                  >
                    Capítulo único
                  </p>
                  <h2
                    className="text-6xl md:text-8xl leading-[0.9]"
                    style={{ fontFamily: "var(--c-display)" }}
                  >
                    Una <span style={{ color: "var(--c-accent)" }}>historia</span> que merece fiesta.
                  </h2>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.9, delay: 0.2 }}
                  className="md:col-span-7"
                >
                  <p className="text-xl md:text-2xl leading-relaxed">
                    {wedding.story}
                  </p>
                  <div
                    className="mt-6 inline-block px-4 py-2 text-sm tracking-[0.3em] uppercase"
                    style={{ backgroundColor: "var(--c-accent-3)", color: "var(--c-bg)" }}
                  >
                    Y queremos que estés ahí.
                  </div>
                </motion.div>
              </div>
            </section>

            {/* DATE BIG */}
            <section
              className="py-32 px-6 relative"
              style={{ backgroundColor: "var(--c-accent-2)", color: "var(--c-bg)" }}
            >
              <div className="absolute inset-x-0 top-0" style={{ color: "var(--c-bg)", opacity: 0.4 }}>
                <PapelPicado />
              </div>
              <div className="absolute inset-x-0 bottom-0 rotate-180" style={{ color: "var(--c-bg)", opacity: 0.4 }}>
                <PapelPicado />
              </div>

              <div className="max-w-5xl mx-auto text-center relative z-10">
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="text-xs tracking-[0.5em] uppercase mb-4 opacity-80"
                >
                  Apunta la fecha
                </motion.p>

                <div className="flex items-center justify-center gap-4 md:gap-12">
                  {[
                    { num: "25", label: "Sábado" },
                    { num: "07", label: "Julio" },
                    { num: "26", label: "2026" },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 60, scale: 0.6 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.8, delay: i * 0.15, type: "spring", bounce: 0.4 }}
                    >
                      <p
                        className="text-7xl md:text-[14rem] leading-none"
                        style={{ fontFamily: "var(--c-display)" }}
                      >
                        {item.num}
                      </p>
                      <p className="mt-2 text-xs md:text-base tracking-[0.4em] uppercase opacity-80">
                        {item.label}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* EVENTS */}
            <section className="py-32 px-6">
              <div className="max-w-5xl mx-auto">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="text-center text-6xl md:text-8xl mb-4"
                  style={{ fontFamily: "var(--c-display)" }}
                >
                  El <span style={{ fontFamily: "var(--c-script)", color: "var(--c-accent)" }}>itinerario</span>
                </motion.h2>

                <div className="grid md:grid-cols-2 gap-8 mt-16">
                  {[wedding.ceremony, wedding.reception].map((event, i) => (
                    <motion.article
                      key={event.title}
                      initial={{ opacity: 0, y: 40, rotate: i === 0 ? -2 : 2 }}
                      whileInView={{ opacity: 1, y: 0, rotate: i === 0 ? -1.5 : 1.5 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.9, delay: i * 0.15 }}
                      whileHover={{ rotate: 0, scale: 1.02 }}
                      className="relative p-10 shadow-xl"
                      style={{
                        backgroundColor: "var(--c-paper)",
                        border: `2px solid ${i === 0 ? "var(--c-accent)" : "var(--c-accent-3)"}`,
                      }}
                    >
                      <span
                        className="absolute -top-4 left-6 px-3 py-1 text-[10px] tracking-[0.3em] uppercase"
                        style={{
                          backgroundColor: i === 0 ? "var(--c-accent)" : "var(--c-accent-3)",
                          color: "var(--c-bg)",
                        }}
                      >
                        {i === 0 ? "Ceremonia" : "Recepción"}
                      </span>
                      <p
                        className="text-7xl mt-2"
                        style={{ fontFamily: "var(--c-script)", color: i === 0 ? "var(--c-accent)" : "var(--c-accent-3)" }}
                      >
                        {event.time}
                      </p>
                      <h3
                        className="text-3xl mt-2"
                        style={{ fontFamily: "var(--c-display)" }}
                      >
                        {event.place}
                      </h3>
                      <p className="mt-2 text-sm opacity-70">{event.address}</p>
                    </motion.article>
                  ))}
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="text-center mt-12 text-sm tracking-[0.3em] uppercase"
                  style={{ color: "var(--c-accent-2)" }}
                >
                  ✿ Etiqueta · {wedding.dressCode} ✿
                </motion.p>
              </div>
            </section>

            {/* RSVP */}
            <section
              className="py-32 px-6 relative overflow-hidden"
              style={{ backgroundColor: "var(--c-accent)", color: "var(--c-bg)" }}
            >
              <div className="max-w-2xl mx-auto text-center relative z-10">
                <motion.h2
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="text-6xl md:text-8xl mb-6"
                  style={{ fontFamily: "var(--c-script)" }}
                >
                  ¡Acompáñanos!
                </motion.h2>
                <p className="text-lg md:text-xl mb-10 opacity-90">
                  Confirma antes del <strong>{wedding.rsvpDeadline}</strong> para reservarte un lugar
                  en esta fiesta inolvidable.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  className="px-12 py-4 text-sm tracking-[0.4em] uppercase font-bold"
                  style={{
                    backgroundColor: "var(--c-bg)",
                    color: "var(--c-accent)",
                    border: "2px solid var(--c-bg)",
                  }}
                >
                  Confirmar asistencia
                </motion.button>
              </div>
              <Confetti />
            </section>

            <footer
              className="py-8 text-center text-xs tracking-[0.4em] uppercase"
              style={{ backgroundColor: "var(--c-fg)", color: "var(--c-bg)" }}
            >
              ✿ ¡Viva México · Viva el amor · 25.07.2026 ✿
            </footer>
          </div>
        </div>
      )}
    </Customizer>
  );
}
