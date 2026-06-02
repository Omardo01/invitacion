"use client";

import Link from "next/link";
import Image from "next/image";
import { BlurFade, useCountdown } from "@/components/magic";
import { wedding } from "@/lib/wedding";

/* ─── Álbum Fotográfico Lavanda · Layout Asimétrico y Limpio ─── */
const C = {
  bg: "#ffffff",
  ink: "#1f1d24",
  mid: "#787182",
  faint: "#b3aebf",
  line: "#e8e6eb",
  lila: "#e6dcf5",
  lilaDeep: "#927bb3",
  plata: "#d1d5db",
};

export default function Opcion30() {
  const t = useCountdown("2026-07-25T17:00:00");

  return (
    <div className="min-h-screen bg-white" style={{ color: C.ink, fontFamily: "var(--font-marcellus)" }}>
      <Link href="/" className="fixed top-6 left-6 z-50 text-[10px] uppercase tracking-[0.4em] px-4 py-2 bg-white/80 backdrop-blur border transition-all hover:bg-neutral-50" style={{ borderColor: C.line, color: C.mid }}>
        ← Inicio
      </Link>

      {/* HEADER / HERO ASIMÉTRICO */}
      <section className="min-h-screen flex flex-col md:flex-row">
        {/* Lado Fotografía */}
        <div className="flex-1 relative min-h-[50vh] md:min-h-screen bg-neutral-100 p-6 md:p-12 flex items-center justify-center">
          <BlurFade delay={0.2} className="relative w-full max-w-md aspect-[4/5] overflow-hidden shadow-2xl">
            <Image
              src="/1.jpg"
              alt="Gabriel y Zayra"
              fill
              priority
              className="object-cover"
            />
          </BlurFade>
        </div>

        {/* Lado Texto */}
        <div className="flex-1 flex flex-col justify-center px-8 py-20 md:px-20 relative">
          <div className="absolute top-0 left-0 w-px h-full" style={{ backgroundColor: C.line }} />
          
          <BlurFade delay={0.4}>
            <p className="text-[10px] uppercase tracking-[0.5em] mb-10" style={{ color: C.lilaDeep }}>
              Invitación de Boda
            </p>
            <h1 className="text-6xl md:text-8xl font-light tracking-tight leading-[0.85] mb-2">
              {wedding.groom}
            </h1>
            <p className="text-5xl md:text-6xl my-2" style={{ fontFamily: "var(--font-script)", color: C.faint }}>
              y
            </p>
            <h1 className="text-6xl md:text-8xl font-light tracking-tight leading-[0.85] mb-12">
              {wedding.bride}
            </h1>

            <div className="flex items-center gap-6">
              <div>
                <p className="text-xl">{wedding.dateLabel}</p>
                <p className="text-[9px] uppercase tracking-[0.4em] mt-2" style={{ color: C.mid }}>2026 · {wedding.city}</p>
              </div>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* CRONÓMETRO */}
      <section className="py-20 px-6 border-t" style={{ borderColor: C.line }}>
        <BlurFade className="max-w-4xl mx-auto flex flex-wrap justify-center gap-12 md:gap-24 text-center">
          {[
            { v: t.d, l: "días" },
            { v: t.h, l: "horas" },
            { v: t.m, l: "minutos" },
            { v: t.s, l: "segundos" }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="text-5xl md:text-6xl tabular-nums tracking-tighter" style={{ color: C.lilaDeep }}>
                {String(item.v).padStart(2, "0")}
              </span>
              <span className="text-[9px] uppercase tracking-[0.4em] mt-4" style={{ color: C.mid }}>
                {item.l}
              </span>
            </div>
          ))}
        </BlurFade>
      </section>

      {/* ITINERARIO */}
      <section className="py-24 px-6 relative" style={{ backgroundColor: C.lila }}>
        <BlurFade className="max-w-4xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.5em] text-center mb-16" style={{ color: C.mid }}>
            Itinerario
          </p>
          <div className="space-y-12">
            {[wedding.ceremony, wedding.reception].map((ev, i) => (
              <BlurFade key={i} delay={i * 0.15} className="flex flex-col md:flex-row items-center gap-8 md:gap-16 border-b pb-12" style={{ borderColor: C.line }}>
                <div className="w-full md:w-1/3 text-center md:text-right">
                  <p className="text-4xl" style={{ fontFamily: "var(--font-script)", color: C.lilaDeep }}>
                    {ev.time}
                  </p>
                  <p className="text-[9px] uppercase tracking-widest mt-2" style={{ color: C.mid }}>{ev.title}</p>
                </div>
                <div className="w-full md:w-2/3 text-center md:text-left">
                  <h4 className="text-2xl mb-2">{ev.place}</h4>
                  <p className="text-sm font-light mb-4" style={{ color: C.mid, fontFamily: "var(--font-sans)" }}>{ev.address}</p>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(ev.mapsQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-[9px] uppercase tracking-[0.3em] pb-1 border-b transition-opacity hover:opacity-60"
                    style={{ color: C.ink, borderColor: C.ink }}
                  >
                    Ver Mapa
                  </a>
                </div>
              </BlurFade>
            ))}
          </div>
        </BlurFade>
      </section>

      {/* DETALLES Y REGALOS */}
      <section className="py-24 px-6 max-w-5xl mx-auto grid md:grid-cols-2 gap-16 md:gap-12">
        {/* Dress Code */}
        <BlurFade className="p-12 text-center border" style={{ borderColor: C.line }}>
          <p className="text-[9px] uppercase tracking-[0.5em] mb-6" style={{ color: C.mid }}>Vestimenta</p>
          <h3 className="text-3xl mb-8">{wedding.dressCode}</h3>
          <div className="flex justify-center gap-4">
            {wedding.dressCodePalette.map((col) => (
              <div
                key={col.name}
                className="w-10 h-10 rounded-full"
                style={{ backgroundColor: col.hex }}
                title={col.name}
              />
            ))}
          </div>
        </BlurFade>

        {/* Regalos */}
        <BlurFade delay={0.2} className="p-12 text-center border" style={{ borderColor: C.line }}>
          <p className="text-[9px] uppercase tracking-[0.5em] mb-6" style={{ color: C.mid }}>Mesa de Regalos</p>
          <div className="space-y-6">
            {wedding.gifts.map((g) => (
              <a
                key={g.store}
                href={g.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 border transition-colors hover:bg-neutral-50"
                style={{ borderColor: C.line }}
              >
                <span className="block text-lg mb-1">{g.store}</span>
                <span className="block text-[10px] uppercase tracking-[0.3em]" style={{ color: C.mid, fontFamily: "var(--font-sans)" }}>{g.code}</span>
              </a>
            ))}
          </div>
        </BlurFade>
      </section>

      {/* CONFIRMACIÓN */}
      <section className="py-32 px-6 text-center border-t" style={{ borderColor: C.line }}>
        <BlurFade className="max-w-md mx-auto">
          <h2 className="text-5xl mb-4">Confirmación</h2>
          <p className="text-sm font-light mb-12" style={{ color: C.mid, fontFamily: "var(--font-sans)" }}>
            Por favor, confírmanos tu asistencia antes del {wedding.rsvpDeadline}.
          </p>
          <button
            className="w-full sm:w-auto px-12 py-4 text-[10px] uppercase tracking-[0.4em] transition-opacity hover:opacity-80"
            style={{ backgroundColor: C.lilaDeep, color: "#fff" }}
          >
            Confirmar Asistencia
          </button>
        </BlurFade>
      </section>

      <footer className="py-16 text-center border-t" style={{ borderColor: C.line, backgroundColor: C.bg }}>
        <p className="text-4xl mb-2" style={{ fontFamily: "var(--font-script)" }}>
          {wedding.groom} &amp; {wedding.bride}
        </p>
      </footer>
    </div>
  );
}
