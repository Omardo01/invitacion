"use client";

import { motion } from "motion/react";
import { useState } from "react";

/* ─────────────────────────────────────────────
   Petal · pétalo individual (SVG)
   ───────────────────────────────────────────── */
function Petal({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M10 0 C15 6 15 14 10 20 C5 14 5 6 10 0 Z" fill={color} />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   PetalRain · lluvia de pétalos ambiental
   ───────────────────────────────────────────── */
export function PetalRain({
  count = 14,
  colors = ["#d9c7ef", "#e8d5f0", "#c4aee0", "#f0ecf6", "#cbb6e6"],
  className = "",
}: {
  count?: number;
  colors?: string[];
  className?: string;
}) {
  const [petals] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      key: i,
      left: Math.random() * 100,
      size: 9 + Math.random() * 13,
      delay: Math.random() * 9,
      dur: 9 + Math.random() * 9,
      rot: Math.random() * 360,
      sway: 24 + Math.random() * 46,
      color: colors[i % colors.length],
      opacity: 0.35 + Math.random() * 0.35,
    }))
  );

  return (
    <div className={`fixed inset-0 z-40 overflow-hidden pointer-events-none ${className}`}>
      {petals.map((p) => (
        <motion.div
          key={p.key}
          className="absolute"
          style={{ left: `${p.left}%`, top: "-6%", opacity: p.opacity }}
          initial={{ y: "-6vh", rotate: p.rot }}
          animate={{ y: "112vh", x: [0, p.sway, -p.sway, 0], rotate: p.rot + 380 }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
            x: { duration: p.dur / 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
          }}
        >
          <Petal size={p.size} color={p.color} />
        </motion.div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Blossom · florecita que florece desde el centro
   ───────────────────────────────────────────── */
export function Blossom({
  cx, cy, r = 7, petalR = 5, color = "#c4aee0", center = "#8f7bb3", delay = 0,
}: {
  cx: number; cy: number; r?: number; petalR?: number; color?: string; center?: string; delay?: number;
}) {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ delay, type: "spring", stiffness: 160, damping: 12 }}
      style={{ transformBox: "view-box", transformOrigin: `${cx}px ${cy}px` }}
    >
      {[0, 60, 120, 180, 240, 300].map((a) => {
        const x = cx + r * Math.cos((a * Math.PI) / 180);
        const y = cy + r * Math.sin((a * Math.PI) / 180);
        return <circle key={a} cx={x} cy={y} r={petalR} fill={color} opacity={0.85} />;
      })}
      <circle cx={cx} cy={cy} r={petalR * 0.9} fill={center} />
    </motion.g>
  );
}

/* ─────────────────────────────────────────────
   FloralCorner · rama line-art que se dibroja sola
   ───────────────────────────────────────────── */
export function FloralCorner({
  className = "", color = "#8f7bb3", soft = "#c4aee0", delay = 0, mirror = false,
}: {
  className?: string; color?: string; soft?: string; delay?: number; mirror?: boolean;
}) {
  const drawn = (d: string, w: number, dl: number) => (
    <motion.path
      d={d}
      stroke={color}
      strokeWidth={w}
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.5, delay: delay + dl, ease: "easeInOut" }}
    />
  );

  return (
    <svg viewBox="0 0 170 170" className={className} fill="none" style={{ transform: mirror ? "scaleX(-1)" : undefined }}>
      {/* tallo principal */}
      {drawn("M6,6 C46,26 70,58 80,104 C84,124 82,140 78,158", 1.6, 0)}
      {/* ramas / hojas */}
      {drawn("M34,22 C50,10 70,14 74,30 C58,34 42,32 34,22 Z", 1.2, 0.5)}
      {drawn("M58,52 C76,42 96,48 98,64 C80,68 64,64 58,52 Z", 1.2, 0.7)}
      {drawn("M76,96 C94,90 112,98 112,114 C94,116 80,110 76,96 Z", 1.2, 0.9)}
      {drawn("M20,40 C14,58 22,76 40,82", 1.2, 0.6)}
      {/* florecitas */}
      <Blossom cx={86} cy={28} r={6} petalR={4} color={soft} center={color} delay={delay + 1.1} />
      <Blossom cx={108} cy={70} r={7} petalR={4.5} color={soft} center={color} delay={delay + 1.3} />
      <Blossom cx={70} cy={150} r={6} petalR={4} color={soft} center={color} delay={delay + 1.5} />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   FloralDivider · ramo simétrico que se dibuja
   ───────────────────────────────────────────── */
export function FloralDivider({ color = "#8f7bb3", soft = "#c4aee0", className = "" }: { color?: string; soft?: string; className?: string }) {
  const branch = (d: string, dl: number, flip = false) => (
    <motion.path
      d={d}
      stroke={color}
      strokeWidth={1.3}
      strokeLinecap="round"
      style={{ transform: flip ? "scaleX(-1)" : undefined, transformOrigin: "center" }}
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, delay: dl, ease: "easeInOut" }}
    />
  );
  return (
    <div className={`flex justify-center ${className}`}>
      <svg viewBox="0 0 220 40" className="w-52 h-10" fill="none">
        {/* línea central */}
        <motion.line x1="60" y1="20" x2="160" y2="20" stroke={color} strokeWidth="1" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.9 }} />
        {/* hojas izquierda */}
        <g transform="translate(110,20)">
          <motion.path d="M-50,0 C-66,-12 -84,-8 -88,4 C-72,8 -56,6 -50,0 Z" stroke={color} strokeWidth="1.1" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.5 }} />
          <motion.path d="M50,0 C66,-12 84,-8 88,4 C72,8 56,6 50,0 Z" stroke={color} strokeWidth="1.1" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.5 }} />
        </g>
        {/* flor central */}
        <Blossom cx={110} cy={20} r={7} petalR={4.5} color={soft} center={color} delay={0.9} />
      </svg>
    </div>
  );
}
