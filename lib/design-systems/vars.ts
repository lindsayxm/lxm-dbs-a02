import type { CSSProperties } from "react";
import type { Theme } from "./themes";

// Turns a theme's tokens into CSS variables for the .ds root element.
export function rootVars(t: Theme): CSSProperties {
  const c = t.colors;
  const v: Record<string, string> = {
    "--bg": c.background,
    "--surface": c.surface,
    "--text": c.text,
    "--muted": c.muted,
    "--border": c.border,
    "--accent": c.accent,
    "--on-accent": c.onAccent,
    ...(c.onAccentPress ? { "--on-accent-press": c.onAccentPress } : {}),
    "--accent-hover": c.accentHover,
    "--accent-press": c.accentPress,
    "--signal": c.signal,
    "--on-signal": c.onSignal,
    "--error": c.error,
    "--focus": c.focus,
  };
  t.spacing.forEach((n, i) => (v[`--s-${i + 1}`] = `${n}px`));
  t.radii.forEach((r, i) => (v[`--r-${i + 1}`] = r.css));
  for (const r of t.type) {
    const k = r.role.toLowerCase();
    v[`--fs-${k}`] = `${r.size}px`;
    v[`--fw-${k}`] = `${r.weight}`;
    v[`--lh-${k}`] = `${r.leading}`;
    v[`--ls-${k}`] = r.tracking;
    v[`--case-${k}`] = r.upper ? "uppercase" : "none";
  }
  return v as CSSProperties;
}
