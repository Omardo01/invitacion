"use client";

import Link from "next/link";
import { wedding } from "@/lib/wedding";
import { BlurFade, useCountdown } from "@/components/magic";

/* ─── Monocromo · ultra minimalista, blanco/gris, un acento sutil ─── */
const C = {
  bg: "#fafafa",
  card: "#ffffff",
  ink: "#18181b",
  mid: "#71717a",
  faint: "#a1a1aa",
  line: "#ececef",
  accent: "#52525b",
};

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-medium tabular-nums" style={{ fontFamily: "var(--font-syne)", color: C.ink }}>
        {String(value).padStart(2, "0")}
      </div>
      <div className="text-[10px] uppercase tracking-[0.25em] mt-1.5" style={{ color: C.faint }}>{label}</div>
    </div>
  );
}

export default function Opcion14() {
  const t = useCountdown("2026-07-25T17:00:00");

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.bg, color: C.ink, fontFamily: "var(--font-syne)" }}>
      <Link href="/" className="fixed top-5 left-5 z-50 text-xs uppercase tracking-widest" style={{ color: C.mid }}>← volver</Link>

      {/* HERO */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <BlurFade delay={0.1}>
          <p className="text-[11px] uppercase tracking-[0.4em] mb-10" style={{ color: C.faint }}>Nos casamos</p>
        </BlurFade>
        <BlurFade delay={0.2} y={28}>
          <h1 className="text-5xl md:text-7xl font-medium tracking-tight leading-[1.05]">
            {wedding.groom}
            <span className="font-light" style={{ color: C.faint }}> &amp; </span>
            {wedding.bride}
          </h1>
        </BlurFade>
        <BlurFade delay={0.4}>
          <div className="mt-8 flex items-center gap-4 text-sm" style={{ color: C.mid }}>
            <span className="uppercase tracking-[0.25em]">{wedding.dateShort}</span>
            <span style={{ color: C.line }}>·</span>
            <span className="uppercase tracking-[0.25em]">{wedding.city}</span>
          </div>
        </BlurFade>
        <BlurFade delay={0.6}>
          <div className="mt-16 flex gap-8">
            <Stat value={t.d} label="días" /><Stat value={t.h} label="hrs" /><Stat value={t.m} label="min" /><Stat value={t.s} label="seg" />
          </div>
        </BlurFade>
      </section>

      {/* Historia */}
      <section className="py-28 px-6 border-t" style={{ borderColor: C.line }}>
        <BlurFade className="max-w-xl mx-auto text-center">
          <p className="text-[11px] uppercase tracking-[0.35em] mb-8" style={{ color: C.faint }}>Nuestra historia</p>
          <p className="text-xl leading-relaxed font-light" style={{ color: C.mid }}>{wedding.story}</p>
        </BlurFade>
      </section>

      {/* Eventos */}
      <section className="py-28 px-6 border-t" style={{ borderColor: C.line }}>
        <BlurFade><p className="text-center text-[11px] uppercase tracking-[0.35em] mb-16" style={{ color: C.faint }}>El gran día</p></BlurFade>
        <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-px" style={{ backgroundColor: C.line }}>
          {[wedding.ceremony, wedding.reception].map((ev, i) => (
            <BlurFade key={ev.title} delay={i * 0.12}>
              <div className="p-10 text-center h-full" style={{ backgroundColor: C.bg }}>
                <p className="text-[10px] uppercase tracking-[0.3em] mb-4" style={{ color: C.faint }}>{ev.title}</p>
                <p className="text-5xl font-medium mb-4 tracking-tight">{ev.time}</p>
                <p className="text-base font-medium mb-1">{ev.place}</p>
                <p className="text-sm mb-7 font-light" style={{ color: C.mid }}>{ev.address}</p>
                <a href={`https://maps.google.com/?q=${encodeURIComponent(ev.mapsQuery)}`} target="_blank" rel="noopener noreferrer"
                  className="inline-block text-[11px] uppercase tracking-[0.25em] border-b pb-0.5 transition-colors hover:opacity-60"
                  style={{ borderColor: C.ink }}>
                  Ver mapa
                </a>
              </div>
            </BlurFade>
          ))}
        </div>
      </section>

      {/* Dress code */}
      <section className="py-24 px-6 border-t text-center" style={{ borderColor: C.line }}>
        <BlurFade className="max-w-sm mx-auto">
          <p className="text-[11px] uppercase tracking-[0.35em] mb-4" style={{ color: C.faint }}>Código de vestimenta</p>
          <p className="text-2xl font-medium">{wedding.dressCode}</p>
        </BlurFade>
      </section>

      {/* Regalos */}
      <section className="py-24 px-6 border-t" style={{ borderColor: C.line }}>
        <BlurFade className="max-w-md mx-auto text-center">
          <p className="text-[11px] uppercase tracking-[0.35em] mb-3" style={{ color: C.faint }}>Mesa de regalos</p>
          <p className="text-sm font-light mb-10" style={{ color: C.mid }}>Tu presencia es nuestro mayor regalo</p>
          <div className="divide-y" style={{ borderColor: C.line }}>
            {wedding.gifts.map((g) => (
              <a key={g.store} href={g.url} target="_blank" rel="noopener noreferrer"
                className="flex justify-between items-center py-4 transition-opacity hover:opacity-60" style={{ borderColor: C.line }}>
                <span className="font-medium text-sm">{g.store}</span>
                <span className="text-xs uppercase tracking-widest" style={{ color: C.faint }}>{g.code} →</span>
              </a>
            ))}
          </div>
        </BlurFade>
      </section>

      {/* RSVP */}
      <section className="py-32 px-6 border-t text-center" style={{ borderColor: C.line }}>
        <BlurFade className="max-w-md mx-auto">
          <h2 className="text-4xl font-medium tracking-tight mb-5">¿Nos acompañas?</h2>
          <p className="mb-10 text-sm font-light" style={{ color: C.mid }}>Confirma antes del {wedding.rsvpDeadline}</p>
          <div className="inline-block px-10 py-3.5 text-[11px] uppercase tracking-[0.3em] rounded-full" style={{ backgroundColor: C.ink, color: C.bg }}>
            Confirmar asistencia
          </div>
          <p className="mt-6 text-xs font-light" style={{ color: C.faint }}>Tu invitación personalizada tiene tu link de confirmación</p>
        </BlurFade>
      </section>

      <footer className="py-12 text-center border-t" style={{ borderColor: C.line }}>
        <p className="text-sm uppercase tracking-[0.3em]" style={{ color: C.faint }}>{wedding.groom} &amp; {wedding.bride} · {wedding.dateShort}</p>
      </footer>
    </div>
  );
}
