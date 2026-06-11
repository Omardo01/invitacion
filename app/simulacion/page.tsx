"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";

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

/* ─── colección: 20 estampas, 3 de plata (premiadas) ─── */
type Sticker = {
  id: number;
  name: string;
  emoji: string;
  plata?: boolean;
};

const STICKERS: Sticker[] = [
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

const PLATA_IDS = STICKERS.filter((s) => s.plata).map((s) => s.id);

function drawSticker(forcePlata: boolean): Sticker {
  if (forcePlata) {
    const id = PLATA_IDS[Math.floor(Math.random() * PLATA_IDS.length)];
    return STICKERS.find((s) => s.id === id)!;
  }
  return STICKERS[Math.floor(Math.random() * STICKERS.length)];
}

function fireConfetti(plata: boolean) {
  if (plata) {
    const silver = ["#ffffff", "#e8e8f0", "#c4c0d6", "#8e8aa6", "#f4f4fa"];
    /* estallido central de estrellas + lluvia */
    confetti({ particleCount: 60, spread: 360, startVelocity: 28, gravity: 0.5, decay: 0.93, ticks: 110, shapes: ["star"], scalar: 1.3, colors: silver, origin: { y: 0.45 } });
    confetti({ particleCount: 160, spread: 110, origin: { y: 0.55 }, colors: silver });
    /* cañones laterales escalonados */
    setTimeout(() => confetti({ particleCount: 70, angle: 60, spread: 65, startVelocity: 55, origin: { x: 0, y: 0.65 }, colors: silver }), 250);
    setTimeout(() => confetti({ particleCount: 70, angle: 120, spread: 65, startVelocity: 55, origin: { x: 1, y: 0.65 }, colors: silver }), 420);
    /* estrellas grandes flotando al final */
    setTimeout(() => confetti({ particleCount: 35, spread: 360, startVelocity: 18, gravity: 0.35, decay: 0.94, ticks: 130, shapes: ["star"], scalar: 1.7, colors: ["#ffffff", "#e8e8f0"], origin: { y: 0.4 } }), 650);
  } else {
    confetti({ particleCount: 70, spread: 75, origin: { y: 0.55 }, colors: ["#b89ad6", "#8a6cb8", "#e8e2f3", "#ffffff"] });
  }
}

/* serrado tipo sobre de estampas (panini) en los bordes laterales */
const serration = (side: "left" | "right") => ({
  position: "absolute" as const,
  top: 0,
  bottom: 0,
  [side]: -5,
  width: 10,
  backgroundImage: `radial-gradient(circle at ${side === "left" ? "0" : "10px"} 6px, transparent 5px, ${C.lilaDeep} 5.5px)`,
  backgroundSize: "10px 12px",
  backgroundRepeat: "repeat-y",
});

/* ─── tira de rasgado: se desliza a la derecha para abrir ─── */
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
      className="absolute inset-x-0 top-0 z-10 flex h-14 cursor-grab touch-none select-none items-center justify-between px-4 active:cursor-grabbing"
      style={{
        background: `linear-gradient(180deg, ${C.lilaDeep}, #7a5da8)`,
        borderBottom: `2px dashed rgba(255,255,255,0.55)`,
        borderRadius: "14px 14px 0 0",
      }}
    >
      <span className="text-sm text-white/90">✂️</span>
      <span className="text-[10px] font-semibold tracking-[0.25em] text-white/90" style={{ fontFamily: "var(--font-deco)" }}>
        DESLIZA PARA ABRIR
      </span>
      <motion.span
        className="text-white/80"
        animate={{ x: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
      >
        ››
      </motion.span>
    </motion.div>
  );
}

/* ─── el sobre cerrado ─── */
function Pack({ onTear, torn }: { onTear: () => void; torn: boolean }) {
  return (
    <motion.div
      key="pack"
      initial={{ y: 24, opacity: 0, scale: 0.95 }}
      animate={
        torn
          ? { y: 110, opacity: 0, scale: 0.88, transition: { delay: 0.25, duration: 0.5 } }
          : { y: [0, -8, 0], opacity: 1, scale: 1, transition: { y: { repeat: Infinity, duration: 3.2, ease: "easeInOut" }, opacity: { duration: 0.5 }, scale: { duration: 0.5 } } }
      }
      className="relative h-[370px] w-[272px]"
      style={{ filter: `drop-shadow(0 22px 40px rgba(138,108,184,0.35))` }}
    >
      <div
        className="relative h-full w-full overflow-visible rounded-2xl"
        style={{
          background: `linear-gradient(160deg, ${C.lilaDeep} 0%, ${C.lila} 55%, #cdb6e4 100%)`,
        }}
      >
        <div style={serration("left")} aria-hidden />
        <div style={serration("right")} aria-hidden />

        {/* patrón de puntitos */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-2xl opacity-25"
          style={{ backgroundImage: `radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1.5px)`, backgroundSize: "16px 16px" }}
        />

        {/* brillo que recorre el sobre */}
        <div aria-hidden className="absolute inset-0 overflow-hidden rounded-2xl">
          <div
            className="absolute inset-y-0 w-1/3"
            style={{
              background: "linear-gradient(105deg, transparent, rgba(255,255,255,0.35), transparent)",
              animation: "wax-shine 2.8s ease-in-out infinite",
            }}
          />
        </div>

        <AnimatePresence>{!torn && <TearStrip onTear={onTear} />}</AnimatePresence>

        {/* contenido del sobre */}
        <div className="absolute inset-x-0 bottom-0 top-14 flex flex-col items-center justify-center gap-3 px-6 text-center">
          <div
            className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-white/70 bg-white/15"
            style={{ boxShadow: "inset 0 0 22px rgba(255,255,255,0.25)" }}
          >
            <span className="text-4xl text-white" style={{ fontFamily: "var(--font-script)" }}>
              G<span className="mx-0.5 text-2xl">♥</span>Z
            </span>
          </div>
          <p className="text-[11px] font-semibold tracking-[0.35em] text-white" style={{ fontFamily: "var(--font-deco)" }}>
            SOBRE OFICIAL
          </p>
          <p className="text-[10px] tracking-[0.25em] text-white/85" style={{ fontFamily: "var(--font-deco)" }}>
            BODA · 25.07.2026
          </p>
          <div className="mt-2 rounded-full border border-white/50 px-4 py-1.5">
            <p className="text-[10px] tracking-[0.2em] text-white/95">1 ESTAMPA POR SOBRE</p>
          </div>
          <p className="mt-1 text-[10px] text-white/75">Colección de 20 · 3 son de plata 🏆</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── la estampa revelada (carta con flip) ─── */

/* posiciones fijas de los destellos ✦ alrededor de la carta de plata */
const SPARKLES = [
  { x: "-8%", y: "8%", d: 0, s: 18 },
  { x: "94%", y: "14%", d: 0.35, s: 14 },
  { x: "104%", y: "55%", d: 0.7, s: 20 },
  { x: "-12%", y: "62%", d: 1.05, s: 13 },
  { x: "8%", y: "96%", d: 0.5, s: 16 },
  { x: "88%", y: "92%", d: 0.9, s: 15 },
  { x: "48%", y: "-10%", d: 0.2, s: 22 },
  { x: "28%", y: "104%", d: 1.2, s: 12 },
];

function StickerCard({ sticker, onRevealed }: { sticker: Sticker; onRevealed: () => void }) {
  const plata = !!sticker.plata;
  /* la plata se hace esperar: aura + temblor antes del flip */
  const flipDelay = plata ? 1.8 : 1.0;
  const flipDur = plata ? 1.1 : 0.9;
  const revealAt = flipDelay + flipDur;
  const frontBg = plata
    ? "linear-gradient(135deg, #f4f4fa 0%, #c4c0d6 30%, #ffffff 50%, #b0accc 70%, #e8e8f0 100%)"
    : `linear-gradient(160deg, ${C.paper} 0%, ${C.paper2} 100%)`;

  return (
    <motion.div
      key="sticker"
      initial={{ y: 130, scale: 0.55, opacity: 0 }}
      animate={{ y: 0, scale: 1, opacity: 1 }}
      transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative h-[340px] w-[240px]"
      style={{ perspective: 1100 }}
    >
      {plata && (
        <>
          {/* viñeta que oscurece el fondo durante el suspenso */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -inset-40 z-0 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(53,44,78,0.5), rgba(53,44,78,0.25) 55%, transparent 75%)", filter: "blur(8px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0.9, 0] }}
            transition={{ delay: 0.8, duration: revealAt - 0.4, times: [0, 0.25, 0.8, 1] }}
          />
          {/* aura plateada que crece antes del flip */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -inset-12 z-0 rounded-full"
            style={{ background: "radial-gradient(circle, rgba(255,255,255,0.95), rgba(196,192,214,0.55) 45%, transparent 72%)", filter: "blur(16px)" }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.55, 0.4, 1], scale: [0.5, 0.95, 0.85, 1.2] }}
            transition={{ delay: 0.9, duration: flipDelay - 0.6, times: [0, 0.4, 0.65, 1] }}
          />
          {/* rayos plateados girando tras la revelación */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -inset-20 z-0"
            style={{
              background: "repeating-conic-gradient(from 0deg, transparent 0deg 13deg, rgba(196,192,214,0.4) 13deg 18deg)",
              maskImage: "radial-gradient(circle, black 25%, transparent 68%)",
              WebkitMaskImage: "radial-gradient(circle, black 25%, transparent 68%)",
            }}
            initial={{ opacity: 0, rotate: 0 }}
            animate={{ opacity: 0.85, rotate: 360 }}
            transition={{
              opacity: { delay: revealAt - 0.1, duration: 0.6 },
              rotate: { repeat: Infinity, duration: 16, ease: "linear" },
            }}
          />
        </>
      )}

      {/* temblor de suspenso (solo plata) antes del flip */}
      <motion.div
        className="relative z-10 h-full w-full"
        animate={plata ? { x: [0, -3, 3, -5, 5, -6, 6, -3, 3, 0], rotate: [0, -1, 1, -1.5, 1.5, -1, 1, 0] } : undefined}
        transition={plata ? { delay: 1.05, duration: 0.7, ease: "easeInOut" } : undefined}
      >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        initial={{ rotateY: 0 }}
        animate={{ rotateY: 180 }}
        transition={{ delay: flipDelay, duration: flipDur, ease: [0.45, 0, 0.2, 1] }}
        onAnimationComplete={onRevealed}
      >
        {/* reverso (se ve primero) */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl border-2"
          style={{
            backfaceVisibility: "hidden",
            background: `linear-gradient(160deg, ${C.lilaDeep}, ${C.lila})`,
            borderColor: "rgba(255,255,255,0.55)",
            boxShadow: "0 18px 45px rgba(53,44,78,0.3)",
          }}
        >
          <span className="text-5xl text-white/90" style={{ fontFamily: "var(--font-script)" }}>
            G♥Z
          </span>
          <span className="text-3xl text-white/70">?</span>
        </div>

        {/* frente */}
        <div
          className="absolute inset-0 overflow-hidden rounded-xl border-2 p-3"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: frontBg,
            borderColor: plata ? C.plataDeep : C.line,
            boxShadow: plata ? "0 18px 50px rgba(142,138,166,0.55)" : "0 18px 45px rgba(53,44,78,0.18)",
          }}
        >
          {/* destello para las de plata */}
          {plata && (
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
              <div
                className="absolute inset-y-0 w-1/3"
                style={{
                  background: "linear-gradient(105deg, transparent, rgba(255,255,255,0.85), transparent)",
                  animation: "wax-shine 2.2s ease-in-out infinite",
                }}
              />
            </div>
          )}

          <div
            className="flex h-full w-full flex-col items-center rounded-lg border px-4 py-5"
            style={{ borderColor: plata ? C.plataDeep : C.lila }}
          >
            <div className="flex w-full items-center justify-between">
              <span
                className="rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider text-white"
                style={{ background: plata ? C.plataDeep : C.lilaDeep, fontFamily: "var(--font-deco)" }}
              >
                Nº {sticker.id}/20
              </span>
              {plata && <span className="text-base">🏆</span>}
            </div>

            <div
              className="mt-5 flex h-28 w-28 items-center justify-center rounded-full border-2"
              style={{
                borderColor: plata ? C.plataDeep : C.lila,
                background: plata ? "rgba(255,255,255,0.7)" : C.bg,
              }}
            >
              <span className="text-6xl">{sticker.emoji}</span>
            </div>

            <h2 className="mt-5 text-center text-xl" style={{ fontFamily: "var(--font-display)", color: C.ink }}>
              {sticker.name}
            </h2>

            <p
              className="mt-1 text-[10px] font-semibold tracking-[0.3em]"
              style={{ fontFamily: "var(--font-deco)", color: plata ? C.plataDeep : C.faint }}
            >
              {plata ? "ESTAMPA DE PLATA" : "ESTAMPA DE COLECCIÓN"}
            </p>

            <div className="mt-auto pt-3 text-center">
              <p className="text-[9px] tracking-[0.25em]" style={{ color: C.faint, fontFamily: "var(--font-deco)" }}>
                G & Z · 25.07.2026
              </p>
            </div>
          </div>
        </div>
      </motion.div>
      </motion.div>

      {plata && (
        <>
          {/* flash blanco a media vuelta */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -inset-24 z-20 rounded-full"
            style={{ background: "radial-gradient(circle, #ffffff, rgba(255,255,255,0.6) 40%, transparent 70%)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ delay: flipDelay + flipDur * 0.45, duration: 0.65, times: [0, 0.3, 1] }}
          />
          {/* onda expansiva al revelar */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 m-auto h-44 w-44 rounded-full border-4"
            style={{ borderColor: "rgba(255,255,255,0.9)", boxShadow: "0 0 30px rgba(196,192,214,0.8)" }}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: [0, 0.9, 0], scale: [0.4, 2.4, 3] }}
            transition={{ delay: revealAt - 0.15, duration: 0.9, ease: "easeOut" }}
          />
          {/* destellos ✦ flotando alrededor */}
          {SPARKLES.map((p, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="pointer-events-none absolute z-20 select-none"
              style={{ left: p.x, top: p.y, fontSize: p.s, color: "#ffffff", textShadow: "0 0 10px rgba(196,192,214,1), 0 0 22px rgba(142,138,166,0.8)" }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0], y: [0, -16] }}
              transition={{ delay: revealAt + p.d, duration: 1.8, repeat: Infinity, repeatDelay: 1.1, ease: "easeInOut" }}
            >
              ✦
            </motion.span>
          ))}
        </>
      )}
    </motion.div>
  );
}

/* ─── página de simulación ─── */
type Phase = "idle" | "opening" | "revealed";

export default function SimulacionPage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [sticker, setSticker] = useState<Sticker | null>(null);
  const [album, setAlbum] = useState<Record<number, number>>({}); // id -> veces obtenida
  const [opened, setOpened] = useState(0);
  const [round, setRound] = useState(0); // cambia solo al rasgar: mantiene estable la key de la carta
  const [forcePlata, setForcePlata] = useState(false);

  const handleTear = useCallback(() => {
    setSticker(drawSticker(forcePlata));
    setRound((r) => r + 1);
    setPhase("opening");
  }, [forcePlata]);

  const handleRevealed = useCallback(() => {
    if (phase !== "opening" || !sticker) return;
    setPhase("revealed");
    fireConfetti(!!sticker.plata);
    setAlbum((prev) => ({ ...prev, [sticker.id]: (prev[sticker.id] ?? 0) + 1 }));
    setOpened((n) => n + 1);
  }, [phase, sticker]);

  const reset = useCallback(() => {
    setSticker(null);
    setPhase("idle");
  }, []);

  const platasObtenidas = PLATA_IDS.filter((id) => album[id]).length;

  return (
    <main className="min-h-dvh px-4 py-8" style={{ background: C.bg, color: C.ink }}>
      <div className="mx-auto flex w-full max-w-md flex-col items-center">
        {/* encabezado */}
        <p className="text-[10px] font-semibold tracking-[0.4em]" style={{ fontFamily: "var(--font-deco)", color: C.faint }}>
          SIMULACIÓN · UI
        </p>
        <h1 className="mt-2 text-center text-3xl" style={{ fontFamily: "var(--font-display)" }}>
          Sobre de Estampas
        </h1>
        <p className="mt-2 max-w-xs text-center text-sm" style={{ color: C.mid }}>
          La primera vez que un invitado abra su invitación, rasgará un sobre y recibirá{" "}
          <strong>1 de 20 estampas</strong>. Quien saque una de las <strong>3 de plata</strong>, gana premio. 🏆
        </p>

        {/* escenario */}
        <div className="relative mt-6 flex h-[440px] w-full items-center justify-center">
          <AnimatePresence mode="popLayout">
            {phase === "idle" && <Pack key="pack" onTear={handleTear} torn={false} />}
            {phase !== "idle" && sticker && (
              <StickerCard key={`sticker-${round}`} sticker={sticker} onRevealed={handleRevealed} />
            )}
          </AnimatePresence>
        </div>

        {/* mensaje de resultado */}
        <div className="flex h-16 items-center justify-center">
          <AnimatePresence>
            {phase === "revealed" && sticker && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                {sticker.plata ? (
                  <p className="text-sm font-semibold" style={{ color: C.plataDeep }}>
                    🎉 ¡Estampa de plata! Este invitado <span className="underline underline-offset-2">gana premio</span>.
                  </p>
                ) : (
                  <p className="text-sm" style={{ color: C.mid }}>
                    ¡Te tocó <strong>{sticker.name}</strong>! Guárdala en tu colección. 💜
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* controles */}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          {phase === "revealed" && (
            <button
              onClick={reset}
              className="rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-transform active:scale-95"
              style={{ background: C.lilaDeep, fontFamily: "var(--font-deco)", letterSpacing: "0.1em" }}
            >
              ABRIR OTRO SOBRE
            </button>
          )}
          <label className="flex cursor-pointer items-center gap-2 text-xs" style={{ color: C.mid }}>
            <input
              type="checkbox"
              checked={forcePlata}
              onChange={(e) => setForcePlata(e.target.checked)}
              className="h-4 w-4 accent-[#8e8aa6]"
            />
            Forzar plata (demo)
          </label>
        </div>

        {/* estadísticas */}
        <div
          className="mt-8 flex w-full items-center justify-around rounded-2xl border px-4 py-3"
          style={{ borderColor: C.line, background: C.paper }}
        >
          <div className="text-center">
            <p className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{opened}</p>
            <p className="text-[10px] tracking-widest" style={{ color: C.faint }}>SOBRES ABIERTOS</p>
          </div>
          <div className="h-8 w-px" style={{ background: C.line }} />
          <div className="text-center">
            <p className="text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: C.plataDeep }}>
              {platasObtenidas}/3
            </p>
            <p className="text-[10px] tracking-widest" style={{ color: C.faint }}>PLATAS VISTAS</p>
          </div>
          <div className="h-8 w-px" style={{ background: C.line }} />
          <div className="text-center">
            <p className="text-xl font-bold" style={{ fontFamily: "var(--font-display)", color: C.lilaDeep }}>
              {Object.keys(album).length}/20
            </p>
            <p className="text-[10px] tracking-widest" style={{ color: C.faint }}>COLECCIÓN</p>
          </div>
        </div>

        {/* álbum */}
        <div className="mt-6 w-full">
          <p className="mb-3 text-center text-[10px] font-semibold tracking-[0.35em]" style={{ fontFamily: "var(--font-deco)", color: C.faint }}>
            ÁLBUM DE LA COLECCIÓN
          </p>
          <div className="grid grid-cols-5 gap-2">
            {STICKERS.map((s) => {
              const got = !!album[s.id];
              return (
                <div
                  key={s.id}
                  className="flex aspect-square flex-col items-center justify-center rounded-lg border text-center transition-colors"
                  style={{
                    borderColor: got ? (s.plata ? C.plataDeep : C.lilaDeep) : C.line,
                    background: got
                      ? s.plata
                        ? "linear-gradient(135deg, #f4f4fa, #c4c0d6)"
                        : C.paper2
                      : C.paper,
                    opacity: got ? 1 : 0.55,
                  }}
                  title={got ? s.name : `Estampa Nº ${s.id}`}
                >
                  <span className="text-lg leading-none">{got ? s.emoji : "·"}</span>
                  <span className="mt-1 text-[8px] font-semibold" style={{ color: got ? C.ink : C.faint }}>
                    {s.id}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-center text-[10px]" style={{ color: C.faint }}>
            En la versión real, cada invitado recibe su estampa una sola vez (asignada desde el servidor).
          </p>
        </div>
      </div>
    </main>
  );
}
