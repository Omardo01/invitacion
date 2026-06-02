"use client";

import Link from "next/link";
import { wedding } from "@/lib/wedding";
import { BlurFade, useCountdown } from "@/components/magic";

/* ─── Serif Editorial · blanco cálido, serif elegante, líneas finas ─── */
const C = {
  bg: "#faf9fc",      // blanco con matiz lila frío
  ink: "#221d2e",     // tinta violeta oscura
  mid: "#6b6480",     // gris-lila medio
  faint: "#a8a2b8",   // gris-lila tenue
  line: "#ece9f1",    // línea lila clara
  accent: "#8f7bb3",  // lila
};

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center px-5">
      <div className="text-4xl md:text-5xl tabular-nums" style={{ fontFamily: "var(--font-fraunces)", color: C.ink }}>
        {String(value).padStart(2, "0")}
      </div>
      <div className="text-[10px] uppercase tracking-[0.3em] mt-2" style={{ color: C.faint }}>{label}</div>
    </div>
  );
}

function Rule() {
  return <div className="h-px w-16 mx-auto my-8" style={{ backgroundColor: C.line }} />;
}

export default function Opcion16() {
  const t = useCountdown("2026-07-25T17:00:00");

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.bg, color: C.ink, fontFamily: "var(--font-fraunces)" }}>
      <Link href="/" className="fixed top-5 left-5 z-50 text-xs uppercase tracking-widest" style={{ color: C.mid, fontFamily: "var(--font-syne)" }}>← volver</Link>

      {/* HERO */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <BlurFade delay={0.1}>
          <p className="text-[11px] uppercase tracking-[0.45em] mb-12" style={{ color: C.faint, fontFamily: "var(--font-syne)" }}>
            Acompáñanos · {wedding.dateShort}
          </p>
        </BlurFade>
        <BlurFade delay={0.2} y={28}>
          <h1 className="text-6xl md:text-8xl leading-[1] tracking-tight">{wedding.groom}</h1>
          <p className="text-4xl my-3 italic font-light" style={{ color: C.accent }}>y</p>
          <h1 className="text-6xl md:text-8xl leading-[1] tracking-tight">{wedding.bride}</h1>
        </BlurFade>
        <BlurFade delay={0.4}>
          <Rule />
          <p className="text-base italic" style={{ color: C.mid }}>{wedding.dateLabel} de 2026 · {wedding.city}</p>
        </BlurFade>
        <BlurFade delay={0.6}>
          <div className="mt-14 flex divide-x" style={{ borderColor: C.line }}>
            <Stat value={t.d} label="días" /><Stat value={t.h} label="hrs" /><Stat value={t.m} label="min" /><Stat value={t.s} label="seg" />
          </div>
        </BlurFade>
      </section>

      {/* Historia */}
      <section className="py-28 px-6 border-t" style={{ borderColor: C.line }}>
        <BlurFade className="max-w-2xl mx-auto text-center">
          <p className="text-[11px] uppercase tracking-[0.4em] mb-8" style={{ color: C.faint, fontFamily: "var(--font-syne)" }}>Nuestra historia</p>
          <p className="text-2xl md:text-3xl leading-relaxed italic font-light">{wedding.story}</p>
        </BlurFade>
      </section>

      {/* Eventos */}
      <section className="py-28 px-6 border-t" style={{ borderColor: C.line }}>
        <BlurFade><p className="text-center text-[11px] uppercase tracking-[0.4em] mb-16" style={{ color: C.faint, fontFamily: "var(--font-syne)" }}>El gran día</p></BlurFade>
        <div className="max-w-2xl mx-auto space-y-16">
          {[wedding.ceremony, wedding.reception].map((ev, i) => (
            <BlurFade key={ev.title} delay={i * 0.12}>
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-[0.35em] mb-4" style={{ color: C.faint, fontFamily: "var(--font-syne)" }}>{ev.title}</p>
                <p className="text-6xl mb-3 tracking-tight" style={{ color: C.accent }}>{ev.time}</p>
                <p className="text-xl mb-1">{ev.place}</p>
                <p className="text-sm mb-6 italic" style={{ color: C.mid }}>{ev.address}</p>
                <a href={`https://maps.google.com/?q=${encodeURIComponent(ev.mapsQuery)}`} target="_blank" rel="noopener noreferrer"
                  className="inline-block text-[11px] uppercase tracking-[0.3em] border-b pb-1 transition-opacity hover:opacity-60"
                  style={{ borderColor: C.ink, fontFamily: "var(--font-syne)" }}>
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
          <p className="text-[11px] uppercase tracking-[0.4em] mb-4" style={{ color: C.faint, fontFamily: "var(--font-syne)" }}>Código de vestimenta</p>
          <p className="text-3xl italic" style={{ color: C.accent }}>{wedding.dressCode}</p>
        </BlurFade>
      </section>

      {/* Padrinos */}
      <section className="py-24 px-6 border-t" style={{ borderColor: C.line }}>
        <BlurFade><p className="text-center text-[11px] uppercase tracking-[0.4em] mb-12" style={{ color: C.faint, fontFamily: "var(--font-syne)" }}>Padrinos</p></BlurFade>
        <div className="max-w-2xl mx-auto grid sm:grid-cols-2 gap-x-12 gap-y-8 text-center">
          {wedding.godparents.map((gp, i) => (
            <BlurFade key={gp.role} delay={i * 0.08}>
              <p className="text-[10px] uppercase tracking-[0.3em] mb-1.5" style={{ color: C.faint, fontFamily: "var(--font-syne)" }}>{gp.role}</p>
              <p className="text-lg italic">{gp.names}</p>
            </BlurFade>
          ))}
        </div>
      </section>

      {/* Regalos */}
      <section className="py-24 px-6 border-t" style={{ borderColor: C.line }}>
        <BlurFade className="max-w-md mx-auto text-center">
          <p className="text-[11px] uppercase tracking-[0.4em] mb-3" style={{ color: C.faint, fontFamily: "var(--font-syne)" }}>Mesa de regalos</p>
          <p className="text-base italic mb-10" style={{ color: C.mid }}>Tu presencia es nuestro mayor regalo</p>
          <div className="divide-y" style={{ borderColor: C.line }}>
            {wedding.gifts.map((g) => (
              <a key={g.store} href={g.url} target="_blank" rel="noopener noreferrer"
                className="flex justify-between items-center py-4 transition-opacity hover:opacity-60">
                <span className="text-lg">{g.store}</span>
                <span className="text-xs uppercase tracking-widest" style={{ color: C.faint, fontFamily: "var(--font-syne)" }}>{g.code} →</span>
              </a>
            ))}
          </div>
        </BlurFade>
      </section>

      {/* RSVP */}
      <section className="py-32 px-6 border-t text-center" style={{ borderColor: C.line }}>
        <BlurFade className="max-w-md mx-auto">
          <h2 className="text-5xl italic mb-6" style={{ color: C.accent }}>¿Nos acompañas?</h2>
          <p className="mb-10 text-sm" style={{ color: C.mid, fontFamily: "var(--font-syne)" }}>Confirma antes del {wedding.rsvpDeadline}</p>
          <div className="inline-block px-10 py-3.5 text-[11px] uppercase tracking-[0.3em]" style={{ backgroundColor: C.accent, color: "#fff", fontFamily: "var(--font-syne)" }}>
            Confirmar asistencia
          </div>
          <p className="mt-6 text-xs italic" style={{ color: C.faint }}>Tu invitación personalizada tiene tu link de confirmación</p>
        </BlurFade>
      </section>

      <footer className="py-12 text-center border-t" style={{ borderColor: C.line }}>
        <p className="text-2xl italic mb-1">{wedding.groom} <span style={{ color: C.accent }}>&amp;</span> {wedding.bride}</p>
        <p className="text-[10px] uppercase tracking-[0.4em]" style={{ color: C.faint, fontFamily: "var(--font-syne)" }}>{wedding.dateShort}</p>
      </footer>
    </div>
  );
}
