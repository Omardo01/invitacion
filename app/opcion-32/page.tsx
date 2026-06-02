"use client";

import Link from "next/link";
import Image from "next/image";
import { BlurFade, useCountdown } from "@/components/magic";
import { PetalRain } from "@/components/floral";
import { wedding } from "@/lib/wedding";

/* ─── Glassmorphism Minimalista · Lujo Moderno ─── */
const C = {
  ink: "#231f2e",
  mid: "#787182",
  faint: "#b3aebf",
  line: "rgba(255,255,255,0.4)",
  accent: "#8b73b3",
};

export default function Opcion32() {
  const t = useCountdown("2026-07-25T17:00:00");

  return (
    <div className="min-h-screen relative overflow-x-hidden font-sans" style={{ color: C.ink }}>
      {/* Fondo Fijo con la imagen difuminada y un tinte lila/plata */}
      <div className="fixed inset-0 z-0">
        <Image src="/hero1.png" alt="Fondo" fill className="object-cover opacity-60 blur-xl scale-110" />
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#e6dcf5]/30 to-[#d1d5db]/30" />
      </div>

      <PetalRain count={15} colors={["#ffffff", "#f0eaf7", "#e2d6f2", "#d1c4e9"]} />

      <Link href="/" className="fixed top-6 left-6 z-50 text-[10px] uppercase tracking-[0.3em] px-4 py-2 bg-white/40 backdrop-blur-md rounded-full border border-white/60 transition-colors hover:bg-white/80" style={{ color: C.ink }}>
        ← Inicio
      </Link>

      {/* HERO: Tarjeta Glassmorphism */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
        <BlurFade y={30} className="w-full max-w-lg">
          <div className="bg-white/40 backdrop-blur-xl p-8 md:p-10 rounded-2xl shadow-2xl border border-white/70 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/10 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="relative w-40 h-40 md:w-48 md:h-48 mx-auto rounded-full overflow-hidden mb-8 border-4 border-white/80 shadow-lg">
                <Image src="/1.jpg" alt="Zayra y Gabriel" fill priority className="object-cover" />
              </div>

              <p className="text-[9px] uppercase tracking-[0.5em] mb-4" style={{ color: C.mid }}>Únete a nuestra boda</p>
              
              <h1 className="text-5xl md:text-6xl tracking-tight mb-2" style={{ fontFamily: "var(--font-fraunces)" }}>
                {wedding.groom}
              </h1>
              <p className="text-3xl my-1" style={{ fontFamily: "var(--font-script)", color: C.accent }}>&amp;</p>
              <h1 className="text-5xl md:text-6xl tracking-tight mb-8" style={{ fontFamily: "var(--font-fraunces)" }}>
                {wedding.bride}
              </h1>

              <div className="bg-white/50 backdrop-blur-sm py-4 px-6 rounded-xl border border-white/60 inline-flex gap-8">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] mb-1" style={{ color: C.mid }}>Fecha</p>
                  <p className="text-lg">{wedding.dateShort}</p>
                </div>
                <div className="w-px bg-black/10" />
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] mb-1" style={{ color: C.mid }}>Lugar</p>
                  <p className="text-lg">{wedding.city}</p>
                </div>
              </div>
            </div>
          </div>
        </BlurFade>
      </section>

      {/* CRONÓMETRO */}
      <section className="py-16 relative z-10">
        <BlurFade className="max-w-xl mx-auto bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl p-8 flex justify-center gap-6 md:gap-12 shadow-xl">
          {[
            { v: t.d, l: "Días" },
            { v: t.h, l: "Horas" },
            { v: t.m, l: "Minutos" },
            { v: t.s, l: "Segundos" }
          ].map((item, idx) => (
            <div key={idx} className="text-center">
              <span className="block text-3xl md:text-5xl" style={{ fontFamily: "var(--font-fraunces)", color: C.accent }}>
                {String(item.v).padStart(2, "0")}
              </span>
              <span className="block text-[9px] uppercase tracking-[0.3em] mt-2" style={{ color: C.mid }}>
                {item.l}
              </span>
            </div>
          ))}
        </BlurFade>
      </section>

      {/* DETALLES */}
      <section className="py-24 px-4 relative z-10">
        <BlurFade className="max-w-3xl mx-auto space-y-8">
          {[wedding.ceremony, wedding.reception].map((ev, i) => (
            <div key={i} className="bg-white/50 backdrop-blur-xl border border-white/70 rounded-2xl p-8 md:p-10 shadow-lg flex flex-col md:flex-row items-center text-center md:text-left gap-8">
              <div className="md:w-1/3">
                <p className="text-4xl" style={{ fontFamily: "var(--font-script)", color: C.accent }}>{ev.time}</p>
                <p className="text-[9px] uppercase tracking-widest mt-2" style={{ color: C.mid }}>{ev.title}</p>
              </div>
              <div className="md:w-2/3">
                <h4 className="text-2xl mb-2" style={{ fontFamily: "var(--font-fraunces)" }}>{ev.place}</h4>
                <p className="text-sm mb-4" style={{ color: C.mid }}>{ev.address}</p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(ev.mapsQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-[9px] uppercase tracking-[0.3em] px-6 py-2 bg-white/80 rounded-full border border-white transition-colors hover:bg-white"
                  style={{ color: C.accent }}
                >
                  Abrir Mapa
                </a>
              </div>
            </div>
          ))}
        </BlurFade>
      </section>

      {/* RSVP */}
      <section className="py-24 px-4 relative z-10 text-center">
        <BlurFade className="max-w-md mx-auto">
          <div className="bg-white/60 backdrop-blur-2xl border border-white/80 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-3xl mb-4" style={{ fontFamily: "var(--font-fraunces)" }}>Esperamos verte</h2>
            <p className="text-sm mb-10" style={{ color: C.mid }}>Confirma tu asistencia antes del {wedding.rsvpDeadline}</p>
            <button
              className="w-full px-8 py-4 text-[10px] uppercase tracking-[0.4em] text-white rounded-full transition-opacity hover:opacity-90 shadow-md"
              style={{ backgroundColor: C.accent }}
            >
              Confirmar Ahora
            </button>
          </div>
        </BlurFade>
      </section>

      {/* FOOTER */}
      <footer className="py-12 relative z-10 text-center">
        <p className="text-xl" style={{ fontFamily: "var(--font-fraunces)", color: C.ink }}>
          {wedding.groom} &amp; {wedding.bride}
        </p>
      </footer>
    </div>
  );
}
