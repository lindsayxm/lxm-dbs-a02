export function StateIcon({ name }: { name: "check" | "alert" | "spinner" }) {
  const common = { width: 32, height: 32, viewBox: "0 0 36 36", fill: "none", "aria-hidden": true } as const;
  if (name === "check")
    return (
      <svg {...common}>
        <circle cx="18" cy="18" r="16" fill="currentColor" />
        <path d="M10.5 18.5l5 5 10-11" stroke="var(--on-signal)" strokeWidth="3" strokeLinecap="square" />
      </svg>
    );
  if (name === "alert")
    return (
      <svg {...common}>
        <path d="M18 3L34 32H2L18 3z" fill="currentColor" />
        <path d="M18 13v9M18 26v2" stroke="var(--bg)" strokeWidth="3" strokeLinecap="square" />
      </svg>
    );
  return (
    <svg {...common} className="spin">
      <circle cx="18" cy="18" r="14" stroke="var(--border)" strokeWidth="4" />
      <path d="M18 4a14 14 0 0 1 14 14" stroke="currentColor" strokeWidth="4" strokeLinecap="square" />
    </svg>
  );
}
