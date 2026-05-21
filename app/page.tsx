"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { wedding } from "@/lib/wedding";

const options = [
  {
    href: "/opcion-1",
    number: "01",
    name: "Editorial Vintage",
    tagline: "Revista 70s · papel envejecido · máquina de escribir",
    bg: "bg-[#f4ecd8]",
    fg: "text-[#3a2a1e]",
    accent: "border-[#7c1d1d]",
    chip: "bg-[#7c1d1d] text-[#f4ecd8]",
    previewFont: "var(--font-display)",
    preview: "G & Z",
    customizable: true,
  },
  {
    href: "/opcion-2",
    number: "02",
    name: "Art Deco Cinematográfico",
    tagline: "Gatsby moderno · dorados · cortinas · parallax",
    bg: "bg-[#0a0a0a]",
    fg: "text-[#f5f0e8]",
    accent: "border-[#c9a961]",
    chip: "bg-[#c9a961] text-[#0a0a0a]",
    previewFont: "var(--font-deco)",
    preview: "G • Z",
    customizable: true,
  },
  {
    href: "/opcion-3",
    number: "03",
    name: "Botánico Acuarela",
    tagline: "Flores SVG dibujándose · salvia · script romántico",
    bg: "bg-[#faf3e7]",
    fg: "text-[#3d4a36]",
    accent: "border-[#87a96b]",
    chip: "bg-[#87a96b] text-[#faf3e7]",
    previewFont: "var(--font-script)",
    preview: "G & Z",
    customizable: true,
  },
  {
    href: "/opcion-4",
    number: "04",
    name: "Mexicano Folk Modern",
    tagline: "Papel picado · rosa mexicano · confeti · marquees",
    bg: "bg-[#fff5d6]",
    fg: "text-[#1a1a1a]",
    accent: "border-[#e4007c]",
    chip: "bg-[#e4007c] text-[#fff5d6]",
    previewFont: "var(--font-dm-serif)",
    preview: "G & Z",
    customizable: true,
  },
  {
    href: "/opcion-5",
    number: "05",
    name: "Minimalista Editorial",
    tagline: "Swiss design · word reveals · números gigantes",
    bg: "bg-white",
    fg: "text-neutral-900",
    accent: "border-[#c4623d]",
    chip: "bg-neutral-900 text-white",
    previewFont: "var(--font-sans)",
    preview: "g & z",
    customizable: true,
  },
  {
    href: "/opcion-6",
    number: "06",
    name: "Sobre Lacrado",
    tagline: "Lila + plata · sello de cera que se rompe · 8 secciones",
    bg: "bg-[#1e1828]",
    fg: "text-[#f8f4fc]",
    accent: "border-[#9b7cc7]",
    chip: "bg-[#9b7cc7] text-[#1e1828]",
    previewFont: "var(--font-display)",
    preview: "✉",
    customizable: true,
  },
  {
    href: "/opcion-7",
    number: "07",
    name: "Sobre Postal Vintage",
    tagline: "Sobre kraft con cordón y estampillas · postal aérea",
    bg: "bg-[#2a1f15]",
    fg: "text-[#d9b88a]",
    accent: "border-[#a02828]",
    chip: "bg-[#a02828] text-[#f0e2c8]",
    previewFont: "var(--font-typewriter)",
    preview: "✦",
    customizable: true,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-900 px-6 py-16 md:px-12 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-5xl mx-auto mb-12 md:mb-20"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-4">
          Exploración de diseño · v3
        </p>
        <h1
          className="text-4xl md:text-6xl tracking-tight leading-[0.95]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Siete propuestas para la invitación de{" "}
          <em
            className="not-italic"
            style={{ fontFamily: "var(--font-script)", fontSize: "1.3em" }}
          >
            {wedding.groom} &amp; {wedding.bride}
          </em>
        </h1>
        <p
          className="mt-6 max-w-2xl text-neutral-600"
          style={{ fontFamily: "var(--font-serif)", fontSize: "1.125rem" }}
        >
          Cada propuesta mezcla algo vintage con animaciones modernas. Las
          marcadas como{" "}
          <strong className="text-neutral-900">✦ custom</strong> incluyen un
          panel para cambiar paleta, tipografía y detalles (sello, estampilla,
          cordón…) en vivo desde el botón flotante.
        </p>
        <p
          className="mt-3 max-w-2xl text-neutral-500 text-sm"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          ✉ Las dos últimas son sobres que se abren —rompe el sello o desata el
          cordón para descubrir la invitación.
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {options.map((opt, i) => (
          <motion.div
            key={opt.href}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href={opt.href} className="group block h-full">
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={`relative h-full overflow-hidden rounded-sm border ${opt.accent} ${opt.bg} ${opt.fg} aspect-[3/4] xl:aspect-auto xl:min-h-[480px] flex flex-col justify-between p-6`}
              >
                <div className="flex items-start justify-between">
                  <span
                    className={`text-[10px] tracking-[0.3em] uppercase px-2 py-1 ${opt.chip}`}
                  >
                    {opt.number}
                  </span>
                  {opt.customizable && (
                    <span
                      className="text-[9px] tracking-[0.2em] uppercase px-2 py-1 border border-current opacity-70"
                      title="Personalizable"
                    >
                      ✦ custom
                    </span>
                  )}
                </div>

                <div className="flex-1 flex items-center justify-center">
                  <motion.span
                    className="text-5xl md:text-6xl text-center"
                    style={{ fontFamily: opt.previewFont }}
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {opt.preview}
                  </motion.span>
                </div>

                <div>
                  <h2
                    className="text-xl md:text-2xl mb-2 leading-tight"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {opt.name}
                  </h2>
                  <p
                    className="text-xs md:text-sm opacity-70 leading-relaxed"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {opt.tagline}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase opacity-70 group-hover:opacity-100 transition-opacity">
                    <span>Ver propuesta</span>
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    >
                      →
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="text-center mt-16 text-xs tracking-[0.3em] uppercase text-neutral-400"
      >
        Datos de prueba · 25 · Julio · 2026
      </motion.p>
    </main>
  );
}
