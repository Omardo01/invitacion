"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { wedding } from "@/lib/wedding";
import { Customizer, type Palette, type FontChoice } from "@/components/customizer";

const palettes: Palette[] = [
  {
    id: "sumi",
    name: "Sumi",
    swatch: ["#ffffff", "#0a0a0a", "#c4623d", "#a3a3a3"],
    tokens: {
      "--c-bg": "#ffffff",
      "--c-paper": "#fafafa",
      "--c-fg": "#0a0a0a",
      "--c-muted": "#737373",
      "--c-accent": "#c4623d",
    } as Record<string, string>,
  },
  {
    id: "ink",
    name: "Tinta",
    swatch: ["#f5f1ea", "#0a0a0a", "#1d4ed8", "#a3a3a3"],
    tokens: {
      "--c-bg": "#f5f1ea",
      "--c-paper": "#faf6ef",
      "--c-fg": "#0a0a0a",
      "--c-muted": "#737373",
      "--c-accent": "#1d4ed8",
    } as Record<string, string>,
  },
  {
    id: "mono",
    name: "Mono",
    swatch: ["#fafafa", "#0a0a0a", "#525252", "#d4d4d4"],
    tokens: {
      "--c-bg": "#fafafa",
      "--c-paper": "#ffffff",
      "--c-fg": "#0a0a0a",
      "--c-muted": "#737373",
      "--c-accent": "#0a0a0a",
    } as Record<string, string>,
  },
  {
    id: "noche",
    name: "Noche",
    swatch: ["#0e1117", "#fafafa", "#c9a961", "#525252"],
    tokens: {
      "--c-bg": "#0e1117",
      "--c-paper": "#161b23",
      "--c-fg": "#fafafa",
      "--c-muted": "#a3a3a3",
      "--c-accent": "#c9a961",
    } as Record<string, string>,
  },
];

const fonts: FontChoice[] = [
  {
    id: "suizo",
    name: "Suizo",
    sample: "Ag",
    tokens: {
      "--c-display": "var(--font-sans)",
      "--c-display-weight": "300",
      "--c-serif": "var(--font-dm-serif)",
      "--c-body": "var(--font-sans)",
    } as Record<string, string>,
  },
  {
    id: "editorial",
    name: "Editorial",
    sample: "Ag",
    tokens: {
      "--c-display": "var(--font-marcellus)",
      "--c-display-weight": "400",
      "--c-serif": "var(--font-marcellus)",
      "--c-body": "var(--font-sans)",
    } as Record<string, string>,
  },
  {
    id: "moderno",
    name: "Moderno",
    sample: "Ag",
    tokens: {
      "--c-display": "var(--font-bodoni)",
      "--c-display-weight": "400",
      "--c-serif": "var(--font-bodoni)",
      "--c-body": "var(--font-sans)",
    } as Record<string, string>,
  },
  {
    id: "clasico",
    name: "Clásico",
    sample: "Ag",
    tokens: {
      "--c-display": "var(--font-display)",
      "--c-display-weight": "400",
      "--c-serif": "var(--font-display)",
      "--c-body": "var(--font-serif)",
    } as Record<string, string>,
  },
];

function WordReveal({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.25em]">
          <motion.span
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{
              duration: 0.8,
              delay: delay + i * 0.07,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="inline-block"
          >
            {w}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function ScrollWordReveal({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const words = text.split(" ");
  return (
    <span ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.25em]">
          <motion.span
            initial={{ y: "110%" }}
            animate={{ y: inView ? 0 : "110%" }}
            transition={{
              duration: 0.8,
              delay: i * 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="inline-block"
          >
            {w}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function Counter({ to, duration = 1.5 }: { to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);
  return <span ref={ref}>{val.toString().padStart(2, "0")}</span>;
}

export default function MinimalEditorial() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  return (
    <Customizer themeId="opcion-5" palettes={palettes} fonts={fonts} tone="light">
      {({ styleVars, palette }) => {
        const isDark = palette.id === "noche";
        return (
          <div ref={containerRef} style={styleVars} className="min-h-screen overflow-hidden">
            <div
              className="min-h-screen"
              style={{
                backgroundColor: "var(--c-bg)",
                color: "var(--c-fg)",
                fontFamily: "var(--c-body)",
                fontWeight: "300",
              }}
            >
              {/* Progress bar */}
              <motion.div
                style={{ scaleX: scrollYProgress, transformOrigin: "0%" }}
                className="fixed top-0 left-0 right-0 h-[2px] z-50"
              >
                <div className="h-full" style={{ backgroundColor: "var(--c-accent)" }} />
              </motion.div>

              <nav
                className="fixed top-0 left-0 right-0 z-40 px-6 md:px-12 py-5 flex justify-between items-center backdrop-blur-sm"
                style={{
                  backgroundColor: `color-mix(in srgb, var(--c-bg) 80%, transparent)`,
                }}
              >
                <Link
                  href="/"
                  className="text-[11px] tracking-[0.3em] uppercase hover:opacity-60 transition-opacity"
                >
                  ← Volver
                </Link>
                <div className="flex items-center gap-6 text-[11px] tracking-[0.3em] uppercase">
                  <span style={{ color: "var(--c-muted)" }}>Inv. 005</span>
                  <span>25.07.2026</span>
                </div>
              </nav>

              {/* HERO - massive type */}
              <section className="relative min-h-screen flex flex-col px-6 md:px-12 pt-32 pb-16">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="flex items-center gap-3 text-[11px] tracking-[0.3em] uppercase mb-12"
                >
                  <span className="w-8 h-px" style={{ backgroundColor: "var(--c-accent)" }} />
                  <span style={{ color: "var(--c-accent)" }}>Invitación</span>
                  <span style={{ color: "var(--c-muted)" }}>· Boda · MMXXVI</span>
                </motion.div>

                <div className="flex-1 flex flex-col justify-center">
                  <h1
                    className="text-[18vw] md:text-[14vw] leading-[0.85] tracking-[-0.04em]"
                    style={{
                      fontFamily: "var(--c-display)",
                      fontWeight: "var(--c-display-weight, 300)" as string,
                    }}
                  >
                    <WordReveal text={wedding.groom.toLowerCase()} delay={0.4} />
                  </h1>
                  <h1
                    className="text-[18vw] md:text-[14vw] leading-[0.85] tracking-[-0.04em] flex items-baseline gap-[0.1em]"
                    style={{
                      fontFamily: "var(--c-display)",
                      fontWeight: "var(--c-display-weight, 300)" as string,
                    }}
                  >
                    <span
                      className="text-[12vw] md:text-[8vw] italic"
                      style={{ fontFamily: "var(--c-serif)", color: "var(--c-accent)" }}
                    >
                      &amp;
                    </span>
                    <WordReveal text={wedding.bride.toLowerCase()} delay={0.7} />
                  </h1>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.4 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 mt-16 pt-8 border-t"
                  style={{ borderColor: "color-mix(in srgb, var(--c-fg) 12%, transparent)" }}
                >
                  {[
                    { label: "Fecha", value: "25.07.2026" },
                    { label: "Ciudad", value: wedding.city },
                    { label: "Etiqueta", value: wedding.dressCode },
                    { label: "Confirma", value: wedding.rsvpDeadline },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-[10px] tracking-[0.3em] uppercase mb-1.5" style={{ color: "var(--c-muted)" }}>
                        {item.label}
                      </p>
                      <p className="text-sm md:text-base" style={{ fontFamily: "var(--c-serif)" }}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </motion.div>
              </section>

              {/* Marquee */}
              <section
                className="py-6 overflow-hidden border-y"
                style={{ borderColor: "color-mix(in srgb, var(--c-fg) 12%, transparent)" }}
              >
                <motion.div
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  className="inline-flex gap-12 whitespace-nowrap will-change-transform"
                >
                  {Array.from({ length: 8 }).map((_, i) => (
                    <span key={i} className="inline-flex items-center gap-12 text-3xl md:text-5xl">
                      <span style={{ fontFamily: "var(--c-display)", fontWeight: "var(--c-display-weight, 300)" as string }}>
                        Gabriel &amp; Zayra
                      </span>
                      <span style={{ color: "var(--c-accent)" }}>—</span>
                      <span style={{ fontFamily: "var(--c-serif)", fontStyle: "italic" }}>nos casamos</span>
                      <span style={{ color: "var(--c-accent)" }}>—</span>
                    </span>
                  ))}
                </motion.div>
              </section>

              {/* STORY 2 columns */}
              <section className="py-32 px-6 md:px-12">
                <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-8 md:gap-16">
                  <div className="md:col-span-3">
                    <p className="text-[11px] tracking-[0.3em] uppercase" style={{ color: "var(--c-muted)" }}>
                      §01 · Capítulo
                    </p>
                    <p className="text-[11px] tracking-[0.3em] uppercase mt-1" style={{ color: "var(--c-accent)" }}>
                      Historia
                    </p>
                  </div>

                  <h2
                    className="md:col-span-9 text-4xl md:text-6xl leading-[1.05] tracking-[-0.02em]"
                    style={{ fontFamily: "var(--c-serif)" }}
                  >
                    <ScrollWordReveal text={wedding.story} />
                  </h2>
                </div>
              </section>

              {/* DATE - massive numbers */}
              <section
                className="py-32 px-6 md:px-12 border-y"
                style={{
                  borderColor: "color-mix(in srgb, var(--c-fg) 12%, transparent)",
                  backgroundColor: "var(--c-paper)",
                }}
              >
                <div className="max-w-6xl mx-auto">
                  <div className="flex items-baseline justify-between mb-8 text-[11px] tracking-[0.3em] uppercase" style={{ color: "var(--c-muted)" }}>
                    <span>§02 · La fecha</span>
                    <span>—</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 md:gap-8 items-end">
                    {[
                      { num: 25, label: "Día" },
                      { num: 7, label: "Mes" },
                      { num: 26, label: "Año" },
                    ].map((item, i) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.9, delay: i * 0.15 }}
                      >
                        <p
                          className="text-[24vw] md:text-[18vw] leading-[0.85] tracking-[-0.05em] tabular-nums"
                          style={{
                            fontFamily: "var(--c-display)",
                            fontWeight: "var(--c-display-weight, 300)" as string,
                            color: i === 1 ? "var(--c-accent)" : "var(--c-fg)",
                          }}
                        >
                          <Counter to={item.num} />
                        </p>
                        <p className="text-[11px] tracking-[0.3em] uppercase mt-3" style={{ color: "var(--c-muted)" }}>
                          {item.label}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              {/* EVENTS */}
              <section className="py-32 px-6 md:px-12">
                <div className="max-w-6xl mx-auto">
                  <div className="grid md:grid-cols-12 gap-8 mb-16">
                    <p className="md:col-span-3 text-[11px] tracking-[0.3em] uppercase" style={{ color: "var(--c-muted)" }}>
                      §03 · Programa
                    </p>
                    <h2
                      className="md:col-span-9 text-5xl md:text-7xl tracking-[-0.02em] leading-[1]"
                      style={{ fontFamily: "var(--c-serif)" }}
                    >
                      <ScrollWordReveal text="Dos actos. Un mismo día." />
                    </h2>
                  </div>

                  <div className="space-y-px">
                    {[wedding.ceremony, wedding.reception].map((event, i) => (
                      <motion.div
                        key={event.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        whileHover={{ x: 4 }}
                        className="group grid md:grid-cols-12 gap-4 md:gap-8 items-baseline py-8 border-t"
                        style={{ borderColor: "color-mix(in srgb, var(--c-fg) 12%, transparent)" }}
                      >
                        <p
                          className="md:col-span-1 text-2xl md:text-3xl tabular-nums"
                          style={{ color: "var(--c-accent)" }}
                        >
                          0{i + 1}
                        </p>
                        <p className="md:col-span-2 text-[11px] tracking-[0.3em] uppercase" style={{ color: "var(--c-muted)" }}>
                          {event.time}
                        </p>
                        <h3 className="md:col-span-4 text-2xl md:text-3xl tracking-[-0.01em]" style={{ fontFamily: "var(--c-serif)" }}>
                          {event.title}
                        </h3>
                        <div className="md:col-span-5">
                          <p className="text-lg" style={{ fontFamily: "var(--c-serif)" }}>{event.place}</p>
                          <p className="text-sm mt-1" style={{ color: "var(--c-muted)" }}>{event.address}</p>
                        </div>
                      </motion.div>
                    ))}
                    <div className="border-t" style={{ borderColor: "color-mix(in srgb, var(--c-fg) 12%, transparent)" }} />
                  </div>
                </div>
              </section>

              {/* RSVP */}
              <section
                className="py-32 px-6 md:px-12 border-y"
                style={{
                  borderColor: "color-mix(in srgb, var(--c-fg) 12%, transparent)",
                  backgroundColor: "var(--c-paper)",
                }}
              >
                <div className="max-w-4xl mx-auto text-center">
                  <p className="text-[11px] tracking-[0.3em] uppercase mb-6" style={{ color: "var(--c-muted)" }}>
                    §04 · Confirmación
                  </p>
                  <h2
                    className="text-6xl md:text-9xl leading-[0.95] tracking-[-0.03em] mb-10"
                    style={{ fontFamily: "var(--c-display)", fontWeight: "var(--c-display-weight, 300)" as string }}
                  >
                    <ScrollWordReveal text="¿Vienes?" />
                  </h2>
                  <p className="max-w-md mx-auto mb-12 leading-relaxed" style={{ color: "var(--c-muted)" }}>
                    Tu lugar estará reservado si confirmas antes del{" "}
                    <span style={{ color: "var(--c-fg)" }}>{wedding.rsvpDeadline}</span>.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative inline-flex items-center gap-3 px-8 py-4 text-sm tracking-[0.3em] uppercase border transition-colors"
                    style={{
                      borderColor: "var(--c-fg)",
                      color: "var(--c-fg)",
                    }}
                  >
                    Confirmar
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    >
                      →
                    </motion.span>
                  </motion.button>
                </div>
              </section>

              <footer className="py-10 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-3 text-[11px] tracking-[0.3em] uppercase" style={{ color: "var(--c-muted)" }}>
                <span>Gabriel &amp; Zayra · MMXXVI</span>
                <span>25.07.2026 · {wedding.city}</span>
              </footer>
            </div>
          </div>
        );
      }}
    </Customizer>
  );
}
