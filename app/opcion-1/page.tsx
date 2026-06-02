"use client";

import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { wedding } from "@/lib/wedding";
import { Customizer, type Palette, type FontChoice } from "@/components/customizer";

const palettes: Palette[] = [
  {
    id: "lila-plata",
    name: "Lila & Plata",
    swatch: ["#f7f5fb", "#9b7ec4", "#3a3050", "#ece8f4"],
    tokens: {
      "--c-bg": "#f7f5fb",
      "--c-paper-2": "#ece8f4",
      "--c-paper-3": "#fdfcff",
      "--c-fg": "#3a3050",
      "--c-accent": "#9b7ec4",
    } as Record<string, string>,
  },
  {
    id: "plata",
    name: "Plata",
    swatch: ["#f4f4f6", "#8c8ca0", "#2e2e36", "#e6e6ea"],
    tokens: {
      "--c-bg": "#f4f4f6",
      "--c-paper-2": "#e6e6ea",
      "--c-paper-3": "#fbfbfc",
      "--c-fg": "#2e2e36",
      "--c-accent": "#8c8ca0",
    } as Record<string, string>,
  },
  {
    id: "lavanda",
    name: "Lavanda",
    swatch: ["#f3f0fa", "#b794d4", "#352b4d", "#e7e0f3"],
    tokens: {
      "--c-bg": "#f3f0fa",
      "--c-paper-2": "#e7e0f3",
      "--c-paper-3": "#faf8ff",
      "--c-fg": "#352b4d",
      "--c-accent": "#b794d4",
    } as Record<string, string>,
  },
  {
    id: "perla-lila",
    name: "Perla & Lila",
    swatch: ["#fdfcff", "#8a5fb0", "#2e2440", "#f0ecf6"],
    tokens: {
      "--c-bg": "#fdfcff",
      "--c-paper-2": "#f0ecf6",
      "--c-paper-3": "#ffffff",
      "--c-fg": "#2e2440",
      "--c-accent": "#8a5fb0",
    } as Record<string, string>,
  },
];

const fonts: FontChoice[] = [
  {
    id: "editorial",
    name: "Editorial",
    sample: "Ag",
    tokens: {
      "--c-display": "var(--font-display)",
      "--c-script": "var(--font-script)",
      "--c-body": "var(--font-serif)",
      "--c-mono": "var(--font-typewriter)",
    } as Record<string, string>,
  },
  {
    id: "clasica",
    name: "Clásica",
    sample: "Ag",
    tokens: {
      "--c-display": "var(--font-bodoni)",
      "--c-script": "var(--font-great-vibes)",
      "--c-body": "var(--font-serif)",
      "--c-mono": "var(--font-typewriter)",
    } as Record<string, string>,
  },
  {
    id: "manuscrita",
    name: "Manuscrita",
    sample: "Ag",
    tokens: {
      "--c-display": "var(--font-dm-serif)",
      "--c-script": "var(--font-script)",
      "--c-body": "var(--font-marcellus)",
      "--c-mono": "var(--font-typewriter)",
    } as Record<string, string>,
  },
];

function Typewriter({ text, delay = 0 }: { text: string; delay?: number }) {
  const [out, setOut] = useState("");
  useEffect(() => {
    let i = 0;
    const start = setTimeout(() => {
      const id = setInterval(() => {
        i++;
        setOut(text.slice(0, i));
        if (i >= text.length) clearInterval(id);
      }, 55);
    }, delay);
    return () => clearTimeout(start);
  }, [text, delay]);
  return (
    <span style={{ fontFamily: "var(--c-mono)" }}>
      {out}
      <span className="inline-block w-[0.5ch] animate-pulse">|</span>
    </span>
  );
}

function PaperEdge({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 1200 24"
      preserveAspectRatio="none"
      className={`w-full h-6 ${flip ? "rotate-180" : ""}`}
      style={{ color: "var(--c-bg)" }}
    >
      <path
        d="M0,0 L1200,0 L1200,12 C1140,18 1080,8 1020,14 C960,20 900,6 840,12 C780,18 720,4 660,10 C600,16 540,2 480,8 C420,14 360,20 300,12 C240,4 180,18 120,10 C60,2 30,16 0,12 Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function VintageEditorial() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const yHero = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const [opening, setOpening] = useState(false);
  const [opened, setOpened] = useState(false);
  const openEnvelope = () => {
    if (opening) return;
    setOpening(true);
    setTimeout(() => setOpened(true), 1300);
  };

  return (
    <Customizer themeId="opcion-1" palettes={palettes} fonts={fonts} tone="light">
      {({ styleVars }) => (
        <div
          style={{
            ...styleVars,
            backgroundColor: "var(--c-bg)",
            color: "var(--c-fg)",
            fontFamily: "var(--c-body)",
          }}
          className="min-h-screen overflow-hidden"
        >
          <style>{`
            .paper-grain-1 {
              background-image:
                radial-gradient(color-mix(in srgb, var(--c-fg) 8%, transparent) 1px, transparent 1px),
                radial-gradient(color-mix(in srgb, var(--c-fg) 5%, transparent) 1px, transparent 1px);
              background-size: 3px 3px, 7px 7px;
              background-position: 0 0, 1.5px 1.5px;
            }
            .ink-stain-1 {
              background: radial-gradient(ellipse at center, color-mix(in srgb, var(--c-accent) 15%, transparent) 0%, transparent 70%);
            }
          `}</style>

          {/* ── INTRO DE SOBRE (pantalla completa) ── */}
          <AnimatePresence>
            {!opened && (
              <motion.div
                key="envelope-intro"
                onClick={openEnvelope}
                role="button"
                aria-label="Abrir invitación"
                initial={false}
                animate={{ opacity: opening ? 0 : 1 }}
                transition={{ duration: 0.55, delay: opening ? 0.95 : 0, ease: "easeInOut" }}
                className="fixed inset-0 z-[70] overflow-hidden cursor-pointer select-none"
                style={{ perspective: 1600, backgroundColor: "var(--c-paper-2)" }}
              >
                {/* grano de papel del interior */}
                <div className="absolute inset-0 paper-grain-1 opacity-60 pointer-events-none" />

                {/* Carta con los nombres */}
                <motion.div
                  initial={{ y: "12%", opacity: 0 }}
                  animate={{ y: opening ? "0%" : "12%", opacity: opening ? 1 : 0 }}
                  transition={{ delay: opening ? 0.55 : 0, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[82%] max-w-sm rounded-sm px-8 py-10 text-center"
                  style={{ backgroundColor: "var(--c-paper-3)", boxShadow: "0 24px 60px rgba(0,0,0,0.2)", zIndex: 15 }}
                >
                  <p className="text-[10px] tracking-[0.4em] uppercase" style={{ color: "var(--c-accent)", fontFamily: "var(--c-mono)" }}>
                    Nos casamos
                  </p>
                  <p className="text-4xl md:text-5xl italic leading-tight mt-2" style={{ fontFamily: "var(--c-display)" }}>
                    {wedding.groom} &amp; {wedding.bride}
                  </p>
                  <p className="text-xs tracking-[0.25em] uppercase mt-3" style={{ color: "color-mix(in srgb, var(--c-fg) 55%, transparent)", fontFamily: "var(--c-mono)" }}>
                    {wedding.dateShort}
                  </p>
                </motion.div>

                {/* Bolsillo frontal */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ zIndex: 20, backgroundColor: "var(--c-accent)", clipPath: "polygon(0 100%, 0 36%, 50% 76%, 100% 36%, 100% 100%)" }}
                />

                {/* Solapa superior que se abre */}
                <motion.div
                  initial={{ rotateX: 0 }}
                  animate={{ rotateX: opening ? -180 : 0 }}
                  transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute top-0 left-0 right-0 pointer-events-none"
                  style={{
                    height: "60%",
                    transformOrigin: "top center",
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                    zIndex: opening ? 5 : 30,
                    backgroundColor: "color-mix(in srgb, var(--c-accent) 90%, #fff)",
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                  }}
                />

                {/* Sello de cera */}
                <motion.div
                  animate={{ opacity: opening ? 0 : 1, scale: opening ? 0.4 : 1, rotate: opening ? -25 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ top: "57%", zIndex: 35 }}
                >
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: "color-mix(in srgb, var(--c-accent) 62%, #000)",
                      boxShadow: "0 4px 14px rgba(0,0,0,0.4), inset 0 1px 3px rgba(255,255,255,0.25)",
                    }}
                  >
                    <span className="text-xl italic" style={{ fontFamily: "var(--c-display)", color: "var(--c-bg)" }}>
                      {wedding.groom[0]}&amp;{wedding.bride[0]}
                    </span>
                  </div>
                </motion.div>

                {/* Indicación */}
                <motion.p
                  animate={{ opacity: opening ? 0 : 1 }}
                  transition={{ duration: 0.4 }}
                  className="absolute bottom-10 left-1/2 -translate-x-1/2 text-xs tracking-[0.3em] uppercase pointer-events-none"
                  style={{ color: "var(--c-bg)", fontFamily: "var(--c-mono)" }}
                >
                  Toca para abrir
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nav */}
          <nav
            className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center backdrop-blur-sm"
            style={{
              backgroundColor: "color-mix(in srgb, var(--c-bg) 80%, transparent)",
              borderBottom: "1px solid color-mix(in srgb, var(--c-fg) 10%, transparent)",
            }}
          >
            <Link
              href="/"
              className="text-xs tracking-[0.3em] uppercase transition-colors hover:opacity-70"
              style={{ fontFamily: "var(--c-mono)" }}
            >
              ← Volver
            </Link>
            <span
              className="text-xs tracking-[0.3em] uppercase"
              style={{ fontFamily: "var(--c-mono)" }}
            >
              Vol. I · No. 25
            </span>
          </nav>

          {/* HERO */}
          <section ref={heroRef} className="relative min-h-screen paper-grain-1 flex items-center justify-center px-6 pt-20">
            <motion.div style={{ y: yHero, opacity: opacityHero }} className="text-center max-w-4xl">
              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="text-xs tracking-[0.5em] uppercase mb-8"
                style={{ color: "var(--c-accent)" }}
              >
                ✦ Crónica de un Amor ✦
              </motion.p>

              <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <h1
                  className="text-7xl md:text-[10rem] leading-[0.85] tracking-tight italic"
                  style={{ fontFamily: "var(--c-display)" }}
                >
                  {wedding.groom}
                </h1>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="my-4 h-px origin-center mx-auto max-w-md"
                  style={{ backgroundColor: "var(--c-fg)" }}
                />
                <p
                  className="text-5xl md:text-7xl -my-2"
                  style={{ fontFamily: "var(--c-script)", color: "var(--c-accent)" }}
                >
                  &amp;
                </p>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.2, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
                  className="my-4 h-px origin-center mx-auto max-w-md"
                  style={{ backgroundColor: "var(--c-fg)" }}
                />
                <h1
                  className="text-7xl md:text-[10rem] leading-[0.85] tracking-tight italic"
                  style={{ fontFamily: "var(--c-display)" }}
                >
                  {wedding.bride}
                </h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                className="mt-10 text-sm tracking-[0.3em] uppercase"
              >
                <Typewriter text="Edición especial · 25 · julio · 2026" delay={1800} />
              </motion.div>
            </motion.div>

            {/* sello vintage */}
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: 30 }}
              animate={{ opacity: 1, scale: 1, rotate: -8 }}
              transition={{ delay: 2.2, duration: 0.7, type: "spring" }}
              className="hidden sm:block absolute top-24 right-8 md:right-24"
            >
              <div
                className="border-2 border-dashed px-4 py-3 text-[10px] tracking-[0.3em] uppercase text-center leading-relaxed rounded-2xl"
                style={{
                  borderColor: "var(--c-accent)",
                  color: "var(--c-accent)",
                  fontFamily: "var(--c-mono)",
                }}
              >
                Save<br />the<br />Date
              </div>
            </motion.div>

            {/* scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 text-xs tracking-[0.3em] uppercase"
              style={{ fontFamily: "var(--c-mono)" }}
            >
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                ↓ continúa leyendo
              </motion.div>
            </motion.div>
          </section>

          <PaperEdge />

          {/* COLUMN ARTICLE */}
          <section
            className="py-24 px-6 md:px-12 paper-grain-1"
            style={{ backgroundColor: "var(--c-paper-2)" }}
          >
            <div className="max-w-5xl mx-auto">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="text-xs tracking-[0.4em] uppercase mb-2"
                style={{ color: "var(--c-accent)" }}
              >
                Capítulo I
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-5xl md:text-7xl italic leading-none mb-12"
                style={{ fontFamily: "var(--c-display)" }}
              >
                Cómo<br />
                <span style={{ color: "var(--c-accent)" }}>empezó</span> todo.
              </motion.h2>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="md:columns-2 md:gap-12 text-lg leading-relaxed"
                style={{
                  // first-letter drop cap via inline style + CSS-in-JS isn't trivial; use class hack below
                }}
              >
                <p className="dropcap-1">{wedding.story}</p>
                <p className="mt-4 italic">
                  Y como en toda buena historia, llega el momento de invitar a la
                  gente que más queremos a la página final — la que nunca termina.
                </p>
              </motion.div>

              <style>{`
                .dropcap-1::first-letter {
                  font-family: var(--c-display);
                  font-size: 4.5rem;
                  float: left;
                  margin-right: 0.75rem;
                  line-height: 0.85;
                  color: var(--c-accent);
                }
              `}</style>
            </div>
          </section>

          <PaperEdge flip />

          {/* POSTCARD */}
          <section className="py-32 px-6 paper-grain-1 relative">
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -40, rotate: -3 }}
                whileInView={{ opacity: 1, x: 0, rotate: -2 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1 }}
                className="relative p-8 rounded-2xl"
                style={{
                  backgroundColor: "var(--c-paper-3)",
                  boxShadow: "8px 8px 0 color-mix(in srgb, var(--c-fg) 15%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--c-fg) 20%, transparent)",
                }}
              >
                <div
                  className="absolute top-3 right-3 border border-dashed p-2 rounded-md"
                  style={{ borderColor: "var(--c-accent)", color: "var(--c-accent)" }}
                >
                  <div
                    className="text-xs text-center leading-tight"
                    style={{ fontFamily: "var(--c-mono)" }}
                  >
                    25¢<br />
                    <span className="text-[8px]">CDMX</span>
                  </div>
                </div>
                <p
                  className="text-xs tracking-widest uppercase mb-4"
                  style={{ color: "var(--c-accent)", fontFamily: "var(--c-mono)" }}
                >
                  Postal · destino: tú
                </p>
                <p
                  className="italic text-2xl leading-relaxed"
                  style={{ fontFamily: "var(--c-display)" }}
                >
                  &quot;El amor no es mirarse el uno al otro, sino mirar juntos en la
                  misma dirección.&quot;
                </p>
                <p className="mt-6 text-sm" style={{ fontFamily: "var(--c-mono)" }}>
                  — Antoine de Saint-Exupéry
                </p>
                <div className="absolute -bottom-3 -left-3 w-16 h-16 ink-stain-1 rounded-full" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <p
                  className="text-xs tracking-[0.4em] uppercase mb-3"
                  style={{ color: "var(--c-accent)" }}
                >
                  La fecha
                </p>
                <p
                  className="text-6xl md:text-8xl italic leading-none"
                  style={{ fontFamily: "var(--c-display)" }}
                >
                  25
                </p>
                <p
                  className="text-5xl"
                  style={{ fontFamily: "var(--c-script)", color: "var(--c-accent)" }}
                >
                  julio
                </p>
                <p
                  className="text-sm mt-3"
                  style={{ fontFamily: "var(--c-mono)" }}
                >
                  · sábado · 2026 ·
                </p>
                <div
                  className="mt-8 h-px w-32"
                  style={{ backgroundColor: "color-mix(in srgb, var(--c-fg) 30%, transparent)" }}
                />
                <p
                  className="mt-4 italic text-lg"
                  style={{ fontFamily: "var(--c-body)" }}
                >
                  Reserva la página de tu agenda.
                </p>
              </motion.div>
            </div>
          </section>

          <PaperEdge />

          {/* EVENTS */}
          <section
            className="py-24 px-6 paper-grain-1"
            style={{ backgroundColor: "var(--c-paper-2)" }}
          >
            <div className="max-w-5xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-7xl italic mb-16 text-center"
                style={{ fontFamily: "var(--c-display)" }}
              >
                El <span style={{ color: "var(--c-accent)" }}>programa</span>
              </motion.h2>

              <div className="grid md:grid-cols-2 gap-10">
                {[wedding.ceremony, wedding.reception].map((event, i) => (
                  <motion.article
                    key={event.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, delay: i * 0.15 }}
                    className="relative p-8 rounded-2xl"
                    style={{
                      backgroundColor: "var(--c-paper-3)",
                      border: "1px solid color-mix(in srgb, var(--c-fg) 15%, transparent)",
                    }}
                  >
                    <span
                      className="absolute -top-3 left-6 px-3 py-1 text-[10px] tracking-[0.3em] uppercase rounded-md"
                      style={{
                        backgroundColor: "var(--c-accent)",
                        color: "var(--c-bg)",
                        fontFamily: "var(--c-mono)",
                      }}
                    >
                      Acto {i + 1}
                    </span>
                    <h3
                      className="text-3xl italic mt-2"
                      style={{ fontFamily: "var(--c-display)" }}
                    >
                      {event.title}
                    </h3>
                    <p
                      className="text-5xl my-2"
                      style={{ fontFamily: "var(--c-script)", color: "var(--c-accent)" }}
                    >
                      {event.time}
                    </p>
                    <div
                      className="h-px my-4"
                      style={{ backgroundColor: "color-mix(in srgb, var(--c-fg) 20%, transparent)" }}
                    />
                    <p
                      className="text-xl italic"
                      style={{ fontFamily: "var(--c-display)" }}
                    >
                      {event.place}
                    </p>
                    <p
                      className="mt-2 text-sm opacity-70"
                      style={{ fontFamily: "var(--c-mono)" }}
                    >
                      {event.address}
                    </p>
                  </motion.article>
                ))}
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-center mt-12 text-xs tracking-[0.3em] uppercase"
                style={{ fontFamily: "var(--c-mono)" }}
              >
                · código de vestimenta · {wedding.dressCode} ·
              </motion.p>
            </div>
          </section>

          <PaperEdge flip />

          {/* RSVP */}
          <section className="py-32 px-6 paper-grain-1 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="max-w-2xl mx-auto"
            >
              <p
                className="text-xs tracking-[0.4em] uppercase mb-4"
                style={{ color: "var(--c-accent)" }}
              >
                Capítulo final
              </p>
              <h2
                className="text-5xl md:text-7xl italic mb-8"
                style={{ fontFamily: "var(--c-display)" }}
              >
                ¿Vienes?
              </h2>
              <p
                className="text-xl leading-relaxed mb-10"
                style={{ fontFamily: "var(--c-body)" }}
              >
                Confirma tu asistencia antes del{" "}
                <strong style={{ color: "var(--c-accent)" }}>{wedding.rsvpDeadline}</strong>.
                Cada respuesta hace este día más nuestro.
              </p>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="px-10 py-4 text-sm tracking-[0.3em] uppercase rounded-full transition-colors"
                style={{
                  backgroundColor: "var(--c-accent)",
                  color: "var(--c-bg)",
                  fontFamily: "var(--c-mono)",
                }}
              >
                Confirmar asistencia
              </motion.button>
            </motion.div>
          </section>

          <footer
            className="py-8 text-center text-xs tracking-[0.3em] uppercase opacity-60"
            style={{
              borderTop: "1px solid color-mix(in srgb, var(--c-fg) 20%, transparent)",
              fontFamily: "var(--c-mono)",
            }}
          >
            · Impreso con amor · {wedding.dateShort} ·
          </footer>
        </div>
      )}
    </Customizer>
  );
}
