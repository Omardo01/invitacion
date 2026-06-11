"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { BlurFade } from "@/components/magic";
import { FloralCorner, FloralDivider } from "@/components/floral";

/* ─── misma paleta que la invitación definitiva (opción 33) ─── */
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

const SILVER_GRAD = "linear-gradient(135deg, #f4f4fa 0%, #c4c0d6 30%, #ffffff 50%, #b0accc 70%, #e8e8f0 100%)";
const DAILY_LIMIT = 3;

/* catálogo demo (en la versión real viene de GET /api/stamps/[slug]) */
type Stamp = { id: number; name: string; emoji: string; plata?: boolean };

const STAMPS: Stamp[] = [
  { id: 1, name: "Los Novios", emoji: "💑" },
  { id: 2, name: "Los Anillos", emoji: "💍" },
  { id: 3, name: "El Ramo", emoji: "💐" },
  { id: 4, name: "El Pastel", emoji: "🎂" },
  { id: 5, name: "El Brindis", emoji: "🥂" },
  { id: 6, name: "El Primer Baile", emoji: "💃" },
  { id: 7, name: "La Pista", emoji: "🪩" },
  { id: 8, name: "La Serenata", emoji: "🎶" },
  { id: 9, name: "El Banquete", emoji: "🍽️" },
  { id: 10, name: "El Fotógrafo", emoji: "📸" },
  { id: 11, name: "Los Padrinos", emoji: "🎩" },
  { id: 12, name: "El Salón", emoji: "🏛️" },
  { id: 13, name: "Las Flores", emoji: "🌸" },
  { id: 14, name: "La Fiesta", emoji: "🎉" },
  { id: 15, name: "El Beso", emoji: "💋" },
  { id: 16, name: "La Carta", emoji: "💌" },
  { id: 17, name: "La Fecha", emoji: "📅" },
  { id: 18, name: "Corazón de Plata", emoji: "🤍", plata: true },
  { id: 19, name: "Estrella de Plata", emoji: "✨", plata: true },
  { id: 20, name: "Luna de Plata", emoji: "🌙", plata: true },
];

const PLATA_IDS = STAMPS.filter((s) => s.plata).map((s) => s.id);

function drawStamp(forcePlata: boolean): Stamp {
  if (forcePlata) return STAMPS.find((s) => s.id === PLATA_IDS[Math.floor(Math.random() * PLATA_IDS.length)])!;
  return STAMPS[Math.floor(Math.random() * STAMPS.length)];
}

function fireConfetti(plata: boolean) {
  if (plata) {
    const silver = ["#ffffff", "#e8e8f0", "#c4c0d6", "#8e8aa6", "#f4f4fa"];
    confetti({ particleCount: 60, spread: 360, startVelocity: 28, gravity: 0.5, decay: 0.93, ticks: 110, shapes: ["star"], scalar: 1.3, colors: silver, origin: { y: 0.5 } });
    confetti({ particleCount: 150, spread: 110, origin: { y: 0.55 }, colors: silver });
    setTimeout(() => confetti({ particleCount: 70, angle: 60, spread: 65, startVelocity: 55, origin: { x: 0, y: 0.65 }, colors: silver }), 250);
    setTimeout(() => confetti({ particleCount: 70, angle: 120, spread: 65, startVelocity: 55, origin: { x: 1, y: 0.65 }, colors: silver }), 420);
  } else {
    confetti({ particleCount: 70, spread: 75, origin: { y: 0.55 }, colors: ["#b89ad6", "#8a6cb8", "#e8e2f3", "#ffffff"] });
  }
}

/* ─── encabezado de sección, igual que en la invitación 33 ─── */
function SectionTitle({ children, kicker }: { children: React.ReactNode; kicker?: string }) {
  return (
    <motion.div
      className="mb-10 text-center"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
    >
      {kicker && (
        <motion.p
          className="mb-3 text-[11px] uppercase tracking-[0.4em]"
          style={{ color: C.lilaDeep }}
          variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {kicker}
        </motion.p>
      )}
      <motion.h2
        className="text-4xl md:text-5xl"
        style={{ fontFamily: "var(--font-great-vibes)", color: C.lilaDeep }}
        variants={{ hidden: { opacity: 0, y: 14, filter: "blur(8px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)" } }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.h2>
    </motion.div>
  );
}

/* ─── tira de rasgado del sobre ─── */
function TearStrip({ onTear }: { onTear: () => void }) {
  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={{ left: 0, right: 0.85 }}
      dragSnapToOrigin
      onDragEnd={(_, info) => {
        if (info.offset.x > 80 || info.velocity.x > 500) onTear();
      }}
      onClick={onTear}
      exit={{ x: 280, y: -90, rotate: 28, opacity: 0, transition: { duration: 0.45, ease: [0.32, 0, 0.67, 0] } }}
      className="absolute inset-x-0 top-0 z-20 flex h-12 cursor-grab touch-none select-none items-center justify-center gap-2 active:cursor-grabbing"
      style={{ background: "#f6f1e6", borderBottom: `2px dashed ${C.lila}`, borderRadius: "12px 12px 0 0" }}
    >
      <span className="text-[10px]" style={{ color: C.mid }}>✂</span>
      <span className="text-[9px] font-semibold tracking-[0.35em]" style={{ fontFamily: "var(--font-deco)", color: C.mid }}>
        DESLIZA PARA ABRIR
      </span>
      <motion.span animate={{ x: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }} style={{ color: C.faint }}>
        ››
      </motion.span>
    </motion.div>
  );
}

/* ─── el sobre Jardín, cerrado ─── */
function SobreJardin({ onTear, torn }: { onTear: () => void; torn: boolean }) {
  return (
    <motion.div
      key="sobre"
      initial={{ y: 24, opacity: 0, scale: 0.95 }}
      animate={
        torn
          ? { y: 110, opacity: 0, scale: 0.88, transition: { delay: 0.25, duration: 0.5 } }
          : { y: [0, -8, 0], opacity: 1, scale: 1, transition: { y: { repeat: Infinity, duration: 3.2, ease: "easeInOut" }, opacity: { duration: 0.5 }, scale: { duration: 0.5 } } }
      }
      className="relative h-[370px] w-[272px] overflow-hidden rounded-xl border"
      style={{
        background: "linear-gradient(160deg, #fffefb 0%, #f6f1ea 100%)",
        borderColor: "#e7e1d4",
        boxShadow: "0 22px 44px rgba(53,44,78,0.22)",
      }}
    >
      <FloralCorner eager className="absolute -left-4 top-6 h-40 w-40 opacity-90" color={C.lilaDeep} soft={C.lila} />
      <FloralCorner eager className="absolute -bottom-4 -right-4 h-40 w-40 rotate-180 opacity-90" color={C.lilaDeep} soft={C.lila} delay={0.4} />

      <AnimatePresence>{!torn && <TearStrip onTear={onTear} />}</AnimatePresence>

      <div className="absolute inset-x-0 top-12 z-10 flex flex-col items-center pt-7">
        <p className="text-[10px] font-semibold tracking-[0.35em]" style={{ fontFamily: "var(--font-deco)", color: C.mid }}>
          COLECCIÓN DE ESTAMPAS
        </p>
      </div>

      {/* banda central */}
      <div
        className="absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 py-3.5 text-center"
        style={{ background: `linear-gradient(90deg, #7a5da8, ${C.lilaDeep}, #7a5da8)`, boxShadow: "0 5px 16px rgba(53,44,78,0.28)" }}
      >
        <p className="text-3xl leading-none text-white" style={{ fontFamily: "var(--font-script)" }}>
          Gabriel & Zayra
        </p>
        <p className="mt-1.5 text-[9px] font-semibold tracking-[0.45em] text-white/85" style={{ fontFamily: "var(--font-deco)" }}>
          25 · 07 · 2026
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center pb-5">
        <p className="max-w-[230px] truncate text-xl leading-tight" style={{ fontFamily: "var(--font-script)", color: C.ink }}>
          Para Familia Domínguez
        </p>
        <p className="mt-1 text-[9px] tracking-[0.25em]" style={{ fontFamily: "var(--font-deco)", color: C.faint }}>
          1 ESTAMPA SORPRESA · 3 DE PLATA ✦
        </p>
      </div>
    </motion.div>
  );
}

/* ─── la estampa revelada: estilo Clásica (flip) ─── */
function StampCard({ stamp, onRevealed }: { stamp: Stamp; onRevealed: () => void }) {
  const plata = !!stamp.plata;
  const frame = plata ? C.plataDeep : C.lilaDeep;
  return (
    <motion.div
      key="stamp"
      initial={{ y: 130, scale: 0.55, opacity: 0 }}
      animate={{ y: 0, scale: 1, opacity: 1 }}
      transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative h-[340px] w-[240px]"
      style={{ perspective: 1100 }}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        initial={{ rotateY: 0 }}
        animate={{ rotateY: 180 }}
        transition={{ delay: plata ? 1.4 : 1.0, duration: 0.9, ease: [0.45, 0, 0.2, 1] }}
        onAnimationComplete={onRevealed}
      >
        {/* reverso */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl border-2"
          style={{
            backfaceVisibility: "hidden",
            background: `linear-gradient(160deg, ${C.lilaDeep}, ${C.lila})`,
            borderColor: "rgba(255,255,255,0.55)",
            boxShadow: "0 18px 45px rgba(53,44,78,0.3)",
          }}
        >
          <span className="text-5xl text-white/90" style={{ fontFamily: "var(--font-script)" }}>G♥Z</span>
          <span className="text-3xl text-white/70">?</span>
        </div>

        {/* frente: estilo Clásica */}
        <div
          className="absolute inset-0 overflow-hidden rounded-xl border-2 p-3"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: plata ? SILVER_GRAD : `linear-gradient(160deg, ${C.paper} 0%, ${C.paper2} 100%)`,
            borderColor: frame,
            boxShadow: plata ? "0 18px 50px rgba(142,138,166,0.55)" : "0 18px 45px rgba(53,44,78,0.18)",
          }}
        >
          {plata && (
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
              <div
                className="absolute inset-y-0 w-1/4"
                style={{ background: "linear-gradient(105deg, transparent, rgba(255,255,255,0.65), transparent)", animation: "wax-shine 2.2s ease-in-out infinite" }}
              />
            </div>
          )}
          <div className="flex h-full w-full flex-col items-center rounded-lg border px-3 py-4" style={{ borderColor: frame }}>
            <div className="flex w-full items-center justify-between">
              <span
                className="rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider text-white"
                style={{ background: frame, fontFamily: "var(--font-deco)" }}
              >
                Nº {stamp.id}/20
              </span>
              {plata ? <span className="text-base">🏆</span> : <span style={{ color: frame }}>✦</span>}
            </div>
            <div
              className="mt-4 flex h-40 w-28 items-center justify-center overflow-hidden border-2"
              style={{ borderColor: frame, borderRadius: "999px 999px 14px 14px", background: plata ? "rgba(255,255,255,0.7)" : C.bg }}
            >
              <span className="text-6xl">{stamp.emoji}</span>
            </div>
            <h3 className="mt-3 max-w-full truncate text-center text-lg" style={{ fontFamily: "var(--font-display)", color: C.ink }}>
              {stamp.name}
            </h3>
            <p className="text-[9px] font-semibold tracking-[0.3em]" style={{ fontFamily: "var(--font-deco)", color: plata ? C.plataDeep : C.faint }}>
              {plata ? "ESTAMPA DE PLATA" : "ESTAMPA DE COLECCIÓN"}
            </p>
            <p className="mt-auto pt-2 text-[9px] tracking-[0.25em]" style={{ color: C.faint, fontFamily: "var(--font-deco)" }}>
              G & Z · 25.07.2026
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── página: la invitación con la nueva sección ─── */
type Phase = "idle" | "opening" | "revealed";

export default function OpcionPage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [stamp, setStamp] = useState<Stamp | null>(null);
  const [album, setAlbum] = useState<Record<number, number>>({});
  const [openedToday, setOpenedToday] = useState(0);
  const [round, setRound] = useState(0);
  const [forcePlata, setForcePlata] = useState(false);

  const remaining = DAILY_LIMIT - openedToday;

  const handleTear = useCallback(() => {
    setStamp(drawStamp(forcePlata));
    setRound((r) => r + 1);
    setPhase("opening");
  }, [forcePlata]);

  const handleRevealed = useCallback(() => {
    if (phase !== "opening" || !stamp) return;
    setPhase("revealed");
    fireConfetti(!!stamp.plata);
    setAlbum((prev) => ({ ...prev, [stamp.id]: (prev[stamp.id] ?? 0) + 1 }));
    setOpenedToday((n) => n + 1);
  }, [phase, stamp]);

  const next = useCallback(() => {
    setStamp(null);
    setPhase("idle");
  }, []);

  const resetDay = useCallback(() => {
    setStamp(null);
    setPhase("idle");
    setOpenedToday(0);
  }, []);

  const colectadas = Object.keys(album).length;
  const agotado = phase === "idle" && remaining <= 0;

  return (
    <main className="min-h-dvh" style={{ background: C.bg, color: C.ink }}>
      {/* ── hero condensado (contexto de la invitación) ── */}
      <section className="relative flex min-h-[62vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
        <FloralCorner eager className="absolute -left-6 -top-6 h-44 w-44 opacity-70" color={C.lilaDeep} soft={C.lila} />
        <FloralCorner eager mirror className="absolute -right-6 -top-6 h-44 w-44 opacity-70" color={C.lilaDeep} soft={C.lila} delay={0.3} />
        <BlurFade>
          <p className="mb-3 text-[11px] uppercase tracking-[0.5em]" style={{ color: C.lilaDeep }}>Nuestra boda</p>
        </BlurFade>
        <BlurFade delay={0.15}>
          <h1 className="text-6xl md:text-7xl" style={{ fontFamily: "var(--font-great-vibes)", color: C.ink }}>
            Gabriel & Zayra
          </h1>
        </BlurFade>
        <BlurFade delay={0.3}>
          <FloralDivider className="my-7" color={C.lilaDeep} soft={C.lila} />
          <p className="text-sm uppercase tracking-[0.35em]" style={{ color: C.mid }}>25 de Julio · 2026</p>
          <p className="mt-1 text-xs uppercase tracking-[0.3em]" style={{ color: C.faint }}>Villahermosa</p>
        </BlurFade>
        <p className="absolute bottom-5 text-[10px] uppercase tracking-[0.3em]" style={{ color: C.faint }}>
          ↓ la invitación continúa
        </p>
      </section>

      {/* ── secciones previas, insinuadas ── */}
      <div className="py-6 text-center text-[10px] uppercase tracking-[0.4em]" style={{ color: C.faint }}>
        Nuestros padres · Nuestra historia · Itinerario · Galería ···
      </div>

      {/* ── LA NUEVA SECCIÓN: Álbum de Estampas ── */}
      <section className="mx-auto max-w-2xl px-5 py-16">
        <SectionTitle kicker="Colecciona recuerdos">Álbum de Estampas</SectionTitle>

        <BlurFade>
          <p className="mx-auto mb-2 max-w-md text-center text-sm leading-relaxed" style={{ color: C.mid }}>
            Cada día que visites tu invitación podrás abrir hasta <strong>3 sobres</strong> y coleccionar
            las <strong>20 estampas</strong> de nuestra boda. Si te sale una de las{" "}
            <strong style={{ color: C.plataDeep }}>3 de plata</strong>, ¡ganaste un premio que te entregaremos el gran día! 🏆
          </p>
        </BlurFade>

        {/* contador de sobres del día */}
        <BlurFade delay={0.1}>
          <div className="mb-8 mt-6 flex items-center justify-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: C.faint }}>Sobres de hoy</span>
            {Array.from({ length: DAILY_LIMIT }, (_, i) => (
              <span
                key={i}
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: i < remaining ? C.lilaDeep : C.line, transition: "background 0.4s" }}
              />
            ))}
            <span className="text-[10px] tabular-nums tracking-[0.2em]" style={{ color: C.mid }}>{Math.max(0, remaining)}/{DAILY_LIMIT}</span>
          </div>
        </BlurFade>

        {/* escenario del sobre / estampa */}
        <div className="relative flex h-[440px] items-center justify-center">
          <AnimatePresence mode="popLayout">
            {phase === "idle" && !agotado && <SobreJardin key={`sobre-${round}`} onTear={handleTear} torn={false} />}
            {phase !== "idle" && stamp && <StampCard key={`stamp-${round}`} stamp={stamp} onRevealed={handleRevealed} />}
            {agotado && (
              <motion.div
                key="agotado"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex h-[300px] w-[272px] flex-col items-center justify-center rounded-xl border px-8 text-center"
                style={{ background: C.paper, borderColor: C.line }}
              >
                <span className="text-3xl">🌙</span>
                <p className="mt-4 text-lg" style={{ fontFamily: "var(--font-display)" }}>
                  Abriste tus 3 sobres de hoy
                </p>
                <p className="mt-2 text-xs leading-relaxed" style={{ color: C.mid }}>
                  Vuelve mañana para seguir llenando tu álbum.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* mensaje + acción tras revelar */}
        <div className="flex min-h-20 flex-col items-center justify-center gap-3">
          <AnimatePresence>
            {phase === "revealed" && stamp && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center">
                {stamp.plata ? (
                  <p className="text-sm font-semibold" style={{ color: C.plataDeep }}>
                    🎉 ¡Estampa de plata! <span className="underline underline-offset-2">Ganaste un premio</span> — te lo entregamos en la boda.
                  </p>
                ) : (
                  <p className="text-sm" style={{ color: C.mid }}>
                    ¡Te tocó <strong>{stamp.name}</strong>! {album[stamp.id] > 1 ? "(repetida)" : "Nueva para tu álbum. 💜"}
                  </p>
                )}
                <button
                  onClick={next}
                  className="mt-4 rounded-full px-7 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-transform active:scale-95"
                  style={{ background: C.lilaDeep, fontFamily: "var(--font-deco)" }}
                >
                  {remaining > 0 ? "Abrir otro sobre" : "Ver mi álbum"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* álbum */}
        <div className="mt-10">
          <BlurFade>
            <p className="mb-1 text-center text-[10px] font-semibold uppercase tracking-[0.4em]" style={{ color: C.lilaDeep }}>
              Tu álbum
            </p>
            <p className="mb-4 text-center text-[11px]" style={{ color: C.faint }}>
              {colectadas} de {STAMPS.length} estampas
            </p>
          </BlurFade>
          <div className="grid grid-cols-5 gap-2">
            {STAMPS.map((s) => {
              const got = !!album[s.id];
              return (
                <div
                  key={s.id}
                  className="flex aspect-square flex-col items-center justify-center rounded-lg border text-center transition-colors"
                  style={{
                    borderColor: got ? (s.plata ? C.plataDeep : C.lilaDeep) : C.line,
                    background: got ? (s.plata ? SILVER_GRAD : C.paper2) : C.paper,
                    opacity: got ? 1 : 0.55,
                  }}
                  title={got ? s.name : `Estampa Nº ${s.id}`}
                >
                  <span className="text-lg leading-none">{got ? s.emoji : "·"}</span>
                  <span className="mt-1 text-[8px] font-semibold" style={{ color: got ? C.ink : C.faint }}>{s.id}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* controles de demo */}
        <div className="mt-8 flex items-center justify-center gap-5 text-[11px]" style={{ color: C.faint }}>
          <label className="flex cursor-pointer items-center gap-1.5">
            <input type="checkbox" checked={forcePlata} onChange={(e) => setForcePlata(e.target.checked)} className="h-3.5 w-3.5 accent-[#8e8aa6]" />
            Forzar plata (demo)
          </label>
          <button onClick={resetDay} className="underline underline-offset-2">Reiniciar día (demo)</button>
        </div>
      </section>

      {/* ── el resto de la invitación, insinuado ── */}
      <div className="pb-14 pt-4 text-center">
        <FloralDivider className="mx-auto mb-6" color={C.lilaDeep} soft={C.lila} />
        <p className="text-[10px] uppercase tracking-[0.4em]" style={{ color: C.faint }}>
          ··· Mesa de regalos · ¿Nos acompañas? (RSVP)
        </p>
        <p className="mt-4 text-[10px]" style={{ color: C.faint }}>
          Demo de integración — en la versión real esta sección vive dentro de <span className="underline">/i/[slug]</span> y usa la API de estampas.
        </p>
      </div>
    </main>
  );
}
