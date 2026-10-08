"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { PressedChart } from "../../design-systems/_components/PressedChart";
import { storywriter } from "@/lib/design-systems/themes";
import { rootVars } from "@/lib/design-systems/vars";
import { ACCEPTED_TYPES, MAX_BYTES, pressImage } from "@/lib/press-image";
import { Barcode } from "./Barcode";
import { StateIcon } from "./StateIcon";
import "../../design-systems/ds.css";
import "../site.css";

const MAX_ACTS = 5;
type Status = "idle" | "loading" | "error" | "ready";
type Field = "title" | "date" | "time" | "price" | "venmo";

// Venmo usernames are 5 to 30 letters, numbers, hyphens or underscores. A leading @ is fine.
const VENMO = /^[A-Za-z0-9_-]{5,30}$/;
const cleanHandle = (v: string) => v.trim().replace(/^@+/, "");

/* ---------- helpers ---------- */

function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

const fmtDate = (d: string) => {
  if (!d) return "—";
  const [y, m, day] = d.split("-").map(Number);
  return new Date(y, m - 1, day).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }).replace(",", "");
};

const fmtTime = (t: string) => {
  if (!t) return "—";
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};

const fmtPrice = (p: string) => {
  const n = Number(p);
  if (!p.trim() || Number.isNaN(n)) return "—";
  if (n === 0) return "FREE";
  return `$${Number.isInteger(n) ? n : n.toFixed(2)}`;
};

/* ---------- ticket ---------- */

// The band's own image, pressed into the paper. It replaces the stock chart.
function EmbossArt({ source }: { source: HTMLCanvasElement }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    c.width = source.width;
    c.height = source.height;
    ctx.drawImage(source, 0, 0);
  }, [source]);
  return <canvas ref={ref} className="ticket-art" aria-hidden width={source.width} height={source.height} />;
}

function Ticket(props: { title: string; acts: string[]; date: string; time: string; price: string; no: string; emboss: HTMLCanvasElement | null; light: boolean }) {
  return (
    <article className="ticket" data-mode={props.light ? "light" : "dark"} aria-label={`Ticket preview: ${props.title}`}>
      <span className="paper" aria-hidden />
      <div className="ticket-main">
        {props.emboss ? <EmbossArt source={props.emboss} /> : <PressedChart />}
        <p className="t-label ticket-kicker">Admit one</p>
        <h3 className="t-heading ticket-title">{props.title}</h3>
        {props.acts.length > 0 && (
          <ul className="ticket-subs">
            {props.acts.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        )}
        <dl className="ticket-meta">
          <div>
            <dt className="t-label">Date</dt>
            <dd>{fmtDate(props.date)}</dd>
          </div>
          <div>
            <dt className="t-label">Time</dt>
            <dd>{fmtTime(props.time)}</dd>
          </div>
          <div>
            <dt className="t-label">Price</dt>
            <dd>{fmtPrice(props.price)}</dd>
          </div>
        </dl>
      </div>
      <div className="ticket-stub">
        <div className="barcode-plate">
          <Barcode value={props.no} />
        </div>
        <div className="stub-foot">
          <p className="t-label">No. {props.no}</p>
          <p className="ticket-note">
            <span>Valid for one entry.</span>
            <span>Do not duplicate.</span>
          </p>
        </div>
      </div>
    </article>
  );
}

/* ---------- page ---------- */

export function PapercutSite({ fontClass }: { fontClass: string }) {
  const uid = useId();
  const fieldId = (f: Field) => `${uid}-${f}`;
  const errId = (f: Field) => `${uid}-${f}-err`;
  const [title, setTitle] = useState("Night Season");
  const [acts, setActs] = useState(["Low Orbit", "Hollow Ground"]);
  const [date, setDate] = useState("2026-11-21");
  const [time, setTime] = useState("19:00");
  const [price, setPrice] = useState("10");
  const [venmo, setVenmo] = useState("");

  const [status, setStatus] = useState<Status>("idle");
  const [issues, setIssues] = useState<Partial<Record<Field, string>>>({});
  const [linkFor, setLinkFor] = useState<string | null>(null);
  const [copied, setCopied] = useState<"idle" | "yes" | "no">("idle");
  const [lightTicket, setLightTicket] = useState(false); // the ticket can be printed on dark or light paper
  const [sold, setSold] = useState(false); // once Sell Tickets has been pressed, the how-it-works note goes away

  // the band's image, converted to an emboss in the browser
  const [image, setImage] = useState<{ name: string; url: string; key: string } | null>(null);
  const [emboss, setEmboss] = useState<HTMLCanvasElement | null>(null);
  const [imageState, setImageState] = useState<"idle" | "working" | "error">("idle");
  const [imageError, setImageError] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const objectUrl = useRef<string | null>(null);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const linkInput = useRef<HTMLInputElement>(null);

  const cleanTitle = title.trim();
  const cleanActs = acts.map((a) => a.trim()).filter(Boolean);
  // the ticket number follows the ticket itself; the checkout link also follows where the money goes
  const ticketSig = JSON.stringify([cleanTitle, cleanActs, date, time, price.trim(), image?.key ?? ""]);
  const signature = JSON.stringify([ticketSig, cleanHandle(venmo).toLowerCase()]);
  const ticketNo = String(hash(ticketSig) % 100000000).padStart(8, "0");
  const link = `https://buy.stripe.com/test_${hash(signature).toString(36)}${hash(signature + "x").toString(36)}`;
  const sigRef = useRef(signature);

  useEffect(() => {
    sigRef.current = signature;
  }, [signature]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    },
    [],
  );

  async function addImage(file: File) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setImageState("error");
      setImageError("Use a PNG, JPG, WebP, GIF or SVG image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setImageState("error");
      setImageError("That file is over 8 MB. Try a smaller one.");
      return;
    }
    setImageState("working");
    setImageError("");
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      img.src = url;
      await img.decode();
      const canvas = pressImage(img);
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
      objectUrl.current = url;
      setImage({ name: file.name, url, key: `${file.name}|${file.size}|${file.lastModified}` });
      setEmboss(canvas);
      setImageState("idle");
    } catch {
      URL.revokeObjectURL(url);
      setImageState("error");
      setImageError("We couldn't read that image. Try another file.");
    }
  }

  function removeImage() {
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    objectUrl.current = null;
    setImage(null);
    setEmboss(null);
    setImageState("idle");
    setImageError("");
    if (fileInput.current) fileInput.current.value = "";
  }

  const clearIssue = (f: Field) => setIssues((prev) => (prev[f] ? { ...prev, [f]: undefined } : prev));

  function validate() {
    const e: Partial<Record<Field, string>> = {};
    if (!cleanTitle) e.title = "Add an event title.";
    if (!date) e.date = "Pick a date.";
    if (!time) e.time = "Pick a time.";
    if (!price.trim()) e.price = "Add a price, or 0 for free.";
    else if (!/^\d{1,4}(\.\d{1,2})?$/.test(price.trim())) e.price = "Use numbers only, like 15 or 12.50.";
    if (!venmo.trim() || !cleanHandle(venmo)) e.venmo = "Add your Venmo handle so we know where to send your sales.";
    else if (!VENMO.test(cleanHandle(venmo))) e.venmo = "Use 5 to 30 letters, numbers, hyphens or underscores, like @night-season.";
    return e;
  }

  function sell() {
    setSold(true);
    const e = validate();
    setIssues(e);
    setCopied("idle");
    const first = (["title", "date", "time", "price", "venmo"] as Field[]).find((f) => e[f]);
    if (first) {
      setLinkFor(null);
      setStatus("error");
      document.getElementById(fieldId(first))?.focus();
      return;
    }
    setStatus("loading");
    const sig = signature;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (sigRef.current !== sig) return setStatus("idle");
      setLinkFor(sig);
      setStatus("ready");
    }, 900);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied("yes");
    } catch {
      linkInput.current?.select();
      setCopied("no");
    }
  }

  // Any edit makes an earlier link stale, so only show it while it still matches the ticket.
  const view: Status = status === "ready" && linkFor !== signature ? "idle" : status;
  const issueList = (Object.entries(issues) as [Field, string | undefined][]).filter(([, m]) => m);
  const fieldProps = (f: Field) => ({
    id: fieldId(f),
    "aria-invalid": issues[f] ? true : undefined,
    "aria-describedby": issues[f] ? errId(f) : undefined,
  });
  const fieldError = (f: Field) =>
    issues[f] ? (
      <span id={errId(f)} className="field-error">
        {issues[f]}
      </span>
    ) : null;

  return (
    <div className={`ds ds-storywriter site ${fontClass}`} style={rootVars(storywriter)}>
      <div className="wrap">
        <header className="site-top">
          {/* no visible title; the page still needs a heading for screen readers */}
          <h1 className="sr-only">Papercut Tickets</h1>
          <Link href="/" className="back">
            ← THE HUB
          </Link>
        </header>

        <div className="site-grid">
          {/* ---------- 1. form ---------- */}
          <section aria-labelledby={`${uid}-s1`} className="site-form">
            <h2 className="sec-title">
              <span className="sec-mark" aria-hidden>
                §
              </span>
              <span id={`${uid}-s1`}>Event</span>
            </h2>

            <div className="form-stack">
              <label className="field-wrap">
                <span className="t-label">Event title</span>
                <input
                  {...fieldProps("title")}
                  className="field"
                  type="text"
                  value={title}
                  maxLength={60}
                  placeholder="Band or event name"
                  onChange={(e) => {
                    setTitle(e.target.value);
                    clearIssue("title");
                  }}
                />
                {fieldError("title")}
              </label>

              <fieldset className="acts">
                <legend className="t-label">
                  Subtitles <span className="hint">· up to {MAX_ACTS}</span>
                </legend>
                {acts.map((a, i) => (
                  <div key={i} className="act-row">
                    <input
                      className="field"
                      type="text"
                      value={a}
                      maxLength={40}
                      placeholder={`Subtitle ${i + 1}`}
                      aria-label={`Subtitle ${i + 1}`}
                      onChange={(e) => setActs(acts.map((x, j) => (j === i ? e.target.value : x)))}
                    />
                    <button type="button" className="btn btn-secondary btn-sm btn-icon" aria-label={`Remove subtitle ${i + 1}`} onClick={() => setActs(acts.filter((_, j) => j !== i))}>
                      <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden>
                        <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
                      </svg>
                    </button>
                  </div>
                ))}
                <div className="act-add">
                  <button type="button" className="btn btn-secondary btn-sm" disabled={acts.length >= MAX_ACTS} onClick={() => setActs([...acts, ""])}>
                    + Add subtitle
                  </button>
                </div>
              </fieldset>

              <div className="when-row">
                <label className="field-wrap">
                  <span className="t-label">Date</span>
                  <input
                    {...fieldProps("date")}
                    className="field"
                    type="date"
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      clearIssue("date");
                    }}
                  />
                  {fieldError("date")}
                </label>
                <label className="field-wrap">
                  <span className="t-label">Time</span>
                  <input
                    {...fieldProps("time")}
                    className="field"
                    type="time"
                    value={time}
                    onChange={(e) => {
                      setTime(e.target.value);
                      clearIssue("time");
                    }}
                  />
                  {fieldError("time")}
                </label>
                <label className="field-wrap">
                  <span className="t-label">Price</span>
                  <span className="money">
                    <input
                      {...fieldProps("price")}
                      className="field"
                      type="text"
                      inputMode="decimal"
                      value={price}
                      maxLength={7}
                      placeholder="15"
                      onChange={(e) => {
                        setPrice(e.target.value);
                        clearIssue("price");
                      }}
                    />
                  </span>
                  {fieldError("price")}
                </label>
              </div>

              <div className="image-field">
                <label
                  className={`upload${dragging ? " is-drag" : ""}${image ? " has-image" : ""}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    const f = e.dataTransfer.files[0];
                    if (f) addImage(f);
                  }}
                >
                  <input
                    ref={fileInput}
                    className="upload-input"
                    type="file"
                    accept={ACCEPTED_TYPES.join(",")}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) addImage(f);
                    }}
                  />
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="upload-thumb" src={image.url} alt="" />
                  ) : (
                    <svg className="upload-icon" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
                      <rect x="3" y="5" width="22" height="18" stroke="currentColor" strokeWidth="1.6" />
                      <circle cx="10" cy="11.5" r="2.2" stroke="currentColor" strokeWidth="1.6" />
                      <path d="M4 21l6.5-6 4.5 4 3-2.5 6 5" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                  )}
                  <span className="upload-text">
                    <strong>{image ? image.name : "Add an image"}</strong>
                    <span>{image ? "Pressed into your ticket. Click to replace." : "Drop a logo or drawing here, or click to choose. PNG, JPG, WebP, GIF or SVG, up to 8 MB."}</span>
                  </span>
                </label>
                {image && (
                  <button type="button" className="btn btn-secondary btn-sm upload-remove" onClick={removeImage}>
                    Remove image
                  </button>
                )}
                <p className="upload-status" role="status">
                  {imageState === "working" ? "Pressing your image…" : ""}
                </p>
                {imageError && (
                  <span className="field-error" role="alert">
                    {imageError}
                  </span>
                )}
              </div>

              <label className="field-wrap">
                <span className="t-label">
                  Venmo handle <span className="hint">· required, where your ticket sales are sent</span>
                </span>
                <span className="handle">
                  <span className="handle-at" aria-hidden>
                    @
                  </span>
                  <input
                    {...fieldProps("venmo")}
                    className="field"
                    type="text"
                    value={venmo}
                    maxLength={31}
                    placeholder="your-handle"
                    autoComplete="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    required
                    onChange={(e) => {
                      setVenmo(e.target.value);
                      clearIssue("venmo");
                    }}
                  />
                </span>
                {fieldError("venmo")}
              </label>
            </div>
          </section>

          {/* ---------- 2. ticket ---------- */}
          <section aria-labelledby={`${uid}-s2`} className="site-preview">
            <h2 className="sec-title">
              <span className="sec-mark" aria-hidden>
                §
              </span>
              <span id={`${uid}-s2`}>Ticket</span>
            </h2>

            {cleanTitle ? (
              <Ticket title={cleanTitle} acts={cleanActs} date={date} time={time} price={price} no={ticketNo} emboss={emboss} light={lightTicket} />
            ) : (
              <section className="ui-state empty" aria-label="Empty ticket">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
                  <circle cx="18" cy="18" r="15" stroke="currentColor" strokeWidth="2" strokeDasharray="4 5" />
                </svg>
                <h3 className="ui-title">No ticket yet</h3>
                <p>Add an event title to print your first ticket.</p>
              </section>
            )}

            {/* once the link is made the button has done its job. Editing the ticket brings it back. */}
            {/* once the link is made, the button and the paper switch have both done their job. Editing the ticket brings them back. */}
            {view !== "ready" && (
              <div className="actions">
                <div className="sell">
                  <button type="button" className="btn btn-primary btn-lg" onClick={sell} disabled={view === "loading"} aria-busy={view === "loading"}>
                    Sell Tickets
                  </button>
                  {!sold && <p className="sell-note">Makes a checkout link you can post.</p>}
                </div>
                <span className="toggle-wrap mode-toggle" role="group" aria-label="Ticket color">
                  <span className={`t-label mode-label${lightTicket ? "" : " is-on"}`} onClick={() => setLightTicket(false)}>
                    Dark
                  </span>
                  <button type="button" className="toggle" role="switch" aria-checked={lightTicket} aria-label="Light ticket" onClick={() => setLightTicket(!lightTicket)} />
                  <span className={`t-label mode-label${lightTicket ? " is-on" : ""}`} onClick={() => setLightTicket(true)}>
                    Light
                  </span>
                </span>
              </div>
            )}

            {view === "loading" && (
              <div className="banner loading" role="status">
                <StateIcon name="spinner" />
                <div>
                  <h3 className="ui-title">Printing ticket…</h3>
                  <p>Building your checkout link.</p>
                </div>
              </div>
            )}

            {view === "error" && issueList.length > 0 && (
              <div className="banner error" role="alert">
                <StateIcon name="alert" />
                <div>
                  <h3 className="ui-title">Print fault</h3>
                  <ul>
                    {issueList.map(([f, m]) => (
                      <li key={f}>{m}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {view === "ready" && (
              <div className="banner success" role="status">
                <StateIcon name="check" />
                <div className="link-block">
                  <h3 className="ui-title">Ticket printed</h3>
                  <p>Your checkout link is ready to share.</p>
                  <div className="link-row">
                    <input ref={linkInput} className="field" type="text" readOnly value={link} aria-label="Checkout link" onFocus={(e) => e.currentTarget.select()} />
                    <button type="button" className="btn btn-secondary" onClick={copy}>
                      {copied === "yes" ? "✓ Copied" : "Copy link"}
                    </button>
                  </div>
                  {copied === "no" && (
                    <p className="demo-note" role="status">
                      Couldn&apos;t copy automatically. The link is selected, so press Ctrl or Cmd + C.
                    </p>
                  )}
                </div>
              </div>
            )}

            {view === "ready" && <p className="save-note">Be sure to save this link. We don&apos;t save these for you.</p>}
          </section>
        </div>

        <footer className="site-foot">
          <span>Papercut Tickets.</span>
          <span>
            Chicago, USA.{" "}
            <span className="stars" aria-hidden>
              {[0, 1, 2, 3].map((i) => (
                <svg key={i} viewBox="0 0 24 24" focusable="false">
                  <polygon points="12.00,0.50 15.32,6.25 21.96,6.25 18.64,12.00 21.96,17.75 15.32,17.75 12.00,23.50 8.68,17.75 2.04,17.75 5.36,12.00 2.04,6.25 8.68,6.25" />
                </svg>
              ))}
            </span>
          </span>
          <span>All rights reserved.</span>
        </footer>
      </div>
    </div>
  );
}
