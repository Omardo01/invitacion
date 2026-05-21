"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

export type Palette = {
  id: string;
  name: string;
  swatch: string[];
  tokens: Record<string, string>;
};

export type FontChoice = {
  id: string;
  name: string;
  sample: string;
  tokens: Record<string, string>;
};

export type ExtraOption = {
  id: string;
  label: string;
  preview?: string;
  color?: string;
};

type GroupBase = {
  id: string;
  label: string;
};

export type ExtraGroupButtons = GroupBase & {
  type?: "buttons";
  options: ExtraOption[];
  columns?: 2 | 3 | 4;
};

export type ExtraGroupSwatches = GroupBase & {
  type: "swatches";
  options: ExtraOption[];
};

export type ExtraGroupText = GroupBase & {
  type: "text";
  defaultValue: string;
  placeholder?: string;
  maxLength?: number;
};

export type ExtraGroup = ExtraGroupButtons | ExtraGroupSwatches | ExtraGroupText;

type Props = {
  themeId: string;
  palettes: Palette[];
  fonts: FontChoice[];
  extras?: ExtraGroup[];
  children: (state: {
    palette: Palette;
    font: FontChoice;
    styleVars: React.CSSProperties;
    extras: Record<string, string>;
  }) => React.ReactNode;
  tone?: "light" | "dark";
};

function readStorage(key: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function initialValue(g: ExtraGroup): string {
  if (g.type === "text") return g.defaultValue;
  return g.options[0].id;
}

export function Customizer({
  themeId,
  palettes,
  fonts,
  extras = [],
  children,
  tone = "light",
}: Props) {
  const [paletteId, setPaletteId] = useState(palettes[0].id);
  const [fontId, setFontId] = useState(fonts[0].id);
  const [extrasState, setExtrasState] = useState<Record<string, string>>(() =>
    Object.fromEntries(extras.map((g) => [g.id, initialValue(g)]))
  );
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Hidratar desde localStorage UNA sola vez al montar.
  // Si lo metiéramos en deps, el default `extras = []` crea una ref nueva
  // por render y este efecto pelearía con el de persistencia.
  useEffect(() => {
    setPaletteId(readStorage(`${themeId}:palette`, palettes[0].id));
    setFontId(readStorage(`${themeId}:font`, fonts[0].id));
    if (extras.length) {
      setExtrasState(
        Object.fromEntries(
          extras.map((g) => [g.id, readStorage(`${themeId}:${g.id}`, initialValue(g))])
        )
      );
    }
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(`${themeId}:palette`, paletteId);
    } catch {}
  }, [paletteId, themeId, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(`${themeId}:font`, fontId);
    } catch {}
  }, [fontId, themeId, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try {
      for (const [k, v] of Object.entries(extrasState)) {
        localStorage.setItem(`${themeId}:${k}`, v);
      }
    } catch {}
  }, [extrasState, themeId, mounted]);

  const palette = palettes.find((p) => p.id === paletteId) ?? palettes[0];
  const font = fonts.find((f) => f.id === fontId) ?? fonts[0];
  const styleVars = { ...palette.tokens, ...font.tokens } as React.CSSProperties;

  const panelBg = tone === "dark" ? "bg-neutral-900/95 text-white" : "bg-white/95 text-neutral-900";
  const itemBorder = tone === "dark" ? "border-white/15" : "border-neutral-200";
  const itemActive = tone === "dark" ? "border-white" : "border-neutral-900";
  const muted = tone === "dark" ? "text-white/60" : "text-neutral-500";
  const inputBg =
    tone === "dark" ? "bg-white/5 focus:bg-white/10" : "bg-neutral-50 focus:bg-white";

  return (
    <>
      {children({ palette, font, styleVars, extras: extrasState })}

      <div className="fixed bottom-6 right-6 z-[100]">
        <motion.button
          aria-label={open ? "Cerrar personalización" : "Personalizar invitación"}
          onClick={() => setOpen((v) => !v)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          className={`relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center backdrop-blur-md border ${
            tone === "dark"
              ? "bg-white text-neutral-900 border-white"
              : "bg-neutral-900 text-white border-neutral-900"
          }`}
        >
          <motion.span
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-xl"
          >
            {open ? "×" : "✦"}
          </motion.span>
          {!open && (
            <motion.span
              className="absolute inset-0 rounded-full border-2 border-current"
              animate={{ scale: [1, 1.3], opacity: [0.6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            />
          )}
        </motion.button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={`absolute bottom-16 right-0 w-[19rem] max-w-[calc(100vw-3rem)] max-h-[80vh] overflow-y-auto rounded-3xl shadow-2xl border ${itemBorder} ${panelBg} backdrop-blur-xl p-5 font-sans`}
              style={{ fontFamily: "var(--font-sans)" }}
            >
              <div className="flex items-center justify-between mb-4 sticky top-0 -mt-1 pt-1 pb-2" style={{ background: "inherit" }}>
                <p className="text-[10px] tracking-[0.3em] uppercase opacity-70">Personalizar</p>
                <p className={`text-[10px] ${muted}`}>{palette.name} · {font.name}</p>
              </div>

              <div className="mb-4">
                <p className={`text-[10px] tracking-[0.2em] uppercase mb-2 ${muted}`}>Paleta</p>
                <div className="grid grid-cols-2 gap-2">
                  {palettes.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPaletteId(p.id)}
                      className={`group text-left rounded-xl border ${
                        p.id === paletteId ? itemActive : itemBorder
                      } p-2 hover:scale-[1.02] transition-transform`}
                    >
                      <div className="flex gap-1 mb-1.5">
                        {p.swatch.map((c, i) => (
                          <span
                            key={i}
                            className="w-5 h-5 rounded-full border border-black/10"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                      <p className="text-[11px] font-medium">{p.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className={`text-[10px] tracking-[0.2em] uppercase mb-2 ${muted}`}>Tipografía</p>
                <div className="space-y-1.5">
                  {fonts.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFontId(f.id)}
                      className={`w-full text-left rounded-xl border ${
                        f.id === fontId ? itemActive : itemBorder
                      } px-3 py-2 hover:scale-[1.01] transition-transform flex items-baseline justify-between gap-3`}
                    >
                      <span
                        className="text-2xl leading-none truncate"
                        style={{ fontFamily: f.tokens["--c-display"] }}
                      >
                        {f.sample}
                      </span>
                      <span className={`text-[10px] ${muted} flex-shrink-0`}>{f.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {extras.map((group) => {
                const value = extrasState[group.id] ?? initialValue(group);
                const setValue = (v: string) =>
                  setExtrasState((s) => ({ ...s, [group.id]: v }));

                if (group.type === "text") {
                  return (
                    <div key={group.id} className="mt-4">
                      <p className={`text-[10px] tracking-[0.2em] uppercase mb-2 ${muted}`}>
                        {group.label}
                      </p>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder={group.placeholder}
                        maxLength={group.maxLength}
                        className={`w-full rounded-xl border ${itemBorder} ${inputBg} px-3 py-2 text-sm outline-none transition-colors focus:border-current`}
                      />
                    </div>
                  );
                }

                if (group.type === "swatches") {
                  return (
                    <div key={group.id} className="mt-4">
                      <p className={`text-[10px] tracking-[0.2em] uppercase mb-2 ${muted}`}>
                        {group.label}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {group.options.map((opt) => {
                          const active = value === opt.id;
                          return (
                            <button
                              key={opt.id}
                              onClick={() => setValue(opt.id)}
                              aria-label={opt.label}
                              title={opt.label}
                              className={`relative w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                                active ? "scale-110" : ""
                              }`}
                              style={{
                                backgroundColor: opt.color,
                                borderColor: active
                                  ? tone === "dark"
                                    ? "#fff"
                                    : "#0a0a0a"
                                  : "rgba(0,0,0,0.15)",
                                boxShadow: active
                                  ? "0 0 0 2px " +
                                    (tone === "dark" ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.9)") +
                                    " inset"
                                  : undefined,
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                }

                // buttons (default)
                const cols = group.columns ?? 2;
                const colsClass =
                  cols === 4 ? "grid-cols-4" : cols === 3 ? "grid-cols-3" : "grid-cols-2";
                return (
                  <div key={group.id} className="mt-4">
                    <p className={`text-[10px] tracking-[0.2em] uppercase mb-2 ${muted}`}>
                      {group.label}
                    </p>
                    <div className={`grid ${colsClass} gap-1.5`}>
                      {group.options.map((opt) => {
                        const active = value === opt.id;
                        return (
                          <button
                            key={opt.id}
                            onClick={() => setValue(opt.id)}
                            className={`text-left rounded-xl border ${
                              active ? itemActive : itemBorder
                            } px-2.5 py-2 hover:scale-[1.02] transition-transform`}
                          >
                            {opt.preview && (
                              <span className="block text-lg leading-none mb-1">
                                {opt.preview}
                              </span>
                            )}
                            <span className="text-[11px] font-medium">{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              <p className={`mt-4 text-[10px] text-center ${muted}`}>
                Se guarda automáticamente.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
