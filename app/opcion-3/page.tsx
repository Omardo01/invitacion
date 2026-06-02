"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "motion/react";
import { useRef } from "react";
import { wedding } from "@/lib/wedding";
import { Customizer, type Palette, type FontChoice } from "@/components/customizer";

const palettes: Palette[] = [
  {
    id: "salvia",
    name: "Salvia & coral",
    swatch: ["#faf3e7", "#87a96b", "#c4623d", "#f4a89d"],
    tokens: {
      "--c-bg": "#faf3e7",
      "--c-paper-2": "#f5ecda",
      "--c-fg": "#3d4a36",
      "--c-accent": "#87a96b",
      "--c-accent-2": "#c4623d",
      "--c-accent-3": "#f4a89d",
      "--c-stem": "#5a6b4e",
      "--c-leaf": "#87a96b",
      "--c-petal": "#f4a89d",
      "--c-bud": "#c4623d",
    } as Record<string, string>,
  },
  {
    id: "eucalipto",
    name: "Eucalipto",
    swatch: ["#f4f6f0", "#7a9080", "#a8736f", "#e8c5b9"],
    tokens: {
      "--c-bg": "#f4f6f0",
      "--c-paper-2": "#ecefe6",
      "--c-fg": "#2d3a30",
      "--c-accent": "#7a9080",
      "--c-accent-2": "#a8736f",
      "--c-accent-3": "#e8c5b9",
      "--c-stem": "#4a5d52",
      "--c-leaf": "#7a9080",
      "--c-petal": "#e8c5b9",
      "--c-bud": "#a8736f",
    } as Record<string, string>,
  },
  {
    id: "romero-lavanda",
    name: "Romero & lavanda",
    swatch: ["#f5f1ea", "#5b6f4a", "#9b7cc7", "#c8b8e0"],
    tokens: {
      "--c-bg": "#f5f1ea",
      "--c-paper-2": "#ede8dc",
      "--c-fg": "#2e3a25",
      "--c-accent": "#5b6f4a",
      "--c-accent-2": "#9b7cc7",
      "--c-accent-3": "#c8b8e0",
      "--c-stem": "#3a4d2e",
      "--c-leaf": "#5b6f4a",
      "--c-petal": "#c8b8e0",
      "--c-bud": "#9b7cc7",
    } as Record<string, string>,
  },
  {
    id: "crema-coral",
    name: "Crema & coral",
    swatch: ["#fcf6ee", "#d68868", "#f4a89d", "#a05f47"],
    tokens: {
      "--c-bg": "#fcf6ee",
      "--c-paper-2": "#f5ebd9",
      "--c-fg": "#3a2418",
      "--c-accent": "#d68868",
      "--c-accent-2": "#a05f47",
      "--c-accent-3": "#f4a89d",
      "--c-stem": "#8b6d5a",
      "--c-leaf": "#c4a89a",
      "--c-petal": "#f4a89d",
      "--c-bud": "#a05f47",
    } as Record<string, string>,
  },
  {
    id: "lila-blanco",
    name: "Lila & Blanco",
    swatch: ["#ffffff", "#9b7cc7", "#c8c4d8", "#f0ecf8"],
    tokens: {
      "--c-bg": "#ffffff",
      "--c-paper-2": "#f0ecf8",
      "--c-fg": "#2d2240",
      "--c-accent": "#9b7cc7",
      "--c-accent-2": "#7a5da8",
      "--c-accent-3": "#d4c8e8",
      "--c-stem": "#8a849a",
      "--c-leaf": "#b8b4cc",
      "--c-petal": "#d4c8e8",
      "--c-bud": "#7a5da8",
    } as Record<string, string>,
  },
  {
    id: "plata-lila",
    name: "Plata & Lila",
    swatch: ["#f0eef6", "#7a6daa", "#b8b4cc", "#e4e0f0"],
    tokens: {
      "--c-bg": "#f0eef6",
      "--c-paper-2": "#e4e0f0",
      "--c-fg": "#1e1830",
      "--c-accent": "#7a6daa",
      "--c-accent-2": "#5d5090",
      "--c-accent-3": "#c8c4d8",
      "--c-stem": "#7a7490",
      "--c-leaf": "#a8a4bc",
      "--c-petal": "#c8c4d8",
      "--c-bud": "#5d5090",
    } as Record<string, string>,
  },
];

const fonts: FontChoice[] = [
  {
    id: "romantica",
    name: "Romántica",
    sample: "Ag",
    tokens: {
      "--c-display": "var(--font-script)",
      "--c-script": "var(--font-script)",
      "--c-serif": "var(--font-serif)",
      "--c-body": "var(--font-sans)",
    } as Record<string, string>,
  },
  {
    id: "editorial",
    name: "Editorial",
    sample: "Ag",
    tokens: {
      "--c-display": "var(--font-dm-serif)",
      "--c-script": "var(--font-script)",
      "--c-serif": "var(--font-serif)",
      "--c-body": "var(--font-sans)",
    } as Record<string, string>,
  },
  {
    id: "caligrafica",
    name: "Caligráfica",
    sample: "Ag",
    tokens: {
      "--c-display": "var(--font-great-vibes)",
      "--c-script": "var(--font-great-vibes)",
      "--c-serif": "var(--font-marcellus)",
      "--c-body": "var(--font-sans)",
    } as Record<string, string>,
  },
];

function BotanicalSprig({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <svg
      ref={ref}
      viewBox="0 0 200 400"
      className={className}
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
    >
      <motion.path
        d="M100,380 Q90,300 100,220 Q110,140 95,60 Q90,30 100,10"
        fill="none"
        stroke="var(--c-stem)"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: inView ? 1 : 0 }}
        transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
      />
      {[
        { d: "M100,320 Q70,310 50,280 Q70,300 100,310", delay: 0.6 },
        { d: "M100,260 Q130,250 150,220 Q130,245 100,255", delay: 0.9 },
        { d: "M100,200 Q70,190 55,160 Q75,185 100,195", delay: 1.2 },
        { d: "M100,140 Q130,130 145,100 Q125,125 100,135", delay: 1.5 },
        { d: "M100,80 Q80,70 70,45 Q85,65 100,75", delay: 1.8 },
      ].map((leaf, i) => (
        <motion.path
          key={i}
          d={leaf.d}
          fill="var(--c-leaf)"
          stroke="var(--c-stem)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: inView ? 1 : 0, opacity: inView ? 0.85 : 0 }}
          transition={{ duration: 1.2, delay: leaf.delay, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
      {[
        { cx: 100, cy: 30, delay: 2 },
        { cx: 150, cy: 100, delay: 2.3 },
        { cx: 55, cy: 160, delay: 2.5 },
      ].map((f, i) => (
        <g key={i}>
          {Array.from({ length: 6 }).map((_, p) => (
            <motion.ellipse
              key={p}
              cx={f.cx}
              cy={f.cy - 6}
              rx="5"
              ry="9"
              fill="var(--c-petal)"
              opacity="0.85"
              transform={`rotate(${p * 60} ${f.cx} ${f.cy})`}
              initial={{ scale: 0 }}
              animate={{ scale: inView ? 1 : 0 }}
              transition={{ duration: 0.5, delay: f.delay + p * 0.06, type: "spring" }}
            />
          ))}
          <motion.circle
            cx={f.cx}
            cy={f.cy}
            r="3"
            fill="var(--c-bud)"
            initial={{ scale: 0 }}
            animate={{ scale: inView ? 1 : 0 }}
            transition={{ duration: 0.4, delay: f.delay + 0.4 }}
          />
        </g>
      ))}
    </svg>
  );
}

function FloralFrame() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <svg ref={ref} viewBox="0 0 400 400" className="absolute inset-0 w-full h-full pointer-events-none">
      <motion.circle
        cx="200"
        cy="200"
        r="160"
        fill="none"
        stroke="var(--c-accent)"
        strokeWidth="1"
        strokeDasharray="3 4"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: inView ? 1 : 0, opacity: inView ? 0.5 : 0 }}
        transition={{ duration: 2 }}
      />
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 360) / 8;
        return (
          <motion.g
            key={i}
            transform={`rotate(${angle} 200 200)`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: inView ? 1 : 0, opacity: inView ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 1 + i * 0.1, type: "spring" }}
          >
            <ellipse cx="200" cy="40" rx="4" ry="9" fill="var(--c-petal)" opacity="0.8" />
            <ellipse cx="200" cy="50" rx="3" ry="6" fill="var(--c-bud)" opacity="0.7" />
          </motion.g>
        );
      })}
    </svg>
  );
}

export default function Botanico() {
  const { scrollYProgress } = useScroll();
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);
  const heroScale = useTransform(heroScroll, [0, 0.8], [1, 0.92]);

  return (
    <Customizer themeId="opcion-3" palettes={palettes} fonts={fonts} tone="light">
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
            .watercolor-3 {
              background-image:
                radial-gradient(ellipse 600px 400px at 10% 20%, color-mix(in srgb, var(--c-accent) 14%, transparent) 0%, transparent 60%),
                radial-gradient(ellipse 500px 300px at 90% 70%, color-mix(in srgb, var(--c-accent-3) 16%, transparent) 0%, transparent 60%),
                radial-gradient(ellipse 400px 300px at 50% 100%, color-mix(in srgb, var(--c-accent-2) 12%, transparent) 0%, transparent 60%);
            }
            .paper-warm-3 {
              background-color: var(--c-bg);
              background-image:
                radial-gradient(color-mix(in srgb, var(--c-fg) 4%, transparent) 1px, transparent 1px);
              background-size: 4px 4px;
            }
          `}</style>

          <motion.div
            style={{ y: bgY }}
            className="fixed inset-0 watercolor-3 pointer-events-none -z-10"
          />

          <nav
            className="fixed top-0 left-0 right-0 z-40 px-6 py-5 flex justify-between items-center backdrop-blur-sm"
            style={{
              backgroundColor: "color-mix(in srgb, var(--c-bg) 80%, transparent)",
            }}
          >
            <Link
              href="/"
              className="text-xs tracking-[0.3em] uppercase transition-colors hover:opacity-70"
              style={{ color: "var(--c-fg)" }}
            >
              ← Volver
            </Link>
            <span
              className="text-2xl"
              style={{ fontFamily: "var(--c-script)", color: "var(--c-accent)" }}
            >
              {wedding.groom[0]} &amp; {wedding.bride[0]}
            </span>
          </nav>

          {/* HERO */}
          <section
            ref={heroRef}
            className="relative min-h-screen flex items-center justify-center px-6 paper-warm-3"
          >
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-0 top-0 bottom-0 w-24 md:w-48 hidden sm:block"
            >
              <BotanicalSprig className="w-full h-full" />
            </motion.div>
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 bottom-0 w-24 md:w-48 hidden sm:block"
            >
              <BotanicalSprig className="w-full h-full" flip />
            </motion.div>

            <motion.div
              style={{ opacity: heroOpacity, scale: heroScale }}
              className="relative z-10 text-center max-w-3xl"
            >
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-xs tracking-[0.4em] uppercase mb-8"
                style={{ color: "var(--c-accent)" }}
              >
                ❀ Nos casamos ❀
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="text-7xl md:text-[9rem] leading-[0.85]"
                style={{
                  fontFamily: "var(--c-display)",
                  color: "var(--c-fg)",
                }}
              >
                {wedding.groom}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.4, type: "spring" }}
                className="italic text-3xl md:text-5xl my-2"
                style={{ fontFamily: "var(--c-serif)", color: "var(--c-accent-2)" }}
              >
                &amp;
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 1, ease: [0.22, 1, 0.36, 1] }}
                className="text-7xl md:text-[9rem] leading-[0.85]"
                style={{
                  fontFamily: "var(--c-display)",
                  color: "var(--c-fg)",
                }}
              >
                {wedding.bride}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.8 }}
                className="mt-12 inline-flex items-center gap-6"
              >
                <span className="h-px w-12" style={{ backgroundColor: "var(--c-accent)" }} />
                <span
                  className="text-sm tracking-[0.3em] uppercase"
                  style={{
                    color: "color-mix(in srgb, var(--c-fg) 70%, transparent)",
                    fontFamily: "var(--c-serif)",
                  }}
                >
                  25 · julio · 2026
                </span>
                <span className="h-px w-12" style={{ backgroundColor: "var(--c-accent)" }} />
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 2.2 }}
                className="mt-4 italic text-lg"
                style={{ fontFamily: "var(--c-serif)", color: "var(--c-accent)" }}
              >
                {wedding.city}
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 2.5 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="text-xs tracking-[0.3em] uppercase"
                style={{ color: "var(--c-accent)" }}
              >
                ❀ desliza ❀
              </motion.div>
            </motion.div>
          </section>

          {/* STORY */}
          <section className="py-32 px-6 relative">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1 }}
              >
                <p
                  className="text-xs tracking-[0.4em] uppercase mb-4"
                  style={{ color: "var(--c-accent)" }}
                >
                  ❀ Nuestra historia ❀
                </p>
                <h2
                  className="text-6xl md:text-8xl mb-12 leading-none"
                  style={{ fontFamily: "var(--c-display)", color: "var(--c-fg)" }}
                >
                  Una semilla<br />
                  <span style={{ color: "var(--c-accent-2)" }}>en flor</span>
                </h2>
                <p
                  className="text-xl md:text-2xl italic leading-relaxed"
                  style={{
                    fontFamily: "var(--c-serif)",
                    color: "color-mix(in srgb, var(--c-fg) 85%, transparent)",
                  }}
                >
                  {wedding.story}
                </p>
              </motion.div>
            </div>
          </section>

          {/* DATE FRAMED */}
          <section className="py-32 px-6 relative">
            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="relative aspect-square flex items-center justify-center"
              >
                <FloralFrame />
                <div className="relative z-10 text-center">
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-3xl md:text-5xl"
                    style={{ fontFamily: "var(--c-script)", color: "var(--c-accent)" }}
                  >
                    sábado
                  </motion.p>
                  <motion.p
                    initial={{ scale: 0.7, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="text-9xl md:text-[12rem] leading-none -my-4"
                    style={{ fontFamily: "var(--c-display)", color: "var(--c-fg)" }}
                  >
                    25
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="text-4xl md:text-6xl"
                    style={{ fontFamily: "var(--c-script)", color: "var(--c-accent-2)" }}
                  >
                    julio
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="mt-4 text-xs tracking-[0.4em] uppercase"
                    style={{ color: "var(--c-accent)" }}
                  >
                    · 2026 ·
                  </motion.p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* EVENTS - timeline */}
          <section className="py-32 px-6 relative">
            <div className="max-w-3xl mx-auto">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center text-6xl md:text-7xl mb-20"
                style={{ fontFamily: "var(--c-display)", color: "var(--c-fg)" }}
              >
                El día
              </motion.h2>

              <div
                className="relative pl-8 md:pl-12 space-y-16"
                style={{
                  borderLeft: "1px solid color-mix(in srgb, var(--c-accent) 40%, transparent)",
                }}
              >
                {[wedding.ceremony, wedding.reception].map((event, i) => (
                  <motion.div
                    key={event.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.9, delay: i * 0.2 }}
                    className="relative"
                  >
                    <motion.span
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.2 + 0.3, type: "spring" }}
                      className="absolute -left-[2.4rem] md:-left-[3.4rem] top-1 w-5 h-5 rounded-full"
                      style={{
                        backgroundColor: "var(--c-accent-3)",
                        border: "2px solid var(--c-accent-2)",
                      }}
                    />
                    <p
                      className="text-5xl mb-1"
                      style={{ fontFamily: "var(--c-script)", color: "var(--c-accent-2)" }}
                    >
                      {event.time}
                    </p>
                    <h3
                      className="text-2xl italic mb-2"
                      style={{ fontFamily: "var(--c-serif)" }}
                    >
                      {event.title}
                    </h3>
                    <p
                      className="text-lg"
                      style={{ fontFamily: "var(--c-serif)" }}
                    >
                      {event.place}
                    </p>
                    <p
                      className="text-sm mt-1"
                      style={{ color: "color-mix(in srgb, var(--c-fg) 60%, transparent)" }}
                    >
                      {event.address}
                    </p>
                  </motion.div>
                ))}
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-center mt-16 italic"
                style={{ fontFamily: "var(--c-serif)", color: "var(--c-accent)" }}
              >
                Etiqueta · {wedding.dressCode}
              </motion.p>
            </div>
          </section>

          {/* RSVP */}
          <section className="py-32 px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="max-w-2xl mx-auto text-center"
            >
              <p
                className="text-xs tracking-[0.4em] uppercase mb-4"
                style={{ color: "var(--c-accent)" }}
              >
                ❀ Tu lugar te espera ❀
              </p>
              <h2
                className="text-6xl md:text-8xl mb-8"
                style={{ fontFamily: "var(--c-display)", color: "var(--c-fg)" }}
              >
                ¿Nos acompañas?
              </h2>
              <p
                className="text-xl italic leading-relaxed mb-10"
                style={{
                  fontFamily: "var(--c-serif)",
                  color: "color-mix(in srgb, var(--c-fg) 85%, transparent)",
                }}
              >
                Confírmanos tu asistencia antes del{" "}
                <span style={{ color: "var(--c-accent-2)", fontWeight: 600 }}>
                  {wedding.rsvpDeadline}
                </span>.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="px-12 py-4 rounded-full text-sm tracking-[0.3em] uppercase transition-colors"
                style={{
                  backgroundColor: "var(--c-accent)",
                  color: "var(--c-bg)",
                  fontFamily: "var(--c-body)",
                }}
              >
                Confirmar asistencia
              </motion.button>
            </motion.div>
          </section>

          <footer
            className="py-10 text-center"
            style={{
              borderTop: "1px solid color-mix(in srgb, var(--c-accent) 20%, transparent)",
            }}
          >
            <p
              className="text-3xl"
              style={{ fontFamily: "var(--c-script)", color: "var(--c-accent)" }}
            >
              Con cariño, {wedding.groom[0]} &amp; {wedding.bride[0]}
            </p>
          </footer>
        </div>
      )}
    </Customizer>
  );
}
