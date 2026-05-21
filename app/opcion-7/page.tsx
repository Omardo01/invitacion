"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { wedding } from "@/lib/wedding";
import {
  Customizer,
  type Palette,
  type FontChoice,
  type ExtraGroup,
} from "@/components/customizer";

const palettes: Palette[] = [
  {
    id: "kraft",
    name: "Kraft sepia",
    swatch: ["#c8a878", "#5a3a1e", "#3a2410", "#a02828"],
    tokens: {
      "--c-bg": "#2a1f15",
      "--c-paper": "#d9b88a",
      "--c-paper-2": "#c8a878",
      "--c-fg": "#3a2410",
      "--c-accent": "#a02828",
      "--c-accent-2": "#5a3a1e",
      "--c-string": "#7c5a3a",
      "--c-stamp-bg": "#f0e2c8",
    } as Record<string, string>,
  },
  {
    id: "postal-azul",
    name: "Postal azul",
    swatch: ["#dde6f0", "#1d3557", "#0e1d33", "#e63946"],
    tokens: {
      "--c-bg": "#1a2638",
      "--c-paper": "#dde6f0",
      "--c-paper-2": "#c7d4e0",
      "--c-fg": "#0e1d33",
      "--c-accent": "#e63946",
      "--c-accent-2": "#1d3557",
      "--c-string": "#3a4f70",
      "--c-stamp-bg": "#f5edd6",
    } as Record<string, string>,
  },
  {
    id: "rosa-polvo",
    name: "Rosa polvo",
    swatch: ["#e8c5b9", "#7d2c3c", "#3d1820", "#c4623d"],
    tokens: {
      "--c-bg": "#2a1820",
      "--c-paper": "#e8c5b9",
      "--c-paper-2": "#d8b0a4",
      "--c-fg": "#3d1820",
      "--c-accent": "#7d2c3c",
      "--c-accent-2": "#c4623d",
      "--c-string": "#9c6055",
      "--c-stamp-bg": "#f5e5d6",
    } as Record<string, string>,
  },
  {
    id: "musgo",
    name: "Musgo",
    swatch: ["#d4d9c0", "#3e4a2d", "#1a2010", "#8b6f47"],
    tokens: {
      "--c-bg": "#1c2218",
      "--c-paper": "#d4d9c0",
      "--c-paper-2": "#c0c6a8",
      "--c-fg": "#1a2010",
      "--c-accent": "#3e4a2d",
      "--c-accent-2": "#8b6f47",
      "--c-string": "#6a5a3a",
      "--c-stamp-bg": "#ede8d0",
    } as Record<string, string>,
  },
];

const fonts: FontChoice[] = [
  {
    id: "maquina",
    name: "Máquina",
    sample: "Ag",
    tokens: {
      "--c-display": "var(--font-typewriter)",
      "--c-serif": "var(--font-serif)",
      "--c-script": "var(--font-script)",
      "--c-body": "var(--font-serif)",
    } as Record<string, string>,
  },
  {
    id: "editorial",
    name: "Editorial",
    sample: "Ag",
    tokens: {
      "--c-display": "var(--font-dm-serif)",
      "--c-serif": "var(--font-serif)",
      "--c-script": "var(--font-script)",
      "--c-body": "var(--font-serif)",
    } as Record<string, string>,
  },
  {
    id: "clasica",
    name: "Clásica",
    sample: "Ag",
    tokens: {
      "--c-display": "var(--font-display)",
      "--c-serif": "var(--font-serif)",
      "--c-script": "var(--font-great-vibes)",
      "--c-body": "var(--font-serif)",
    } as Record<string, string>,
  },
  {
    id: "deco",
    name: "Deco",
    sample: "Ag",
    tokens: {
      "--c-display": "var(--font-deco)",
      "--c-serif": "var(--font-serif)",
      "--c-script": "var(--font-great-vibes)",
      "--c-body": "var(--font-sans)",
    } as Record<string, string>,
  },
];

const extras: ExtraGroup[] = [
  {
    id: "stamp",
    label: "Estampilla",
    options: [
      { id: "mexicana", label: "México", preview: "✦" },
      { id: "francesa", label: "Francia", preview: "❀" },
      { id: "italiana", label: "Italia", preview: "♛" },
      { id: "tropical", label: "Tropical", preview: "✿" },
    ],
  },
  {
    id: "tie",
    label: "Cordón",
    options: [
      { id: "twine", label: "Cáñamo", preview: "〰" },
      { id: "ribbon", label: "Listón", preview: "～" },
      { id: "wax", label: "Sin cordón", preview: "○" },
    ],
  },
];

function PostalStamp({ kind }: { kind: string }) {
  const labels: Record<string, { country: string; mark: string }> = {
    mexicana: { country: "México · 5.00", mark: "✦" },
    francesa: { country: "France · 2 fr", mark: "❀" },
    italiana: { country: "Italia · L.50", mark: "♛" },
    tropical: { country: "Tropic · 3.00", mark: "✿" },
  };
  const { country, mark } = labels[kind] ?? labels.mexicana;

  return (
    <div
      className="relative w-20 h-24 rotate-[6deg] shadow-md"
      style={{
        backgroundColor: "var(--c-stamp-bg)",
        backgroundImage:
          "radial-gradient(circle, transparent 2px, var(--c-stamp-bg) 2px)",
        backgroundSize: "8px 8px",
        backgroundPosition: "-4px -4px",
      }}
    >
      <div
        className="absolute inset-[6px] flex flex-col items-center justify-between p-2"
        style={{
          border: "1px solid var(--c-accent)",
          color: "var(--c-accent)",
        }}
      >
        <p className="text-[7px] tracking-[0.2em] uppercase">Correos</p>
        <span className="text-3xl leading-none">{mark}</span>
        <p className="text-[7px] tracking-[0.15em] uppercase text-center">
          {country}
        </p>
      </div>
    </div>
  );
}

function useResponsiveScale(baseW: number, margin = 24) {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const compute = () => {
      const available = window.innerWidth - margin * 2;
      setScale(Math.min(1, available / baseW));
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [baseW, margin]);
  return scale;
}

function PostalEnvelope({
  open,
  onOpen,
  stamp,
  tie,
}: {
  open: boolean;
  onOpen: () => void;
  stamp: string;
  tie: string;
}) {
  const hasString = tie !== "wax";
  const stringColor = tie === "ribbon" ? "var(--c-accent)" : "var(--c-string)";
  const W = 380;
  const H = 280;
  const scale = useResponsiveScale(W);

  return (
    <div
      className="relative"
      style={{ width: W * scale, height: H * scale }}
    >
      <div
        className="relative"
        style={{
          width: W,
          height: H,
          perspective: 1600,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
      {/* envelope body (back panel) */}
      <div
        className="absolute inset-0 rounded-sm shadow-2xl"
        style={{
          backgroundColor: "var(--c-paper-2)",
          border: "1px solid color-mix(in srgb, var(--c-fg) 18%, transparent)",
          backgroundImage:
            "repeating-linear-gradient(45deg, color-mix(in srgb, var(--c-fg) 4%, transparent) 0 1px, transparent 1px 6px)",
        }}
      >
        {/* address lines */}
        <AnimatePresence>
          {!open && (
            <motion.div
              key="lines"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.6 }}
              className="absolute left-8 top-1/2 -translate-y-1/2"
              style={{ color: "var(--c-fg)" }}
            >
              <p
                className="text-[10px] tracking-[0.3em] uppercase opacity-50 mb-2"
                style={{ fontFamily: "var(--c-display)" }}
              >
                Vía aérea · Air mail
              </p>
              <p
                className="text-2xl"
                style={{ fontFamily: "var(--c-script)", color: "var(--c-accent)" }}
              >
                A nuestra gente querida,
              </p>
              <div
                className="my-2 h-px w-32"
                style={{ backgroundColor: "var(--c-accent-2)", opacity: 0.4 }}
              />
              <p
                className="text-[10px] tracking-[0.3em] uppercase opacity-70"
                style={{ fontFamily: "var(--c-display)" }}
              >
                {wedding.city}
              </p>
              <p
                className="text-[10px] tracking-[0.3em] uppercase opacity-70 mt-0.5"
                style={{ fontFamily: "var(--c-display)" }}
              >
                25 · 07 · 2026
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* air-mail border */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "repeating-linear-gradient(45deg, var(--c-accent) 0 8px, transparent 8px 16px, var(--c-accent-2) 16px 24px, transparent 24px 32px)",
            WebkitMask:
              "linear-gradient(#000,#000) content-box, linear-gradient(#000,#000)",
            mask: "linear-gradient(#000,#000) content-box, linear-gradient(#000,#000)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            padding: 6,
            opacity: 0.55,
          }}
        />

        {/* stamp */}
        <div className="absolute top-3 right-3">
          <PostalStamp kind={stamp} />
        </div>

        {/* postmark */}
        <div
          className="absolute top-6 right-28 w-20 h-20 rounded-full border-2 flex items-center justify-center rotate-[-12deg] opacity-50"
          style={{ borderColor: "var(--c-accent-2)", color: "var(--c-accent-2)" }}
        >
          <div className="text-center leading-tight">
            <p className="text-[8px] tracking-[0.2em] uppercase">Cdmx</p>
            <p className="text-[10px] tracking-[0.2em]">25.07.26</p>
            <p className="text-[8px] tracking-[0.2em] uppercase">M·M·X·X·V·I</p>
          </div>
        </div>
      </div>

      {/* card inside */}
      <motion.div
        className="absolute inset-x-6 rounded-sm shadow-lg overflow-hidden"
        style={{
          top: 20,
          bottom: 20,
          backgroundColor: "var(--c-paper)",
          color: "var(--c-fg)",
          border: "1px solid color-mix(in srgb, var(--c-fg) 18%, transparent)",
          zIndex: 1,
        }}
        animate={open ? { y: -200, scale: 1.05 } : { y: 0, scale: 1 }}
        transition={{ delay: open ? 0.9 : 0, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="h-full flex items-center px-6 gap-5">
          <div
            className="flex-shrink-0 w-16 text-center"
            style={{ color: "var(--c-accent)" }}
          >
            <p
              className="text-4xl leading-none"
              style={{ fontFamily: "var(--c-display)" }}
            >
              25
            </p>
            <p
              className="text-[10px] tracking-[0.3em] uppercase mt-1"
              style={{ fontFamily: "var(--c-display)" }}
            >
              Jul
            </p>
          </div>
          <div
            className="flex-shrink-0 w-px h-16"
            style={{ backgroundColor: "var(--c-accent-2)", opacity: 0.5 }}
          />
          <div className="flex-1">
            <p
              className="text-[10px] tracking-[0.3em] uppercase opacity-60 mb-1"
              style={{ fontFamily: "var(--c-display)" }}
            >
              Postal · Boda
            </p>
            <p
              className="text-2xl leading-tight"
              style={{ fontFamily: "var(--c-display)" }}
            >
              {wedding.groom} & {wedding.bride}
            </p>
            <p
              className="text-3xl"
              style={{
                fontFamily: "var(--c-script)",
                color: "var(--c-accent)",
                marginTop: 2,
              }}
            >
              ¡nos casamos!
            </p>
          </div>
        </div>
      </motion.div>

      {/* top flap (triangle) */}
      <motion.div
        className="absolute left-0 right-0 top-0 origin-top"
        style={{
          height: 140,
          backgroundColor: "var(--c-paper)",
          clipPath: "polygon(0 0, 100% 0, 50% 100%)",
          transformOrigin: "top center",
          transformStyle: "preserve-3d",
          zIndex: 2,
          backgroundImage:
            "repeating-linear-gradient(45deg, color-mix(in srgb, var(--c-fg) 4%, transparent) 0 1px, transparent 1px 6px)",
        }}
        animate={open ? { rotateX: 175 } : { rotateX: 0 }}
        transition={{ delay: open ? 0.45 : 0, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="absolute inset-0 opacity-25"
          style={{
            background:
              "linear-gradient(180deg, transparent 30%, color-mix(in srgb, var(--c-fg) 35%, transparent))",
          }}
        />
      </motion.div>

      {/* string / tie */}
      {hasString && (
        <>
          <motion.span
            className="absolute"
            style={{
              top: 0,
              bottom: 0,
              left: "50%",
              width: tie === "ribbon" ? 8 : 3,
              transform: "translateX(-50%)",
              backgroundColor: stringColor,
              zIndex: 3,
              boxShadow: "0 0 4px rgba(0,0,0,0.3)",
            }}
            animate={
              open
                ? { opacity: 0, x: "-50%", rotate: -25, scale: 0.6 }
                : { opacity: 1, x: "-50%", rotate: 0, scale: 1 }
            }
            transition={{ duration: 0.5 }}
          />
          <motion.span
            className="absolute"
            style={{
              left: 0,
              right: 0,
              top: "50%",
              height: tie === "ribbon" ? 8 : 3,
              transform: "translateY(-50%)",
              backgroundColor: stringColor,
              zIndex: 3,
              boxShadow: "0 0 4px rgba(0,0,0,0.3)",
            }}
            animate={
              open
                ? { opacity: 0, y: "-50%", rotate: 20, scale: 0.6 }
                : { opacity: 1, y: "-50%", rotate: 0, scale: 1 }
            }
            transition={{ duration: 0.5, delay: 0.05 }}
          />
          {/* knot */}
          <motion.button
            onClick={onOpen}
            disabled={open}
            aria-label="Desatar cordón"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center shadow-lg"
            style={{
              width: 58,
              height: 58,
              backgroundColor: stringColor,
              color: "var(--c-paper)",
              zIndex: 4,
              cursor: open ? "default" : "pointer",
              border: "2px solid color-mix(in srgb, " + stringColor + " 60%, black)",
            }}
            whileHover={open ? {} : { scale: 1.05, rotate: 15 }}
            whileTap={open ? {} : { scale: 0.93 }}
            animate={open ? { opacity: 0, scale: 0, rotate: 360 } : { opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <span
              className="text-[9px] tracking-[0.3em] uppercase"
              style={{ fontFamily: "var(--c-display)" }}
            >
              Abrir
            </span>
          </motion.button>
        </>
      )}

      {!hasString && (
        <motion.button
          onClick={onOpen}
          disabled={open}
          aria-label="Romper sello"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-lg flex items-center justify-center"
          style={{
            width: 72,
            height: 72,
            backgroundColor: "var(--c-accent)",
            color: "var(--c-paper)",
            zIndex: 4,
            border: "3px solid color-mix(in srgb, var(--c-accent) 60%, black)",
          }}
          whileHover={open ? {} : { scale: 1.05 }}
          whileTap={open ? {} : { scale: 0.93 }}
          animate={open ? { opacity: 0, scale: 0, rotate: -180 } : { opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span
            className="text-xs tracking-[0.25em] uppercase"
            style={{ fontFamily: "var(--c-display)" }}
          >
            G&Z
          </span>
        </motion.button>
      )}
      </div>
    </div>
  );
}

export default function SobrePostal() {
  const [opened, setOpened] = useState(false);

  return (
    <Customizer themeId="opcion-7" palettes={palettes} fonts={fonts} extras={extras} tone="dark">
      {({ styleVars, extras: extrasState }) => (
        <div style={styleVars}>
          <div
            className="min-h-screen"
            style={{
              backgroundColor: "var(--c-bg)",
              color: "var(--c-paper)",
              fontFamily: "var(--c-body)",
              backgroundImage:
                "radial-gradient(circle at 50% 20%, color-mix(in srgb, var(--c-accent) 18%, transparent), transparent 60%)",
            }}
          >
            <nav
              className="fixed top-0 left-0 right-0 z-40 px-6 py-4 flex justify-between items-center backdrop-blur-sm"
              style={{
                backgroundColor: "color-mix(in srgb, var(--c-bg) 70%, transparent)",
                borderBottom:
                  "1px solid color-mix(in srgb, var(--c-paper) 8%, transparent)",
              }}
            >
              <Link
                href="/"
                className="text-xs tracking-[0.3em] uppercase opacity-70 hover:opacity-100 transition-opacity"
              >
                ← Volver
              </Link>
              <span className="text-xs tracking-[0.3em] uppercase opacity-50">
                Inv. 007 · Sobre Postal
              </span>
            </nav>

            {/* HERO ENVELOPE */}
            <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24">
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-10"
              >
                <p
                  className="text-[10px] tracking-[0.5em] uppercase opacity-50"
                  style={{ fontFamily: "var(--c-display)" }}
                >
                  Una carta cruzó océanos para llegar a ti
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30, rotate: -3 }}
                animate={{ opacity: 1, y: 0, rotate: opened ? 0 : -2 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                <PostalEnvelope
                  open={opened}
                  onOpen={() => setOpened(true)}
                  stamp={extrasState.stamp ?? "mexicana"}
                  tie={extrasState.tie ?? "twine"}
                />
              </motion.div>

              <AnimatePresence mode="wait">
                {!opened ? (
                  <motion.button
                    key="open-cta"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 1.2, duration: 0.7 }}
                    onClick={() => setOpened(true)}
                    className="mt-12 px-8 py-3 text-xs tracking-[0.4em] uppercase border hover:scale-[1.02] transition-transform"
                    style={{
                      borderColor: "var(--c-accent-2)",
                      color: "var(--c-paper)",
                      fontFamily: "var(--c-display)",
                    }}
                  >
                    Abrir postal
                  </motion.button>
                ) : (
                  <motion.p
                    key="continue"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.8, duration: 0.8 }}
                    className="mt-12 text-[10px] tracking-[0.5em] uppercase opacity-60"
                    style={{ fontFamily: "var(--c-display)" }}
                  >
                    Desliza para leer ↓
                  </motion.p>
                )}
              </AnimatePresence>
            </section>

            {/* CONTENT */}
            <AnimatePresence>
              {opened && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                  style={{
                    backgroundColor: "var(--c-paper)",
                    color: "var(--c-fg)",
                  }}
                >
                  {/* postcard back */}
                  <section className="py-24 px-6">
                    <div className="max-w-4xl mx-auto">
                      <div
                        className="grid md:grid-cols-2 gap-px shadow-2xl"
                        style={{
                          backgroundColor:
                            "color-mix(in srgb, var(--c-fg) 18%, transparent)",
                        }}
                      >
                        <div
                          className="p-10"
                          style={{ backgroundColor: "var(--c-paper-2)" }}
                        >
                          <p
                            className="text-[10px] tracking-[0.3em] uppercase mb-4 opacity-60"
                            style={{ fontFamily: "var(--c-display)" }}
                          >
                            Mensaje
                          </p>
                          <p
                            className="text-lg leading-relaxed"
                            style={{ fontFamily: "var(--c-script)" }}
                          >
                            {wedding.story}
                          </p>
                          <p
                            className="mt-6 text-2xl"
                            style={{
                              fontFamily: "var(--c-script)",
                              color: "var(--c-accent)",
                            }}
                          >
                            — Gabo & Zay
                          </p>
                        </div>
                        <div
                          className="p-10 relative"
                          style={{ backgroundColor: "var(--c-paper)" }}
                        >
                          <div className="absolute top-6 right-6">
                            <PostalStamp kind={extrasState.stamp ?? "mexicana"} />
                          </div>
                          <p
                            className="text-[10px] tracking-[0.3em] uppercase mb-3 opacity-60"
                            style={{ fontFamily: "var(--c-display)" }}
                          >
                            Destinatario
                          </p>
                          <div className="space-y-2 mt-10">
                            {[1, 2, 3].map((i) => (
                              <div
                                key={i}
                                className="h-px"
                                style={{
                                  backgroundColor: "var(--c-fg)",
                                  opacity: 0.25,
                                }}
                              />
                            ))}
                          </div>
                          <div
                            className="mt-6 inline-block px-4 py-2 text-[10px] tracking-[0.4em] uppercase"
                            style={{
                              border: "1px solid var(--c-accent)",
                              color: "var(--c-accent)",
                              fontFamily: "var(--c-display)",
                            }}
                          >
                            Via aérea
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* DATE */}
                  <section
                    className="py-24 px-6 border-y"
                    style={{
                      borderColor:
                        "color-mix(in srgb, var(--c-fg) 20%, transparent)",
                      backgroundColor: "var(--c-paper-2)",
                    }}
                  >
                    <div className="max-w-4xl mx-auto text-center">
                      <p
                        className="text-[10px] tracking-[0.5em] uppercase mb-4 opacity-60"
                        style={{ fontFamily: "var(--c-display)" }}
                      >
                        Sellado para
                      </p>
                      <p
                        className="text-6xl md:text-8xl tabular-nums leading-none"
                        style={{
                          fontFamily: "var(--c-display)",
                          color: "var(--c-accent)",
                        }}
                      >
                        25 · 07 · 2026
                      </p>
                      <p
                        className="mt-4 text-xl"
                        style={{ fontFamily: "var(--c-script)" }}
                      >
                        Sábado de verano · {wedding.city}
                      </p>
                    </div>
                  </section>

                  {/* EVENTS */}
                  <section className="py-24 px-6">
                    <div className="max-w-4xl mx-auto">
                      <h2
                        className="text-center text-5xl md:text-6xl mb-12"
                        style={{ fontFamily: "var(--c-display)" }}
                      >
                        Itinerario
                      </h2>
                      <div className="grid md:grid-cols-2 gap-8">
                        {[wedding.ceremony, wedding.reception].map(
                          (event, i) => (
                            <motion.div
                              key={event.title}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.7, delay: i * 0.1 }}
                              className="relative p-8"
                              style={{
                                backgroundColor: "var(--c-paper-2)",
                                border: "1px dashed var(--c-accent-2)",
                              }}
                            >
                              <span
                                className="absolute -top-3 left-6 px-3 py-1 text-[9px] tracking-[0.4em] uppercase"
                                style={{
                                  backgroundColor: "var(--c-accent)",
                                  color: "var(--c-paper)",
                                  fontFamily: "var(--c-display)",
                                }}
                              >
                                {event.title}
                              </span>
                              <p
                                className="text-5xl mt-2 tabular-nums"
                                style={{
                                  fontFamily: "var(--c-display)",
                                  color: "var(--c-accent)",
                                }}
                              >
                                {event.time}
                              </p>
                              <h3
                                className="text-2xl mt-2"
                                style={{ fontFamily: "var(--c-display)" }}
                              >
                                {event.place}
                              </h3>
                              <p className="mt-2 text-sm opacity-70">
                                {event.address}
                              </p>
                            </motion.div>
                          )
                        )}
                      </div>
                      <p
                        className="text-center mt-10 text-xs tracking-[0.4em] uppercase opacity-70"
                        style={{ fontFamily: "var(--c-display)" }}
                      >
                        Etiqueta · {wedding.dressCode}
                      </p>
                    </div>
                  </section>

                  {/* RSVP */}
                  <section
                    className="py-24 px-6"
                    style={{
                      backgroundColor: "var(--c-accent)",
                      color: "var(--c-paper)",
                    }}
                  >
                    <div className="max-w-2xl mx-auto text-center">
                      <p
                        className="text-[10px] tracking-[0.5em] uppercase opacity-80 mb-4"
                        style={{ fontFamily: "var(--c-display)" }}
                      >
                        Responde el correo
                      </p>
                      <h2
                        className="text-5xl md:text-7xl mb-6"
                        style={{ fontFamily: "var(--c-script)" }}
                      >
                        ¿Cuento contigo?
                      </h2>
                      <p className="mb-8 opacity-90">
                        Confirma antes del{" "}
                        <strong>{wedding.rsvpDeadline}</strong>.
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        className="px-10 py-4 text-xs tracking-[0.4em] uppercase border-2"
                        style={{
                          borderColor: "var(--c-paper)",
                          backgroundColor: "var(--c-paper)",
                          color: "var(--c-accent)",
                          fontFamily: "var(--c-display)",
                        }}
                      >
                        Enviar respuesta
                      </motion.button>
                    </div>
                  </section>

                  <footer
                    className="py-8 text-center text-[10px] tracking-[0.4em] uppercase opacity-70"
                    style={{
                      backgroundColor: "var(--c-fg)",
                      color: "var(--c-paper)",
                      fontFamily: "var(--c-display)",
                    }}
                  >
                    Correos · {wedding.groom} & {wedding.bride} · 25.07.2026
                  </footer>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </Customizer>
  );
}
