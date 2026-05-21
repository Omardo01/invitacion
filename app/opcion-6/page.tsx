"use client";

import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { wedding } from "@/lib/wedding";
import {
  Customizer,
  type Palette,
  type FontChoice,
  type ExtraGroup,
} from "@/components/customizer";

/* ============================================================
   Datos del customizer
   ============================================================ */

const palettes: Palette[] = [
  {
    id: "lila",
    name: "Lila suave",
    swatch: ["#f5f0fa", "#9b7cc7", "#3d2a52", "#c8c6d0"],
    tokens: {
      "--c-bg": "#1e1828",
      "--c-paper": "#f8f4fc",
      "--c-paper-2": "#efe7f7",
      "--c-paper-3": "#e2d6ef",
      "--c-fg": "#3d2a52",
      "--c-fg-soft": "#5d4a70",
      "--c-accent": "#9b7cc7",
      "--c-accent-2": "#c8c6d0",
      "--c-flap": "#efe7f7",
      "--c-flap-shadow": "#cebde4",
    } as Record<string, string>,
  },
  {
    id: "lavanda",
    name: "Lavanda",
    swatch: ["#ece4f5", "#7a5da8", "#2e1f44", "#b8b4c4"],
    tokens: {
      "--c-bg": "#171121",
      "--c-paper": "#f2ebf9",
      "--c-paper-2": "#e5dbf0",
      "--c-paper-3": "#d5c8e5",
      "--c-fg": "#2e1f44",
      "--c-fg-soft": "#4a3a64",
      "--c-accent": "#7a5da8",
      "--c-accent-2": "#b8b4c4",
      "--c-flap": "#e5dbf0",
      "--c-flap-shadow": "#c0b0d8",
    } as Record<string, string>,
  },
  {
    id: "plata",
    name: "Plata",
    swatch: ["#fafafa", "#9a98a6", "#3a3845", "#b8a8d4"],
    tokens: {
      "--c-bg": "#1a1a22",
      "--c-paper": "#fcfcfd",
      "--c-paper-2": "#f0f0f4",
      "--c-paper-3": "#e0e0e8",
      "--c-fg": "#3a3845",
      "--c-fg-soft": "#5a5868",
      "--c-accent": "#9a98a6",
      "--c-accent-2": "#b8a8d4",
      "--c-flap": "#f0f0f4",
      "--c-flap-shadow": "#cccce0",
    } as Record<string, string>,
  },
  {
    id: "glicinia",
    name: "Glicinia",
    swatch: ["#ede0f5", "#6b3fa0", "#2a1840", "#d4c5e5"],
    tokens: {
      "--c-bg": "#140e1f",
      "--c-paper": "#f4eafa",
      "--c-paper-2": "#e6d6f0",
      "--c-paper-3": "#d4bee5",
      "--c-fg": "#2a1840",
      "--c-fg-soft": "#4a3460",
      "--c-accent": "#6b3fa0",
      "--c-accent-2": "#d4c5e5",
      "--c-flap": "#e6d6f0",
      "--c-flap-shadow": "#bea0d6",
    } as Record<string, string>,
  },
  {
    id: "nocturno",
    name: "Lila nocturno",
    swatch: ["#1a1428", "#c4a8e8", "#ede0f5", "#7c6098"],
    tokens: {
      "--c-bg": "#0d0817",
      "--c-paper": "#1a1428",
      "--c-paper-2": "#241a36",
      "--c-paper-3": "#2e2244",
      "--c-fg": "#ede0f5",
      "--c-fg-soft": "#b8a8c8",
      "--c-accent": "#c4a8e8",
      "--c-accent-2": "#ede0f5",
      "--c-flap": "#241a36",
      "--c-flap-shadow": "#160f24",
    } as Record<string, string>,
  },
];

const fonts: FontChoice[] = [
  {
    id: "clasica",
    name: "Clásica",
    sample: "Ag",
    tokens: {
      "--c-display": "var(--font-display)",
      "--c-script": "var(--font-great-vibes)",
      "--c-body": "var(--font-serif)",
      "--c-mono": "var(--font-typewriter)",
    } as Record<string, string>,
  },
  {
    id: "editorial",
    name: "Editorial",
    sample: "Ag",
    tokens: {
      "--c-display": "var(--font-dm-serif)",
      "--c-script": "var(--font-script)",
      "--c-body": "var(--font-serif)",
      "--c-mono": "var(--font-typewriter)",
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
      "--c-mono": "var(--font-typewriter)",
    } as Record<string, string>,
  },
  {
    id: "deco",
    name: "Deco",
    sample: "Ag",
    tokens: {
      "--c-display": "var(--font-deco)",
      "--c-script": "var(--font-great-vibes)",
      "--c-body": "var(--font-sans)",
      "--c-mono": "var(--font-typewriter)",
    } as Record<string, string>,
  },
];

const WAX_COLORS: Record<string, { base: string; rim: string }> = {
  lila: { base: "#9b7cc7", rim: "#6b4ca0" },
  lavanda: { base: "#7a5da8", rim: "#4a3578" },
  plata: { base: "#c8c6d0", rim: "#8a8896" },
  blanco: { base: "#f0ecf5", rim: "#c0bcca" },
  uva: { base: "#4a2a6c", rim: "#2a1840" },
};

const extras: ExtraGroup[] = [
  {
    id: "initials",
    label: "Iniciales del sello",
    type: "text",
    defaultValue: wedding.initials,
    placeholder: "G&Z",
    maxLength: 6,
  },
  {
    id: "seal",
    label: "Diseño del sello",
    options: [
      { id: "monogram", label: "Monograma", preview: "G&Z" },
      { id: "floral", label: "Floral", preview: "❀" },
      { id: "crown", label: "Corona", preview: "♛" },
      { id: "diamond", label: "Diamante", preview: "◆" },
      { id: "laurel", label: "Laurel", preview: "❦" },
      { id: "anchor", label: "Lazo", preview: "♡" },
    ],
    columns: 3,
  },
  {
    id: "waxColor",
    label: "Color de la cera",
    type: "swatches",
    options: [
      { id: "lila", label: "Lila", color: WAX_COLORS.lila.base },
      { id: "lavanda", label: "Lavanda", color: WAX_COLORS.lavanda.base },
      { id: "plata", label: "Plata", color: WAX_COLORS.plata.base },
      { id: "blanco", label: "Blanco perla", color: WAX_COLORS.blanco.base },
      { id: "uva", label: "Uva oscura", color: WAX_COLORS.uva.base },
    ],
  },
  {
    id: "shape",
    label: "Formato del sobre",
    options: [
      { id: "portrait", label: "Vertical", preview: "▭" },
      { id: "square", label: "Cuadrado", preview: "■" },
    ],
  },
  {
    id: "paper",
    label: "Textura del papel",
    options: [
      { id: "smooth", label: "Liso", preview: "▢" },
      { id: "ribbed", label: "Costillas", preview: "≣" },
      { id: "marbled", label: "Marmolea.", preview: "◐" },
      { id: "watermark", label: "Marca agua", preview: "✜" },
      { id: "kraft", label: "Kraft", preview: "▦" },
    ],
    columns: 3,
  },
  {
    id: "motion",
    label: "Movimiento de fondo",
    options: [
      { id: "dust", label: "Polvo oro", preview: "·" },
      { id: "leaves", label: "Hojas", preview: "❦" },
      { id: "sparkles", label: "Brillos", preview: "✦" },
      { id: "none", label: "Ninguno", preview: "○" },
    ],
  },
];

/* ============================================================
   Sub-componentes visuales
   ============================================================ */

function SealMark({
  kind,
  initials,
}: {
  kind: string;
  initials: string;
}) {
  switch (kind) {
    case "floral":
      return (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="currentColor">
          <circle cx="20" cy="9" r="5.5" opacity="0.9" />
          <circle cx="20" cy="31" r="5.5" opacity="0.9" />
          <circle cx="9" cy="20" r="5.5" opacity="0.9" />
          <circle cx="31" cy="20" r="5.5" opacity="0.9" />
          <circle cx="20" cy="20" r="4" />
        </svg>
      );
    case "crown":
      return <span className="text-3xl md:text-4xl leading-none">♛</span>;
    case "diamond":
      return (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="currentColor">
          <path d="M20 4 L36 20 L20 36 L4 20 Z" />
          <path d="M20 12 L28 20 L20 28 L12 20 Z" fill="var(--c-paper)" opacity="0.35" />
        </svg>
      );
    case "laurel":
      return (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="currentColor">
          <path d="M8 30 Q4 22 8 14 Q12 18 12 24 Q12 28 8 30 Z" />
          <path d="M32 30 Q36 22 32 14 Q28 18 28 24 Q28 28 32 30 Z" />
          <text
            x="20"
            y="25"
            textAnchor="middle"
            fontSize="11"
            fontFamily="serif"
            fontWeight="600"
          >
            {initials.slice(0, 3)}
          </text>
        </svg>
      );
    case "anchor":
      return <span className="text-2xl md:text-3xl leading-none">♡</span>;
    default:
      return (
        <span
          className="leading-none tracking-tight font-semibold"
          style={{
            fontFamily: "var(--c-display)",
            fontSize: initials.length > 3 ? "0.95rem" : "1.15rem",
          }}
        >
          {initials || "G&Z"}
        </span>
      );
  }
}

function paperTextureStyle(kind: string): React.CSSProperties {
  switch (kind) {
    case "ribbed":
      return {
        backgroundImage:
          "repeating-linear-gradient(0deg, color-mix(in srgb, var(--c-fg) 6%, transparent) 0 1px, transparent 1px 8px)",
      };
    case "marbled":
      return {
        backgroundImage:
          "radial-gradient(circle at 20% 30%, color-mix(in srgb, var(--c-accent-2) 18%, transparent), transparent 40%)," +
          "radial-gradient(circle at 70% 60%, color-mix(in srgb, var(--c-accent) 12%, transparent), transparent 40%)," +
          "radial-gradient(circle at 40% 80%, color-mix(in srgb, var(--c-fg) 8%, transparent), transparent 35%)",
      };
    case "watermark":
      return {
        backgroundImage:
          "radial-gradient(ellipse 60% 40% at 50% 50%, color-mix(in srgb, var(--c-accent) 8%, transparent), transparent 70%)",
      };
    case "kraft":
      return {
        backgroundImage:
          "repeating-linear-gradient(45deg, color-mix(in srgb, var(--c-fg) 5%, transparent) 0 1px, transparent 1px 4px)," +
          "repeating-linear-gradient(-45deg, color-mix(in srgb, var(--c-fg) 4%, transparent) 0 1px, transparent 1px 5px)",
      };
    default:
      return {};
  }
}

/* ============================================================
   Movimiento de fondo (polvo / hojas / brillos)
   ============================================================ */

function BgMotion({ kind }: { kind: string }) {
  if (kind === "none") return null;

  const count = kind === "sparkles" ? 18 : 24;
  const items = Array.from({ length: count }, (_, i) => ({
    left: (i * 41 + 13) % 100,
    delay: (i * 0.37) % 6,
    duration: 8 + ((i * 1.1) % 8),
    size: 3 + ((i * 0.6) % 5),
    drift: (i % 2 === 0 ? 1 : -1) * (10 + ((i * 3) % 30)),
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((it, i) => {
        const common = {
          left: `${it.left}%`,
          width: it.size,
          height: it.size,
        } as React.CSSProperties;

        if (kind === "leaves") {
          return (
            <motion.span
              key={i}
              className="absolute top-0"
              style={{ ...common, fontSize: 14 + it.size, color: "var(--c-accent-2)" }}
              initial={{ y: -30, opacity: 0, rotate: 0 }}
              animate={{
                y: ["0vh", "110vh"],
                x: [0, it.drift, -it.drift, 0],
                opacity: [0, 0.7, 0.7, 0],
                rotate: [0, 180, 360, 540],
              }}
              transition={{
                duration: it.duration,
                delay: it.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              ❦
            </motion.span>
          );
        }
        if (kind === "sparkles") {
          return (
            <motion.span
              key={i}
              className="absolute"
              style={{
                ...common,
                top: `${(i * 23) % 100}%`,
                color: "var(--c-accent-2)",
                fontSize: 10 + it.size,
              }}
              animate={{ opacity: [0, 1, 0], scale: [0.6, 1, 0.6] }}
              transition={{
                duration: 2 + (i % 3),
                delay: it.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              ✦
            </motion.span>
          );
        }
        // dust
        return (
          <motion.span
            key={i}
            className="absolute top-0 rounded-full"
            style={{
              ...common,
              backgroundColor: "var(--c-accent-2)",
              opacity: 0,
              boxShadow: "0 0 6px var(--c-accent-2)",
            }}
            animate={{
              y: ["-5vh", "110vh"],
              x: [0, it.drift, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: it.duration,
              delay: it.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        );
      })}
    </div>
  );
}

/* ============================================================
   Sobre — animación principal
   ============================================================ */

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

function Envelope({
  open,
  onOpen,
  seal,
  initials,
  shape,
  paper,
  wax,
}: {
  open: boolean;
  onOpen: () => void;
  seal: string;
  initials: string;
  shape: string;
  paper: string;
  wax: string;
}) {
  const portrait = shape === "portrait";
  const w = portrait ? 340 : 380;
  const h = portrait ? 460 : 380;
  const flapH = h * 0.52;
  const scale = useResponsiveScale(w);

  const waxConf = WAX_COLORS[wax] ?? WAX_COLORS.lila;
  const textureStyle = paperTextureStyle(paper);

  // Shards for breaking wax
  const shards = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        angle: -120 + i * 40 + Math.sin(i) * 8,
        dist: 90 + (i % 3) * 30,
        size: 8 + (i % 4) * 3,
        rotate: (i % 2 === 0 ? 1 : -1) * (180 + i * 30),
        delay: i * 0.02,
      })),
    []
  );

  return (
    <div
      className="relative"
      style={{ width: w * scale, height: h * scale }}
    >
      <div
        className="relative"
        style={{
          width: w,
          height: h,
          perspective: 1600,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
      {/* envelope back/body */}
      <div
        className="absolute inset-0 rounded-[28px] shadow-2xl overflow-hidden"
        style={{
          backgroundColor: "var(--c-paper)",
          border: "1px solid color-mix(in srgb, var(--c-fg) 18%, transparent)",
          ...textureStyle,
        }}
      >
        {/* watermark special: show initials big */}
        {paper === "watermark" && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{
              color: "var(--c-accent)",
              opacity: 0.1,
              fontFamily: "var(--c-display)",
              fontSize: "9rem",
              letterSpacing: "-0.05em",
            }}
          >
            {initials || "G&Z"}
          </div>
        )}

        {/* recipient typed */}
        <AnimatePresence>
          {!open && (
            <motion.div
              key="address"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="absolute inset-x-10 top-[58%] -translate-y-1/2 text-center"
              style={{ color: "var(--c-fg)" }}
            >
              <p
                className="text-[10px] tracking-[0.4em] uppercase opacity-60 mb-3"
                style={{ fontFamily: "var(--c-mono)" }}
              >
                Para
              </p>
              <p
                className="text-3xl md:text-4xl"
                style={{ fontFamily: "var(--c-script)", color: "var(--c-accent)" }}
              >
                Persona especial
              </p>
              <div
                className="mx-auto my-3 h-px w-12"
                style={{ backgroundColor: "var(--c-accent-2)" }}
              />
              <p
                className="text-[10px] tracking-[0.4em] uppercase opacity-60"
                style={{ fontFamily: "var(--c-mono)" }}
              >
                {wedding.city} · MMXXVI
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* postmark */}
        <div
          className="absolute top-4 right-4 w-16 h-16 rounded-full border-2 flex items-center justify-center rotate-[12deg] opacity-60"
          style={{ borderColor: "var(--c-accent)", color: "var(--c-accent)" }}
        >
          <div className="text-center leading-tight">
            <p className="text-[8px] tracking-[0.2em] uppercase">25 · 07</p>
            <p className="text-[7px] tracking-[0.2em] uppercase">2026</p>
          </div>
        </div>
      </div>

      {/* letter inside */}
      <motion.div
        className="absolute left-4 right-4 rounded-2xl shadow-md overflow-hidden"
        style={{
          top: 30,
          bottom: 20,
          backgroundColor: "var(--c-paper-2)",
          color: "var(--c-fg)",
          border: "1px solid color-mix(in srgb, var(--c-fg) 14%, transparent)",
          transformOrigin: "bottom center",
          zIndex: 1,
          ...textureStyle,
        }}
        animate={open ? { y: -h * 0.6, scale: 1.03, rotateZ: 0 } : { y: 0, scale: 1 }}
        transition={{
          delay: open ? 0.75 : 0,
          duration: 1.2,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className="h-full flex flex-col items-center justify-center px-6 text-center relative">
          <p
            className="text-[10px] tracking-[0.4em] uppercase mb-4"
            style={{ color: "var(--c-accent-2)", fontFamily: "var(--c-mono)" }}
          >
            Invitación a boda
          </p>
          <p
            className="text-2xl md:text-3xl leading-tight"
            style={{ fontFamily: "var(--c-display)" }}
          >
            {wedding.groom}
          </p>
          <p
            className="my-1 text-4xl"
            style={{ fontFamily: "var(--c-script)", color: "var(--c-accent)" }}
          >
            &
          </p>
          <p
            className="text-2xl md:text-3xl leading-tight"
            style={{ fontFamily: "var(--c-display)" }}
          >
            {wedding.bride}
          </p>
          <div className="my-4 h-px w-12" style={{ backgroundColor: "var(--c-accent-2)" }} />
          <p
            className="text-xs tracking-[0.3em] uppercase"
            style={{ fontFamily: "var(--c-mono)" }}
          >
            25 · julio · 2026
          </p>
          <AnimatePresence>
            {open && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.7, duration: 0.6 }}
                className="absolute bottom-4 inset-x-0 text-[10px] tracking-[0.3em] uppercase opacity-50"
              >
                Desliza para continuar ↓
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* flap shadow (sits under flap to add depth when opening) */}
      <motion.div
        className="absolute left-0 right-0 top-0 pointer-events-none"
        style={{
          height: flapH,
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--c-fg) 30%, transparent) 0%, transparent 60%)",
          clipPath: "polygon(0 0, 100% 0, 50% 100%)",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          zIndex: 1,
          opacity: 0,
        }}
        animate={{ opacity: open ? 0.35 : 0 }}
        transition={{ delay: open ? 0.5 : 0, duration: 0.5 }}
      />

      {/* top flap */}
      <motion.div
        className="absolute left-0 right-0 top-0 origin-top overflow-hidden"
        style={{
          height: flapH,
          backgroundColor: "var(--c-flap)",
          clipPath: "polygon(0 0, 100% 0, 50% 100%)",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          transformOrigin: "top center",
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
          zIndex: 2,
          ...textureStyle,
        }}
        animate={open ? { rotateX: 180 } : { rotateX: 0 }}
        transition={{
          delay: open ? 0.35 : 0,
          duration: 1,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "linear-gradient(180deg, transparent 30%, var(--c-flap-shadow))",
          }}
        />
      </motion.div>

      {/* wax seal button */}
      <motion.button
        onClick={onOpen}
        disabled={open}
        className="group absolute left-1/2 -translate-x-1/2 rounded-full flex items-center justify-center"
        style={{
          top: h * 0.44,
          width: 92,
          height: 92,
          backgroundColor: waxConf.base,
          color: "var(--c-paper)",
          border: `3px solid ${waxConf.rim}`,
          zIndex: 3,
          cursor: open ? "default" : "pointer",
          boxShadow:
            "0 8px 20px rgba(0,0,0,0.45), inset 0 -3px 6px rgba(0,0,0,0.35), inset 0 3px 6px rgba(255,255,255,0.18)",
        }}
        whileHover={open ? {} : { scale: 1.05, rotate: -3 }}
        whileTap={open ? {} : { scale: 0.92, rotate: 4 }}
        animate={
          open
            ? { scale: 0, rotate: -160, opacity: 0 }
            : { scale: 1, rotate: 0, opacity: 1 }
        }
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        aria-label="Romper sello y abrir invitación"
      >
        {/* shine sweep on hover */}
        {!open && (
          <span
            className="pointer-events-none absolute inset-0 rounded-full overflow-hidden"
            aria-hidden
          >
            <span
              className="absolute top-0 -left-2 h-full w-6 -skew-x-12 opacity-0 group-hover:opacity-60 transition-opacity"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)",
                animation: "wax-shine 1.6s ease-in-out infinite",
              }}
            />
          </span>
        )}

        <div className="w-12 h-12 flex items-center justify-center relative">
          <SealMark kind={seal} initials={initials} />
        </div>

        {!open && (
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ border: "2px solid " + waxConf.base }}
            animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          />
        )}
      </motion.button>

      {/* wax shards when breaking */}
      <AnimatePresence>
        {open &&
          shards.map((s, i) => {
            const rad = (s.angle * Math.PI) / 180;
            return (
              <motion.span
                key={i}
                className="absolute pointer-events-none"
                style={{
                  left: "50%",
                  top: h * 0.44 + 46,
                  width: s.size,
                  height: s.size,
                  backgroundColor: waxConf.base,
                  borderRadius: i % 2 === 0 ? "40% 60% 35% 65%" : "30%",
                  border: `1px solid ${waxConf.rim}`,
                  zIndex: 4,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
                initial={{ x: -s.size / 2, y: -s.size / 2, opacity: 1, rotate: 0, scale: 1 }}
                animate={{
                  x: Math.cos(rad) * s.dist,
                  y: Math.sin(rad) * s.dist + 60,
                  opacity: 0,
                  rotate: s.rotate,
                  scale: 0.6,
                }}
                transition={{ duration: 0.9, delay: s.delay, ease: "easeOut" }}
              />
            );
          })}
      </AnimatePresence>
      </div>
    </div>
  );
}

/* ============================================================
   Cuenta regresiva
   ============================================================ */

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds };
}

function Countdown() {
  const { days, hours, minutes, seconds } = useCountdown(wedding.date);
  const cells = [
    { v: days, l: "Días" },
    { v: hours, l: "Horas" },
    { v: minutes, l: "Min" },
    { v: seconds, l: "Seg" },
  ];
  return (
    <div className="grid grid-cols-4 gap-3 md:gap-8 max-w-3xl mx-auto">
      {cells.map((c) => (
        <div key={c.l} className="text-center">
          <div
            className="relative px-2 py-6 md:py-10 border rounded-3xl"
            style={{
              borderColor: "color-mix(in srgb, var(--c-fg) 25%, transparent)",
              backgroundColor: "color-mix(in srgb, var(--c-paper-2) 70%, transparent)",
            }}
          >
            <p
              className="text-4xl md:text-7xl tabular-nums leading-none"
              style={{ fontFamily: "var(--c-display)", color: "var(--c-accent)" }}
            >
              {c.v.toString().padStart(2, "0")}
            </p>
          </div>
          <p
            className="mt-3 text-[10px] tracking-[0.3em] uppercase opacity-70"
            style={{ fontFamily: "var(--c-mono)" }}
          >
            {c.l}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   Galería
   ============================================================ */

function Gallery() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
      {wedding.gallery.map((g, i) => (
        <motion.figure
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: (i % 3) * 0.08 }}
          whileHover={{ y: -4 }}
          className="relative overflow-hidden aspect-[4/5] group rounded-3xl"
          style={{
            border: "1px solid color-mix(in srgb, var(--c-fg) 18%, transparent)",
            backgroundColor: "var(--c-paper-2)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                i % 2 === 0
                  ? "linear-gradient(135deg, color-mix(in srgb, var(--c-accent) 35%, var(--c-paper-3)), color-mix(in srgb, var(--c-accent-2) 25%, var(--c-paper-2)))"
                  : "linear-gradient(225deg, color-mix(in srgb, var(--c-accent-2) 40%, var(--c-paper-3)), color-mix(in srgb, var(--c-accent) 20%, var(--c-paper-2)))",
            }}
          />
          {/* decorative monogram */}
          <div
            className="absolute inset-0 flex items-center justify-center text-7xl opacity-25"
            style={{ fontFamily: "var(--c-script)", color: "var(--c-paper)" }}
          >
            {wedding.initials}
          </div>
          <figcaption
            className="absolute bottom-0 inset-x-0 px-4 py-3"
            style={{
              background:
                "linear-gradient(180deg, transparent, color-mix(in srgb, var(--c-fg) 80%, transparent))",
              color: "var(--c-paper)",
            }}
          >
            <p
              className="text-[10px] tracking-[0.3em] uppercase opacity-80"
              style={{ fontFamily: "var(--c-mono)" }}
            >
              {g.year}
            </p>
            <p
              className="text-base md:text-lg leading-tight"
              style={{ fontFamily: "var(--c-display)" }}
            >
              {g.caption}
            </p>
          </figcaption>
        </motion.figure>
      ))}
    </div>
  );
}

/* ============================================================
   Mapa embebido
   ============================================================ */

function MapEmbed({ query, label }: { query: string; label: string }) {
  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  return (
    <div
      className="overflow-hidden shadow-lg rounded-3xl"
      style={{
        border: "1px solid color-mix(in srgb, var(--c-fg) 20%, transparent)",
        backgroundColor: "var(--c-paper-2)",
      }}
    >
      <div
        className="px-4 py-2 flex items-center justify-between"
        style={{
          backgroundColor: "var(--c-accent)",
          color: "var(--c-paper)",
        }}
      >
        <p
          className="text-[10px] tracking-[0.3em] uppercase"
          style={{ fontFamily: "var(--c-mono)" }}
        >
          {label}
        </p>
        <a
          href={`https://www.google.com/maps?q=${encodeURIComponent(query)}`}
          target="_blank"
          rel="noreferrer"
          className="text-[10px] tracking-[0.3em] uppercase underline opacity-90 hover:opacity-100"
          style={{ fontFamily: "var(--c-mono)" }}
        >
          Abrir en maps ↗
        </a>
      </div>
      <iframe
        src={src}
        loading="lazy"
        title={`Mapa · ${label}`}
        className="w-full h-64 md:h-72 block"
        style={{ filter: "saturate(0.85) contrast(0.95)", border: 0 }}
      />
    </div>
  );
}

/* ============================================================
   Reproductor de música flotante
   ============================================================ */

function MusicButton() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);

  const toggle = async () => {
    const el = audioRef.current;
    if (!el) return;
    try {
      if (playing) {
        el.pause();
        setPlaying(false);
      } else {
        await el.play();
        setPlaying(true);
        setError(false);
      }
    } catch {
      setError(true);
      setPlaying(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} src={wedding.music.src} loop preload="none" />
      <motion.button
        onClick={toggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-6 left-6 z-[100] flex items-center gap-0 sm:gap-3 p-2 sm:pl-3 sm:pr-4 rounded-full shadow-lg backdrop-blur-md"
        style={{
          backgroundColor: "color-mix(in srgb, var(--c-paper) 92%, transparent)",
          color: "var(--c-fg)",
          border: "1px solid color-mix(in srgb, var(--c-fg) 20%, transparent)",
        }}
        aria-label={playing ? "Pausar música" : "Reproducir música"}
      >
        <span
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "var(--c-accent)", color: "var(--c-paper)" }}
        >
          {playing ? (
            <span className="flex gap-[2px]">
              <span className="block w-[3px] h-3 bg-current" />
              <span className="block w-[3px] h-3 bg-current" />
            </span>
          ) : (
            <span className="block w-0 h-0 border-y-[6px] border-y-transparent border-l-[9px] border-l-current ml-[2px]" />
          )}
        </span>
        <span className="hidden sm:block text-left leading-tight">
          <span
            className="block text-[9px] tracking-[0.3em] uppercase opacity-70"
            style={{ fontFamily: "var(--c-mono)" }}
          >
            {error ? "Sin pista" : playing ? "Sonando" : "Tu canción"}
          </span>
          <span
            className="block text-xs"
            style={{ fontFamily: "var(--c-display)" }}
          >
            {wedding.music.title}
          </span>
        </span>
      </motion.button>
    </>
  );
}

/* ============================================================
   Página principal
   ============================================================ */

export default function SobreLacrado() {
  const [opened, setOpened] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroFade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  return (
    <Customizer
      themeId="opcion-6"
      palettes={palettes}
      fonts={fonts}
      extras={extras}
      tone="dark"
    >
      {({ styleVars, extras: ex }) => {
        const initials = ex.initials || wedding.initials;
        return (
          <div ref={containerRef} style={styleVars}>
            <div
              className="min-h-screen"
              style={{
                backgroundColor: "var(--c-bg)",
                color: "var(--c-paper)",
                fontFamily: "var(--c-body)",
              }}
            >
              <BgMotion kind={ex.motion ?? "dust"} />

              <nav
                className="fixed top-0 left-0 right-0 z-40 px-6 py-4 flex justify-between items-center backdrop-blur-sm"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--c-bg) 70%, transparent)",
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
                  Inv. 006 · Sobre Lacrado
                </span>
              </nav>

              {/* HERO ENVELOPE */}
              <motion.section
                ref={heroRef}
                style={{ opacity: heroFade, scale: heroScale }}
                className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24"
              >
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-[10px] tracking-[0.5em] uppercase opacity-50 mb-10"
                  style={{ fontFamily: "var(--c-mono)" }}
                >
                  Has recibido un sobre lacrado
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Envelope
                    open={opened}
                    onOpen={() => setOpened(true)}
                    seal={ex.seal ?? "monogram"}
                    initials={initials}
                    shape={ex.shape ?? "portrait"}
                    paper={ex.paper ?? "smooth"}
                    wax={ex.waxColor ?? "lila"}
                  />
                </motion.div>

                <AnimatePresence>
                  {!opened && (
                    <motion.button
                      key="cta"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: 1.2, duration: 0.7 }}
                      onClick={() => setOpened(true)}
                      className="mt-12 px-8 py-3 text-xs tracking-[0.4em] uppercase border rounded-full hover:scale-[1.02] transition-transform"
                      style={{
                        borderColor: "var(--c-accent-2)",
                        color: "var(--c-accent-2)",
                        fontFamily: "var(--c-mono)",
                      }}
                    >
                      Romper sello
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.section>

              {/* CONTENT after opening */}
              <AnimatePresence>
                {opened && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.8, duration: 0.8 }}
                    className="relative z-10"
                    style={{
                      backgroundColor: "var(--c-paper)",
                      color: "var(--c-fg)",
                    }}
                  >
                    {/* INTRO / CARTA */}
                    <section className="py-28 px-6">
                      <div className="max-w-3xl mx-auto text-center">
                        <motion.p
                          initial={{ opacity: 0, y: 12 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.7 }}
                          className="text-[10px] tracking-[0.5em] uppercase mb-6 opacity-60"
                          style={{ fontFamily: "var(--c-mono)" }}
                        >
                          Carta abierta · {wedding.hashtag}
                        </motion.p>
                        <motion.h2
                          initial={{ opacity: 0, y: 16 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.9 }}
                          className="text-5xl md:text-7xl leading-[1.1]"
                          style={{ fontFamily: "var(--c-display)" }}
                        >
                          Querida persona,
                        </motion.h2>
                        <motion.p
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="mt-8 text-lg md:text-xl leading-relaxed"
                        >
                          {wedding.story}
                        </motion.p>
                        <p
                          className="mt-8 text-4xl"
                          style={{
                            fontFamily: "var(--c-script)",
                            color: "var(--c-accent)",
                          }}
                        >
                          — {wedding.groom} & {wedding.bride}
                        </p>
                      </div>
                    </section>

                    {/* COUNTDOWN */}
                    <section
                      className="py-24 px-6"
                      style={{
                        backgroundColor: "var(--c-paper-2)",
                        borderTop:
                          "1px solid color-mix(in srgb, var(--c-fg) 12%, transparent)",
                        borderBottom:
                          "1px solid color-mix(in srgb, var(--c-fg) 12%, transparent)",
                      }}
                    >
                      <div className="max-w-5xl mx-auto text-center">
                        <p
                          className="text-[10px] tracking-[0.5em] uppercase mb-3 opacity-60"
                          style={{ fontFamily: "var(--c-mono)" }}
                        >
                          Falta para el gran día
                        </p>
                        <h2
                          className="text-3xl md:text-5xl mb-10"
                          style={{ fontFamily: "var(--c-display)" }}
                        >
                          Cuenta regresiva
                        </h2>
                        <Countdown />
                      </div>
                    </section>

                    {/* FECHA GRANDE */}
                    <section className="py-28 px-6">
                      <div className="max-w-5xl mx-auto text-center">
                        <p
                          className="text-[10px] tracking-[0.5em] uppercase mb-6 opacity-60"
                          style={{ fontFamily: "var(--c-mono)" }}
                        >
                          Marca tu calendario
                        </p>
                        <div className="flex items-center justify-center gap-6 md:gap-16">
                          {[
                            { num: "25", label: "Sábado" },
                            { num: "07", label: "Julio" },
                            { num: "26", label: "MMXXVI" },
                          ].map((d, i) => (
                            <motion.div
                              key={d.label}
                              initial={{ opacity: 0, y: 30 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.7, delay: i * 0.1 }}
                            >
                              <p
                                className="text-7xl md:text-[10rem] leading-none tabular-nums"
                                style={{
                                  fontFamily: "var(--c-display)",
                                  color:
                                    i === 1 ? "var(--c-accent)" : "var(--c-fg)",
                                }}
                              >
                                {d.num}
                              </p>
                              <p
                                className="mt-3 text-[10px] tracking-[0.3em] uppercase opacity-60"
                                style={{ fontFamily: "var(--c-mono)" }}
                              >
                                {d.label}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </section>

                    {/* ITINERARIO + MAPA */}
                    <section
                      className="py-28 px-6"
                      style={{ backgroundColor: "var(--c-paper-2)" }}
                    >
                      <div className="max-w-5xl mx-auto">
                        <h2
                          className="text-center text-5xl md:text-7xl mb-16"
                          style={{ fontFamily: "var(--c-display)" }}
                        >
                          Itinerario
                        </h2>
                        <div className="space-y-px">
                          {[wedding.ceremony, wedding.reception].map(
                            (event, i) => (
                              <motion.div
                                key={event.title}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.7, delay: i * 0.1 }}
                                className="grid md:grid-cols-12 gap-4 items-baseline py-8 border-t"
                                style={{
                                  borderColor:
                                    "color-mix(in srgb, var(--c-fg) 15%, transparent)",
                                }}
                              >
                                <p
                                  className="md:col-span-2 text-2xl tabular-nums"
                                  style={{ color: "var(--c-accent)" }}
                                >
                                  {event.time}
                                </p>
                                <h3
                                  className="md:col-span-4 text-2xl md:text-3xl"
                                  style={{ fontFamily: "var(--c-display)" }}
                                >
                                  {event.title}
                                </h3>
                                <div className="md:col-span-6">
                                  <p
                                    className="text-lg"
                                    style={{ fontFamily: "var(--c-body)" }}
                                  >
                                    {event.place}
                                  </p>
                                  <p className="text-sm opacity-70 mt-1">
                                    {event.address}
                                  </p>
                                </div>
                              </motion.div>
                            )
                          )}
                          <div
                            className="border-t"
                            style={{
                              borderColor:
                                "color-mix(in srgb, var(--c-fg) 15%, transparent)",
                            }}
                          />
                        </div>

                        {/* Mapas */}
                        <div className="grid md:grid-cols-2 gap-5 mt-12">
                          <MapEmbed
                            query={wedding.ceremony.mapsQuery}
                            label="Ceremonia"
                          />
                          <MapEmbed
                            query={wedding.reception.mapsQuery}
                            label="Recepción"
                          />
                        </div>
                      </div>
                    </section>

                    {/* DRESS CODE */}
                    <section className="py-28 px-6">
                      <div className="max-w-5xl mx-auto">
                        <div className="grid md:grid-cols-12 gap-10 items-center">
                          <div className="md:col-span-5">
                            <p
                              className="text-[10px] tracking-[0.5em] uppercase mb-3 opacity-60"
                              style={{ fontFamily: "var(--c-mono)" }}
                            >
                              Código de vestimenta
                            </p>
                            <h2
                              className="text-5xl md:text-6xl leading-[1]"
                              style={{ fontFamily: "var(--c-display)" }}
                            >
                              {wedding.dressCode}
                            </h2>
                            <p className="mt-5 text-base opacity-80 leading-relaxed">
                              Pensamos en una paleta cálida, tipo atardecer.
                              Sigue esta guía sin estresarte —lo importante es
                              que estés cómoda(o).
                            </p>
                          </div>
                          <div className="md:col-span-7">
                            <div className="grid grid-cols-5 gap-2 mb-6">
                              {wedding.dressCodePalette.map((c) => (
                                <div key={c.hex} className="text-center">
                                  <div
                                    className="aspect-square shadow-md rounded-2xl"
                                    style={{
                                      backgroundColor: c.hex,
                                      border:
                                        "1px solid color-mix(in srgb, var(--c-fg) 15%, transparent)",
                                    }}
                                  />
                                  <p
                                    className="mt-2 text-[9px] tracking-[0.2em] uppercase opacity-70"
                                    style={{ fontFamily: "var(--c-mono)" }}
                                  >
                                    {c.name}
                                  </p>
                                </div>
                              ))}
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div
                                className="p-5 rounded-2xl"
                                style={{
                                  backgroundColor: "var(--c-paper-2)",
                                  border:
                                    "1px solid color-mix(in srgb, var(--c-fg) 15%, transparent)",
                                }}
                              >
                                <p
                                  className="text-[10px] tracking-[0.3em] uppercase mb-2"
                                  style={{ color: "var(--c-accent)" }}
                                >
                                  Ellas
                                </p>
                                <p className="text-sm leading-relaxed">
                                  {wedding.dressCodeNotes.ellas}
                                </p>
                              </div>
                              <div
                                className="p-5 rounded-2xl"
                                style={{
                                  backgroundColor: "var(--c-paper-2)",
                                  border:
                                    "1px solid color-mix(in srgb, var(--c-fg) 15%, transparent)",
                                }}
                              >
                                <p
                                  className="text-[10px] tracking-[0.3em] uppercase mb-2"
                                  style={{ color: "var(--c-accent)" }}
                                >
                                  Ellos
                                </p>
                                <p className="text-sm leading-relaxed">
                                  {wedding.dressCodeNotes.ellos}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* GALERÍA */}
                    <section
                      className="py-28 px-6"
                      style={{ backgroundColor: "var(--c-paper-2)" }}
                    >
                      <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                          <p
                            className="text-[10px] tracking-[0.5em] uppercase mb-3 opacity-60"
                            style={{ fontFamily: "var(--c-mono)" }}
                          >
                            Nuestra historia
                          </p>
                          <h2
                            className="text-5xl md:text-7xl"
                            style={{ fontFamily: "var(--c-display)" }}
                          >
                            Galería
                          </h2>
                        </div>
                        <Gallery />
                      </div>
                    </section>

                    {/* PADRINOS */}
                    <section className="py-28 px-6">
                      <div className="max-w-4xl mx-auto text-center">
                        <p
                          className="text-[10px] tracking-[0.5em] uppercase mb-3 opacity-60"
                          style={{ fontFamily: "var(--c-mono)" }}
                        >
                          Quienes nos acompañan
                        </p>
                        <h2
                          className="text-5xl md:text-7xl mb-12"
                          style={{ fontFamily: "var(--c-display)" }}
                        >
                          Padrinos
                        </h2>
                        <div className="grid md:grid-cols-2 gap-5">
                          {wedding.godparents.map((p, i) => (
                            <motion.div
                              key={p.role}
                              initial={{ opacity: 0, y: 16 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.7, delay: i * 0.05 }}
                              className="p-6 rounded-3xl"
                              style={{
                                backgroundColor: "var(--c-paper-2)",
                                border:
                                  "1px solid color-mix(in srgb, var(--c-fg) 15%, transparent)",
                              }}
                            >
                              <p
                                className="text-[10px] tracking-[0.3em] uppercase mb-2"
                                style={{ color: "var(--c-accent)" }}
                              >
                                {p.role}
                              </p>
                              <p
                                className="text-xl md:text-2xl"
                                style={{ fontFamily: "var(--c-display)" }}
                              >
                                {p.names}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </section>

                    {/* MESA DE REGALOS */}
                    <section
                      className="py-28 px-6"
                      style={{ backgroundColor: "var(--c-paper-2)" }}
                    >
                      <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-12">
                          <p
                            className="text-[10px] tracking-[0.5em] uppercase mb-3 opacity-60"
                            style={{ fontFamily: "var(--c-mono)" }}
                          >
                            Si quieres regalar algo
                          </p>
                          <h2
                            className="text-5xl md:text-7xl"
                            style={{ fontFamily: "var(--c-display)" }}
                          >
                            Mesa de regalos
                          </h2>
                          <p className="mt-4 max-w-lg mx-auto text-sm opacity-70">
                            Tu presencia es nuestro regalo. Si quieres regalarnos
                            algo, te dejamos opciones.
                          </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-5">
                          {wedding.gifts.map((g) => (
                            <motion.a
                              key={g.store}
                              href={g.url}
                              target="_blank"
                              rel="noreferrer"
                              whileHover={{ y: -4 }}
                              transition={{
                                duration: 0.3,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                              className="block p-6 text-center group rounded-3xl"
                              style={{
                                backgroundColor: "var(--c-paper)",
                                border:
                                  "1px solid color-mix(in srgb, var(--c-fg) 15%, transparent)",
                              }}
                            >
                              <div
                                className="mx-auto w-12 h-1 mb-5 transition-all group-hover:w-20"
                                style={{ backgroundColor: g.accent }}
                              />
                              <p
                                className="text-2xl md:text-3xl"
                                style={{ fontFamily: "var(--c-display)" }}
                              >
                                {g.store}
                              </p>
                              <p
                                className="mt-2 text-[10px] tracking-[0.3em] uppercase opacity-70"
                                style={{ fontFamily: "var(--c-mono)" }}
                              >
                                {g.code}
                              </p>
                              <p
                                className="mt-5 text-[11px] tracking-[0.3em] uppercase opacity-80"
                                style={{
                                  color: g.accent,
                                  fontFamily: "var(--c-mono)",
                                }}
                              >
                                Ver mesa ↗
                              </p>
                            </motion.a>
                          ))}
                        </div>
                      </div>
                    </section>

                    {/* RSVP */}
                    <section
                      className="py-32 px-6"
                      style={{
                        backgroundColor: "var(--c-accent)",
                        color: "var(--c-paper)",
                      }}
                    >
                      <div className="max-w-2xl mx-auto text-center">
                        <h2
                          className="text-6xl md:text-8xl mb-6"
                          style={{ fontFamily: "var(--c-script)" }}
                        >
                          Te esperamos
                        </h2>
                        <p className="mb-10 opacity-90">
                          Confirma antes del{" "}
                          <strong>{wedding.rsvpDeadline}</strong>.
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          className="px-10 py-4 text-xs tracking-[0.4em] uppercase border-2 rounded-full"
                          style={{
                            borderColor: "var(--c-paper)",
                            backgroundColor: "var(--c-paper)",
                            color: "var(--c-accent)",
                            fontFamily: "var(--c-mono)",
                          }}
                        >
                          Confirmar asistencia
                        </motion.button>
                      </div>
                    </section>

                    <footer
                      className="py-10 text-center text-[10px] tracking-[0.4em] uppercase opacity-70"
                      style={{
                        backgroundColor: "var(--c-fg)",
                        color: "var(--c-paper)",
                        fontFamily: "var(--c-mono)",
                      }}
                    >
                      {wedding.groom} & {wedding.bride} · 25.07.2026 ·{" "}
                      {wedding.hashtag}
                    </footer>
                  </motion.div>
                )}
              </AnimatePresence>

              <MusicButton />
            </div>
          </div>
        );
      }}
    </Customizer>
  );
}
