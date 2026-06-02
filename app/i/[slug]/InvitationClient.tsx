"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

type GuestProps = {
  id: number;
  slug: string;
  name: string;
  seats: number;
  confirmed: 1 | 0 | null;
  notes: string | null;
};

type WeddingProps = {
  bride: string;
  groom: string;
  dateLabel: string;
  dateShort: string;
  city: string;
  ceremony: { title: string; time: string; place: string; address: string; mapsQuery: string };
  reception: { title: string; time: string; place: string; address: string; mapsQuery: string };
  dressCode: string;
  rsvpDeadline: string;
  hashtag: string;
  story: string;
};

function Countdown({ target }: { target: string }) {
  const [diff, setDiff] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const calc = () => {
      const ms = new Date(target).getTime() - Date.now();
      if (ms <= 0) return;
      const s = Math.floor(ms / 1000);
      setDiff({ d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [target]);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="flex gap-4 justify-center">
      {[["d", "días"], ["h", "hrs"], ["m", "min"], ["s", "seg"]].map(([k, label]) => (
        <div key={k} className="text-center">
          <div className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "var(--font-display)", color: "#c1694f" }}>
            {pad(diff[k as keyof typeof diff])}
          </div>
          <div className="text-[10px] uppercase tracking-widest mt-1 text-stone-500">{label}</div>
        </div>
      ))}
    </div>
  );
}

function RSVPSection({ slug, seats, initialConfirmed }: { slug: string; seats: number; initialConfirmed: 1 | 0 | null }) {
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [confirmed, setConfirmed] = useState(initialConfirmed);
  const [notes, setNotes] = useState("");

  const respond = async (val: boolean) => {
    setStatus("loading");
    const res = await fetch(`/api/rsvp/${slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ confirmed: val, notes: notes.trim() || undefined }),
    });
    if (res.ok) {
      setConfirmed(val ? 1 : 0);
      setStatus("done");
    } else {
      setStatus("idle");
      alert("Ocurrió un error. Intenta de nuevo.");
    }
  };

  if (confirmed === 1) return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12 px-6">
      <div className="text-5xl mb-4">🥂</div>
      <h3 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-display)", color: "#2a1a0e" }}>
        ¡Muchas gracias!
      </h3>
      <p className="mt-2 text-stone-600">Tu asistencia está confirmada. Te esperamos con mucho amor.</p>
    </motion.div>
  );

  if (confirmed === 0) return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12 px-6">
      <div className="text-5xl mb-4">🌸</div>
      <h3 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-display)", color: "#2a1a0e" }}>
        Lo entendemos
      </h3>
      <p className="mt-2 text-stone-600">Lamentamos que no puedas acompañarnos. ¡Te queremos!</p>
    </motion.div>
  );

  return (
    <div className="text-center py-12 px-6 max-w-md mx-auto">
      <p className="text-xs uppercase tracking-widest mb-2 text-stone-400">Confirmación</p>
      <h3 className="text-2xl font-semibold mb-1" style={{ fontFamily: "var(--font-display)", color: "#2a1a0e" }}>
        ¿Nos acompañas?
      </h3>
      <p className="text-stone-500 text-sm mb-6">
        Tienes <strong className="text-stone-700">{seats} {seats === 1 ? "lugar reservado" : "lugares reservados"}</strong>.
        Confirma antes del <strong className="text-stone-700">1 de julio</strong>.
      </p>
      <textarea
        placeholder="¿Alguna nota para los novios? (opcional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={2}
        className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm text-stone-700 resize-none outline-none focus:border-stone-400 mb-4 transition-colors"
      />
      <div className="flex flex-col gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => respond(true)}
          disabled={status === "loading"}
          className="w-full py-3.5 rounded-2xl text-white font-semibold text-sm tracking-wide transition-colors disabled:opacity-60"
          style={{ backgroundColor: "#c1694f" }}
        >
          {status === "loading" ? "Confirmando..." : `✓ Confirmar ${seats === 1 ? "mi lugar" : `mis ${seats} lugares`}`}
        </motion.button>
        <button
          onClick={() => respond(false)}
          disabled={status === "loading"}
          className="w-full py-2.5 text-stone-400 text-sm hover:text-stone-600 transition-colors"
        >
          No podré asistir
        </button>
      </div>
    </div>
  );
}

export default function InvitationClient({ guest, wedding }: { guest: GuestProps; wedding: WeddingProps }) {
  const [envelopeOpen, setEnvelopeOpen] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: "#faf5ee", fontFamily: "var(--font-serif)", color: "#2a1a0e" }}>

      <AnimatePresence>
        {!envelopeOpen && (
          <motion.div
            key="envelope"
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6"
            style={{ backgroundColor: "#faf5ee" }}
          >
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xs uppercase tracking-[0.4em] mb-6 text-stone-400"
            >
              Hola, <span className="text-stone-600 font-medium">{guest.name}</span>
            </motion.p>

            <motion.button
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setEnvelopeOpen(true)}
              className="relative cursor-pointer group"
            >
              {/* Envelope */}
              <svg width="260" height="180" viewBox="0 0 260 180" className="drop-shadow-xl">
                {/* Body */}
                <rect x="0" y="30" width="260" height="150" rx="6" fill="#c1694f" />
                {/* Bottom triangle sides */}
                <polygon points="0,60 130,145 260,60 260,180 0,180" fill="#a8502f" />
                {/* Flap (animates on hover) */}
                <motion.polygon
                  points="0,30 130,120 260,30"
                  fill="#d4795e"
                  animate={{ rotateX: [0, 0] }}
                  className="origin-top group-hover:-translate-y-1 transition-transform"
                />
                {/* Wax seal */}
                <circle cx="130" cy="115" r="22" fill="#8b2e0e" />
                <text x="130" y="121" textAnchor="middle" fontSize="20" fill="#f5ede2">💍</text>
              </svg>
            </motion.button>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-6 text-sm text-stone-500"
            >
              Toca el sobre para abrir tu invitación
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invitation Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: envelopeOpen ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Hero */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-24 relative">
          {/* Floral decorations */}
          <div className="absolute top-0 left-0 text-8xl opacity-10 -translate-x-8 -translate-y-4">🌸</div>
          <div className="absolute top-0 right-0 text-8xl opacity-10 translate-x-8 -translate-y-4">🌸</div>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: envelopeOpen ? 1 : 0, y: envelopeOpen ? 0 : -10 }}
            transition={{ delay: 0.4 }}
            className="text-xs uppercase tracking-[0.4em] mb-6 text-stone-400"
          >
            Nos casamos
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: envelopeOpen ? 1 : 0, scale: envelopeOpen ? 1 : 0.9 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-6xl md:text-8xl leading-[0.85] mb-2"
            style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
          >
            {wedding.groom}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: envelopeOpen ? 1 : 0 }}
            transition={{ delay: 0.7 }}
            className="text-4xl my-2"
            style={{ fontFamily: "var(--font-script)", color: "#c1694f" }}
          >
            &amp;
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: envelopeOpen ? 1 : 0, scale: envelopeOpen ? 1 : 0.9 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-6xl md:text-8xl leading-[0.85] mb-8"
            style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }}
          >
            {wedding.bride}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: envelopeOpen ? 1 : 0, y: envelopeOpen ? 0 : 10 }}
            transition={{ delay: 0.9 }}
          >
            <p className="text-sm uppercase tracking-[0.3em] text-stone-500 mb-1">{wedding.city}</p>
            <p className="text-2xl" style={{ fontFamily: "var(--font-script)", color: "#c1694f" }}>
              {wedding.dateLabel} · 2026
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: envelopeOpen ? 1 : 0, y: envelopeOpen ? 0 : 10 }}
            transition={{ delay: 1.1 }}
            className="mt-6 px-5 py-3 rounded-2xl"
            style={{ backgroundColor: "rgba(193,105,79,0.08)", border: "1px solid rgba(193,105,79,0.2)" }}
          >
            <p className="text-sm text-stone-600">
              <span className="font-semibold" style={{ color: "#c1694f" }}>{guest.name}</span>
              {" "}· {guest.seats} {guest.seats === 1 ? "lugar reservado" : "lugares reservados"}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: envelopeOpen ? 1 : 0 }}
            transition={{ delay: 1.3 }}
            className="mt-12"
          >
            <Countdown target="2026-07-25T17:00:00" />
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-8 text-xs uppercase tracking-widest text-stone-400"
          >
            ↓ scroll
          </motion.div>
        </section>

        {/* Divider */}
        <div className="h-px mx-8" style={{ background: "linear-gradient(to right, transparent, rgba(193,105,79,0.3), transparent)" }} />

        {/* Events */}
        <section className="py-20 px-6">
          <div className="max-w-lg mx-auto space-y-6">
            <p className="text-center text-xs uppercase tracking-widest text-stone-400 mb-10">El gran día</p>

            {[wedding.ceremony, wedding.reception].map((ev) => (
              <motion.div
                key={ev.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="rounded-2xl p-6 text-center"
                style={{ backgroundColor: "#fff", border: "1px solid rgba(193,105,79,0.15)", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}
              >
                <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">{ev.title}</p>
                <p className="text-4xl font-bold mb-1" style={{ fontFamily: "var(--font-display)", color: "#c1694f" }}>{ev.time}</p>
                <p className="text-lg font-semibold text-stone-800 mb-1">{ev.place}</p>
                <p className="text-sm text-stone-500 mb-4">{ev.address}</p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(ev.mapsQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-xs uppercase tracking-widest px-5 py-2 rounded-full transition-colors"
                  style={{ backgroundColor: "#c1694f", color: "#fff" }}
                >
                  Ver mapa
                </a>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Dress code */}
        <section className="py-16 px-6 text-center" style={{ backgroundColor: "rgba(193,105,79,0.06)" }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-sm mx-auto"
          >
            <p className="text-xs uppercase tracking-widest text-stone-400 mb-3">Código de vestimenta</p>
            <p className="text-2xl font-semibold" style={{ fontFamily: "var(--font-display)", color: "#2a1a0e" }}>
              {wedding.dressCode}
            </p>
            <p className="text-sm text-stone-500 mt-2">Evitar tonos blancos</p>
          </motion.div>
        </section>

        {/* RSVP */}
        <section className="py-8 px-6" style={{ backgroundColor: "#fff" }}>
          <div className="max-w-md mx-auto">
            <div className="h-px mb-8" style={{ background: "linear-gradient(to right, transparent, rgba(193,105,79,0.3), transparent)" }} />
            <RSVPSection slug={guest.slug} seats={guest.seats} initialConfirmed={guest.confirmed} />
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 text-center text-xs text-stone-300 tracking-widest uppercase">
          {wedding.hashtag} · {wedding.dateShort}
        </footer>
      </motion.div>
    </div>
  );
}
