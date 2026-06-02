"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { useRef } from "react";
import { wedding } from "@/lib/wedding";
import { Customizer, type Palette, type FontChoice } from "@/components/customizer";

const palettes: Palette[] = [
  {
    id: "noche-oro",
    name: "Noche dorada",
    swatch: ["#0a0a0a", "#c9a961", "#f5e1a8", "#8a6d2c"],
    tokens: {
      "--c-bg": "#0a0a0a",
      "--c-fg": "#f5f0e8",
      "--c-accent": "#c9a961",
      "--c-accent-2": "#f5e1a8",
      "--c-accent-3": "#8a6d2c",
      "--c-shine": "linear-gradient(135deg, #d4af6f 0%, #f5e1a8 30%, #c9a961 55%, #8a6d2c 80%, #f0d486 100%)",
    } as Record<string, string>,
  },
  {
    id: "champagne",
    name: "Champagne",
    swatch: ["#f4ecd8", "#a87b2a", "#dcc28a", "#5a4317"],
    tokens: {
      "--c-bg": "#f4ecd8",
      "--c-fg": "#2a200e",
      "--c-accent": "#a87b2a",
      "--c-accent-2": "#5a4317",
      "--c-accent-3": "#dcc28a",
      "--c-shine": "linear-gradient(135deg, #b88a32 0%, #5a4317 30%, #8a6d2c 55%, #a87b2a 80%, #c9a961 100%)",
    } as Record<string, string>,
  },
  {
    id: "esmeralda",
    name: "Esmeralda",
    swatch: ["#0c1f17", "#c9a961", "#f5e1a8", "#1e3a2c"],
    tokens: {
      "--c-bg": "#0c1f17",
      "--c-fg": "#f0e8d8",
      "--c-accent": "#c9a961",
      "--c-accent-2": "#f5e1a8",
      "--c-accent-3": "#1e3a2c",
      "--c-shine": "linear-gradient(135deg, #d4af6f 0%, #f5e1a8 30%, #c9a961 55%, #8a6d2c 80%, #f0d486 100%)",
    } as Record<string, string>,
  },
  {
    id: "borgona",
    name: "Borgoña",
    swatch: ["#1a0a0e", "#d4af6f", "#f5e1a8", "#3a1018"],
    tokens: {
      "--c-bg": "#1a0a0e",
      "--c-fg": "#f5e8d8",
      "--c-accent": "#d4af6f",
      "--c-accent-2": "#f5e1a8",
      "--c-accent-3": "#7a1f2e",
      "--c-shine": "linear-gradient(135deg, #d4af6f 0%, #f5e1a8 30%, #c9a961 55%, #8a6d2c 80%, #f0d486 100%)",
    } as Record<string, string>,
  },
  {
    id: "lila-blanco",
    name: "Lila & Blanco",
    swatch: ["#ffffff", "#9b7cc7", "#c8c4d8", "#f0ecf8"],
    tokens: {
      "--c-bg": "#ffffff",
      "--c-fg": "#2d2240",
      "--c-accent": "#9b7cc7",
      "--c-accent-2": "#e4e0f4",
      "--c-accent-3": "#c8c4d8",
      "--c-shine": "linear-gradient(135deg, #c4b0e0 0%, #f0ecf8 30%, #9b7cc7 55%, #b8b4cc 80%, #d4cce8 100%)",
    } as Record<string, string>,
  },
  {
    id: "plata-lila",
    name: "Plata & Lila",
    swatch: ["#f0eef6", "#7a6daa", "#b8b4cc", "#1e1830"],
    tokens: {
      "--c-bg": "#f0eef6",
      "--c-fg": "#1e1830",
      "--c-accent": "#7a6daa",
      "--c-accent-2": "#f0eef6",
      "--c-accent-3": "#b8b4cc",
      "--c-shine": "linear-gradient(135deg, #9888c4 0%, #e4e0f0 30%, #7a6daa 55%, #a8a4bc 80%, #c4c0d8 100%)",
    } as Record<string, string>,
  },
];

const fonts: FontChoice[] = [
  {
    id: "deco",
    name: "Deco",
    sample: "Ag",
    tokens: {
      "--c-display": "var(--font-deco)",
      "--c-script": "var(--font-script)",
      "--c-body": "var(--font-serif)",
    } as Record<string, string>,
  },
  {
    id: "editorial",
    name: "Editorial",
    sample: "Ag",
    tokens: {
      "--c-display": "var(--font-bodoni)",
      "--c-script": "var(--font-great-vibes)",
      "--c-body": "var(--font-serif)",
    } as Record<string, string>,
  },
  {
    id: "refinada",
    name: "Refinada",
    sample: "Ag",
    tokens: {
      "--c-display": "var(--font-dm-serif)",
      "--c-script": "var(--font-script)",
      "--c-body": "var(--font-marcellus)",
    } as Record<string, string>,
  },
];

function GoldText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={className}
      style={{
        background: "var(--c-shine)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        color: "transparent",
        backgroundSize: "200% 200%",
        animation: "shimmer-deco 6s ease-in-out infinite",
      }}
    >
      {children}
    </span>
  );
}

function Sunburst() {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      <defs>
        <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--c-accent-2)" />
          <stop offset="50%" stopColor="var(--c-accent)" />
          <stop offset="100%" stopColor="var(--c-accent-3)" />
        </linearGradient>
      </defs>
      {Array.from({ length: 24 }).map((_, i) => (
        <motion.line
          key={i}
          x1="100"
          y1="100"
          x2="100"
          y2="10"
          stroke="url(#gold)"
          strokeWidth="1.5"
          transform={`rotate(${i * 15} 100 100)`}
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
      <motion.circle
        cx="100"
        cy="100"
        r="30"
        fill="none"
        stroke="url(#gold)"
        strokeWidth="1.5"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
      />
      <motion.circle
        cx="100"
        cy="100"
        r="15"
        fill="url(#gold)"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 1 }}
      />
    </svg>
  );
}

function DecoBorder() {
  return (
    <svg
      viewBox="0 0 1200 60"
      preserveAspectRatio="none"
      className="w-full h-8"
      style={{ color: "var(--c-accent)" }}
    >
      <defs>
        <pattern id="deco-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M0,30 L15,15 L30,30 L45,15 L60,30" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="30" cy="30" r="2" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="1200" height="60" fill="url(#deco-pattern)" opacity="0.6" />
    </svg>
  );
}

export default function ArtDeco() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const curtainLeft = useTransform(heroScroll, [0, 0.5], ["0%", "-100%"]);
  const curtainRight = useTransform(heroScroll, [0, 0.5], ["0%", "100%"]);
  const heroY = useTransform(heroScroll, [0, 1], [0, 200]);

  const isDarkPalette = (id: string) => id !== "champagne";

  return (
    <Customizer themeId="opcion-2" palettes={palettes} fonts={fonts} tone="dark">
      {({ styleVars, palette }) => {
        const dark = isDarkPalette(palette.id);
        return (
          <div
            ref={containerRef}
            style={{
              ...styleVars,
              backgroundColor: "var(--c-bg)",
              color: "var(--c-fg)",
              fontFamily: "var(--c-body)",
            }}
            className="min-h-screen overflow-hidden"
          >
            <style>{`
              @keyframes shimmer-deco {
                0%, 100% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
              }
              .deco-bg-2 {
                background-image:
                  radial-gradient(circle at 20% 80%, color-mix(in srgb, var(--c-accent) 10%, transparent) 0%, transparent 50%),
                  radial-gradient(circle at 80% 20%, color-mix(in srgb, var(--c-accent) 7%, transparent) 0%, transparent 50%);
              }
            `}</style>

            {/* Progress bar */}
            <motion.div
              style={{ scaleX, transformOrigin: "0%" }}
              className="fixed top-0 left-0 right-0 h-[2px] z-50 origin-left"
            >
              <div className="h-full" style={{ background: "var(--c-shine)" }} />
            </motion.div>

            <nav
              className="fixed top-0 left-0 right-0 z-40 px-6 py-5 flex justify-between items-center backdrop-blur-md"
              style={{
                backgroundColor: "color-mix(in srgb, var(--c-bg) 60%, transparent)",
                borderBottom: "1px solid color-mix(in srgb, var(--c-accent) 20%, transparent)",
              }}
            >
              <Link
                href="/"
                className="text-xs tracking-[0.4em] uppercase transition-colors hover:opacity-80"
                style={{ color: "var(--c-accent)", fontFamily: "var(--c-display)" }}
              >
                ← Volver
              </Link>
              <span
                className="text-xs tracking-[0.2em] sm:tracking-[0.4em] uppercase"
                style={{ color: "var(--c-accent)", fontFamily: "var(--c-display)" }}
              >
                <span className="hidden sm:inline">MCMXXVI · </span>MMXXVI
              </span>
            </nav>

            {/* HERO con cortinas */}
            <section
              ref={heroRef}
              className="relative min-h-screen flex items-center justify-center deco-bg-2 overflow-hidden"
            >
              <motion.div
                style={{ x: curtainLeft }}
                className="absolute inset-y-0 left-0 w-1/2 z-30"
                initial={{ x: 0 }}
                animate={{ x: "-100%" }}
                transition={{ duration: 2.5, delay: 0.3, ease: [0.7, 0, 0.2, 1] }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundColor: "var(--c-bg)",
                    borderRight: "1px solid var(--c-accent)",
                  }}
                />
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, var(--c-accent) 0, var(--c-accent) 1px, transparent 1px, transparent 40px)",
                  }}
                />
              </motion.div>
              <motion.div
                style={{ x: curtainRight }}
                className="absolute inset-y-0 right-0 w-1/2 z-30"
                initial={{ x: 0 }}
                animate={{ x: "100%" }}
                transition={{ duration: 2.5, delay: 0.3, ease: [0.7, 0, 0.2, 1] }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundColor: "var(--c-bg)",
                    borderLeft: "1px solid var(--c-accent)",
                  }}
                />
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, var(--c-accent) 0, var(--c-accent) 1px, transparent 1px, transparent 40px)",
                  }}
                />
              </motion.div>

              <motion.div style={{ y: heroY }} className="relative z-10 text-center max-w-5xl px-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.2, delay: 2.5 }}
                  className="mx-auto w-32 h-32 md:w-44 md:h-44 mb-8"
                >
                  <Sunburst />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.4, delay: 3 }}
                >
                  <p
                    className="text-xs md:text-sm tracking-[0.6em] uppercase mb-6"
                    style={{ color: "var(--c-accent)", fontFamily: "var(--c-display)" }}
                  >
                    ✦ Sociedad de los Enamorados ✦
                  </p>
                  <h1
                    className="text-5xl md:text-8xl tracking-[0.05em] leading-none"
                    style={{ fontFamily: "var(--c-display)" }}
                  >
                    <GoldText>{wedding.groom.toUpperCase()}</GoldText>
                  </h1>
                  <motion.p
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, delay: 3.5, type: "spring" }}
                    className="text-7xl md:text-9xl my-2"
                    style={{ fontFamily: "var(--c-script)", color: "var(--c-accent-2)" }}
                  >
                    &amp;
                  </motion.p>
                  <h1
                    className="text-5xl md:text-8xl tracking-[0.05em] leading-none"
                    style={{ fontFamily: "var(--c-display)" }}
                  >
                    <GoldText>{wedding.bride.toUpperCase()}</GoldText>
                  </h1>

                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "auto" }}
                    transition={{ duration: 1.5, delay: 4 }}
                    className="mx-auto mt-12 inline-flex items-center gap-2 md:gap-4 py-3 md:py-4 px-4 md:px-8 overflow-hidden whitespace-nowrap"
                    style={{
                      borderTop: "1px solid var(--c-accent)",
                      borderBottom: "1px solid var(--c-accent)",
                    }}
                  >
                    <span
                      className="tracking-[0.25em] md:tracking-[0.5em] text-xs md:text-sm"
                      style={{ color: "var(--c-accent)", fontFamily: "var(--c-display)" }}
                    >
                      XXV
                    </span>
                    <span className="text-lg md:text-2xl" style={{ color: "var(--c-accent-2)" }}>◆</span>
                    <span
                      className="tracking-[0.25em] md:tracking-[0.5em] text-xs md:text-sm"
                      style={{ color: "var(--c-accent)", fontFamily: "var(--c-display)" }}
                    >
                      VII
                    </span>
                    <span className="text-lg md:text-2xl" style={{ color: "var(--c-accent-2)" }}>◆</span>
                    <span
                      className="tracking-[0.25em] md:tracking-[0.5em] text-xs md:text-sm"
                      style={{ color: "var(--c-accent)", fontFamily: "var(--c-display)" }}
                    >
                      MMXXVI
                    </span>
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 4.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs tracking-[0.4em] uppercase z-10"
                style={{ color: "var(--c-accent)", fontFamily: "var(--c-display)" }}
              >
                <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  ▼ DESCUBRE ▼
                </motion.span>
              </motion.div>
            </section>

            <DecoBorder />

            {/* STORY */}
            <section className="py-32 px-6 deco-bg-2 relative">
              <div className="max-w-4xl mx-auto text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="mx-auto w-24 h-24 mb-8"
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full" style={{ color: "var(--c-accent)" }}>
                    <motion.path
                      d="M50,10 L60,40 L90,40 L65,58 L75,88 L50,70 L25,88 L35,58 L10,40 L40,40 Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 2 }}
                    />
                  </svg>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="text-4xl md:text-6xl tracking-[0.15em] mb-12"
                  style={{ fontFamily: "var(--c-display)" }}
                >
                  <GoldText>UNA HISTORIA</GoldText>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="text-lg md:text-2xl leading-relaxed italic"
                  style={{
                    fontFamily: "var(--c-body)",
                    color: dark
                      ? "color-mix(in srgb, var(--c-fg) 90%, transparent)"
                      : "var(--c-fg)",
                  }}
                >
                  &quot;{wedding.story}&quot;
                </motion.p>
              </div>
            </section>

            <DecoBorder />

            {/* DATE */}
            <section className="py-32 px-6 relative deco-bg-2">
              <div className="max-w-5xl mx-auto">
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="text-center text-xs tracking-[0.5em] uppercase mb-4"
                  style={{ color: "var(--c-accent)", fontFamily: "var(--c-display)" }}
                >
                  ☆ Marque su calendario ☆
                </motion.p>

                <div className="grid grid-cols-3 gap-4 md:gap-12 mt-12">
                  {[
                    { num: "25", label: "Día" },
                    { num: "07", label: "Mes" },
                    { num: "26", label: "Año" },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 60, rotateX: -90 }}
                      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 1, delay: i * 0.2, ease: [0.22, 1, 0.36, 1] }}
                      className="text-center py-8 relative rounded-3xl"
                      style={{
                        borderTop: "1px solid var(--c-accent)",
                        borderBottom: "1px solid var(--c-accent)",
                      }}
                    >
                      <span
                        className="absolute top-0 left-0 w-3 h-3"
                        style={{
                          borderLeft: "1px solid var(--c-accent)",
                          borderTop: "1px solid var(--c-accent)",
                        }}
                      />
                      <span
                        className="absolute top-0 right-0 w-3 h-3"
                        style={{
                          borderRight: "1px solid var(--c-accent)",
                          borderTop: "1px solid var(--c-accent)",
                        }}
                      />
                      <span
                        className="absolute bottom-0 left-0 w-3 h-3"
                        style={{
                          borderLeft: "1px solid var(--c-accent)",
                          borderBottom: "1px solid var(--c-accent)",
                        }}
                      />
                      <span
                        className="absolute bottom-0 right-0 w-3 h-3"
                        style={{
                          borderRight: "1px solid var(--c-accent)",
                          borderBottom: "1px solid var(--c-accent)",
                        }}
                      />
                      <p
                        className="text-6xl md:text-9xl leading-none"
                        style={{ fontFamily: "var(--c-display)" }}
                      >
                        <GoldText>{item.num}</GoldText>
                      </p>
                      <p
                        className="mt-4 text-xs md:text-sm tracking-[0.4em] uppercase"
                        style={{ color: "var(--c-accent)", fontFamily: "var(--c-display)" }}
                      >
                        {item.label}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            <DecoBorder />

            {/* EVENTS */}
            <section className="py-32 px-6 deco-bg-2">
              <div className="max-w-5xl mx-auto">
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="text-center text-4xl md:text-6xl tracking-[0.15em] mb-20"
                  style={{ fontFamily: "var(--c-display)" }}
                >
                  <GoldText>EL PROGRAMA</GoldText>
                </motion.h2>

                <div className="grid md:grid-cols-2 gap-8">
                  {[wedding.ceremony, wedding.reception].map((event, i) => (
                    <motion.div
                      key={event.title}
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.9, delay: i * 0.15 }}
                      className="relative p-10 transition-colors group rounded-3xl"
                      style={{
                        border: "1px solid color-mix(in srgb, var(--c-accent) 40%, transparent)",
                        background:
                          "linear-gradient(135deg, color-mix(in srgb, var(--c-accent) 4%, transparent) 0%, transparent 100%)",
                      }}
                    >
                      <div
                        className="absolute -top-3 left-1/2 -translate-x-1/2 px-4"
                        style={{ backgroundColor: "var(--c-bg)" }}
                      >
                        <span
                          className="tracking-[0.3em] text-xs"
                          style={{ color: "var(--c-accent)", fontFamily: "var(--c-display)" }}
                        >
                          {i === 0 ? "ACTO I" : "ACTO II"}
                        </span>
                      </div>
                      <h3
                        className="text-center text-2xl tracking-[0.2em] mb-2 mt-2"
                        style={{ fontFamily: "var(--c-display)" }}
                      >
                        <GoldText>{event.title.toUpperCase()}</GoldText>
                      </h3>
                      <p
                        className="text-center text-5xl mb-4"
                        style={{ fontFamily: "var(--c-script)", color: "var(--c-accent-2)" }}
                      >
                        {event.time}
                      </p>
                      <div
                        className="h-px my-4"
                        style={{
                          background:
                            "linear-gradient(to right, transparent, var(--c-accent), transparent)",
                        }}
                      />
                      <p
                        className="text-center text-lg tracking-[0.1em]"
                        style={{ fontFamily: "var(--c-display)" }}
                      >
                        {event.place}
                      </p>
                      <p
                        className="text-center text-sm mt-2"
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
                  className="text-center mt-16 tracking-[0.4em] uppercase text-xs"
                  style={{ color: "var(--c-accent)", fontFamily: "var(--c-display)" }}
                >
                  ◆ Etiqueta · {wedding.dressCode} ◆
                </motion.p>
              </div>
            </section>

            <DecoBorder />

            {/* RSVP */}
            <section className="py-32 px-6 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="max-w-2xl mx-auto text-center"
              >
                <div className="mx-auto w-20 h-20 mb-8">
                  <Sunburst />
                </div>
                <h2
                  className="text-4xl md:text-6xl tracking-[0.15em] mb-8"
                  style={{ fontFamily: "var(--c-display)" }}
                >
                  <GoldText>CONFIRME</GoldText>
                </h2>
                <p
                  className="text-lg leading-relaxed mb-10 italic"
                  style={{
                    color: "color-mix(in srgb, var(--c-fg) 80%, transparent)",
                    fontFamily: "var(--c-body)",
                  }}
                >
                  Su presencia será el oro de la noche. Reserve su lugar antes del{" "}
                  <span style={{ color: "var(--c-accent-2)" }}>{wedding.rsvpDeadline}</span>.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative px-12 py-4 tracking-[0.4em] uppercase text-sm rounded-full transition-all duration-500"
                  style={{
                    border: "1px solid var(--c-accent)",
                    color: "var(--c-accent)",
                    fontFamily: "var(--c-display)",
                  }}
                >
                  Confirmar Asistencia
                </motion.button>
              </motion.div>
            </section>

            <footer
              className="py-8 text-center text-xs tracking-[0.4em] uppercase opacity-60"
              style={{
                borderTop: "1px solid color-mix(in srgb, var(--c-accent) 30%, transparent)",
                color: "var(--c-accent)",
                fontFamily: "var(--c-display)",
              }}
            >
              ◆ MMXXVI ◆ {wedding.groom[0]} & {wedding.bride[0]} ◆
            </footer>
          </div>
        );
      }}
    </Customizer>
  );
}
