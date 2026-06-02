"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { wedding } from "@/lib/wedding";

const options = [
  {
    href: "/opcion-1",
    number: "01",
    name: "Editorial Lila",
    tagline: "Revista editorial · lila, plata y blanco · máquina de escribir",
    bg: "bg-[#f7f5fb]",
    fg: "text-[#3a3050]",
    accent: "border-[#9b7ec4]",
    chip: "bg-[#9b7ec4] text-white",
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
  {
    href: "/opcion-8",
    number: "08",
    name: "Sobre Terracota",
    tagline: "Sobre animado · sello de cera · paleta cálida · flores warm",
    bg: "bg-[#f7efe5]",
    fg: "text-[#2a1a0e]",
    accent: "border-[#c1694f]",
    chip: "bg-[#c1694f] text-[#f7efe5]",
    previewFont: "var(--font-display)",
    preview: "✉",
    customizable: false,
  },
  {
    href: "/opcion-9",
    number: "09",
    name: "Blanco & Plata",
    tagline: "Fecha numérica gigante · playlist · fotos collage · timeline",
    bg: "bg-white",
    fg: "text-[#111]",
    accent: "border-[#ddd]",
    chip: "bg-[#111] text-white",
    previewFont: "var(--font-script)",
    preview: "G & Z",
    customizable: false,
  },
  {
    href: "/opcion-10",
    number: "10",
    name: "Navy & Oro",
    tagline: "Sobre lacrado · sello lotus · navy profundo · acento dorado",
    bg: "bg-[#0d1b3e]",
    fg: "text-[#f8f3ec]",
    accent: "border-[#c9a253]",
    chip: "bg-[#c9a253] text-[#0d1b3e]",
    previewFont: "var(--font-deco)",
    preview: "✦",
    customizable: false,
  },
  {
    href: "/opcion-11",
    number: "11",
    name: "Lila Etéreo",
    tagline: "Glassmorphism · orbes flotantes · degradados lila · plata suave",
    bg: "bg-[#f6f3fb]",
    fg: "text-[#2e2440]",
    accent: "border-[#b794d4]",
    chip: "bg-[#8a5fb0] text-white",
    previewFont: "var(--font-display)",
    preview: "G & Z",
    customizable: false,
  },
  {
    href: "/opcion-12",
    number: "12",
    name: "Cristal & Plata",
    tagline: "Art déco · cortinas que se abren · lila metálico · dramático",
    bg: "bg-[#1a1426]",
    fg: "text-[#f3eefb]",
    accent: "border-[#c9a4ec]",
    chip: "bg-[#c9a4ec] text-[#1a1426]",
    previewFont: "var(--font-deco)",
    preview: "G & Z",
    customizable: false,
  },
  {
    href: "/opcion-13",
    number: "13",
    name: "Lavanda Romántica",
    tagline: "Blanco perla · lavanda suave · ramilletes florales · script",
    bg: "bg-[#fdfcff]",
    fg: "text-[#3a3050]",
    accent: "border-[#c4aee0]",
    chip: "bg-[#9b7ec4] text-white",
    previewFont: "var(--font-great-vibes)",
    preview: "G & Z",
    customizable: false,
  },
  {
    href: "/opcion-14",
    number: "14",
    name: "Monocromo",
    tagline: "Ultra minimalista · blanco y gris · líneas finas · mucho aire",
    bg: "bg-[#fafafa]",
    fg: "text-[#18181b]",
    accent: "border-[#e4e4e7]",
    chip: "bg-[#18181b] text-white",
    previewFont: "var(--font-syne)",
    preview: "G & Z",
    customizable: false,
  },
  {
    href: "/opcion-15",
    number: "15",
    name: "Bruma Lila",
    tagline: "Clean · tarjetas suaves con sombra sutil · lila discreto",
    bg: "bg-[#f6f5f9]",
    fg: "text-[#2a2535]",
    accent: "border-[#e0dbe9]",
    chip: "bg-[#8f7bb3] text-white",
    previewFont: "var(--font-display)",
    preview: "G & Z",
    customizable: false,
  },
  {
    href: "/opcion-16",
    number: "16",
    name: "Serif Editorial Lila",
    tagline: "Blanco lila frío · serif Fraunces · acentos lila · líneas finas",
    bg: "bg-[#faf9fc]",
    fg: "text-[#221d2e]",
    accent: "border-[#ece9f1]",
    chip: "bg-[#8f7bb3] text-white",
    previewFont: "var(--font-fraunces)",
    preview: "G & Z",
    customizable: false,
  },
  {
    href: "/opcion-17",
    number: "17",
    name: "Cinemático",
    tagline: "Tipografía dirigida por scroll · los nombres convergen · limpio",
    bg: "bg-[#fdfcfb]",
    fg: "text-[#17151c]",
    accent: "border-[#eceaef]",
    chip: "bg-[#8f7bb3] text-white",
    previewFont: "var(--font-syne)",
    preview: "G & Z",
    customizable: false,
  },
  {
    href: "/opcion-18",
    number: "18",
    name: "Índice Editorial",
    tagline: "Revista de moda · filas numeradas que se expanden al pasar el cursor",
    bg: "bg-[#faf8f4]",
    fg: "text-[#1b1814]",
    accent: "border-[#e6e1d7]",
    chip: "bg-[#8f7bb3] text-white",
    previewFont: "var(--font-fraunces)",
    preview: "01",
    customizable: false,
  },
  {
    href: "/opcion-19",
    number: "19",
    name: "Wipe",
    tagline: "Cortina de apertura · revelados por máscara coreografiados",
    bg: "bg-[#f7f6f4]",
    fg: "text-[#111110]",
    accent: "border-[#e4e2dd]",
    chip: "bg-[#8f7bb3] text-white",
    previewFont: "var(--font-fraunces)",
    preview: "G & Z",
    customizable: false,
  },
  {
    href: "/opcion-20",
    number: "20",
    name: "Spotlight",
    tagline: "Oscuro mate · luz que sigue el cursor · al confirmar se vuelve claro y festivo",
    bg: "bg-[#0e0d12]",
    fg: "text-[#f3f1f7]",
    accent: "border-[#b9a3e0]",
    chip: "bg-[#b9a3e0] text-[#0e0d12]",
    previewFont: "var(--font-syne)",
    preview: "G & Z",
    customizable: false,
  },
  {
    href: "/opcion-21",
    number: "21",
    name: "Parallax",
    tagline: "Capas a distintas velocidades al hacer scroll · galería flotante · elegante",
    bg: "bg-[#fbfaf8]",
    fg: "text-[#1c1a22]",
    accent: "border-[#ebe8ee]",
    chip: "bg-[#8f7bb3] text-white",
    previewFont: "var(--font-fraunces)",
    preview: "G & Z",
    customizable: false,
  },
  {
    href: "/opcion-22",
    number: "22",
    name: "Perspectiva 3D",
    tagline: "Tilt 3D al mouse · tarjetas de eventos que voltean · entrada en perspectiva",
    bg: "bg-white",
    fg: "text-[#1a1722]",
    accent: "border-[#ece9f1]",
    chip: "bg-[#8f7bb3] text-white",
    previewFont: "var(--font-syne)",
    preview: "G & Z",
    customizable: false,
  },
  {
    href: "/opcion-23",
    number: "23",
    name: "Línea de Tiempo",
    tagline: "Una línea SVG que se dibuja con el scroll · itinerario del día · hitos",
    bg: "bg-[#fcfbfe]",
    fg: "text-[#211c2e]",
    accent: "border-[#ebe7f1]",
    chip: "bg-[#8a5fb0] text-white",
    previewFont: "var(--font-fraunces)",
    preview: "✦",
    customizable: false,
  },
  {
    href: "/opcion-24",
    number: "24",
    name: "Kinético",
    tagline: "Letras que entran una a una · palabra rotativa · texto que respira",
    bg: "bg-[#f7f5fb]",
    fg: "text-[#2a2440]",
    accent: "border-[#e8e3f1]",
    chip: "bg-[#8f7bb3] text-white",
    previewFont: "var(--font-syne)",
    preview: "G & Z",
    customizable: false,
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
          Veinticuatro propuestas para la invitación de{" "}
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
          panel para cambiar paleta, tipografía y detalles en vivo. Las{" "}
          <strong className="text-neutral-900">08–10</strong> son nuevas,
          inspiradas en referencias reales.
        </p>
        <p
          className="mt-3 max-w-2xl text-neutral-500 text-sm"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          ✉ Los sobres (06, 07, 08, 10) se abren al tocarlos. El dashboard de
          invitados está en{" "}
          <a href="/admin" className="underline hover:opacity-70">/admin</a>.
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
