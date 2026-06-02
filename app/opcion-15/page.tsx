"use client";

import Link from "next/link";
import { wedding } from "@/lib/wedding";
import { BlurFade, useCountdown } from "@/components/magic";

/* ─── Bruma Lila · clean, tarjetas suaves, lila/plata muy discreto ─── */
const C = {
  bg: "#f6f5f9",
  card: "#ffffff",
  ink: "#2a2535",
  mid: "#6e6880",
  faint: "#9d97ad",
  line: "#eceaf1",
  accent: "#8f7bb3",
  accentSoft: "#f0ecf6",
};

function SoftCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl ${className}`} style={{ backgroundColor: C.card, boxShadow: "0 1px 2px rgba(42,37,53,0.04), 0 8px 24px rgba(42,37,53,0.05)" }}>
      {children}
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-semibold tabular-nums" style={{ fontFamily: "var(--font-display)", color: C.ink }}>
        {String(value).padStart(2, "0")}
      </div>
      <div className="text-[10px] uppercase tracking-[0.25em] mt-1.5" style={{ color: C.faint }}>{label}</div>
    </div>
  );
}

export default function Opcion15() {
  const t = useCountdown("2026-07-25T17:00:00");

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.bg, color: C.ink, fontFamily: "var(--font-serif)" }}>
      <Link href="/" className="fixed top-5 left-5 z-50 text-xs uppercase tracking-widest" style={{ color: C.mid }}>← volver</Link>

      {/* HERO */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <BlurFade delay={0.1}>
          <span className="inline-block text-[10px] uppercase tracking-[0.3em] px-4 py-1.5 rounded-full mb-10"
            style={{ backgroundColor: C.accentSoft, color: C.accent }}>Nos casamos</span>
        </BlurFade>
        <BlurFade delay={0.2} y={28}>
          <h1 className="text-6xl md:text-8xl leading-[0.95] italic" style={{ fontFamily: "var(--font-display)" }}>
            {wedding.groom}
          </h1>
          <span className="block text-4xl my-2" style={{ fontFamily: "var(--font-script)", color: C.accent }}>&amp;</span>
          <h1 className="text-6xl md:text-8xl leading-[0.95] italic" style={{ fontFamily: "var(--font-display)" }}>
            {wedding.bride}
          </h1>
        </BlurFade>
        <BlurFade delay={0.4}>
          <p className="mt-8 text-sm uppercase tracking-[0.25em]" style={{ color: C.mid }}>{wedding.dateLabel} · 2026 · {wedding.city}</p>
        </BlurFade>
        <BlurFade delay={0.6}>
          <SoftCard className="mt-14 px-10 py-6">
            <div className="flex gap-8">
              <Stat value={t.d} label="días" /><Stat value={t.h} label="hrs" /><Stat value={t.m} label="min" /><Stat value={t.s} label="seg" />
            </div>
          </SoftCard>
        </BlurFade>
      </section>

      {/* Historia */}
      <section className="py-24 px-6">
        <BlurFade className="max-w-xl mx-auto">
          <SoftCard className="p-12 text-center">
            <p className="text-[11px] uppercase tracking-[0.35em] mb-6" style={{ color: C.accent }}>Nuestra historia</p>
            <p className="text-lg leading-relaxed" style={{ color: C.mid }}>{wedding.story}</p>
          </SoftCard>
        </BlurFade>
      </section>

      {/* Eventos */}
      <section className="py-16 px-6">
        <BlurFade><p className="text-center text-[11px] uppercase tracking-[0.35em] mb-12" style={{ color: C.accent }}>El gran día</p></BlurFade>
        <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
          {[wedding.ceremony, wedding.reception].map((ev, i) => (
            <BlurFade key={ev.title} delay={i * 0.12}>
              <SoftCard className="p-9 text-center h-full">
                <p className="text-[10px] uppercase tracking-[0.3em] mb-3" style={{ color: C.faint }}>{ev.title}</p>
                <p className="text-5xl mb-3" style={{ fontFamily: "var(--font-display)", color: C.accent }}>{ev.time}</p>
                <p className="text-base font-semibold mb-1">{ev.place}</p>
                <p className="text-sm mb-6" style={{ color: C.mid }}>{ev.address}</p>
                <a href={`https://maps.google.com/?q=${encodeURIComponent(ev.mapsQuery)}`} target="_blank" rel="noopener noreferrer"
                  className="inline-block text-[11px] uppercase tracking-[0.25em] px-6 py-2.5 rounded-full transition-opacity hover:opacity-70"
                  style={{ backgroundColor: C.accentSoft, color: C.accent }}>
                  Ver mapa
                </a>
              </SoftCard>
            </BlurFade>
          ))}
        </div>
      </section>

      {/* Dress code */}
      <section className="py-16 px-6">
        <BlurFade className="max-w-sm mx-auto">
          <SoftCard className="p-9 text-center">
            <p className="text-[11px] uppercase tracking-[0.35em] mb-3" style={{ color: C.accent }}>Código de vestimenta</p>
            <p className="text-2xl font-semibold">{wedding.dressCode}</p>
            <div className="flex justify-center gap-2 mt-4">
              {["#ffffff", C.accentSoft, "#cabfe0", C.accent].map((c) => (
                <span key={c} className="w-5 h-5 rounded-full" style={{ backgroundColor: c, border: `1px solid ${C.line}` }} />
              ))}
            </div>
          </SoftCard>
        </BlurFade>
      </section>

      {/* Regalos */}
      <section className="py-16 px-6">
        <BlurFade className="max-w-md mx-auto">
          <SoftCard className="p-10 text-center">
            <p className="text-[11px] uppercase tracking-[0.35em] mb-3" style={{ color: C.accent }}>Mesa de regalos</p>
            <p className="text-sm mb-8" style={{ color: C.mid }}>Tu presencia es nuestro mayor regalo</p>
            <div className="space-y-3">
              {wedding.gifts.map((g) => (
                <a key={g.store} href={g.url} target="_blank" rel="noopener noreferrer"
                  className="flex justify-between items-center px-5 py-3.5 rounded-2xl transition-colors hover:opacity-70"
                  style={{ backgroundColor: C.bg }}>
                  <span className="font-semibold text-sm">{g.store}</span>
                  <span className="text-xs uppercase tracking-widest" style={{ color: C.accent }}>{g.code} →</span>
                </a>
              ))}
            </div>
          </SoftCard>
        </BlurFade>
      </section>

      {/* RSVP */}
      <section className="py-28 px-6">
        <BlurFade className="max-w-md mx-auto">
          <SoftCard className="p-12 text-center">
            <h2 className="text-4xl italic mb-4" style={{ fontFamily: "var(--font-display)", color: C.accent }}>¿Nos acompañas?</h2>
            <p className="mb-9 text-sm" style={{ color: C.mid }}>Confirma antes del {wedding.rsvpDeadline}</p>
            <div className="inline-block px-10 py-3.5 rounded-full text-[11px] uppercase tracking-[0.3em] text-white" style={{ backgroundColor: C.accent }}>
              Confirmar asistencia
            </div>
            <p className="mt-6 text-xs" style={{ color: C.faint }}>Tu invitación personalizada tiene tu link de confirmación</p>
          </SoftCard>
        </BlurFade>
      </section>

      <footer className="py-12 text-center">
        <p className="text-3xl italic mb-1" style={{ fontFamily: "var(--font-script)", color: C.accent }}>{wedding.groom} &amp; {wedding.bride}</p>
        <p className="text-[10px] uppercase tracking-[0.4em]" style={{ color: C.faint }}>{wedding.dateShort}</p>
      </footer>
    </div>
  );
}
