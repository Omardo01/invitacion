"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "motion/react";
import { useRef, useState, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import { wedding } from "@/lib/wedding";
import { BlurFade, useCountdown } from "@/components/magic";
import { PetalRain, FloralCorner, FloralDivider, Blossom } from "@/components/floral";

/* ─── La Definitiva · lila · blanco · plata · combinación de 24+11+13+9+1 ─── */
/* deploy check 2026-06-04 — forzar redeploy en prod */
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
  novia: { label: "Padres de la novia", names: ["Mariano Madrigal Domínguez", "Norma Hernández Hernández"] },
  novio: { label: "Padres del novio", names: ["Gabriel Domínguez Landero", "Guadalupe Ruiz Uribe"] },
};

/* lugar (ceremonia y recepción en el mismo sitio) */
const venue = {
  name: "Salón Gomzav",
  address: "Calle Huimanguillo No. 105, Col. Pino Suárez, cerca de Mario Brown Peralta, Villahermosa, Tabasco",
  time: "05:00 pm",
  mapsQuery: "Salón Gomzav, Calle Huimanguillo 105, Col. Pino Suárez, Villahermosa, Tabasco",
};

/* evento para calendario · 25 jul 2026, 17:00 (Tabasco, UTC-6) → 23:00 UTC; fin 02:00 → 08:00 UTC */
const calEvent = {
  title: `Boda de ${wedding.groom} & ${wedding.bride}`,
  start: "20260725T230000Z",
  end: "20260726T080000Z",
  location: `${venue.name}, ${venue.address}`,
  details: "¡Nos casamos! Te esperamos para celebrar este día tan especial con nosotros.",
};

const googleCalUrl =
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  `&text=${encodeURIComponent(calEvent.title)}` +
  `&dates=${calEvent.start}/${calEvent.end}` +
  `&location=${encodeURIComponent(calEvent.location)}` +
  `&details=${encodeURIComponent(calEvent.details)}`;

/* descarga un archivo .ics (Apple Calendar, Outlook, etc.) */
function downloadICS() {
  const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Invitacion//Boda//ES", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:boda-gabriel-zayra-2026@invitacion",
    `DTSTAMP:${stamp}`,
    `DTSTART:${calEvent.start}`,
    `DTEND:${calEvent.end}`,
    `SUMMARY:${esc(calEvent.title)}`,
    `LOCATION:${esc(calEvent.location)}`,
    `DESCRIPTION:${esc(calEvent.details)}`,
    "BEGIN:VALARM", "TRIGGER:-P1D", "ACTION:DISPLAY", "DESCRIPTION:Mañana es la boda", "END:VALARM",
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "boda-gabriel-y-zayra.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* programa / itinerario */
const itinerary = [
  { time: "16:50", label: "Recepción", sub: "Salón Gomzav" },
  { time: "17:00", label: "Cóctel de bienvenida", sub: "" },
  { time: "18:00", label: "Inicio de la ceremonia", sub: "" },
  { time: "21:00", label: "Cena", sub: "" },
  { time: "21:30", label: "Sorpresas de la noche", sub: "" },
  { time: "23:00", label: "Despedida", sub: "" },
];

/* mesa de regalos · opciones (Amazon con enlace; las demás informativas) */
const gifts: { icon: string; title: string; desc: string; url?: string; note?: string }[] = [
  { icon: "🎁", title: "Amazon", desc: "Nuestra mesa de regalos", url: "https://www.amazon.com.mx/wedding/guest-view/3SQ0VWA0YNHSS" },
  { icon: "💌", title: "Dinero en efectivo", desc: "Puedes entregarlo el día del evento", note: "En el evento" },
  { icon: "🎀", title: "Regalo físico", desc: "A tu elección, con todo el cariño", note: "En el evento" },
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
    <motion.div
      className="text-center mb-10"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
    >
      {kicker && (
        <motion.p
          className="text-[11px] uppercase tracking-[0.4em] mb-3" style={{ color: C.lilaDeep }}
          variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {kicker}
        </motion.p>
      )}
      <motion.h2
        className="text-4xl md:text-5xl" style={{ fontFamily: "var(--font-great-vibes)", color: C.lilaDeep }}
        variants={{ hidden: { opacity: 0, y: 14, filter: "blur(8px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)" } }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.h2>
    </motion.div>
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
                  {it.sub && <p className="text-xs" style={{ color: C.faint }}>{it.sub}</p>}
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
                  {it.sub && <p className="text-xs" style={{ color: C.faint }}>{it.sub}</p>}
                </motion.div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Galería · fotos reales en /public/Fotos (orientación intercalada para balance) ── */
const galleryPhotos: { src: string; w: number; h: number }[] = [
  { src: "/Fotos/20260419_131357.jpg", w: 3792, h: 2134 },
  { src: "/Fotos/20260419_162045.jpg", w: 2170, h: 3854 },
  { src: "/Fotos/20260419_131748.jpg", w: 2006, h: 1984 },
  { src: "/Fotos/20260419_152949.jpg", w: 4000, h: 2252 },
  { src: "/Fotos/20260419_153112.jpg", w: 2074, h: 1496 },
  { src: "/Fotos/20260419_153715.jpg", w: 4000, h: 2252 },
  { src: "/Fotos/20260419_154329.jpg", w: 4000, h: 2252 },
  { src: "/Fotos/20260419_165135.jpg", w: 2252, h: 3878 },
  { src: "/Fotos/20260419_154418.jpg", w: 4000, h: 2252 },
  { src: "/Fotos/20260419_155222.jpg", w: 2252, h: 4000 }, // EXIF portrait
  { src: "/Fotos/20260419_155327.jpg", w: 2252, h: 4000 }, // EXIF portrait
  { src: "/Fotos/20260419_155517.jpg", w: 2252, h: 4000 }, // EXIF portrait
  { src: "/Fotos/20260419_155807.jpg", w: 2252, h: 4000 }, // EXIF portrait
  { src: "/Fotos/20260419_160711.jpg", w: 4000, h: 2252 },
  { src: "/Fotos/20260419_163858.jpg", w: 2252, h: 4000 }, // EXIF portrait
];

/* reparte las fotos en `cols` columnas equilibrando la altura acumulada (evita huecos).
   Usa LPT: asigna de la más alta a la más baja a la columna más corta; luego restaura
   el orden cronológico dentro de cada columna para que la lectura siga teniendo sentido. */
function balanceColumns(cols: number) {
  type Item = { photo: (typeof galleryPhotos)[number]; idx: number };
  const columns: Item[][] = Array.from({ length: cols }, () => []);
  const heights = new Array(cols).fill(0);
  const byTallest = galleryPhotos
    .map((photo, idx) => ({ photo, idx }))
    .sort((a, b) => b.photo.h / b.photo.w - a.photo.h / a.photo.w);
  byTallest.forEach((item) => {
    let shortest = 0;
    for (let c = 1; c < cols; c++) if (heights[c] < heights[shortest]) shortest = c;
    columns[shortest].push(item);
    heights[shortest] += item.photo.h / item.photo.w; // alto relativo a ancho de columna fijo
  });
  columns.forEach((col) => col.sort((a, b) => a.idx - b.idx));
  return columns;
}

function PhotoTile({ photo, idx, onOpen }: { photo: (typeof galleryPhotos)[number]; idx: number; onOpen: (i: number) => void }) {
  const dir = idx % 2 === 0 ? -24 : 24;
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(idx)}
      className="group relative block w-full overflow-hidden rounded-2xl cursor-pointer"
      style={{ border: `1px solid ${C.line}`, boxShadow: "0 14px 34px -20px rgba(120,90,170,0.4)" }}
      initial={{ opacity: 0, y: 34, x: dir, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, y: 0, x: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.75, delay: (idx % 5) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
    >
      <Image
        src={photo.src} width={photo.w} height={photo.h} alt={`Recuerdo ${idx + 1} de ${wedding.groom} y ${wedding.bride}`}
        sizes="(max-width:768px) 50vw, 33vw" quality={90}
        className="w-full h-auto object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
      />
      {/* velo lila al pasar el cursor */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "linear-gradient(to top, rgba(53,44,78,0.45), rgba(138,108,184,0.12) 45%, transparent 70%)" }} />
      {/* ícono expandir */}
      <div className="absolute inset-0 grid place-items-center opacity-0 scale-90 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100">
        <span className="grid place-items-center w-11 h-11 rounded-full backdrop-blur-sm"
          style={{ backgroundColor: "rgba(255,255,255,0.85)", boxShadow: "0 6px 18px -6px rgba(53,44,78,0.5)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.lilaDeep} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
        </span>
      </div>
    </motion.button>
  );
}

function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  const total = galleryPhotos.length;

  const close = useCallback(() => setOpen(null), []);
  const go = useCallback((dir: number) => setOpen((o) => (o === null ? o : (o + dir + total) % total)), [total]);

  useEffect(() => {
    if (open === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [open, close, go]);

  return (
    <>
      {/* móvil · 2 columnas equilibradas por altura */}
      <div className="flex md:hidden gap-3 max-w-5xl mx-auto items-start">
        {balanceColumns(2).map((col, ci) => (
          <div key={ci} className="flex-1 flex flex-col gap-3">
            {col.map(({ photo, idx }) => <PhotoTile key={photo.src} photo={photo} idx={idx} onOpen={setOpen} />)}
          </div>
        ))}
      </div>
      {/* desktop · 3 columnas equilibradas por altura */}
      <div className="hidden md:flex gap-4 max-w-5xl mx-auto items-start">
        {balanceColumns(3).map((col, ci) => (
          <div key={ci} className="flex-1 flex flex-col gap-4">
            {col.map(({ photo, idx }) => <PhotoTile key={photo.src} photo={photo} idx={idx} onOpen={setOpen} />)}
          </div>
        ))}
      </div>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
            style={{ backgroundColor: "rgba(35,28,55,0.86)", backdropFilter: "blur(10px)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
          >
            {/* cerrar */}
            <button type="button" onClick={close} aria-label="Cerrar"
              className="absolute top-5 right-5 z-10 grid place-items-center w-10 h-10 rounded-full text-white cursor-pointer transition-colors hover:bg-white/15"
              style={{ border: "1px solid rgba(255,255,255,0.3)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
            {/* anterior */}
            <button type="button" onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Anterior"
              className="absolute left-3 sm:left-6 z-10 grid place-items-center w-11 h-11 rounded-full text-white cursor-pointer transition-colors hover:bg-white/15"
              style={{ border: "1px solid rgba(255,255,255,0.3)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            {/* siguiente */}
            <button type="button" onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Siguiente"
              className="absolute right-3 sm:right-6 z-10 grid place-items-center w-11 h-11 rounded-full text-white cursor-pointer transition-colors hover:bg-white/15"
              style={{ border: "1px solid rgba(255,255,255,0.3)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={open}
                className="relative"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={galleryPhotos[open].src} width={galleryPhotos[open].w} height={galleryPhotos[open].h}
                  alt={`Recuerdo ${open + 1}`} sizes="100vw" quality={92} priority
                  className="max-h-[82vh] w-auto max-w-[92vw] object-contain rounded-xl"
                  style={{ boxShadow: "0 30px 80px -20px rgba(0,0,0,0.7)" }}
                />
              </motion.div>
            </AnimatePresence>

            {/* contador */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/85 text-xs uppercase tracking-[0.3em] tabular-nums">
              {open + 1} / {total}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Modal de confirmación · confeti lila + selector de lugares (estilo opción 20) ── */
function RSVPModal({ seats, mode, slug, onClose, onConfirmed }: {
  seats: number; mode: "preview" | "live"; slug?: string;
  onClose: () => void; onConfirmed: (going: number) => void;
}) {
  const [going, setGoing] = useState(seats); // cuántos de los lugares asistirán (por defecto todos)
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [onClose]);

  const celebrate = () => {
    const colors = [C.lila, C.lilaDeep, "#e8def4", "#c9b3e0", "#ffffff"];
    confetti({ particleCount: 130, spread: 95, startVelocity: 45, origin: { y: 0.45 }, colors, scalar: 1.05 });
    const end = Date.now() + 1400;
    (function frame() {
      confetti({ particleCount: 5, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors, scalar: 0.9 });
      confetti({ particleCount: 5, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors, scalar: 0.9 });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };

  const confirm = async () => {
    if (loading) return;
    setError(false);
    const attending = going > 0;
    if (mode === "live" && slug) {
      setLoading(true);
      try {
        const notes = attending
          ? `Asistirán ${going} de ${seats} ${seats === 1 ? "lugar" : "lugares"}`
          : "No podrá asistir";
        const res = await fetch(`/api/rsvp/${slug}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ confirmed: attending, notes }),
        });
        if (!res.ok) throw new Error();
      } catch {
        setError(true); setLoading(false); return;
      }
      setLoading(false);
    }
    setDone(true);
    if (attending) celebrate();
    onConfirmed(going);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(35,28,55,0.6)", backdropFilter: "blur(8px)" }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-[28px] p-7 sm:p-9"
        style={{ backgroundColor: C.paper, border: `1px solid ${C.line}`, boxShadow: "0 40px 90px -30px rgba(80,50,130,0.6)" }}
        initial={{ opacity: 0, y: 30, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 240, damping: 24 }}
      >
        <FloralCorner className="absolute -top-1 -left-1 w-20 h-20 opacity-70 pointer-events-none" color={C.lilaDeep} soft={C.lila} />
        <FloralCorner className="absolute -top-1 -right-1 w-20 h-20 opacity-70 pointer-events-none" color={C.lilaDeep} soft={C.lila} mirror />

        {/* cerrar */}
        <button type="button" onClick={onClose} aria-label="Cerrar"
          className="absolute top-4 right-4 z-10 grid place-items-center w-8 h-8 rounded-full cursor-pointer transition-colors"
          style={{ color: C.faint }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>

        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="relative">
              <div className="text-center mb-6">
                <p className="text-[10px] uppercase tracking-[0.35em] mb-2" style={{ color: C.lilaDeep }}>Confirmación</p>
                <h3 className="text-4xl" style={{ fontFamily: "var(--font-great-vibes)", color: C.lilaDeep }}>¿Nos acompañas?</h3>
                <p className="text-sm mt-2" style={{ color: C.mid }}>Tienes <strong style={{ color: C.lilaDeep }}>{seats} {seats === 1 ? "lugar reservado" : "lugares reservados"}</strong>. ¿Cuántos asistirán? Confirma antes del <strong style={{ color: C.lilaDeep }}>{wedding.rsvpDeadline}</strong>.</p>
              </div>

              {/* selector de cantidad */}
              <div className="flex flex-wrap justify-center gap-2 mb-3">
                {Array.from({ length: seats + 1 }, (_, n) => n).map((n) => (
                  <button key={n} type="button" onClick={() => setGoing(n)}
                    className="w-11 h-11 rounded-full text-sm font-semibold transition-colors cursor-pointer tabular-nums"
                    style={going === n
                      ? { backgroundColor: C.lilaDeep, color: "#fff" }
                      : { backgroundColor: C.paper2, color: C.mid, border: `1px solid ${C.line}` }}>
                    {n}
                  </button>
                ))}
              </div>
              <p className="text-center text-xs mb-1" style={{ color: C.faint }}>
                {going === 0 ? "No podré asistir" : `Asistirán ${going} de ${seats} ${seats === 1 ? "lugar" : "lugares"}`}
              </p>

              {error && <p className="text-center text-xs mt-2" style={{ color: "#d24a4a" }}>Ocurrió un error. Intenta de nuevo.</p>}

              <motion.button type="button" onClick={confirm} disabled={loading} whileHover={{ scale: loading ? 1 : 1.03 }} whileTap={{ scale: loading ? 1 : 0.97 }}
                className="mt-5 w-full py-3.5 rounded-full text-white text-sm uppercase tracking-[0.2em] cursor-pointer disabled:opacity-60"
                style={{ backgroundColor: C.lilaDeep, boxShadow: "0 16px 30px -14px rgba(120,90,170,0.7)" }}>
                {loading ? "Enviando..." : going === 0 ? "Enviar respuesta" : "Confirmar asistencia"}
              </motion.button>
            </motion.div>
          ) : (
            <motion.div key="done" className="relative text-center py-4"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
              {going > 0 ? (
                <>
                  {/* check animado */}
                  <motion.svg width="84" height="84" viewBox="0 0 52 52" className="mx-auto mb-4"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}>
                    <circle cx="26" cy="26" r="24" fill="none" stroke={C.lila} strokeWidth="2.5" />
                    <motion.path d="M15 27 l8 8 l15 -16" fill="none" stroke={C.lilaDeep} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }} />
                  </motion.svg>
                  <motion.div initial={{ scale: 0, rotate: -15 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.45, type: "spring", stiffness: 220 }} className="text-5xl mb-3">🥂</motion.div>
                  <h3 className="text-4xl mb-2" style={{ fontFamily: "var(--font-great-vibes)", color: C.lilaDeep }}>¡Gracias por confirmar!</h3>
                  <p className="text-sm" style={{ color: C.mid }}>
                    Confirmamos <strong style={{ color: C.lilaDeep }}>{going} {going === 1 ? "lugar" : "lugares"}</strong>. ¡Nos vemos el {wedding.dateShort}! ✨
                  </p>
                  <p className="text-xs mt-4 px-3 py-2.5 rounded-xl" style={{ color: C.mid, backgroundColor: C.paper2, border: `1px solid ${C.line}` }}>
                    ⏰ La puntualidad es muy importante para que disfrutes de todas las sorpresas del evento.
                  </p>
                </>
              ) : (
                <>
                  <div className="text-5xl mb-4">🌙</div>
                  <h3 className="text-4xl mb-2" style={{ fontFamily: "var(--font-great-vibes)", color: C.lilaDeep }}>Te vamos a extrañar</h3>
                  <p className="text-sm" style={{ color: C.mid }}>Gracias por avisarnos. ¡Te mandamos un fuerte abrazo!</p>
                </>
              )}
              <button type="button" onClick={onClose} className="mt-7 text-xs underline cursor-pointer transition-opacity hover:opacity-70" style={{ color: C.faint }}>
                Cerrar
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

/* ── Música de fondo · autoplay (arranca en el 1er gesto si el navegador lo bloquea) ──
   Salta los primeros 5 s de silencio del archivo. */
const AUDIO_START = 5;
function AudioPlayer() {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = ref.current;
    if (!audio) return;
    audio.volume = 0.55;

    const atStart = () => { if (audio.currentTime < AUDIO_START) audio.currentTime = AUDIO_START; };

    const tryPlay = () => {
      atStart();
      audio.play().then(() => setPlaying(true)).catch(() => {});
    };

    const onGesture = () => { if (audio.paused) tryPlay(); };

    audio.addEventListener("loadedmetadata", atStart);
    tryPlay(); // intento de autoplay (suele bloquearse con sonido)
    window.addEventListener("pointerdown", onGesture);
    window.addEventListener("keydown", onGesture);
    window.addEventListener("scroll", onGesture, { passive: true });

    return () => {
      audio.removeEventListener("loadedmetadata", atStart);
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
      window.removeEventListener("scroll", onGesture);
    };
  }, []);

  const toggle = () => {
    const audio = ref.current;
    if (!audio) return;
    if (audio.paused) {
      if (audio.currentTime < AUDIO_START) audio.currentTime = AUDIO_START;
      audio.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      <audio
        ref={ref}
        src="/Misterio.mp3"
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={(e) => { const a = e.currentTarget; a.currentTime = AUDIO_START; a.play().catch(() => {}); }}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pausar música" : "Reproducir música"}
        className="fixed bottom-5 right-5 z-50 grid place-items-center w-11 h-11 rounded-full backdrop-blur transition-transform hover:scale-105 active:scale-95"
        style={{ backgroundColor: "rgba(138,108,184,0.92)", boxShadow: "0 8px 20px -8px rgba(120,90,170,0.7)" }}
      >
        {playing ? (
          <span className="flex items-end gap-[3px] h-4">
            {[0, 1, 2].map((i) => (
              <motion.span key={i} className="w-[3px] rounded-full bg-white"
                animate={{ height: ["6px", "16px", "6px"] }}
                transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut", delay: i * 0.18 }} />
            ))}
          </span>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
          </svg>
        )}
      </button>
    </>
  );
}

type Invitation33Props = {
  mode?: "preview" | "live";
  guestName?: string;
  slug?: string;
  seats?: number;
  initialConfirmed?: 1 | 0 | null;
};

export default function Invitation33({
  mode = "preview",
  guestName,
  slug,
  seats = 2,
  initialConfirmed = null,
}: Invitation33Props) {
  const t = useCountdown("2026-07-25T17:00:00");
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(initialConfirmed === 1);
  const [declined, setDeclined] = useState(initialConfirmed === 0);
  const [goingSeats, setGoingSeats] = useState(initialConfirmed === 1 ? seats : 0);

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

      {mode === "preview" && (
        <Link href="/" className="fixed top-5 left-5 z-50 text-xs uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur"
          style={{ color: C.lilaDeep, backgroundColor: "rgba(255,255,255,0.7)" }}>← volver</Link>
      )}

      {/* pétalos en TODA la página */}
      <PetalRain count={18} colors={["#d9c7ee", "#c9b3e0", "#e8def4", "#b89ad6", "#cbb6e6", "#cfc9dc"]} />

      {/* música de fondo */}
      <AudioPlayer />

      {/* ░░ HERO — fecha gigante detrás + nombres con revelado de letras (de la 9 y la 24) ░░ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden grain">
        <FloralCorner className="absolute -top-2 -left-2 w-32 h-32 md:w-52 md:h-52 z-0" color={C.lilaDeep} soft={C.lila} />
        <FloralCorner className="absolute -top-2 -right-2 w-32 h-32 md:w-52 md:h-52 z-0" color={C.lilaDeep} soft={C.lila} mirror />
        <FloralCorner className="absolute -bottom-2 -left-2 w-28 h-28 md:w-44 md:h-44 z-0 rotate-180" color={C.lilaDeep} soft={C.lila} mirror />
        <FloralCorner className="absolute -bottom-2 -right-2 w-28 h-28 md:w-44 md:h-44 z-0 rotate-180" color={C.lilaDeep} soft={C.lila} />

        {/* fecha gigante translúcida de fondo */}
        <div className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none z-0 leading-[0.78]">
          <motion.span initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4 }}
            className="text-[48vw]" style={{ fontFamily: "var(--font-fraunces)", color: "rgba(138,108,184,0.08)" }}>25</motion.span>
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.4, delay: 0.2 }}
            className="text-[23vw] -mt-2" style={{ fontFamily: "var(--font-great-vibes)", color: "rgba(138,108,184,0.11)" }}>julio</motion.span>
          <motion.span initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4, delay: 0.1 }}
            className="text-[29vw]" style={{ fontFamily: "var(--font-fraunces)", color: "rgba(138,108,184,0.08)" }}>2026</motion.span>
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
            className="text-[11px] uppercase tracking-[0.5em] mb-3" style={{ color: C.lilaDeep }}>Nuestra boda</motion.p>

          {guestName && (
            <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
              className="mb-6 text-2xl sm:text-3xl" style={{ fontFamily: "var(--font-great-vibes)", color: C.mid }}>
              Hola, {guestName}
            </motion.p>
          )}

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
            <p className="text-xs uppercase tracking-[0.3em] mt-1" style={{ color: C.faint }}>Villahermosa</p>
          </BlurFade>
        </div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-6 z-10 text-[10px] uppercase tracking-[0.3em]" style={{ color: C.faint }}>↓ desliza</motion.div>
      </section>

      {/* ░░ VERSÍCULO ░░ */}
      <section className="py-20 px-6 border-t grain" style={{ borderColor: C.line, backgroundColor: C.paper2 }}>
        <BlurFade className="max-w-xl mx-auto text-center">
          <FloralDivider className="mb-8 mx-auto" color={C.lilaDeep} soft={C.lila} />
          <p className="text-xl md:text-2xl leading-relaxed italic font-light" style={{ fontFamily: "var(--font-fraunces)", color: C.mid }}>
            Así que no son ya más dos, sino una sola carne; por tanto, lo que Dios juntó, no lo separe el hombre.
          </p>
          <p className="mt-5 text-sm uppercase tracking-[0.3em]" style={{ color: C.lilaDeep }}>Mateo 19:6</p>
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

      {/* ░░ PADRES ░░ */}
      <section className="py-20 px-6 border-t grain" style={{ borderColor: C.line, backgroundColor: C.paper2 }}>
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
      <section className="py-20 px-6 border-t" style={{ borderColor: C.line }}>
        <SectionTitle>Nuestra historia</SectionTitle>
        <BlurFade className="max-w-xl mx-auto text-center">
          <p className="text-xl md:text-2xl leading-relaxed italic font-light" style={{ fontFamily: "var(--font-fraunces)", color: C.mid }}>
            {wedding.story}
          </p>
        </BlurFade>
      </section>

      {/* ░░ CALENDARIO ░░ */}
      <section className="py-20 px-6 border-t grain" style={{ borderColor: C.line, backgroundColor: C.paper2 }}>
        <SectionTitle kicker="Reserva la fecha">El gran día</SectionTitle>
        <BlurFade><p className="text-center text-xs uppercase tracking-[0.3em] mb-8" style={{ color: C.faint }}>Sábado · Julio 2026</p></BlurFade>
        <BlurFade><Calendar /></BlurFade>
        <BlurFade className="mt-10 flex flex-col items-center gap-3">
          <motion.button type="button" onClick={downloadICS} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-white text-[11px] uppercase tracking-[0.25em] cursor-pointer"
            style={{ backgroundColor: C.lilaDeep, boxShadow: "0 14px 30px -14px rgba(120,90,170,0.6)" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18M12 14v4M10 16h4" />
            </svg>
            Agregar a mi calendario
          </motion.button>
          <a href={googleCalUrl} target="_blank" rel="noopener noreferrer"
            className="text-xs underline transition-opacity hover:opacity-70" style={{ color: C.lilaDeep }}>
            ¿Usas Google Calendar? Agrégalo aquí
          </a>
        </BlurFade>
      </section>

      {/* ░░ LUGAR / UBICACIÓN ░░ */}
      <section className="py-20 px-6 border-t" style={{ borderColor: C.line }}>
        <SectionTitle kicker="Dónde celebraremos">Lugar</SectionTitle>
        <div className="max-w-lg mx-auto">
          <BlurFade>
            <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}
              className="rounded-3xl p-8 sm:p-10 text-center" style={{ backgroundColor: C.paper, border: `1px solid ${C.line}`, boxShadow: "0 12px 30px -14px rgba(120,90,170,0.22)" }}>
              <p className="text-[10px] uppercase tracking-[0.3em] mb-2" style={{ color: C.faint }}>Ceremonia y recepción</p>
              <p className="text-5xl mb-4" style={{ fontFamily: "var(--font-great-vibes)", color: C.lilaDeep }}>{venue.time}</p>
              <p className="text-xl font-medium mb-2" style={{ color: C.ink }}>{venue.name}</p>
              <p className="text-sm mb-6 leading-relaxed mx-auto max-w-xs" style={{ color: C.mid }}>{venue.address}</p>
              <a href={`https://maps.google.com/?q=${encodeURIComponent(venue.mapsQuery)}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] px-6 py-2.5 rounded-full text-white transition-opacity hover:opacity-85"
                style={{ backgroundColor: C.lilaDeep }}>
                📍 Ver ubicación
              </a>
            </motion.div>
          </BlurFade>
        </div>
      </section>

      {/* ░░ DRESS CODE ░░ */}
      <section className="py-20 px-6 border-t grain text-center" style={{ borderColor: C.line, backgroundColor: C.paper2 }}>
        <SectionTitle kicker="Etiqueta">Código de vestimenta</SectionTitle>
        <BlurFade className="max-w-md mx-auto">
          <p className="text-2xl italic mb-2" style={{ fontFamily: "var(--font-fraunces)", color: C.ink }}>Formal</p>
          <div className="text-sm mb-8 space-y-1" style={{ color: C.mid }}>
            <p><strong style={{ color: C.ink }}>Ellas:</strong> Vestido largo</p>
            <p><strong style={{ color: C.ink }}>Ellos:</strong> Traje</p>
          </div>

          <p className="text-[10px] uppercase tracking-[0.3em] mb-3" style={{ color: C.lilaDeep }}>Colores reservados · por favor evítalos</p>
          <div className="flex justify-center gap-5 mb-3">
            {[{ n: "Blanco", h: "#ffffff" }, { n: "Lila", h: C.lila }, { n: "Beige", h: "#e3d6c3" }].map((c) => (
              <div key={c.n} className="flex flex-col items-center gap-1">
                <span className="relative w-9 h-9 rounded-full grid place-items-center" style={{ backgroundColor: c.h, border: `1px solid ${C.line}` }}>
                  <span className="absolute w-full h-px rotate-45" style={{ backgroundColor: "#d24a4a" }} />
                </span>
                <span className="text-[10px]" style={{ color: C.faint }}>{c.n}</span>
              </div>
            ))}
          </div>
          <p className="text-xs" style={{ color: C.faint }}>Así como colores cercanos a estos mismos.</p>
        </BlurFade>
      </section>

      {/* ░░ ITINERARIO / PROGRAMA ░░ */}
      <section className="py-20 px-6 border-t" style={{ borderColor: C.line }}>
        <SectionTitle kicker="Programa del día">Itinerario</SectionTitle>
        <Itinerary />
        <BlurFade><div className="flex justify-center mt-10"><svg width="40" height="26" viewBox="0 0 48 32" fill="none" stroke={C.lila} strokeWidth="1.2"><path d="M4 22h40M8 22l3-9h18l7 9M14 13v9M22 13v9" /><circle cx="14" cy="24" r="3" /><circle cx="34" cy="24" r="3" /></svg></div></BlurFade>
      </section>

      {/* ░░ GALERÍA ░░ */}
      <section className="py-20 px-6 border-t grain" style={{ borderColor: C.line, backgroundColor: C.paper2 }}>
        <SectionTitle kicker="Nuestros momentos">Galería</SectionTitle>
        <Gallery />
      </section>

      {/* ░░ MESA DE REGALOS ░░ */}
      <section className="py-20 px-6 border-t" style={{ borderColor: C.line }}>
        <SectionTitle kicker="Si deseas obsequiarnos algo">Mesa de regalos</SectionTitle>
        <BlurFade className="max-w-lg mx-auto text-center">
          <p className="italic text-lg mb-8" style={{ fontFamily: "var(--font-fraunces)", color: C.mid }}>
            Tu presencia es nuestro mayor regalo, pero si deseas tener un detalle con nosotros, aquí te dejamos algunas opciones.
          </p>
          <div className="space-y-3">
            {gifts.map((g, i) => {
              const inner = (
                <>
                  <span className="text-2xl shrink-0">{g.icon}</span>
                  <span className="flex-1 text-left">
                    <span className="block font-medium text-sm" style={{ color: C.ink }}>{g.title}</span>
                    <span className="block text-xs" style={{ color: C.faint }}>{g.desc}</span>
                  </span>
                  {g.url
                    ? <span className="text-xs uppercase tracking-widest shrink-0" style={{ color: C.lilaDeep }}>Ver →</span>
                    : g.note && <span className="text-xs uppercase tracking-widest shrink-0" style={{ color: C.faint }}>{g.note}</span>}
                </>
              );
              return (
                <BlurFade key={g.title} delay={i * 0.08}>
                  {g.url ? (
                    <a href={g.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-4 px-5 py-4 rounded-2xl transition-transform hover:scale-[1.02]"
                      style={{ backgroundColor: C.paper, border: `1px solid ${C.line}` }}>
                      {inner}
                    </a>
                  ) : (
                    <div className="flex items-center gap-4 px-5 py-4 rounded-2xl"
                      style={{ backgroundColor: C.paper, border: `1px solid ${C.line}` }}>
                      {inner}
                    </div>
                  )}
                </BlurFade>
              );
            })}
          </div>
        </BlurFade>
      </section>

      {/* ░░ CONFIRMAR ASISTENCIA ░░ */}
      <section className="relative py-24 px-6 border-t grain text-center overflow-hidden" style={{ borderColor: C.line, backgroundColor: C.paper2 }}>
        <svg className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-64 opacity-60" viewBox="0 0 220 60" fill="none">
          <Blossom cx={110} cy={30} r={9} petalR={6} color={C.lila} center={C.lilaDeep} delay={0.2} />
          <Blossom cx={80} cy={36} r={6} petalR={4} color={C.lila} center={C.lilaDeep} delay={0.35} />
          <Blossom cx={140} cy={36} r={6} petalR={4} color={C.lila} center={C.lilaDeep} delay={0.45} />
        </svg>
        <div className="max-w-md mx-auto relative min-h-[260px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {!confirmed && !declined ? (
              <motion.div key="invite" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                <SectionTitle kicker="Te esperamos">¿Nos acompañas?</SectionTitle>
                <p className="mb-10" style={{ color: C.mid }}>
                  {mode === "live"
                    ? <>Tienes <strong style={{ color: C.lilaDeep }}>{seats} {seats === 1 ? "lugar reservado" : "lugares reservados"}</strong>. Confirma antes del <strong style={{ color: C.lilaDeep }}>{wedding.rsvpDeadline}</strong>.</>
                    : <>Tu respuesta hace este día más nuestro. Confirma antes del <strong style={{ color: C.lilaDeep }}>{wedding.rsvpDeadline}</strong>.</>}
                </p>
                <motion.button type="button" onClick={() => setRsvpOpen(true)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="inline-block px-10 py-4 rounded-full text-white text-sm uppercase tracking-[0.25em] cursor-pointer"
                  style={{ backgroundColor: C.lilaDeep, boxShadow: "0 18px 34px -16px rgba(120,90,170,0.7)" }}>
                  Confirmar asistencia
                </motion.button>
                {mode === "preview" && <p className="mt-5 text-xs" style={{ color: C.faint }}>En tu invitación personalizada tendrás tu enlace único</p>}
              </motion.div>
            ) : confirmed ? (
              <motion.div key="thanks" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                <motion.div initial={{ scale: 0, rotate: -15 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.15, type: "spring", stiffness: 220 }} className="text-5xl mb-4">🥂</motion.div>
                <h2 className="text-5xl md:text-6xl mb-3" style={{ fontFamily: "var(--font-great-vibes)", color: C.lilaDeep }}>¡Gracias por confirmar!</h2>
                <p style={{ color: C.mid }}>
                  {goingSeats > 0 && <>Confirmamos <strong style={{ color: C.lilaDeep }}>{goingSeats} {goingSeats === 1 ? "lugar" : "lugares"}</strong>. </>}
                  Nos vemos el <strong style={{ color: C.lilaDeep }}>{wedding.dateShort}</strong> en Villahermosa ✨
                </p>
                {goingSeats > 0 && (
                  <p className="text-sm mt-5 mx-auto max-w-sm px-4 py-3 rounded-xl" style={{ color: C.mid, backgroundColor: C.paper2, border: `1px solid ${C.line}` }}>
                    ⏰ La puntualidad es muy importante para que disfrutes de todas las sorpresas del evento.
                  </p>
                )}
                <button type="button" onClick={() => setRsvpOpen(true)} className="mt-6 text-xs underline cursor-pointer transition-opacity hover:opacity-70" style={{ color: C.faint }}>
                  Modificar mi respuesta
                </button>
              </motion.div>
            ) : (
              <motion.div key="declined" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                <div className="text-5xl mb-4">🌙</div>
                <h2 className="text-5xl md:text-6xl mb-3" style={{ fontFamily: "var(--font-great-vibes)", color: C.lilaDeep }}>Te vamos a extrañar</h2>
                <p style={{ color: C.mid }}>Gracias por avisarnos. ¡Te mandamos un fuerte abrazo!</p>
                <button type="button" onClick={() => setRsvpOpen(true)} className="mt-6 text-xs underline cursor-pointer transition-opacity hover:opacity-70" style={{ color: C.faint }}>
                  Modificar mi respuesta
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <footer className="py-12 text-center border-t" style={{ borderColor: C.line }}>
        <p className="text-4xl mb-2" style={{ fontFamily: "var(--font-great-vibes)", color: C.lilaDeep }}>{wedding.groom} &amp; {wedding.bride}</p>
        <p className="text-[10px] uppercase tracking-[0.4em]" style={{ color: C.faint }}>{wedding.dateShort} · Villahermosa</p>
        <p className="text-[10px] uppercase tracking-[0.3em] mt-2" style={{ color: C.lila }}>{wedding.hashtag}</p>
      </footer>

      {/* ░░ MODAL DE CONFIRMACIÓN ░░ */}
      <AnimatePresence>
        {rsvpOpen && (
          <RSVPModal
            seats={seats}
            mode={mode}
            slug={slug}
            onClose={() => setRsvpOpen(false)}
            onConfirmed={(going) => {
              setGoingSeats(going);
              setConfirmed(going > 0);
              setDeclined(going === 0);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
