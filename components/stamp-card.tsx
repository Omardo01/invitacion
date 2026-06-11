import Image from "next/image";

/**
 * Diseños DEFINITIVOS de las estampas (elegidos de los pre-diseños de /estampa):
 *  - "clasica"   → marco doble con ventana de arco (opción 1)
 *  - "mundial"   → álbum retro con foto a sangre y banda inferior (opción 2)
 *  - "editorial" → foto completa con marco fino y pie en itálica (opción 5);
 *                  su versión plata lleva el shimmer de lujo en el borde
 *
 * Toda la app (pre-diseños, /opcion y la invitación real) debe renderizar las
 * estampas con este componente para que la forma quede congelada en un solo lugar.
 */

export type StampStyle = "clasica" | "mundial" | "editorial";

export type StampCardData = {
  num: number;
  name: string;
  plata?: boolean;
  emoji?: string;            // respaldo mientras no haya imagen
  image?: string | null;     // /estampas/01.png cuando existan
};

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

/* brillo metálico que recorre la carta (keyframe wax-shine de globals.css) */
function Shine() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-[inherit]">
      <div
        className="absolute inset-y-0 w-1/4"
        style={{ background: "linear-gradient(105deg, transparent, rgba(255,255,255,0.55), transparent)", animation: "wax-shine 2.4s ease-in-out infinite" }}
      />
    </div>
  );
}

/* la imagen de la estampa, o el emoji de respaldo */
function Art({ stamp, sizes, emojiSize = "text-6xl" }: { stamp: StampCardData; sizes: string; emojiSize?: string }) {
  if (stamp.image) {
    return (
      <Image
        src={stamp.image}
        alt={stamp.name}
        fill
        sizes={sizes}
        className="select-none object-cover"
        style={{ objectPosition: "50% 38%" }}
      />
    );
  }
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: `linear-gradient(160deg, ${C.paper2}, #e3d8f2)` }}
    >
      <span className={emojiSize}>{stamp.emoji ?? "✦"}</span>
    </div>
  );
}

type Props = {
  stamp: StampCardData;
  variant: StampStyle;
  accent?: string;   // tono de la paleta; por defecto lila profundo
  total?: number;    // tamaño de la colección (para el "Nº x/total")
};

export function StampCard({ stamp, variant, accent = C.lilaDeep, total = 20 }: Props) {
  if (variant === "mundial") return <Mundial stamp={stamp} accent={accent} total={total} />;
  if (variant === "editorial") return <Editorial stamp={stamp} accent={accent} total={total} />;
  return <Clasica stamp={stamp} accent={accent} total={total} />;
}

type VariantProps = { stamp: StampCardData; accent: string; total: number };

/* ─── Tipo 1 · Clásica (ventana de arco) ─── */
function Clasica({ stamp, accent, total }: VariantProps) {
  const plata = !!stamp.plata;
  const frame = plata ? C.plataDeep : accent;
  return (
    <div
      className="relative h-[340px] w-[240px] overflow-hidden rounded-xl border-2 p-3"
      style={{
        background: plata ? SILVER_GRAD : `linear-gradient(160deg, ${C.paper} 0%, ${C.paper2} 100%)`,
        borderColor: frame,
        boxShadow: plata ? "0 14px 40px rgba(142,138,166,0.5)" : "0 14px 36px rgba(53,44,78,0.16)",
      }}
    >
      {plata && <Shine />}
      <div className="flex h-full w-full flex-col items-center rounded-lg border px-3 py-4" style={{ borderColor: frame }}>
        <div className="flex w-full items-center justify-between">
          <span
            className="rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider text-white"
            style={{ background: frame, fontFamily: "var(--font-deco)" }}
          >
            Nº {stamp.num}/{total}
          </span>
          {plata ? <span className="text-base">🏆</span> : <span style={{ color: frame }}>✦</span>}
        </div>

        <div
          className="relative mt-3 h-44 w-32 overflow-hidden border-2"
          style={{ borderColor: frame, borderRadius: "999px 999px 14px 14px", background: C.bg }}
        >
          <Art stamp={stamp} sizes="128px" emojiSize="text-5xl" />
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
  );
}

/* ─── Tipo 2 · Álbum Mundial (retro, banda inferior) ─── */
function Mundial({ stamp, accent, total }: VariantProps) {
  const plata = !!stamp.plata;
  const edge = plata ? C.plataDeep : accent;
  return (
    <div
      className="relative h-[340px] w-[240px] overflow-hidden rounded-xl"
      style={{
        border: `7px solid ${edge}`,
        boxShadow: plata ? "0 14px 40px rgba(142,138,166,0.5)" : "0 14px 36px rgba(53,44,78,0.22)",
        background: C.ink,
      }}
    >
      <div className="absolute inset-0">
        <Art stamp={stamp} sizes="240px" emojiSize="text-8xl" />
      </div>

      {/* trama de puntos retro */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-25"
        style={{ backgroundImage: "radial-gradient(rgba(0,0,0,0.55) 1px, transparent 1.4px)", backgroundSize: "5px 5px" }}
      />
      {plata && <Shine />}

      {/* medalla con el número */}
      <div
        className="absolute left-2.5 top-2.5 z-10 flex h-12 w-12 flex-col items-center justify-center rounded-full border-2 border-white"
        style={{ background: plata ? SILVER_GRAD : edge, boxShadow: "0 4px 12px rgba(0,0,0,0.35)" }}
      >
        <span className="text-[8px] font-bold leading-none" style={{ color: plata ? C.ink : "#fff", fontFamily: "var(--font-deco)" }}>Nº</span>
        <span className="text-base font-black leading-none" style={{ color: plata ? C.ink : "#fff", fontFamily: "var(--font-deco)" }}>{stamp.num}</span>
      </div>

      {plata && (
        <span
          className="absolute right-2.5 top-2.5 z-10 rounded-full border border-white/70 px-2 py-1 text-[9px] font-bold tracking-widest"
          style={{ background: "rgba(53,44,78,0.55)", color: "#fff", fontFamily: "var(--font-deco)" }}
        >
          ✦ PLATA
        </span>
      )}

      {/* banda inferior */}
      <div className="absolute inset-x-0 bottom-0 z-10 px-3 py-2.5" style={{ background: plata ? SILVER_GRAD : edge }}>
        <p
          className="truncate text-center text-sm font-bold uppercase tracking-[0.18em]"
          style={{ color: plata ? C.ink : "#fff", fontFamily: "var(--font-deco)" }}
        >
          {stamp.name}
        </p>
        <div className="mt-0.5 flex items-center justify-between text-[8px] font-semibold tracking-[0.2em]" style={{ color: plata ? C.mid : "rgba(255,255,255,0.85)" }}>
          <span>COLECCIÓN G&Z</span>
          <span>25.07.26</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Tipo 3 · Editorial (foto completa; plata con shimmer de lujo) ─── */
function Editorial({ stamp, total }: VariantProps) {
  const plata = !!stamp.plata;
  return (
    <div
      className="relative h-[340px] w-[240px] overflow-hidden rounded-xl"
      style={{
        padding: plata ? 3 : 0,
        background: plata ? C.plataDeep : C.ink,
        boxShadow: plata
          ? "0 14px 40px rgba(142,138,166,0.55), 0 0 24px rgba(196,192,214,0.45)"
          : "0 14px 36px rgba(53,44,78,0.28)",
      }}
    >
      {/* shimmer de lujo: anillo de luz girando en el borde */}
      {plata && (
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 h-[460px] w-[460px]"
          style={{
            background: `conic-gradient(from 0deg, ${C.plataDeep} 0deg, #ffffff 30deg, ${C.plata} 70deg, ${C.plataDeep} 140deg, #f4f4fa 185deg, ${C.plataDeep} 230deg, #ffffff 300deg, ${C.plataDeep} 360deg)`,
            transform: "translate(-50%, -50%)",
            animation: "border-spin 3.2s linear infinite",
          }}
        />
      )}

      <div className="relative h-full w-full overflow-hidden" style={{ borderRadius: plata ? 9 : 12, background: C.ink }}>
        <div className="absolute inset-0">
          <Art stamp={stamp} sizes="240px" emojiSize="text-8xl" />
        </div>

        {/* velo inferior para legibilidad */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(43,35,68,0.12) 0%, rgba(43,35,68,0) 30%, rgba(43,35,68,0) 45%, rgba(43,35,68,0.78) 100%)" }}
        />
        {plata && <Shine />}

        {/* marco fino interior */}
        <div aria-hidden className="pointer-events-none absolute inset-2 z-10 rounded-lg border" style={{ borderColor: plata ? "rgba(244,244,250,0.85)" : "rgba(255,255,255,0.65)" }} />

        <span
          className="absolute left-4 top-4 z-10 rounded-full border px-2.5 py-1 text-[9px] font-bold tracking-[0.2em] text-white backdrop-blur-sm"
          style={{ background: "rgba(53,44,78,0.35)", borderColor: "rgba(255,255,255,0.55)", fontFamily: "var(--font-deco)" }}
        >
          Nº {stamp.num}/{total}
        </span>
        {plata && (
          <span
            className="absolute right-4 top-4 z-10 rounded-full px-2.5 py-1 text-[9px] font-bold tracking-widest"
            style={{ background: SILVER_GRAD, color: C.ink, fontFamily: "var(--font-deco)" }}
          >
            ✦ PLATA
          </span>
        )}

        {/* pie editorial */}
        <div className="absolute inset-x-0 bottom-0 z-10 px-5 pb-5 text-center">
          <p className="mx-auto max-w-full truncate text-2xl italic text-white" style={{ fontFamily: "var(--font-display)" }}>
            {stamp.name}
          </p>
          <div aria-hidden className="mx-auto mt-2 h-px w-12" style={{ background: "rgba(255,255,255,0.6)" }} />
          <p className="mt-2 text-[8px] font-semibold tracking-[0.35em]" style={{ fontFamily: "var(--font-deco)", color: "rgba(255,255,255,0.85)" }}>
            {plata ? "ESTAMPA DE PLATA" : "G & Z · 25.07.2026"}
          </p>
        </div>
      </div>
    </div>
  );
}
