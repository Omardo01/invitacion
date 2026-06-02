"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

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
  // Se generan solo en el cliente para evitar mismatch de hidratación (Math.random)
  const [petals, setPetals] = useState<
    { key: number; left: number; size: number; delay: number; dur: number; rot: number; sway: number; color: string; opacity: number }[]
  >([]);
  useEffect(() => {
    setPetals(
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

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
        // redondeado para evitar mismatch de hidratación por precisión de float
        const x = Math.round((cx + r * Math.cos((a * Math.PI) / 180)) * 1000) / 1000;
        const y = Math.round((cy + r * Math.sin((a * Math.PI) / 180)) * 1000) / 1000;
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
   EucalyptusSprig · rama de eucalipto en acuarela
   ───────────────────────────────────────────── */
export function EucalyptusSprig({
  className = "",
  mirror = false,
  greens = ["#8aa67e", "#6f8f6a", "#a9c19a", "#5b7350"],
  delay = 0,
}: {
  className?: string;
  mirror?: boolean;
  greens?: string[];
  delay?: number;
}) {
  // hojas distribuidas a lo largo de un tallo curvo
  const leaves = [
    { x: 70, y: 30, rx: 13, ry: 22, rot: -35, c: 0, o: 0.92 },
    { x: 104, y: 48, rx: 12, ry: 20, rot: 35, c: 1, o: 0.9 },
    { x: 60, y: 70, rx: 14, ry: 24, rot: -45, c: 2, o: 0.85 },
    { x: 108, y: 92, rx: 13, ry: 22, rot: 40, c: 0, o: 0.9 },
    { x: 56, y: 116, rx: 13, ry: 22, rot: -50, c: 1, o: 0.82 },
    { x: 100, y: 138, rx: 11, ry: 19, rot: 48, c: 3, o: 0.88 },
    { x: 66, y: 158, rx: 12, ry: 20, rot: -42, c: 2, o: 0.8 },
    { x: 86, y: 178, rx: 10, ry: 17, rot: 8, c: 0, o: 0.85 },
  ];
  return (
    <svg viewBox="0 0 170 210" className={className} fill="none" style={{ transform: mirror ? "scaleX(-1)" : undefined }}>
      <defs>
        <radialGradient id="euc-leaf" cx="40%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <motion.path
        d="M88,206 C82,170 92,150 86,120 C80,92 96,70 84,44 C78,30 86,16 92,4"
        stroke={greens[3]}
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.8 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, delay, ease: "easeInOut" }}
      />
      {leaves.map((l, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: l.o, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.3 + i * 0.12, type: "spring", stiffness: 150, damping: 13 }}
          style={{ transformBox: "view-box", transformOrigin: `${l.x}px ${l.y}px` }}
        >
          <g transform={`rotate(${l.rot} ${l.x} ${l.y})`}>
            <ellipse cx={l.x} cy={l.y} rx={l.rx} ry={l.ry} fill={greens[l.c]} />
            <ellipse cx={l.x} cy={l.y} rx={l.rx} ry={l.ry} fill="url(#euc-leaf)" />
            <line x1={l.x} y1={l.y - l.ry + 2} x2={l.x} y2={l.y + l.ry - 2} stroke={greens[3]} strokeWidth="0.6" opacity="0.4" />
          </g>
        </motion.g>
      ))}
    </svg>
  );
}

/* ─────────────────────────────────────────────
   LavenderSprig · espiga de lavanda en acuarela
   ───────────────────────────────────────────── */
export function LavenderSprig({
  className = "",
  mirror = false,
  delay = 0,
  purples = ["#b9a5d4", "#a48fc4", "#cdbce4", "#8b75ac"],
  green = "#9bab8a",
  animate = true,
}: {
  className?: string;
  mirror?: boolean;
  delay?: number;
  purples?: string[];
  green?: string;
  animate?: boolean;
}) {
  // tres tallos de lavanda con espigas de florecitas
  const stems = [
    { x: 86, baseY: 200, topY: 50, bend: 12, c: 0 },
    { x: 70, baseY: 200, topY: 78, bend: -16, c: 2 },
    { x: 104, baseY: 200, topY: 84, bend: 16, c: 1 },
  ];
  return (
    <svg viewBox="0 0 170 210" className={className} fill="none" style={{ transform: mirror ? "scaleX(-1)" : undefined }}>
      <defs>
        <radialGradient id="lav-bud" cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>
      {stems.map((s, si) => {
        const ctrlX = s.x + s.bend;
        const path = `M${s.x},${s.baseY} Q${ctrlX},${(s.baseY + s.topY) / 2} ${s.x + s.bend / 2},${s.topY}`;
        // florecitas a lo largo de la mitad superior del tallo
        const buds = Array.from({ length: 9 }, (_, i) => {
          const tt = i / 9;
          const bx = s.x + (s.bend / 2) * tt + s.bend * (1 - tt) * 0.25;
          const by = s.topY + (s.baseY * 0.45 - s.topY) * tt;
          return { bx, by, side: i % 2 === 0 ? -1 : 1, r: 4.5 - tt * 1.2 };
        });
        const stemEl = (
          <>
            <path d={path} stroke={green} strokeWidth="1.6" strokeLinecap="round" opacity="0.75" />
            {buds.map((b, i) => (
              <g key={i}>
                <ellipse cx={b.bx + b.side * 4} cy={b.by} rx={b.r} ry={b.r * 1.5} fill={purples[s.c]} opacity="0.9"
                  transform={`rotate(${b.side * 30} ${b.bx + b.side * 4} ${b.by})`} />
                <ellipse cx={b.bx + b.side * 4} cy={b.by} rx={b.r} ry={b.r * 1.5} fill="url(#lav-bud)"
                  transform={`rotate(${b.side * 30} ${b.bx + b.side * 4} ${b.by})`} />
              </g>
            ))}
            {/* punta */}
            <ellipse cx={s.x + s.bend / 2} cy={s.topY - 4} rx="3.5" ry="6" fill={purples[3]} opacity="0.92" />
          </>
        );
        return animate ? (
          <motion.g key={si}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: delay + si * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {stemEl}
          </motion.g>
        ) : (
          <g key={si}>{stemEl}</g>
        );
      })}
    </svg>
  );
}

/* ─────────────────────────────────────────────
   WatercolorBouquet · ramo de flores en acuarela
   ───────────────────────────────────────────── */
export function WatercolorBouquet({
  className = "",
  mirror = false,
  delay = 0,
  petals = ["#d9b8e0", "#e8c5d8", "#c9a4e0", "#f0d5e8"],
  centers = "#b88ad0",
  greens = ["#9caf88", "#7a9070"],
}: {
  className?: string;
  mirror?: boolean;
  delay?: number;
  petals?: string[];
  centers?: string;
  greens?: string[];
}) {
  const flower = (cx: number, cy: number, R: number, color: string, d: number) => (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: delay + d, type: "spring", stiffness: 140, damping: 13 }}
      style={{ transformBox: "view-box", transformOrigin: `${cx}px ${cy}px` }}
    >
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
        const x = cx + R * 0.62 * Math.cos((a * Math.PI) / 180);
        const y = cy + R * 0.62 * Math.sin((a * Math.PI) / 180);
        return (
          <g key={a} transform={`rotate(${a} ${x} ${y})`}>
            <ellipse cx={x} cy={y} rx={R * 0.42} ry={R * 0.6} fill={color} opacity="0.85" />
            <ellipse cx={x} cy={y} rx={R * 0.42} ry={R * 0.6} fill="url(#wc-sheen)" />
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={R * 0.42} fill={centers} opacity="0.9" />
      <circle cx={cx} cy={cy} r={R * 0.22} fill="#fff" opacity="0.35" />
    </motion.g>
  );
  const leaf = (x: number, y: number, rot: number, c: string, d: number) => (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 0.9, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: delay + d, type: "spring", stiffness: 150, damping: 14 }}
      style={{ transformBox: "view-box", transformOrigin: `${x}px ${y}px` }}
    >
      <g transform={`rotate(${rot} ${x} ${y})`}>
        <ellipse cx={x} cy={y} rx={9} ry={20} fill={c} />
      </g>
    </motion.g>
  );
  return (
    <svg viewBox="0 0 200 160" className={className} fill="none" style={{ transform: mirror ? "scaleX(-1)" : undefined }}>
      <defs>
        <radialGradient id="wc-sheen" cx="38%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* hojas detrás */}
      {leaf(40, 70, -50, greens[1], 0.1)}
      {leaf(150, 60, 45, greens[0], 0.2)}
      {leaf(70, 120, -20, greens[1], 0.3)}
      {leaf(128, 118, 30, greens[0], 0.35)}
      {/* flores */}
      {flower(70, 60, 34, petals[0], 0.2)}
      {flower(120, 80, 38, petals[1], 0.35)}
      {flower(86, 110, 28, petals[2], 0.5)}
      {flower(44, 100, 22, petals[3], 0.6)}
      {flower(150, 112, 24, petals[0], 0.7)}
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
