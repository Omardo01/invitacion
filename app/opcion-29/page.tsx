"use client";

import Link from "next/link";
import Image from "next/image";
import { wedding } from "@/lib/wedding";
import { BlurFade, useCountdown } from "@/components/magic";

/* ─── Editorial Lila y Plata · Elegante con Foto Hero ─── */
const C = {
  bg: "#ffffff",
  bg2: "#f9f8fa",
  ink: "#2c2836",
  mid: "#6a6478",
  faint: "#a6a0b5",
  line: "#e3dfe8",
  lila: "#a18ec9",
  lilaDeep: "#7a63a5",
  plata: "#c5c3cc",
};

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center px-4 md:px-6">
      <div className="text-4xl md:text-5xl font-light tabular-nums" style={{ fontFamily: "var(--font-serif)", color: C.ink }}>
        {String(value).padStart(2, "0")}
      </div>
      <div className="text-[9px] uppercase tracking-[0.25em] mt-2" style={{ color: C.mid }}>{label}</div>
    </div>
  );
}

export default function Opcion29() {
  const t = useCountdown("2026-07-25T17:00:00");

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: C.bg, color: C.ink, fontFamily: "var(--font-sans)" }}>
      <Link href="/" className="fixed top-6 left-6 z-50 text-xs uppercase tracking-widest px-4 py-2 rounded-full backdrop-blur-md bg-white/40 border border-white/60 transition-colors hover:bg-white/80" style={{ color: C.ink }}>
        ← volver
      </Link>

      {/* HERO SECTION CON IMAGEN */}
      <section className="relative min-h-screen flex flex-col justify-end pb-24 px-6 md:px-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero1.png"
            alt={`${wedding.groom} y ${wedding.bride}`}
            fill
            priority
            className="object-cover object-center"
          />
          {/* Gradiente sutil para legibilidad del texto */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.7) 30%, rgba(255,255,255,0) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, transparent 40%)" }} />
        </div>

        <div className="relative z-10 max-w-4xl w-full mx-auto text-center md:text-left flex flex-col md:flex-row md:items-end justify-between">
          <BlurFade delay={0.2} y={30} className="md:flex-1">
            <h1 className="text-5xl md:text-8xl font-light tracking-tight leading-[0.9]" style={{ fontFamily: "var(--font-serif)", color: C.ink }}>
              {wedding.groom}
            </h1>
            <h1 className="text-5xl md:text-8xl font-light tracking-tight leading-[0.9] mt-2" style={{ fontFamily: "var(--font-serif)", color: C.ink }}>
              &amp; {wedding.bride}
            </h1>
          </BlurFade>

          <BlurFade delay={0.4} y={30} className="mt-8 md:mt-0 text-center md:text-right">
            <p className="text-xs uppercase tracking-[0.4em] mb-2" style={{ color: C.lilaDeep }}>Nos casamos</p>
            <p className="text-lg md:text-xl font-light" style={{ fontFamily: "var(--font-serif)", color: C.mid }}>{wedding.dateLabel}</p>
            <p className="text-[10px] uppercase tracking-[0.3em] mt-2" style={{ color: C.faint }}>{wedding.city}</p>
          </BlurFade>
        </div>
      </section>

      {/* HISTORIA */}
      <section className="py-24 px-6 relative" style={{ backgroundColor: C.bg2 }}>
        <BlurFade className="max-w-2xl mx-auto text-center">
          <span className="block w-px h-16 mx-auto mb-8" style={{ backgroundColor: C.plata }} />
          <h2 className="text-3xl md:text-4xl italic mb-8" style={{ fontFamily: "var(--font-display)", color: C.ink }}>Nuestra Historia</h2>
          <p className="text-lg leading-relaxed font-light" style={{ color: C.mid }}>
            "{wedding.story}"
          </p>
        </BlurFade>
      </section>

      {/* COUNTDOWN */}
      <section className="py-20 px-6 border-y" style={{ borderColor: C.line, backgroundColor: C.bg }}>
        <BlurFade>
          <div className="flex justify-center divide-x" style={{ borderColor: C.line }}>
            <Stat value={t.d} label="días" />
            <Stat value={t.h} label="hrs" />
            <Stat value={t.m} label="min" />
            <Stat value={t.s} label="seg" />
          </div>
        </BlurFade>
      </section>

      {/* EVENTOS */}
      <section className="py-24 px-6 relative" style={{ backgroundColor: C.bg2 }}>
        <BlurFade><p className="text-center text-[10px] uppercase tracking-[0.4em] mb-16" style={{ color: C.lilaDeep }}>El Programa</p></BlurFade>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
          {[wedding.ceremony, wedding.reception].map((ev, i) => (
            <BlurFade key={ev.title} delay={i * 0.15}>
              <div className="h-full bg-white p-10 flex flex-col items-center text-center rounded-sm" style={{ border: `1px solid ${C.line}` }}>
                <p className="text-4xl font-light italic mb-4" style={{ fontFamily: "var(--font-display)", color: C.ink }}>{ev.title}</p>
                <div className="h-px w-12 mb-6" style={{ backgroundColor: C.lila }} />
                <p className="text-xs uppercase tracking-[0.3em] font-medium mb-4" style={{ color: C.mid }}>{ev.time} hrs</p>
                <p className="text-lg mb-2">{ev.place}</p>
                <p className="text-sm font-light mb-8 flex-1" style={{ color: C.faint }}>{ev.address}</p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(ev.mapsQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] uppercase tracking-[0.3em] font-medium pb-1 border-b transition-opacity hover:opacity-60"
                  style={{ color: C.lilaDeep, borderColor: C.lilaDeep }}
                >
                  Cómo llegar
                </a>
              </div>
            </BlurFade>
          ))}
        </div>
      </section>

      {/* DRESS CODE & REGALOS */}
      <section className="py-24 px-6 grid md:grid-cols-2 max-w-5xl mx-auto gap-16 md:gap-10">
        <BlurFade className="text-center flex flex-col items-center justify-center">
          <p className="text-[10px] uppercase tracking-[0.4em] mb-6" style={{ color: C.mid }}>Dress Code</p>
          <h3 className="text-3xl font-light italic mb-6" style={{ fontFamily: "var(--font-display)" }}>{wedding.dressCode}</h3>
          <div className="flex gap-3 justify-center">
            {wedding.dressCodePalette.map((col) => (
              <div key={col.hex} className="w-8 h-8 rounded-full shadow-sm" style={{ backgroundColor: col.hex, border: `1px solid ${C.line}` }} title={col.name} />
            ))}
          </div>
        </BlurFade>

        <BlurFade className="text-center flex flex-col items-center justify-center" delay={0.2}>
          <p className="text-[10px] uppercase tracking-[0.4em] mb-6" style={{ color: C.mid }}>Mesa de Regalos</p>
          <div className="w-full space-y-4">
            {wedding.gifts.map((g) => (
              <a
                key={g.store}
                href={g.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-6 py-4 rounded-sm transition-all hover:bg-neutral-50"
                style={{ border: `1px solid ${C.line}` }}
              >
                <span className="font-medium text-sm">{g.store}</span>
                <span className="text-[10px] uppercase tracking-widest" style={{ color: C.lilaDeep }}>{g.code}</span>
              </a>
            ))}
          </div>
        </BlurFade>
      </section>

      {/* RSVP */}
      <section className="py-32 px-6 border-t text-center relative" style={{ borderColor: C.line, backgroundColor: C.bg2 }}>
        <BlurFade className="max-w-lg mx-auto">
          <h2 className="text-4xl md:text-5xl font-light mb-6" style={{ fontFamily: "var(--font-serif)", color: C.ink }}>
            Esperamos que nos acompañes
          </h2>
          <p className="text-sm font-light mb-12" style={{ color: C.mid }}>
            Por favor, confirma tu asistencia antes del {wedding.rsvpDeadline}.
          </p>
          <button
            className="inline-block px-12 py-4 text-[10px] uppercase tracking-[0.4em] transition-colors hover:opacity-80"
            style={{ backgroundColor: C.ink, color: C.bg }}
          >
            Confirmar Asistencia
          </button>
        </BlurFade>
      </section>
      
      <footer className="py-12 text-center border-t" style={{ borderColor: C.line, backgroundColor: C.bg }}>
        <p className="text-2xl font-light italic mb-2" style={{ fontFamily: "var(--font-display)", color: C.ink }}>
          {wedding.groom} &amp; {wedding.bride}
        </p>
        <p className="text-[9px] uppercase tracking-[0.4em]" style={{ color: C.faint }}>
          {wedding.dateShort}
        </p>
      </footer>
    </div>
  );
}
