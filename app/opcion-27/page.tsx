"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { wedding } from "@/lib/wedding";
import { BlurFade, useCountdown } from "@/components/magic";
import { LavenderSprig } from "@/components/floral";

/* ─── Lavanda Editorial · estilo invitación vertical premium (Osvaldo & Any) ─── */
const C = {
  bg: "#f5f3ef",
  paper: "#ffffff",
  ink: "#4a4458",
  mid: "#6e6680",
  faint: "#9a93a8",
  line: "#e7e2ee",
  lav: "#b9a5d4",
  lavDeep: "#8b75ac",
  lavBlock: "#c4b4dd",
};

const LAV = ["#b9a5d4", "#a48fc4", "#cdbce4", "#8b75ac"];

/* ── iconos line-art ── */
const ico = "stroke-current fill-none";
function IconToast({ c = C.lavDeep }: { c?: string }) {
  return <svg width="40" height="40" viewBox="0 0 40 40" className={ico} stroke={c} strokeWidth="1.2"><path d="M12 6l3 10c0 3-6 3-6 0l3-10z" /><path d="M28 6l-3 10c0 3 6 3 6 0l-3-10z" /><path d="M15 16v14M25 16v14M11 32h8M21 32h8" /><path d="M12 6h6M22 6h6" /></svg>;
}
function IconRings({ c = C.lavDeep }: { c?: string }) {
  return <svg width="40" height="40" viewBox="0 0 40 40" className={ico} stroke={c} strokeWidth="1.2"><circle cx="15" cy="24" r="9" /><circle cx="25" cy="24" r="9" /><path d="M22 9l3 4 3-4-3-3z" /></svg>;
}
function IconPlate({ c = C.lavDeep }: { c?: string }) {
  return <svg width="40" height="40" viewBox="0 0 40 40" className={ico} stroke={c} strokeWidth="1.2"><circle cx="20" cy="20" r="11" /><circle cx="20" cy="20" r="6" /><path d="M8 9v8M8 9c-2 1-2 7 0 8M32 9v22M32 9c2 1 2 8-2 9" /></svg>;
}
function IconDance({ c = C.lavDeep }: { c?: string }) {
  return <svg width="40" height="40" viewBox="0 0 40 40" className={ico} stroke={c} strokeWidth="1.2"><circle cx="14" cy="9" r="3" /><circle cx="27" cy="10" r="3" /><path d="M14 12l-2 9 3 9M14 12l5 3 6-2M27 13l3 8-2 8M27 13l-5 2" /></svg>;
}
function IconCar({ c = C.lavDeep }: { c?: string }) {
  return <svg width="48" height="32" viewBox="0 0 48 32" className={ico} stroke={c} strokeWidth="1.2"><path d="M4 22h40M8 22l3-9h18l7 9M14 13v9M22 13v9" /><circle cx="14" cy="24" r="3" /><circle cx="34" cy="24" r="3" /><path d="M30 8c2 0 3 1 3 2" /></svg>;
}
function IconCouple({ c = C.lavDeep }: { c?: string }) {
  return <svg width="56" height="64" viewBox="0 0 56 64" className={ico} stroke={c} strokeWidth="1.1"><circle cx="18" cy="12" r="5" /><path d="M18 17c-4 0-6 3-7 8l-3 16h8l2 14h0l2-14h8l-3-16c-1-5-3-8-7-8z" /><circle cx="40" cy="12" r="5" /><path d="M40 17c4 0 6 4 6 9v12h-3l-1 17h-4l-1-17h-3V26c0-5 2-9 6-9z" /></svg>;
}

function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const toggle = async () => {
    const el = audioRef.current;
    if (!el) return;
    try {
      if (playing) { el.pause(); setPlaying(false); }
      else { await el.play(); setPlaying(true); }
    } catch { setPlaying(false); }
  };
  return (
    <div className="max-w-xs mx-auto">
      <audio ref={audioRef} src={wedding.music.src} loop preload="none" />
      <p className="text-[10px] uppercase tracking-[0.35em] text-center mb-4" style={{ color: C.faint }}>Doble click para reproducir</p>
      <div className="flex items-center justify-between text-[10px] tabular-nums mb-2" style={{ color: C.mid }}>
        <span>01:10</span><span>04:15</span>
      </div>
      <div className="h-1 rounded-full mb-4 overflow-hidden" style={{ backgroundColor: C.line }}>
        <motion.div className="h-full rounded-full" style={{ backgroundColor: C.lav }}
          animate={{ width: playing ? "100%" : "28%" }} transition={{ duration: playing ? 180 : 0.6, ease: "linear" }} />
      </div>
      <div className="flex items-center justify-center gap-6" style={{ color: C.lavDeep }}>
        <span className="text-lg opacity-60">⇄</span>
        <span className="text-xl opacity-60">⏮</span>
        <button onClick={toggle} onDoubleClick={toggle} className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg" style={{ backgroundColor: C.lavDeep }}>
          {playing ? "❚❚" : "▶"}
        </button>
        <span className="text-xl opacity-60">⏭</span>
        <span className="text-lg opacity-60">⇆</span>
      </div>
    </div>
  );
}

function ArchTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-4xl md:text-5xl text-center mb-8" style={{ fontFamily: "var(--font-great-vibes)", color: C.lavDeep }}>{children}</h2>;
}

const parents = {
  novia: ["Edith Guamán Tinoco", "Humberto Benito González"],
  novio: ["Catalina Núñez Martínez", "Alfredo Maldonado Reyes"],
};

const itinerary = [
  { time: "17:00", label: "Recepción", Icon: IconToast },
  { time: "17:30", label: "Ceremonia Civil", Icon: IconRings },
  { time: "19:00", label: "Cena", Icon: IconPlate },
  { time: "21:00", label: "Baile", Icon: IconDance },
];

export default function Opcion27() {
  const t = useCountdown("2026-07-25T17:00:00");

  return (
    <div style={{ backgroundColor: C.bg, color: C.ink, fontFamily: "var(--font-marcellus)" }} className="min-h-screen overflow-x-hidden">
      <Link href="/" className="fixed top-5 left-5 z-50 text-xs uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur"
        style={{ color: C.lavDeep, backgroundColor: "rgba(255,255,255,0.75)" }}>← volver</Link>

      {/* lienzo vertical centrado tipo "story" */}
      <div className="max-w-xl mx-auto" style={{ backgroundColor: C.paper }}>

        {/* HERO */}
        <section className="relative px-6 pt-16 pb-10 overflow-hidden">
          <BlurFade>
            <p className="text-center text-2xl md:text-3xl tracking-[0.35em] mb-8" style={{ color: C.ink }}>
              {wedding.groom.toUpperCase()} <span style={{ color: C.lav }}>&amp;</span> {wedding.bride.toUpperCase()}
            </p>
          </BlurFade>

          <div className="relative mx-auto w-full max-w-sm">
            {/* foto principal en arco */}
            <BlurFade delay={0.15}>
              <div className="relative w-3/4 mx-auto aspect-[3/4] rounded-t-[999px] overflow-hidden"
                style={{ boxShadow: `0 0 0 2px ${C.paper}, 0 0 0 3px ${C.lav}` }}>
                <Image src="/1.jpg" alt={`${wedding.groom} y ${wedding.bride}`} fill priority sizes="300px" className="object-cover" />
              </div>
            </BlurFade>
            {/* foto B/N superpuesta */}
            <BlurFade delay={0.35}>
              <div className="absolute bottom-0 right-2 w-2/5 aspect-square rounded-lg overflow-hidden"
                style={{ boxShadow: `0 0 0 3px ${C.paper}, 0 8px 20px rgba(0,0,0,0.18)` }}>
                <Image src="/1.jpg" alt="" fill sizes="160px" className="object-cover grayscale" style={{ objectPosition: "50% 70%" }} />
              </div>
            </BlurFade>
            {/* lavanda acuarela */}
            <LavenderSprig className="absolute -bottom-4 -left-4 w-24" purples={LAV} delay={0.3} />
          </div>
        </section>

        {/* Música */}
        <section className="px-6 py-10 border-t" style={{ borderColor: C.line }}>
          <MusicPlayer />
        </section>

        {/* Historia */}
        <section className="px-8 py-12 text-center border-t" style={{ borderColor: C.line }}>
          <BlurFade>
            <p className="text-[15px] leading-relaxed uppercase tracking-wide" style={{ color: C.mid }}>
              {wedding.story}
            </p>
          </BlurFade>
        </section>

        {/* Nuestros padres */}
        <section className="px-8 py-12 text-center border-t" style={{ borderColor: C.line }}>
          <ArchTitle>Nuestros padres</ArchTitle>
          <div className="grid grid-cols-2 gap-6">
            {[["De la novia", parents.novia], ["Del novio", parents.novio]].map(([role, names]) => (
              <div key={role as string}>
                <p className="text-[11px] uppercase tracking-[0.3em] font-bold mb-2" style={{ color: C.ink }}>{role as string}</p>
                {(names as string[]).map((n) => <p key={n} className="text-sm" style={{ color: C.mid }}>{n}</p>)}
              </div>
            ))}
          </div>
        </section>

        {/* Guarda la fecha */}
        <section className="px-8 py-12 text-center border-t" style={{ borderColor: C.line }}>
          <ArchTitle>Guarda la fecha</ArchTitle>
          <div className="flex items-center justify-center gap-5">
            <span className="text-sm uppercase tracking-[0.25em]" style={{ color: C.ink }}>Sábado</span>
            <span className="text-6xl tabular-nums px-4" style={{ fontFamily: "var(--font-fraunces)", color: C.lavDeep, borderLeft: `1px solid ${C.lav}`, borderRight: `1px solid ${C.lav}` }}>25</span>
            <span className="text-sm uppercase tracking-[0.25em]" style={{ color: C.ink }}>Julio</span>
          </div>
          <p className="mt-2 text-sm" style={{ color: C.mid }}>2026</p>
          <div className="mt-8 flex justify-center gap-5">
            {[["d", t.d, "días"], ["h", t.h, "hrs"], ["m", t.m, "min"], ["s", t.s, "seg"]].map(([k, v, l]) => (
              <div key={k as string} className="text-center">
                <div className="text-2xl tabular-nums" style={{ fontFamily: "var(--font-fraunces)", color: C.lavDeep }}>{String(v).padStart(2, "0")}</div>
                <div className="text-[9px] uppercase tracking-[0.2em] mt-0.5" style={{ color: C.faint }}>{l as string}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Foto pareja */}
        <section className="relative px-6 py-12 border-t overflow-hidden" style={{ borderColor: C.line }}>
          <BlurFade>
            <div className="relative w-3/4 mx-auto aspect-[3/4] rounded-2xl overflow-hidden" style={{ boxShadow: `0 0 0 2px ${C.paper}, 0 0 0 3px ${C.lav}` }}>
              <Image src="/1.jpg" alt="" fill sizes="320px" className="object-cover" style={{ objectPosition: "50% 30%" }} />
            </div>
          </BlurFade>
          <LavenderSprig className="absolute bottom-2 right-0 w-20" purples={LAV} mirror />
        </section>

        {/* Recepción */}
        <section className="px-8 py-12 text-center border-t" style={{ borderColor: C.line }}>
          <ArchTitle>Recepción</ArchTitle>
          <div className="flex justify-center mb-4"><IconToast /></div>
          <p className="text-xl font-semibold">{wedding.reception.time.replace(":00", ":00 P.M.")}</p>
          <p className="text-sm mb-5" style={{ color: C.mid }}>{wedding.reception.place}</p>
          <a href={`https://maps.google.com/?q=${encodeURIComponent(wedding.reception.mapsQuery)}`} target="_blank" rel="noopener noreferrer"
            className="inline-block px-8 py-3 rounded text-white text-sm tracking-wide" style={{ backgroundColor: C.lavBlock }}>
            Ver Ubicación
          </a>
        </section>

        {/* Dress code */}
        <section className="px-8 py-12 text-center border-t" style={{ borderColor: C.line }}>
          <ArchTitle>Dress Code</ArchTitle>
          <div className="flex justify-center mb-4"><IconCouple /></div>
          <p className="text-lg font-bold uppercase tracking-[0.2em] mb-3" style={{ color: C.ink }}>Semi Formal</p>
          <p className="text-sm max-w-xs mx-auto" style={{ color: C.mid }}>Por favor evita el color blanco, ese color queda reservado para la novia.</p>
        </section>

        {/* Monograma + laurel */}
        <section className="px-8 py-12 text-center border-t" style={{ borderColor: C.line }}>
          <div className="relative inline-block">
            <LavenderSprig className="absolute -top-6 -left-16 w-28 -rotate-[40deg]" purples={LAV} animate={false} />
            <LavenderSprig className="absolute -top-6 -right-16 w-28 rotate-[40deg]" purples={LAV} mirror animate={false} />
            <p className="text-4xl tracking-wide" style={{ fontFamily: "var(--font-fraunces)", color: C.lavDeep }}>
              {wedding.groom[0]}&amp;{wedding.bride[0]}
            </p>
          </div>
        </section>

        {/* Itinerario */}
        <section className="px-8 py-14 text-center border-t" style={{ borderColor: C.line }}>
          <ArchTitle>Itinerario de Boda</ArchTitle>
          <div className="relative max-w-sm mx-auto">
            <div className="absolute left-1/2 top-2 bottom-2 w-px -translate-x-1/2" style={{ backgroundColor: C.lav }} />
            <div className="space-y-8">
              {itinerary.map((it, i) => (
                <BlurFade key={it.label} delay={i * 0.1}>
                  <div className="grid grid-cols-2 items-center gap-4">
                    {i % 2 === 0 ? (
                      <>
                        <div className="flex justify-end pr-6"><it.Icon /></div>
                        <div className="text-left pl-6 relative">
                          <span className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: C.lavDeep }} />
                          <p className="text-sm font-semibold">{it.time.replace(":", ":")} <span className="text-[10px]">{Number(it.time.split(":")[0]) >= 12 ? "P.M." : "A.M."}</span></p>
                          <p className="text-[11px] uppercase tracking-[0.2em]" style={{ color: C.mid }}>{it.label}</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-right pr-6 relative">
                          <span className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: C.lavDeep }} />
                          <p className="text-sm font-semibold">{it.time} <span className="text-[10px]">P.M.</span></p>
                          <p className="text-[11px] uppercase tracking-[0.2em]" style={{ color: C.mid }}>{it.label}</p>
                        </div>
                        <div className="flex justify-start pl-6"><it.Icon /></div>
                      </>
                    )}
                  </div>
                </BlurFade>
              ))}
            </div>
            <div className="flex flex-col items-center mt-10">
              <IconCar />
              <p className="mt-2 text-[11px] uppercase tracking-[0.25em]" style={{ color: C.mid }}>01:00 A.M. · Nos despedimos</p>
            </div>
          </div>
          <LavenderSprig className="w-40 mx-auto mt-8 rotate-180" purples={LAV} />
        </section>

        {/* Confirmar */}
        <section className="px-8 py-14 text-center border-t" style={{ borderColor: C.line }}>
          <ArchTitle>Confirmar Asistencia</ArchTitle>
          <p className="text-sm uppercase tracking-wide mb-8 max-w-xs mx-auto" style={{ color: C.mid }}>
            Nuestro día será aún más especial si estás con nosotros. Confirma tu asistencia antes del {wedding.rsvpDeadline}.
          </p>
          <div className="inline-block px-10 py-3 rounded text-white text-sm tracking-wide cursor-pointer" style={{ backgroundColor: C.lavBlock }}>
            Confirmar Asistencia
          </div>
        </section>

        <footer className="px-8 py-12 text-center border-t" style={{ borderColor: C.line }}>
          <p className="text-4xl mb-2" style={{ fontFamily: "var(--font-great-vibes)", color: C.lavDeep }}>{wedding.groom} &amp; {wedding.bride}</p>
          <p className="text-[10px] uppercase tracking-[0.4em]" style={{ color: C.faint }}>{wedding.dateShort} · {wedding.city}</p>
        </footer>
      </div>
    </div>
  );
}
