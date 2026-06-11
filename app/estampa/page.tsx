"use client";

import { useState } from "react";
import Image from "next/image";
import { StampCard, type StampStyle } from "@/components/stamp-card";

/* ─── misma paleta que la invitación definitiva (opción 33) ─── */
const C = {
  bg: "#faf8fd",
  paper: "#ffffff",
  ink: "#352c4e",
  mid: "#6c628a",
  faint: "#a79ec0",
  line: "#e8e2f3",
  lila: "#b89ad6",
  lilaDeep: "#8a6cb8",
};

/* fotos de la carpeta public/Estampas (los HEIC ya están convertidos a JPG) */
const PHOTOS = [
  "/Estampas/20074cc2-a6a4-40af-92cb-c24e7cfd2ff6.jpg",
  "/Estampas/3968412a-6378-4c3b-b234-1f2974766305.jpg",
  "/Estampas/3a8eabf7-d0a6-4fde-8cb1-e934084b8220.jpg",
  "/Estampas/5C8C71B2-6291-4BE6-9D58-5BC78A2CB6B4.jpg",
  "/Estampas/64C91464-92AF-4729-83E4-2015AB4F16B3.JPG",
  "/Estampas/8bb3b0c1-8bad-4645-8a43-c53c53e19600.jpg",
  "/Estampas/IMG-20211216-WA0055.jpg",
  "/Estampas/IMG-20220102-WA0034.jpg",
  "/Estampas/IMG-20220712-WA0090.jpg",
  "/Estampas/IMG20220709195847.jpg",
  "/Estampas/IMG_0270.jpg",
  "/Estampas/IMG_0418.jpg",
  "/Estampas/IMG_20220807_184518.jpg",
  "/Estampas/IMG_2437.jpeg",
  "/Estampas/IMG_3099.jpg",
  "/Estampas/IMG_3340.jpg",
  "/Estampas/IMG_3961.PNG",
  "/Estampas/IMG_5915.jpg",
  "/Estampas/IMG_6286_VSCO.jpg",
  "/Estampas/IMG_7045.jpg",
  "/Estampas/IMG_8092.jpg",
  "/Estampas/IMG_9175.jpg",
  "/Estampas/IMG_9900.jpg",
  "/Estampas/f122b5a6-0ea5-41d6-be09-80c4717d8fd9.jpg",
];

/* solo tonos de la paleta de la invitación */
const ACCENTS = [
  { name: "Lila profundo", hex: "#8a6cb8" },
  { name: "Lila claro", hex: "#b89ad6" },
  { name: "Tinta", hex: "#352c4e" },
];

/* los 3 tipos definitivos (opciones 1, 2 y 5 de los pre-diseños) */
const TYPES: { style: StampStyle; label: string }[] = [
  { style: "clasica", label: "TIPO 1 · CLÁSICA" },
  { style: "mundial", label: "TIPO 2 · ÁLBUM MUNDIAL" },
  { style: "editorial", label: "TIPO 3 · EDITORIAL" },
];

export default function EstampaPage() {
  const [photo, setPhoto] = useState(PHOTOS[0]);
  const [name, setName] = useState("La Pedida");
  const [plata, setPlata] = useState(false);
  const [accent, setAccent] = useState(ACCENTS[0].hex);

  const labelStyle = { fontFamily: "var(--font-deco)", color: C.faint } as const;

  return (
    <main className="min-h-dvh px-4 py-8" style={{ background: C.bg, color: C.ink }}>
      <div className="mx-auto w-full max-w-5xl">
        {/* encabezado */}
        <div className="text-center">
          <p className="text-[10px] font-semibold tracking-[0.4em]" style={labelStyle}>
            DISEÑOS DEFINITIVOS
          </p>
          <h1 className="mt-2 text-3xl" style={{ fontFamily: "var(--font-display)" }}>
            Tipos de Estampa
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm" style={{ color: C.mid }}>
            La colección usará estos <strong>3 tipos</strong> (las opciones 1, 2 y 5 elegidas). Cada estampa
            del catálogo tiene asignado su tipo; las de plata salen en Editorial con el shimmer de lujo.
          </p>
        </div>

        {/* panel de edición */}
        <div className="mx-auto mt-6 max-w-3xl rounded-2xl border p-4 sm:p-5" style={{ borderColor: C.line, background: C.paper }}>
          {/* fotos */}
          <p className="mb-2 text-[10px] font-semibold tracking-[0.3em]" style={labelStyle}>FOTO</p>
          <div className="flex flex-wrap gap-2">
            {PHOTOS.map((p) => (
              <button
                key={p}
                onClick={() => setPhoto(p)}
                className="relative h-20 w-14 overflow-hidden rounded-lg border-2 transition-transform active:scale-95"
                style={{ borderColor: photo === p ? C.lilaDeep : C.line, boxShadow: photo === p ? `0 0 0 2px ${C.lila}` : "none" }}
                aria-label={`Usar foto ${p}`}
              >
                <Image src={p} alt="" fill sizes="56px" className="object-cover" />
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-end gap-6">
            {/* nombre */}
            <div className="min-w-56 flex-1">
              <p className="mb-2 text-[10px] font-semibold tracking-[0.3em]" style={labelStyle}>NOMBRE DE LA ESTAMPA</p>
              <input
                type="text"
                value={name}
                maxLength={24}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
                style={{ borderColor: C.line, background: C.bg, color: C.ink }}
                placeholder="Ej. El Primer Baile"
              />
            </div>

            {/* acento */}
            <div>
              <p className="mb-2 text-[10px] font-semibold tracking-[0.3em]" style={labelStyle}>COLOR DE ACENTO</p>
              <div className="flex gap-2">
                {ACCENTS.map((a) => (
                  <button
                    key={a.hex}
                    onClick={() => setAccent(a.hex)}
                    className="h-8 w-8 rounded-full border-2 transition-transform active:scale-90"
                    style={{ background: a.hex, borderColor: accent === a.hex ? C.ink : "transparent" }}
                    title={a.name}
                    aria-label={`Acento ${a.name}`}
                  />
                ))}
              </div>
            </div>

            {/* plata */}
            <label className="flex cursor-pointer items-center gap-2 pb-1.5 text-sm" style={{ color: C.mid }}>
              <input
                type="checkbox"
                checked={plata}
                onChange={(e) => setPlata(e.target.checked)}
                className="h-4 w-4 accent-[#8e8aa6]"
              />
              Acabado de plata 🏆
            </label>
          </div>
        </div>

        {/* los tres tipos definitivos */}
        <div className="mt-10 flex flex-wrap items-start justify-center gap-x-8 gap-y-10">
          {TYPES.map(({ style, label }) => (
            <div key={style} className="flex flex-col items-center gap-3">
              <StampCard
                stamp={{ num: 7, name, plata, image: photo }}
                variant={style}
                accent={accent}
              />
              <p className="text-[10px] font-semibold tracking-[0.3em]" style={labelStyle}>{label}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-[10px]" style={{ color: C.faint }}>
          Renderizados con <code>components/stamp-card.tsx</code> — el mismo componente que usará la invitación real.
        </p>
      </div>
    </main>
  );
}
