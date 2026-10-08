"use client";

import Link from "next/link";
import { useId, useRef, useState, type ReactNode } from "react";
import { fmt, grade, ratio } from "@/lib/contrast";
import type { Theme } from "@/lib/design-systems/themes";
import { rootVars } from "@/lib/design-systems/vars";
import { PressedChart } from "./PressedChart";
import "../ds.css";

type State = "rest" | "hover" | "focus" | "pressed" | "selected" | "disabled";
const STATES: State[] = ["rest", "hover", "focus", "pressed", "selected", "disabled"];
const forced = (s: State) => (s === "hover" || s === "focus" || s === "pressed" ? ` is-${s}` : "");

/* ---------- small pieces ---------- */

function Icon({ name }: { name: "check" | "alert" | "spinner" | "empty" }) {
  const common = { width: 36, height: 36, viewBox: "0 0 36 36", fill: "none", "aria-hidden": true } as const;
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
  if (name === "spinner")
    return (
      <svg {...common} className="spin">
        <circle cx="18" cy="18" r="14" stroke="var(--border)" strokeWidth="4" />
        <path d="M18 4a14 14 0 0 1 14 14" stroke="currentColor" strokeWidth="4" strokeLinecap="square" />
      </svg>
    );
  return (
    <svg {...common}>
      <circle cx="18" cy="18" r="15" stroke="currentColor" strokeWidth="2" strokeDasharray="4 5" />
    </svg>
  );
}

function Barcode({ seed }: { seed: string }) {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const bars: ReactNode[] = [];
  let x = 0;
  for (let i = 0; i < 56; i++) {
    h = (h * 1664525 + 1013904223) >>> 0;
    const w = 1 + ((h >>> 28) % 3);
    if (i % 2 === 0) bars.push(<rect key={i} x={x} y={0} width={w} height={40} />);
    x += w;
  }
  return (
    <svg className="barcode" viewBox={`0 0 ${x} 40`} preserveAspectRatio="none" role="img" aria-label={`Barcode for ticket ${seed}`}>
      {bars}
    </svg>
  );
}

const ROMAN = ["", "I", "II", "III", "IV", "V", "VI"];

function SectionTitle({ n, roman, children }: { n: number; roman?: boolean; children: ReactNode }) {
  return (
    <h2 className="sec-title">
      <span className="sec-n" aria-hidden>
        {roman ? ROMAN[n] : n}
      </span>
      {children}
    </h2>
  );
}

function Specimen({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="spec-group">
      <p className="t-label spec-label">{label}</p>
      <div className="spec-body">{children}</div>
    </div>
  );
}

/* ---------- 1. color ---------- */

function ColorRoles({ t }: { t: Theme }) {
  const c = t.colors;
  const mutedOn = Math.min(ratio(c.muted, c.background), ratio(c.muted, c.surface));
  const items: { name: string; hex: string; fg: string | null; r: number; caption: string; use: string }[] = [
    { name: "Background", hex: c.background, fg: c.text, r: ratio(c.text, c.background), caption: "Text on it", use: t.uses.background },
    { name: "Surface", hex: c.surface, fg: c.text, r: ratio(c.text, c.surface), caption: "Text on it", use: t.uses.surface },
    { name: "Text", hex: c.text, fg: c.background, r: ratio(c.text, c.background), caption: "On background", use: t.uses.text },
    { name: "Muted text", hex: c.muted, fg: c.background, r: mutedOn, caption: "Worst case on page or surface", use: t.uses.muted },
    { name: "Border", hex: c.border, fg: null, r: ratio(c.border, c.background), caption: "Against background", use: t.uses.border },
    { name: "Accent", hex: c.accent, fg: c.onAccent, r: ratio(c.onAccent, c.accent), caption: "Label on accent", use: t.uses.accent },
    { name: "Signal", hex: c.signal, fg: c.onSignal, r: ratio(c.onSignal, c.signal), caption: "Label on signal", use: t.uses.signal },
    { name: "Error", hex: c.error, fg: c.background, r: ratio(c.error, c.surface), caption: "On surface", use: t.uses.error },
  ];
  return (
    <ul className="swatches">
      {items.map((i) => (
        <li key={i.name} className="swatch">
          <div className="chip-fill" style={{ background: i.hex, color: i.fg ?? "transparent" }}>
            {i.fg && <span aria-hidden>Aa</span>}
          </div>
          <p className="swatch-name">{i.name}</p>
          <p className="t-label swatch-hex">{i.hex}</p>
          <p className="swatch-ratio">
            <strong>{fmt(i.r)}</strong> <span className="grade">{i.name === "Border" ? "decor only" : grade(i.r)}</span>
          </p>
          <p className="swatch-note">
            {i.caption}. {i.use}
          </p>
        </li>
      ))}
    </ul>
  );
}

/* ---------- 2. type ---------- */

function TypeRoles({ t }: { t: Theme }) {
  return (
    <ul className="type-list">
      {t.type.map((r) => {
        const k = r.role.toLowerCase();
        return (
          <li key={r.role} className="type-row">
            <p className={`t-${k}`}>{r.sample}</p>
            <p className="t-label type-spec">
              {r.role} · {r.font} {r.weightLabel ?? r.weight} · {r.size}/{Math.round(r.size * r.leading)}
              {r.upper ? " · caps" : ""}
            </p>
          </li>
        );
      })}
    </ul>
  );
}

/* ---------- 3. spacing and shape ---------- */

function SpacingShape({ t }: { t: Theme }) {
  const max = Math.max(...t.spacing);
  return (
    <div className="shape-stack">
      <Specimen label="Spacing scale (px)">
        <ul className="bars">
          {t.spacing.map((n) => (
            <li key={n} className="bar-col">
              <span className="bar" style={{ height: `${Math.max(6, (n / max) * 64)}px` }} />
              <span className="t-label">{n}</span>
            </li>
          ))}
        </ul>
      </Specimen>
      <Specimen label="Corners">
        <ul className="shapes">
          {t.radii.map((r) => (
            <li key={r.label} className="shape-item">
              <span className="shape-box" style={{ borderRadius: r.css }} />
              <span className="t-label">{r.label}</span>
            </li>
          ))}
        </ul>
      </Specimen>
      <Specimen label="Borders">
        <ul className="shapes">
          {t.borders.map((b) => (
            <li key={b.label} className="shape-item">
              <span className="shape-box wide" style={{ border: b.css }} />
              <span className="t-label">{b.label}</span>
            </li>
          ))}
        </ul>
      </Specimen>
      <Specimen label={`Shadow · ${t.shadow.label}`}>
        <div className="shadow-demo">
          <span className="shape-box wide shadow-box" />
          <p className="swatch-note">{t.shadow.note}</p>
        </div>
      </Specimen>
    </div>
  );
}

/* ---------- 4. components ---------- */

function Ticket({ t }: { t: Theme }) {
  const e = t.content.event;
  return (
    <article className="ticket" aria-label={`Ticket: ${e.title}`}>
      <div className="ticket-main">
        {t.ticketArt === "constellation" && <PressedChart />}
        <p className="t-label ticket-kicker">Admit one</p>
        <h3 className="t-heading ticket-title">{e.title}</h3>
        <ul className="ticket-subs">
          {e.subs.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <dl className="ticket-meta">
          <div>
            <dt className="t-label">Date</dt>
            <dd>{e.date}</dd>
          </div>
          <div>
            <dt className="t-label">Time</dt>
            <dd>{e.time}</dd>
          </div>
          <div>
            <dt className="t-label">Price</dt>
            <dd>{e.price}</dd>
          </div>
        </dl>
        <p className="ticket-note">{t.content.ticketNote}</p>
      </div>
      <div className="ticket-stub">
        <Barcode seed={e.no} />
        <p className="t-label">No. {e.no}</p>
      </div>
    </article>
  );
}

function Components({ t }: { t: Theme }) {
  const c = t.content;
  const uid = useId();
  const [tab, setTab] = useState(0);
  const [chip, setChip] = useState(0);
  const [on, setOn] = useState(true);
  const [all, setAll] = useState(true);
  const [radio, setRadio] = useState(0);
  const [row, setRow] = useState(0);
  const [asked, setAsked] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);

  return (
    <div className="comp-stack">
      <Specimen label="Buttons and link">
        <div className="inline-row">
          <button className="btn btn-primary">{c.primary}</button>
          <button className="btn btn-secondary">{c.secondary}</button>
          <a href="#components" className="link">
            {c.link}
          </a>
        </div>
      </Specimen>

      <Specimen label="Text input and select">
        <div className="field-row">
          <label className="field-wrap">
            <span className="t-label">{c.inputLabel}</span>
            <input className="field" type="text" placeholder={c.inputPlaceholder} />
          </label>
          <label className="field-wrap">
            <span className="t-label">{c.selectLabel}</span>
            <span className="select">
              <select className="field">
                {c.selectOptions.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </span>
          </label>
        </div>
      </Specimen>

      <Specimen label="Checkbox, radios and toggle">
        <div className="inline-row">
          <label className="check">
            <input type="checkbox" checked={all} onChange={(e) => setAll(e.target.checked)} />
            <span className="box" />
            <span>{c.checkLabel}</span>
          </label>
          {c.radioLabels.map((l, i) => (
            <label key={l} className="check radio">
              <input type="radio" name={`${uid}-r`} checked={radio === i} onChange={() => setRadio(i)} />
              <span className="box" />
              <span>{l}</span>
            </label>
          ))}
          <span className="toggle-wrap">
            <button className="toggle" role="switch" aria-checked={on} aria-label={c.toggleLabel} onClick={() => setOn(!on)} />
            <span>{c.toggleLabel}</span>
          </span>
        </div>
      </Specimen>

      <Specimen label="Tabs and filter chips">
        <div role="tablist" aria-label="Show details" className="tabs">
          {c.tabs.map((l, i) => (
            <button key={l} role="tab" id={`${uid}-t${i}`} aria-selected={tab === i} aria-controls={`${uid}-p`} className="tab" onClick={() => setTab(i)}>
              {l}
            </button>
          ))}
        </div>
        <p role="tabpanel" id={`${uid}-p`} aria-labelledby={`${uid}-t${tab}`} className="tab-panel">
          {c.tabPanels[tab]}
        </p>
        <div className="inline-row chips" role="group" aria-label="Filter shows">
          {c.chips.map((l, i) => (
            <button key={l} className="chip" aria-pressed={chip === i} onClick={() => setChip(i)}>
              {l}
            </button>
          ))}
          <span className="badge">{c.badges[0]}</span>
          <span className="badge badge-muted">{c.badges[1]}</span>
        </div>
      </Specimen>

      <Specimen label="Image upload">
        <div className="upload-demo">
          <div className="upload">
            <svg className="upload-icon" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
              <rect x="3" y="5" width="22" height="18" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="10" cy="11.5" r="2.2" stroke="currentColor" strokeWidth="1.6" />
              <path d="M4 21l6.5-6 4.5 4 3-2.5 6 5" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            <span className="upload-text">
              <strong>Add an image</strong>
              <span>Drop a logo or drawing here, or click to choose.</span>
            </span>
          </div>
          <div className="upload has-image">
            <svg className="upload-thumb" viewBox="0 0 56 56" fill="none" aria-hidden>
              <circle cx="28" cy="28" r="16" stroke="currentColor" strokeWidth="2.5" />
              <path d="M28 16l9 16H19z" fill="currentColor" />
            </svg>
            <span className="upload-text">
              <strong>logo.png</strong>
              <span>Pressed into your ticket. Click to replace.</span>
            </span>
          </div>
        </div>
      </Specimen>

      <div className="card-pair">
        <Specimen label="Card">
          <article className="card">
            <div className="card-date">
              <span className="t-label">{c.event.date.split(" ")[1]}</span>
              <strong>{c.event.date.split(" ")[2]}</strong>
            </div>
            <div className="card-body">
              <h3 className="t-heading card-title">{c.event.title}</h3>
              <p className="card-sub">{c.event.subs.join(", ")}</p>
              <p className="card-meta">
                {c.event.time} · {c.event.price}
              </p>
              <div className="inline-row">
                <button className="btn btn-primary btn-sm" onClick={() => setAsked(true)}>
                  {c.primary}
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => dialog.current?.showModal()}>
                  Details
                </button>
              </div>
              {asked && (
                <p className="t-label card-flag" role="status">
                  ✓ {c.states.success[1]}
                </p>
              )}
            </div>
          </article>
        </Specimen>
        <Specimen label="List rows">
          <ul className="rows">
            {c.rows.map((r, i) => (
              <li key={r.title}>
                <button className="row" aria-current={row === i} onClick={() => setRow(i)}>
                  <span className="row-title">{r.title}</span>
                  <span className="row-meta">
                    {r.date} · {r.price}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Specimen>
      </div>

      <Specimen label="Ticket (the product's main component)">
        <Ticket t={t} />
      </Specimen>

      <dialog ref={dialog} className="modal" aria-labelledby={`${uid}-m`} onClick={(e) => e.target === dialog.current && dialog.current?.close()}>
        <div className="modal-body">
          <p className="t-label">{c.event.date} · {c.event.time}</p>
          <h3 id={`${uid}-m`} className="t-heading">
            {c.panelTitle}
          </h3>
          <p>
            {c.event.title}, with {c.event.subs.join(" and ")}. {c.event.price} at the door.
          </p>
          <p className="t-label">No. {c.event.no}</p>
          <div className="inline-row">
            <button className="btn btn-primary" onClick={() => dialog.current?.close()}>
              {c.primary}
            </button>
            <button className="btn btn-secondary" onClick={() => dialog.current?.close()} autoFocus>
              Close
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

/* ---------- 5. control states ---------- */

function ControlStates({ t }: { t: Theme }) {
  const c = t.content;
  const cell = (s: State, node: ReactNode) => (
    <div key={s} className="state-cell">
      {node}
      <span className="t-label">{s}</span>
    </div>
  );
  const rowOf = (label: string, make: (s: State) => ReactNode, skip: State[] = []) => (
    <div className="state-row">
      <p className="t-label spec-label">{label}</p>
      <div className="state-grid">
        {STATES.map((s) =>
          skip.includes(s) ? (
            <div key={s} className="state-cell">
              <span className="state-na" aria-label="Not applicable">
                —
              </span>
              <span className="t-label">{s}</span>
            </div>
          ) : (
            cell(s, make(s))
          ),
        )}
      </div>
    </div>
  );
  return (
    <div className="state-stack">
      {rowOf("Primary button", (s) => (
        <button tabIndex={-1} className={`btn btn-primary btn-sm${forced(s)}`} aria-pressed={s === "selected" || undefined} disabled={s === "disabled"}>
          {s === "selected" ? "✓ Sold" : "Sell"}
        </button>
      ))}
      {rowOf("Secondary button", (s) => (
        <button tabIndex={-1} className={`btn btn-secondary btn-sm${forced(s)}`} aria-pressed={s === "selected" || undefined} disabled={s === "disabled"}>
          {s === "selected" ? "✓ Saved" : "Save"}
        </button>
      ))}
      {rowOf("Filter chip", (s) => (
        <button tabIndex={-1} className={`chip${forced(s)}`} aria-pressed={s === "selected"} disabled={s === "disabled"}>
          {c.chips[1]}
        </button>
      ))}
      {rowOf("Checkbox", (s) => (
        <label className={`check${forced(s)}`}>
          <input type="checkbox" tabIndex={-1} defaultChecked={s === "selected"} disabled={s === "disabled"} aria-label={`Checkbox, ${s}`} />
          <span className="box" />
        </label>
      ))}
      {rowOf("Toggle", (s) => (
        <button tabIndex={-1} className={`toggle${forced(s)}`} role="switch" aria-checked={s === "selected"} disabled={s === "disabled"} aria-label={`Toggle, ${s}`} />
      ))}
      {rowOf(
        "Text input",
        (s) => (
          <input tabIndex={-1} className={`field field-sm${forced(s)}`} placeholder="Title" disabled={s === "disabled"} aria-label={`Text input, ${s}`} readOnly />
        ),
        ["pressed", "selected"],
      )}
    </div>
  );
}

/* ---------- 6. ui states ---------- */

function UiStates({ t }: { t: Theme }) {
  const s = t.content.states;
  return (
    <div className="ui-states">
      <section className="ui-state empty" aria-label="Empty state">
        <Icon name="empty" />
        <h3 className="ui-title">{s.empty[0]}</h3>
        <p>{s.empty[1]}</p>
        <button className="btn btn-secondary btn-sm" tabIndex={-1}>
          New ticket
        </button>
        <span className="t-label ui-tag">Empty</span>
      </section>
      <section className="ui-state loading" aria-label="Loading state" aria-busy="true">
        <Icon name="spinner" />
        <h3 className="ui-title">{s.loading[0]}</h3>
        <p>{s.loading[1]}</p>
        <span className="t-label ui-tag">Loading</span>
      </section>
      <section className="ui-state error" aria-label="Error state" role="alert">
        <Icon name="alert" />
        <h3 className="ui-title">{s.error[0]}</h3>
        <p>{s.error[1]}</p>
        <button className="btn btn-secondary btn-sm" tabIndex={-1}>
          Retry
        </button>
        <span className="t-label ui-tag">Error</span>
      </section>
      <section className="ui-state success" aria-label="Success state" role="status">
        <Icon name="check" />
        <h3 className="ui-title">{s.success[0]}</h3>
        <p>{s.success[1]}</p>
        <span className="t-label ui-tag">Success</span>
      </section>
    </div>
  );
}

/* ---------- page ---------- */

export function DesignSystem({ theme: t, fontClass }: { theme: Theme; fontClass: string }) {
  return (
    <div className={`ds ds-${t.slug} ${fontClass}`} style={rootVars(t)}>
      <div className="wrap">
        <Link href="/" className="back">
          ← THE HUB
        </Link>
        <header className="ds-head">
          <h1 className="t-display">
            {t.name} <span className="dot">·</span> Design System
          </h1>
          <p className="ds-tagline">{t.tagline}</p>
          <p className="t-label">
            Built from{" "}
            <Link href={`/mood-boards/${t.slug}`} className="link">
              Mood Board {t.number}: {t.board}
            </Link>
          </p>
        </header>

        <div className="ds-grid">
          <div className="ds-col">
            <section aria-labelledby="s1">
              <SectionTitle n={1} roman={t.numerals === "roman"}>
                <span id="s1">Color roles</span>
              </SectionTitle>
              <ColorRoles t={t} />
            </section>
            <section aria-labelledby="s2">
              <SectionTitle n={2} roman={t.numerals === "roman"}>
                <span id="s2">Type roles</span>
              </SectionTitle>
              <TypeRoles t={t} />
            </section>
            <section aria-labelledby="s3">
              <SectionTitle n={3} roman={t.numerals === "roman"}>
                <span id="s3">Spacing and shape</span>
              </SectionTitle>
              <SpacingShape t={t} />
            </section>
          </div>
          <div className="ds-col">
            <section aria-labelledby="s4" id="components">
              <SectionTitle n={4} roman={t.numerals === "roman"}>
                <span id="s4">Components</span>
              </SectionTitle>
              <Components t={t} />
            </section>
            <section aria-labelledby="s5">
              <SectionTitle n={5} roman={t.numerals === "roman"}>
                <span id="s5">Control states</span>
              </SectionTitle>
              <ControlStates t={t} />
            </section>
            <section aria-labelledby="s6">
              <SectionTitle n={6} roman={t.numerals === "roman"}>
                <span id="s6">UI states</span>
              </SectionTitle>
              <UiStates t={t} />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
