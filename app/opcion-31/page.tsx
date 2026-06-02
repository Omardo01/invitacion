"use client";

import Link from "next/link";
import Image from "next/image";
import { BlurFade, useCountdown } from "@/components/magic";
import { wedding } from "@/lib/wedding";

/* ─── Postal Romántica · Marco Plata sobre Fondo Lila ─── */
const C = {
  bg: "#faf8fc",
  card: "#ffffff",
  ink: "#3c3845",
  mid: "#8b8596",
  faint: "#bdb8c7",
  line: "#e6e2ec",
  lila: "#d1c4e9",
  plata: "#b3b0b8",
  accent: "#8b73b3",
};

export default function Opcion31() {
  const t = useCountdown("2026-07-25T17:00:00");

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: C.bg, color: C.ink, fontFamily: "var(--font-serif)" }}>
      <Link href="/" className="fixed top-6 left-6 z-50 text-[10px] uppercase tracking-[0.3em] px-4 py-2 bg-white/60 backdrop-blur rounded-full transition-all hover:bg-white" style={{ border: `1px solid ${C.line}`, color: C.mid }}>
        ← Volver
      </Link>

      {/* HERO POSTAL */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden">
        {/* Adornos sutiles de fondo */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-3xl opacity-30" style={{ backgroundColor: C.lila }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full blur-3xl opacity-20" style={{ backgroundColor: C.lila }} />

        <BlurFade y={20} className="relative z-10 w-full max-w-lg">
          <div className="bg-white p-6 md:p-8 rounded-sm shadow-2xl relative" style={{ boxShadow: "0 25px 50px -12px rgba(139, 115, 179, 0.15)" }}>
            {/* Borde interior plata */}
            <div className="absolute inset-2 pointer-events-none" style={{ border: `1px solid ${C.plata}66` }} />
            
            <div className="relative aspect-[3/4] w-full mb-8 overflow-hidden">
              <Image
                src="/hero1.png"
                alt="Novios"
                fill
                priority
                className="object-cover"
              />
            </div>

            <div className="text-center px-4">
              <p className="text-[10px] uppercase tracking-[0.4em] mb-4" style={{ color: C.mid }}>Nuestra Boda</p>
              <h1 className="text-5xl md:text-6xl" style={{ fontFamily: "var(--font-script)", color: C.accent }}>
                {wedding.groom} &amp; {wedding.bride}
              </h1>
              
              <div className="flex items-center justify-center gap-4 my-6">
                <div className="h-px w-12" style={{ backgroundColor: C.line }} />
                <span className="text-xs tracking-widest" style={{ color: C.mid }}>{wedding.dateShort}</span>
                <div className="h-px w-12" style={{ backgroundColor: C.line }} />
              </div>
              <p className="text-xs uppercase tracking-[0.2em]" style={{ color: C.faint }}>{wedding.city}</p>
            </div>
          </div>
        </BlurFade>
      </section>

      {/* HISTORIA */}
      <section className="py-24 px-6 text-center">
        <BlurFade className="max-w-xl mx-auto">
          <h2 className="text-3xl italic mb-8" style={{ fontFamily: "var(--font-display)", color: C.accent }}>Un poco de nosotros</h2>
          <p className="text-lg leading-loose" style={{ color: C.mid }}>"{wedding.story}"</p>
        </BlurFade>
      </section>

      {/* DETALLES DE LA BODA (Ceremonia y Recepción) */}
      <section className="py-24 px-6 relative bg-white border-y" style={{ borderColor: C.line }}>
        <BlurFade className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16">
          {[wedding.ceremony, wedding.reception].map((ev, i) => (
            <div key={i} className="text-center flex flex-col items-center">
              <p className="text-5xl mb-4" style={{ fontFamily: "var(--font-script)", color: C.accent }}>{ev.time}</p>
              <p className="text-[10px] uppercase tracking-[0.4em] mb-4" style={{ color: C.mid }}>{ev.title}</p>
              <h4 className="text-xl mb-2">{ev.place}</h4>
              <p className="text-sm mb-6" style={{ color: C.mid, fontFamily: "var(--font-sans)" }}>{ev.address}</p>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(ev.mapsQuery)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[9px] uppercase tracking-[0.3em] px-6 py-2 border transition-colors hover:bg-neutral-50"
                style={{ borderColor: C.line, color: C.ink }}
              >
                Ver Ubicación
              </a>
            </div>
          ))}
        </BlurFade>
      </section>

      {/* DRESS CODE */}
      <section className="py-24 px-6 text-center">
        <BlurFade className="max-w-md mx-auto bg-white p-12 rounded-sm shadow-sm border" style={{ borderColor: C.line }}>
          <p className="text-[10px] uppercase tracking-[0.4em] mb-6" style={{ color: C.mid }}>Dress Code</p>
          <h3 className="text-3xl italic mb-8" style={{ fontFamily: "var(--font-display)" }}>{wedding.dressCode}</h3>
          <div className="flex justify-center gap-3">
            {wedding.dressCodePalette.map((col) => (
              <div key={col.hex} className="w-8 h-8 rounded-full shadow-sm" style={{ backgroundColor: col.hex, border: `1px solid ${C.line}` }} />
            ))}
          </div>
        </BlurFade>
      </section>

      {/* RSVP */}
      <section className="py-24 px-6 text-center">
        <BlurFade className="max-w-md mx-auto">
          <p className="text-[10px] uppercase tracking-[0.4em] mb-4" style={{ color: C.mid }}>Confirmación</p>
          <h2 className="text-4xl mb-6" style={{ fontFamily: "var(--font-script)", color: C.accent }}>
            Acompáñanos en nuestro gran día
          </h2>
          <button
            className="mt-8 px-10 py-4 text-[10px] uppercase tracking-[0.3em] transition-opacity hover:opacity-80 text-white"
            style={{ backgroundColor: C.accent }}
          >
            Confirmar Asistencia
          </button>
        </BlurFade>
      </section>
      
      <footer className="py-12 text-center border-t bg-white" style={{ borderColor: C.line }}>
        <p className="text-2xl mb-2" style={{ fontFamily: "var(--font-script)", color: C.accent }}>
          {wedding.groom} &amp; {wedding.bride}
        </p>
      </footer>
    </div>
  );
}
