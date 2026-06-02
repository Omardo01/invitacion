"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { wedding } from "@/lib/wedding";
import { BlurFade, useCountdown } from "@/components/magic";
import { LavenderSprig } from "@/components/floral";

/* ─── Lavanda Sobre · estilo invitación vertical premium (Camila & Sebastián) ─── */
const C = {
  bg: "#f6f4f0",
  paper: "#ffffff",
  ink: "#4a4458",
  mid: "#6e6680",
  faint: "#9a93a8",
  line: "#e7e2ee",
  lav: "#b9a5d4",
  lavDeep: "#8b75ac",
  block: "#c1b0db",
  blockSoft: "#cfc1e4",
};

const LAV = ["#b9a5d4", "#a48fc4", "#cdbce4", "#8b75ac"];

function IconRings({ c = C.lavDeep }: { c?: string }) {
  return <svg width="38" height="30" viewBox="0 0 40 32" className="fill-none" stroke={c} strokeWidth="1.2"><circle cx="15" cy="20" r="9" /><circle cx="25" cy="20" r="9" /><path d="M22 5l3 4 3-4-3-3z" /></svg>;
}
function IconTree({ c = C.lavDeep }: { c?: string }) {
  return <svg width="30" height="34" viewBox="0 0 30 34" className="fill-none" stroke={c} strokeWidth="1.1"><path d="M15 30V14M15 14l-7-6M15 14l7-6M15 20l-6-5M15 20l6-5M15 26l-5-4M15 26l5-4M15 8l-4-4M15 8l4-4" /></svg>;
}
function IconGift({ c = "#fff" }: { c?: string }) {
  return <svg width="34" height="34" viewBox="0 0 34 34" className="fill-none" stroke={c} strokeWidth="1.2"><rect x="5" y="13" width="24" height="16" rx="1" /><path d="M3 13h28v5H3zM17 13v16M17 13c-3-1-7-3-7-7 0-2 3-2 4 0 2 2 3 7 3 7zM17 13c3-1 7-3 7-7 0-2-3-2-4 0-2 2-3 7-3 7z" /></svg>;
}
function IconEnvelopeMini({ c = "#fff" }: { c?: string }) {
  return <svg width="30" height="24" viewBox="0 0 30 24" className="fill-none" stroke={c} strokeWidth="1.2"><rect x="2" y="3" width="26" height="18" rx="1" /><path d="M2 5l13 9 13-9" /></svg>;
}
function IconCalendarHeart({ c = "#fff" }: { c?: string }) {
  return <svg width="32" height="32" viewBox="0 0 32 32" className="fill-none" stroke={c} strokeWidth="1.2"><rect x="4" y="6" width="24" height="22" rx="2" /><path d="M4 12h24M10 3v6M22 3v6" /><path d="M16 24c-3-2-5-4-5-6 0-1.5 2-2 3-0.5 1-1.5 3-1 3 0.5 0 2-2 4-5 6z" /></svg>;
}
function IconDress({ c = C.lavDeep }: { c?: string }) {
  return <svg width="34" height="46" viewBox="0 0 34 46" className="fill-none" stroke={c} strokeWidth="1.1"><path d="M12 4h10M13 4l-3 5 3 4M21 4l3 5-3 4M13 13l-7 26h22l-7-26M13 13h8" /></svg>;
}
function IconSuit({ c = C.lavDeep }: { c?: string }) {
  return <svg width="34" height="46" viewBox="0 0 34 46" className="fill-none" stroke={c} strokeWidth="1.1"><path d="M11 6l6 4 6-4M11 6l-5 4 3 32h18l3-32-5-4M17 10v8M17 18l-3 6h6l-3-6" /></svg>;
}

function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const toggle = async () => {
    const el = audioRef.current; if (!el) return;
    try { if (playing) { el.pause(); setPlaying(false); } else { await el.play(); setPlaying(true); } } catch { setPlaying(false); }
  };
  return (
    <div className="max-w-[200px] mx-auto text-center">
      <audio ref={audioRef} src={wedding.music.src} loop preload="none" />
      <p className="text-xs mb-3" style={{ color: C.mid }}>Dale play a nuestra canción</p>
      <div className="flex items-center justify-center gap-5" style={{ color: C.lavDeep }}>
        <span className="opacity-50">⇄</span><span className="opacity-50">⏮</span>
        <button onClick={toggle} className="w-11 h-11 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: C.lavDeep }}>{playing ? "❚❚" : "▶"}</button>
        <span className="opacity-50">⏭</span><span className="opacity-50">⇆</span>
      </div>
    </div>
  );
}

function Calendar() {
  const year = 2026, month = 6, highlight = 25; // julio
  const startDay = (new Date(year, month, 1).getDay() + 6) % 7; // lunes primero
  const total = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(startDay).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)];
  return (
    <div className="max-w-[300px] mx-auto">
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["LUN", "MAR", "MIE", "JUE", "VIE", "SAB", "DOM"].map((d) => (
          <div key={d} className="text-[9px] uppercase tracking-wide text-center" style={{ color: C.faint }}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((n, i) => (
          <div key={i} className="aspect-square flex items-center justify-center text-xs tabular-nums">
            {n === highlight ? (
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: C.lavDeep }}>{n}</span>
            ) : (
              <span style={{ color: n ? C.mid : "transparent" }}>{n ?? "0"}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Script({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`text-4xl md:text-5xl text-center ${className}`} style={{ fontFamily: "var(--font-great-vibes)", color: C.lavDeep }}>{children}</h2>;
}

export default function Opcion28() {
  const t = useCountdown("2026-07-25T17:00:00");

  return (
    <div style={{ backgroundColor: C.bg, color: C.ink, fontFamily: "var(--font-marcellus)" }} className="min-h-screen overflow-x-hidden">
      <Link href="/" className="fixed top-5 left-5 z-50 text-xs uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur"
        style={{ color: C.lavDeep, backgroundColor: "rgba(255,255,255,0.75)" }}>← volver</Link>

      <div className="max-w-xl mx-auto" style={{ backgroundColor: C.paper }}>

        {/* SOBRE header */}
        <section className="relative px-8 pt-20 pb-16 text-center overflow-hidden" style={{ backgroundColor: C.block }}>
          {/* solapa del sobre */}
          <div className="absolute inset-x-0 bottom-0 h-24" style={{ background: C.blockSoft, clipPath: "polygon(0 0, 50% 70%, 100% 0, 100% 100%, 0 100%)", opacity: 0.6 }} />
          <BlurFade>
            <h1 className="text-6xl md:text-7xl leading-[0.9] text-white" style={{ fontFamily: "var(--font-great-vibes)" }}>{wedding.groom}</h1>
            <span className="block text-4xl my-1 text-white/90" style={{ fontFamily: "var(--font-great-vibes)" }}>&amp;</span>
            <h1 className="text-6xl md:text-7xl leading-[0.9] text-white" style={{ fontFamily: "var(--font-great-vibes)" }}>{wedding.bride}</h1>
            <p className="relative mt-8 text-sm tracking-[0.3em] text-white/90">{wedding.dateShort.replace(/\./g, ".")}</p>
          </BlurFade>
        </section>

        {/* Lavanda + intro */}
        <section className="relative px-10 pt-12 pb-10 text-center overflow-hidden">
          <LavenderSprig className="absolute top-0 left-0 w-28" purples={LAV} />
          <LavenderSprig className="absolute top-0 right-0 w-28" purples={LAV} mirror />
          <div className="flex justify-center mb-5 mt-6"><IconTree /></div>
          <BlurFade>
            <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ color: C.mid }}>
              Nos complace anunciar nuestro matrimonio y queremos compartir contigo este momento.
            </p>
          </BlurFade>
        </section>

        {/* Monograma */}
        <section className="px-8 py-8 text-center">
          <p className="text-4xl tracking-wide" style={{ fontFamily: "var(--font-fraunces)", color: C.ink }}>
            {wedding.groom[0]} <span style={{ color: C.lav }}>|</span> {wedding.bride[0]}
          </p>
        </section>

        {/* ¡Nos casamos! foto */}
        <section className="relative px-8 py-10 text-center overflow-hidden">
          <p className="text-sm uppercase tracking-[0.4em] mb-6" style={{ color: C.ink }}>¡Nos casamos!</p>
          <BlurFade>
            <div className="relative w-3/4 mx-auto aspect-[3/4] rounded-sm overflow-hidden" style={{ boxShadow: `0 0 0 6px ${C.paper}, 0 10px 30px rgba(0,0,0,0.15)` }}>
              <Image src="/1.jpg" alt={`${wedding.groom} y ${wedding.bride}`} fill priority sizes="320px" className="object-cover" />
            </div>
          </BlurFade>
          <LavenderSprig className="absolute bottom-2 right-2 w-20" purples={LAV} mirror />
          <p className="mt-8 text-sm italic max-w-xs mx-auto" style={{ color: C.mid }}>
            &ldquo;Nuestro amor nació en abril, crece cada día y permanecerá por siempre.&rdquo;
          </p>
        </section>

        {/* Música */}
        <section className="px-8 py-10 border-t" style={{ borderColor: C.line }}>
          <MusicPlayer />
        </section>

        {/* Bloque lavanda: fecha + countdown */}
        <section className="px-8 py-12 text-center text-white" style={{ backgroundColor: C.block }}>
          <div className="flex items-center justify-center gap-5 mb-2">
            <span className="text-sm uppercase tracking-[0.25em]">Sábado</span>
            <span className="text-5xl tabular-nums px-3" style={{ fontFamily: "var(--font-fraunces)", borderLeft: "1px solid rgba(255,255,255,0.5)", borderRight: "1px solid rgba(255,255,255,0.5)" }}>25</span>
            <span className="text-sm uppercase tracking-[0.25em]">2026</span>
          </div>
          <p className="text-xs uppercase tracking-[0.4em] opacity-90 mb-8">Julio</p>
          <p className="text-xs uppercase tracking-[0.4em] mb-4">Faltan</p>
          <div className="flex justify-center gap-2 text-2xl tabular-nums" style={{ fontFamily: "var(--font-fraunces)" }}>
            <span>{String(t.d).padStart(2, "0")}</span><span className="opacity-60">:</span>
            <span>{String(t.h).padStart(2, "0")}</span><span className="opacity-60">:</span>
            <span>{String(t.m).padStart(2, "0")}</span><span className="opacity-60">:</span>
            <span>{String(t.s).padStart(2, "0")}</span>
          </div>
          <div className="flex justify-center gap-8 text-[9px] uppercase tracking-[0.2em] mt-1 opacity-80">
            <span>días</span><span>horas</span><span>min</span><span>seg</span>
          </div>
        </section>

        {/* El gran día — calendario */}
        <section className="px-8 py-12 text-center border-t" style={{ borderColor: C.line }}>
          <p className="text-sm uppercase tracking-[0.35em] font-bold mb-1" style={{ color: C.ink }}>El gran día</p>
          <p className="text-xs uppercase tracking-[0.3em] mb-8" style={{ color: C.faint }}>Julio 2026</p>
          <Calendar />
        </section>

        {/* Lugar */}
        <section className="px-8 py-12 text-center border-t" style={{ borderColor: C.line }}>
          <div className="flex justify-center mb-4"><IconRings /></div>
          <Script className="mb-3">Lugar</Script>
          <p className="text-xl font-semibold">{wedding.reception.time.replace(":00", ":00 PM")}</p>
          <p className="text-base font-medium">{wedding.reception.place}</p>
          <p className="text-sm mb-5" style={{ color: C.mid }}>{wedding.reception.address}</p>
          <a href={`https://maps.google.com/?q=${encodeURIComponent(wedding.reception.mapsQuery)}`} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-white text-xs tracking-wide" style={{ backgroundColor: C.lavDeep }}>
            📍 Ver ubicación
          </a>
        </section>

        {/* Código de vestimenta */}
        <section className="relative px-8 py-12 text-center border-t overflow-hidden" style={{ borderColor: C.line }}>
          <LavenderSprig className="absolute bottom-0 left-0 w-24 opacity-80" purples={LAV} />
          <Script className="mb-2">Código de vestimenta</Script>
          <p className="text-sm uppercase tracking-[0.2em] mb-5" style={{ color: C.ink }}>Formal</p>
          <div className="flex justify-center gap-10 mb-6"><IconSuit /><IconDress /></div>
          <div className="text-sm max-w-xs mx-auto space-y-1" style={{ color: C.mid }}>
            <p><strong style={{ color: C.ink }}>Mujeres:</strong> {wedding.dressCodeNotes.ellas}</p>
            <p><strong style={{ color: C.ink }}>Hombres:</strong> {wedding.dressCodeNotes.ellos}</p>
          </div>
        </section>

        {/* Sugerencia de regalo — bloque lavanda */}
        <section className="px-8 py-14 text-center text-white" style={{ backgroundColor: C.block }}>
          <div className="flex justify-center mb-4"><IconGift /></div>
          <h2 className="text-4xl mb-4" style={{ fontFamily: "var(--font-great-vibes)" }}>Sugerencia de regalo</h2>
          <p className="text-sm opacity-90 max-w-xs mx-auto mb-8">
            El mejor regalo es tu presencia, pero si deseas tener un detalle con nosotros, te dejamos estas opciones.
          </p>
          <div className="flex items-center justify-center gap-2 mb-3"><IconEnvelopeMini /><span className="text-sm uppercase tracking-[0.2em]">Lluvia de sobres</span></div>
          <div className="space-y-2 text-sm opacity-90">
            {wedding.gifts.map((g) => (
              <a key={g.store} href={g.url} target="_blank" rel="noopener noreferrer" className="block underline-offset-4 hover:underline">
                {g.store} · {g.code}
              </a>
            ))}
          </div>
        </section>

        {/* Confirmación — bloque lavanda suave */}
        <section className="px-8 py-14 text-center text-white" style={{ backgroundColor: C.blockSoft }}>
          <div className="flex justify-center mb-4"><IconCalendarHeart /></div>
          <h2 className="text-4xl mb-3" style={{ fontFamily: "var(--font-great-vibes)" }}>Confirmación</h2>
          <p className="text-sm opacity-95 max-w-xs mx-auto mb-7">Agradecemos que confirmes tu asistencia antes del {wedding.rsvpDeadline}.</p>
          <div className="inline-block px-10 py-3 rounded bg-white text-sm tracking-wide cursor-pointer" style={{ color: C.lavDeep }}>Confirmar aquí</div>
        </section>

        {/* Sin niños */}
        <section className="px-8 py-12 text-center border-t" style={{ borderColor: C.line }}>
          <div className="text-2xl mb-3" style={{ color: C.lav }}>♥</div>
          <p className="text-sm uppercase tracking-[0.3em] font-bold mb-3" style={{ color: C.ink }}>Sin niños</p>
          <p className="text-sm max-w-xs mx-auto" style={{ color: C.mid }}>
            Adoramos a los niños, pero nuestra boda será solo para adultos. ¡Gracias por comprenderlo y disfrutar con nosotros!
          </p>
        </section>

        {/* Gracias + foto */}
        <section className="relative px-8 py-14 text-center overflow-hidden border-t" style={{ borderColor: C.line }}>
          <p className="text-sm uppercase tracking-[0.3em] mb-2" style={{ color: C.ink }}>Esperamos contar con tu presencia</p>
          <h2 className="text-5xl mb-8" style={{ fontFamily: "var(--font-great-vibes)", color: C.lavDeep }}>¡Muchas gracias!</h2>
          <BlurFade>
            <div className="relative w-3/4 mx-auto aspect-[4/3] rounded-2xl overflow-hidden" style={{ boxShadow: `0 0 0 4px ${C.paper}, 0 10px 30px rgba(0,0,0,0.15)` }}>
              <Image src="/1.jpg" alt="" fill sizes="320px" className="object-cover" style={{ objectPosition: "50% 35%" }} />
            </div>
          </BlurFade>
          <LavenderSprig className="absolute top-2 right-0 w-20" purples={LAV} mirror />
        </section>

        <footer className="px-8 py-10 text-center border-t" style={{ borderColor: C.line }}>
          <p className="text-3xl mb-2" style={{ fontFamily: "var(--font-great-vibes)", color: C.lavDeep }}>{wedding.groom} &amp; {wedding.bride}</p>
          <p className="text-[10px] uppercase tracking-[0.4em]" style={{ color: C.faint }}>{wedding.dateShort} · {wedding.city}</p>
        </footer>
      </div>
    </div>
  );
}
