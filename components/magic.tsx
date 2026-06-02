"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
  useInView,
} from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react";

/* ─────────────────────────────────────────────
   AuroraBackground · blobs de gradiente animados
   ───────────────────────────────────────────── */
export function AuroraBackground({ colors }: { colors: string[] }) {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-0">
      {colors.map((c, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-[100px]"
          style={{
            width: `${45 + i * 8}vw`,
            height: `${45 + i * 8}vw`,
            backgroundColor: c,
            opacity: 0.5,
            left: `${(i * 27) % 70}%`,
            top: `${(i * 33) % 60}%`,
          }}
          animate={{
            x: [0, 80, -40, 0],
            y: [0, -60, 50, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: 18 + i * 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Particles · puntos flotantes en canvas
   ───────────────────────────────────────────── */
export function Particles({
  color = "#ffffff",
  quantity = 60,
  className = "",
}: {
  color?: string;
  quantity?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const dots = Array.from({ length: quantity }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: (Math.random() * 1.6 + 0.4) * dpr,
      vx: (Math.random() - 0.5) * 0.25 * dpr,
      vy: (Math.random() - 0.5) * 0.25 * dpr,
      a: Math.random() * 0.5 + 0.2,
      tw: Math.random() * 0.02,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        d.a += d.tw;
        if (d.a > 0.7 || d.a < 0.15) d.tw *= -1;
        if (d.x < 0) d.x = canvas.width;
        if (d.x > canvas.width) d.x = 0;
        if (d.y < 0) d.y = canvas.height;
        if (d.y > canvas.height) d.y = 0;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = d.a;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [color, quantity]);

  return <canvas ref={canvasRef} className={`w-full h-full ${className}`} />;
}

/* ─────────────────────────────────────────────
   Meteors · meteoros diagonales
   ───────────────────────────────────────────── */
export function Meteors({ number = 12, color = "#ffffff" }: { number?: number; color?: string }) {
  const [meteors] = useState(() =>
    Array.from({ length: number }, (_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 6,
      duration: 3 + Math.random() * 4,
      key: i,
    }))
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {meteors.map((m) => (
        <motion.span
          key={m.key}
          className="absolute top-0 h-0.5 w-0.5 rounded-full"
          style={{
            left: `${m.left}%`,
            backgroundColor: color,
            boxShadow: `0 0 0 1px ${color}33`,
          }}
          initial={{ x: 0, y: -20, opacity: 0 }}
          animate={{ x: -300, y: 400, opacity: [0, 1, 1, 0] }}
          transition={{ duration: m.duration, delay: m.delay, repeat: Infinity, ease: "linear" }}
        >
          <span
            className="absolute top-1/2 -translate-y-1/2 h-px w-16"
            style={{ background: `linear-gradient(90deg, ${color}, transparent)`, transform: "rotate(45deg)", transformOrigin: "left" }}
          />
        </motion.span>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   GradientText · texto con gradiente animado
   ───────────────────────────────────────────── */
export function GradientText({
  children,
  colors,
  className = "",
  style = {},
}: {
  children: ReactNode;
  colors: string[];
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <motion.span
      className={className}
      style={{
        backgroundImage: `linear-gradient(90deg, ${[...colors, colors[0]].join(", ")})`,
        backgroundSize: "200% auto",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        ...style,
      }}
      animate={{ backgroundPosition: ["0% center", "200% center"] }}
      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
    >
      {children}
    </motion.span>
  );
}

/* ─────────────────────────────────────────────
   ShinyText · brillo que barre el texto
   ───────────────────────────────────────────── */
export function ShinyText({ children, className = "", base = "#888", shine = "#fff" }: { children: ReactNode; className?: string; base?: string; shine?: string }) {
  return (
    <motion.span
      className={className}
      style={{
        color: base,
        backgroundImage: `linear-gradient(110deg, transparent 30%, ${shine} 50%, transparent 70%)`,
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
      }}
      animate={{ backgroundPosition: ["150% 0", "-50% 0"] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
    >
      {children}
    </motion.span>
  );
}

/* ─────────────────────────────────────────────
   NumberTicker · número que cuenta hacia arriba
   ───────────────────────────────────────────── */
export function NumberTicker({ value, className = "", style = {} }: { value: number; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);
  return <span ref={ref} className={className} style={style}>{display.toLocaleString("en-US")}</span>;
}

/* ─────────────────────────────────────────────
   BorderBeam · luz que recorre el borde de una card
   ───────────────────────────────────────────── */
export function BorderBeam({ color = "#fff", duration = 6, size = 120 }: { color?: string; duration?: number; size?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ maskImage: "linear-gradient(white, white)" }}>
      <motion.div
        className="absolute aspect-square rounded-full"
        style={{
          width: size,
          offsetPath: `rect(0 100% 100% 0 round 1.5rem)`,
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        }}
        animate={{ offsetDistance: ["0%", "100%"] }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   RetroGrid · piso de rejilla en perspectiva
   ───────────────────────────────────────────── */
export function RetroGrid({ color = "rgba(255,255,255,0.3)" }: { color?: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none [perspective:200px]">
      <div className="absolute inset-0 [transform:rotateX(60deg)]">
        <div
          className="absolute -inset-[200%] animate-[grid_22s_linear_infinite]"
          style={{
            backgroundImage: `linear-gradient(to right, ${color} 1px, transparent 0), linear-gradient(to bottom, ${color} 1px, transparent 0)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>
      <style>{`@keyframes grid { 0% { transform: translateY(0); } 100% { transform: translateY(60px); } }`}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Marquee · banda de texto en desplazamiento
   ───────────────────────────────────────────── */
export function Marquee({ children, reverse = false, duration = 22, className = "" }: { children: ReactNode; reverse?: boolean; duration?: number; className?: string }) {
  return (
    <div className={`flex overflow-hidden ${className}`}>
      <motion.div
        className="flex shrink-0 gap-8 pr-8"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Sparkles · estrellitas que titilan
   ───────────────────────────────────────────── */
export function Sparkles({ count = 18, color = "#fff" }: { count?: number; color?: string }) {
  const [sparks] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      key: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 8 + 4,
      delay: Math.random() * 3,
      dur: 1.5 + Math.random() * 2,
    }))
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {sparks.map((s) => (
        <motion.svg
          key={s.key}
          className="absolute"
          style={{ top: `${s.top}%`, left: `${s.left}%`, width: s.size, height: s.size }}
          viewBox="0 0 24 24"
          fill={color}
          animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], rotate: [0, 90] }}
          transition={{ duration: s.dur, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M12 0 L14 10 L24 12 L14 14 L12 24 L10 14 L0 12 L10 10 Z" />
        </motion.svg>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   BlurFade · reveal con desenfoque al entrar
   ───────────────────────────────────────────── */
export function BlurFade({ children, delay = 0, className = "", y = 20, style }: { children: ReactNode; delay?: number; className?: string; y?: number; style?: CSSProperties }) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   useCountdown · hook de cuenta regresiva
   ───────────────────────────────────────────── */
export function useCountdown(target: string) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const u = () => {
      const s = Math.max(0, Math.floor((new Date(target).getTime() - Date.now()) / 1000));
      setT({ d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 });
    };
    u();
    const id = setInterval(u, 1000);
    return () => clearInterval(id);
  }, [target]);
  return t;
}

/* ─────────────────────────────────────────────
   TiltCard · tarjeta con tilt 3D al mouse
   ───────────────────────────────────────────── */
export function TiltCard({ children, className = "", style = {} }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });
  return (
    <motion.div
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left) / r.width - 0.5);
        y.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", ...style }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
