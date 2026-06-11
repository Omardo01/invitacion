"use client";

import { useState } from "react";
import { FloralCorner } from "@/components/floral";

/* ─── misma paleta que la invitación definitiva (opción 33) ─── */
const C = {
  bg: "#faf8fd",
  paper: "#ffffff",
  paper2: "#f1ecf9",
  ink: "#352c4e",
  inkDeep: "#2b2344",
  mid: "#6c628a",
  faint: "#a79ec0",
  line: "#e8e2f3",
  lila: "#b89ad6",
  lilaDeep: "#8a6cb8",
  plata: "#c4c0d6",
  plataDeep: "#8e8aa6",
};

/* solo tonos de la paleta de la invitación */
const ACCENTS = [
  { name: "Lila profundo", hex: "#8a6cb8" },
  { name: "Lila claro", hex: "#b89ad6" },
  { name: "Tinta", hex: "#352c4e" },
];

type Design = {
  guest: string;
  accent: string;
};

/* brillo que recorre la superficie (reusa el keyframe wax-shine de globals) */
function Shine({ opacity = 0.35 }: { opacity?: number }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-[inherit]">
      <div
        className="absolute inset-y-0 w-1/3"
        style={{ background: `linear-gradient(105deg, transparent, rgba(255,255,255,${opacity}), transparent)`, animation: "wax-shine 2.8s ease-in-out infinite" }}
      />
    </div>
  );
}

/* ─── Sobre 1 · Arco (marfil elegante con ventana esmerilada) ─── */
function SobreArco({ d }: { d: Design }) {
  const tint = d.accent;
  return (
    <div
      className="relative h-[370px] w-[272px] rounded-xl border p-[7px]"
      style={{ background: "#fffefb", borderColor: "#e7e1d4", boxShadow: "0 18px 40px rgba(53,44,78,0.14)" }}
    >
      <div className="flex h-full w-full flex-col items-center border px-5 pb-4 pt-4" style={{ borderColor: "#e7e1d4" }}>
        {/* línea de apertura */}
        <div className="flex w-full items-center justify-center gap-2 border-b border-dashed pb-2.5" style={{ borderColor: C.lila }}>
          <span className="text-[9px]" style={{ color: C.mid }}>✂</span>
          <span className="text-[8px] font-semibold tracking-[0.4em]" style={{ fontFamily: "var(--font-deco)", color: C.mid }}>
            DESLIZA PARA ABRIR
          </span>
        </div>

        <p className="mt-3 text-2xl" style={{ fontFamily: "var(--font-script)", color: tint }}>
          G <span className="text-base">♥</span> Z
        </p>

        {/* ventana esmerilada: la estampa misteriosa asoma */}
        <div
          className="relative mt-2 h-40 w-28 overflow-hidden border"
          style={{ borderColor: tint, borderRadius: "999px 999px 14px 14px", background: `linear-gradient(160deg, ${C.paper2}, #ffffff)` }}
        >
          <div aria-hidden className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 45%, color-mix(in srgb, ${tint} 22%, transparent), transparent 70%)` }} />
          <span
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl"
            style={{ color: tint, textShadow: `0 0 18px color-mix(in srgb, ${tint} 55%, transparent)`, fontFamily: "var(--font-display)" }}
          >
            ?
          </span>
          <Shine opacity={0.5} />
        </div>

        <p className="mt-3 text-[9px] font-semibold tracking-[0.35em]" style={{ fontFamily: "var(--font-deco)", color: C.mid }}>
          COLECCIÓN DE ESTAMPAS
        </p>
        <p className="max-w-full truncate text-xl leading-tight" style={{ fontFamily: "var(--font-script)", color: C.ink }}>
          Para {d.guest || "ti"}
        </p>

        <div className="mt-auto rounded-full border px-3 py-1.5" style={{ borderColor: tint, background: "#ffffff" }}>
          <p className="whitespace-nowrap text-[8px] font-semibold tracking-[0.18em]" style={{ color: `color-mix(in srgb, ${tint} 65%, ${C.ink})` }}>
            1 ESTAMPA SORPRESA · 3 DE PLATA ✦
          </p>
        </div>
        <p className="pt-2 text-[9px] tracking-[0.3em]" style={{ fontFamily: "var(--font-deco)", color: "#9a917f" }}>
          BODA · 25.07.2026
        </p>
      </div>
    </div>
  );
}

/* ─── Sobre 2 · Noche de gala (oscuro con shimmer de lujo en el borde) ─── */
const GALA_STARS = [
  { x: "12%", y: "12%", s: 9 },
  { x: "86%", y: "16%", s: 7 },
  { x: "8%", y: "44%", s: 7 },
  { x: "90%", y: "40%", s: 9 },
  { x: "14%", y: "76%", s: 8 },
  { x: "84%", y: "72%", s: 7 },
];

function SobreGala({ d }: { d: Design }) {
  return (
    <div
      className="relative h-[370px] w-[272px] overflow-hidden rounded-xl"
      style={{ padding: 3, background: C.plataDeep, boxShadow: "0 18px 44px rgba(43,35,68,0.5), 0 0 26px rgba(196,192,214,0.4)" }}
    >
      {/* shimmer de lujo girando en el borde */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[500px] w-[500px]"
        style={{
          background: `conic-gradient(from 0deg, ${C.plataDeep} 0deg, #ffffff 30deg, ${C.plata} 70deg, ${C.plataDeep} 140deg, #f4f4fa 185deg, ${C.plataDeep} 230deg, #ffffff 300deg, ${C.plataDeep} 360deg)`,
          transform: "translate(-50%, -50%)",
          animation: "border-spin 3.2s linear infinite",
        }}
      />

      <div
        className="relative flex h-full w-full flex-col items-center overflow-hidden px-6 pb-5 pt-7 text-center"
        style={{ borderRadius: 9, background: "radial-gradient(circle at 50% 16%, #463a6b, #2b2344 68%)" }}
      >
        {GALA_STARS.map((s, i) => (
          <span key={i} aria-hidden className="absolute select-none" style={{ left: s.x, top: s.y, fontSize: s.s, color: C.plata, opacity: 0.7 }}>
            ✦
          </span>
        ))}
        <Shine opacity={0.16} />

        <p className="text-5xl leading-none" style={{ fontFamily: "var(--font-script)", color: C.plata }}>
          G & Z
        </p>
        <div className="mt-3 flex items-center gap-2" style={{ color: C.plataDeep }}>
          <div className="h-px w-10" style={{ background: "rgba(196,192,214,0.5)" }} />
          <span className="text-[9px]" style={{ color: C.plata }}>✦</span>
          <div className="h-px w-10" style={{ background: "rgba(196,192,214,0.5)" }} />
        </div>

        <p className="mt-3 text-[10px] font-semibold tracking-[0.4em]" style={{ fontFamily: "var(--font-deco)", color: C.plata }}>
          COLECCIÓN DE ESTAMPAS
        </p>
        <p className="mt-1 text-[9px] tracking-[0.3em]" style={{ fontFamily: "var(--font-deco)", color: "rgba(255,255,255,0.78)" }}>
          EDICIÓN ÚNICA · 25.07.2026
        </p>

        <p
          className="mt-6 max-w-full truncate text-2xl leading-tight text-white"
          style={{ fontFamily: "var(--font-script)", textShadow: "0 1px 14px rgba(0,0,0,0.45)" }}
        >
          Para {d.guest || "ti"}
        </p>

        <div className="mt-auto rounded-full border px-4 py-1.5" style={{ borderColor: "rgba(196,192,214,0.8)", background: "rgba(53,44,78,0.45)" }}>
          <p className="text-[9px] font-semibold tracking-[0.2em]" style={{ color: "#e8e6f2" }}>20 ESTAMPAS · 3 DE PLATA 🏆</p>
        </div>
        <p className="pt-2.5 text-[9px] tracking-[0.35em]" style={{ fontFamily: "var(--font-deco)", color: "rgba(255,255,255,0.72)" }}>
          ✂ DESLIZA PARA ABRIR
        </p>
      </div>
    </div>
  );
}

/* ─── Sobre 3 · Jardín (floral de la invitación + banda con los novios) ─── */
function SobreJardin({ d }: { d: Design }) {
  const band = d.accent;
  return (
    <div
      className="relative h-[370px] w-[272px] overflow-hidden rounded-xl border"
      style={{ background: "linear-gradient(160deg, #fffefb 0%, #f6f1ea 100%)", borderColor: "#e7e1d4", boxShadow: "0 18px 40px rgba(53,44,78,0.16)" }}
    >
      {/* tira de apertura real, con fondo propio */}
      <div
        className="absolute inset-x-0 top-0 z-20 flex h-10 items-center justify-center gap-2"
        style={{ background: "#f1ead9", borderBottom: `2px dashed ${C.lila}`, borderRadius: "11px 11px 0 0" }}
      >
        <span className="text-[10px]" style={{ color: C.mid }}>✂</span>
        <span className="text-[9px] font-semibold tracking-[0.35em]" style={{ fontFamily: "var(--font-deco)", color: C.mid }}>
          DESLIZA PARA ABRIR
        </span>
      </div>

      {/* ramos de la invitación, bajo la tira y sin invadir los textos */}
      <FloralCorner eager className="absolute -left-5 top-9 h-36 w-36 opacity-75" color={C.lilaDeep} soft={C.lila} />
      <FloralCorner eager className="absolute -bottom-5 -right-5 h-36 w-36 rotate-180 opacity-75" color={C.lilaDeep} soft={C.lila} delay={0.4} />

      {/* velo que aclara la zona del texto inferior */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-[5] h-28"
        style={{ background: "linear-gradient(180deg, transparent 0%, rgba(255,254,251,0.9) 55%, #fffefb 100%)" }}
      />

      {/* parte superior */}
      <div className="absolute inset-x-0 top-14 z-10 flex flex-col items-center">
        <p
          className="rounded-full px-3.5 py-1 text-[10px] font-semibold tracking-[0.35em] backdrop-blur-sm"
          style={{ fontFamily: "var(--font-deco)", color: C.mid, background: "rgba(255,254,251,0.85)" }}
        >
          COLECCIÓN DE ESTAMPAS
        </p>
      </div>

      {/* banda central */}
      <div
        className="absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 py-3.5 text-center"
        style={{ background: `linear-gradient(90deg, color-mix(in srgb, ${band} 88%, black), ${band}, color-mix(in srgb, ${band} 88%, black))`, boxShadow: "0 5px 16px rgba(53,44,78,0.28)" }}
      >
        <p className="text-3xl leading-none text-white" style={{ fontFamily: "var(--font-script)" }}>
          Gabriel & Zayra
        </p>
        <p className="mt-1.5 text-[9px] font-semibold tracking-[0.45em] text-white/85" style={{ fontFamily: "var(--font-deco)" }}>
          25 · 07 · 2026
        </p>
      </div>

      {/* parte inferior */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center pb-5">
        <p className="max-w-[230px] truncate text-xl leading-tight" style={{ fontFamily: "var(--font-script)", color: C.ink }}>
          Para {d.guest || "ti"}
        </p>
        <p className="mt-1 text-[9px] font-semibold tracking-[0.25em]" style={{ fontFamily: "var(--font-deco)", color: C.mid }}>
          1 ESTAMPA SORPRESA · 3 DE PLATA ✦
        </p>
      </div>
    </div>
  );
}

/* ─── página de pre-diseños del sobre ─── */
export default function SobrePage() {
  const [design, setDesign] = useState<Design>({
    guest: "Familia Domínguez",
    accent: ACCENTS[0].hex,
  });

  const set = <K extends keyof Design>(key: K, value: Design[K]) => setDesign((d) => ({ ...d, [key]: value }));

  const labelStyle = { fontFamily: "var(--font-deco)", color: C.faint } as const;

  return (
    <main className="min-h-dvh px-4 py-8" style={{ background: C.bg, color: C.ink }}>
      <div className="mx-auto w-full max-w-5xl">
        {/* encabezado */}
        <div className="text-center">
          <p className="text-[10px] font-semibold tracking-[0.4em]" style={labelStyle}>
            PRE-DISEÑOS · BORRADOR
          </p>
          <h1 className="mt-2 text-3xl" style={{ fontFamily: "var(--font-display)" }}>
            Diseños del Sobre
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm" style={{ color: C.mid }}>
            Tres formas de presentar el sobre que cada invitado rasgará la primera vez que abra su invitación. Cambia el nombre y el acento para comparar.
          </p>
        </div>

        {/* panel de edición */}
        <div className="mx-auto mt-6 max-w-3xl rounded-2xl border p-4 sm:p-5" style={{ borderColor: C.line, background: C.paper }}>
          <div className="flex flex-wrap items-end gap-6">
            {/* invitado */}
            <div className="min-w-56 flex-1">
              <p className="mb-2 text-[10px] font-semibold tracking-[0.3em]" style={labelStyle}>NOMBRE DEL INVITADO</p>
              <input
                type="text"
                value={design.guest}
                maxLength={28}
                onChange={(e) => set("guest", e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
                style={{ borderColor: C.line, background: C.bg, color: C.ink }}
                placeholder="Ej. Familia Domínguez"
              />
            </div>

            {/* acento */}
            <div>
              <p className="mb-2 text-[10px] font-semibold tracking-[0.3em]" style={labelStyle}>COLOR DE ACENTO</p>
              <div className="flex gap-2">
                {ACCENTS.map((a) => (
                  <button
                    key={a.hex}
                    onClick={() => set("accent", a.hex)}
                    className="h-8 w-8 rounded-full border-2 transition-transform active:scale-90"
                    style={{ background: a.hex, borderColor: design.accent === a.hex ? C.ink : "transparent" }}
                    title={a.name}
                    aria-label={`Acento ${a.name}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* los tres sobres */}
        <div className="mt-10 flex flex-wrap items-start justify-center gap-x-10 gap-y-10">
          {(
            [
              ["SOBRE 1 · ARCO", <SobreArco key="a" d={design} />],
              ["SOBRE 2 · NOCHE DE GALA", <SobreGala key="g" d={design} />],
              ["SOBRE 3 · JARDÍN", <SobreJardin key="j" d={design} />],
            ] as const
          ).map(([label, card]) => (
            <div key={label} className="flex flex-col items-center gap-3">
              {card}
              <p className="text-[10px] font-semibold tracking-[0.3em]" style={labelStyle}>{label}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-[10px]" style={{ color: C.faint }}>
          El sobre elegido reemplazará al de <a href="/simulacion" className="underline underline-offset-2">/simulacion</a>, junto con el estilo de estampa de <a href="/estampa" className="underline underline-offset-2">/estampa</a>.
        </p>
      </div>
    </main>
  );
}
