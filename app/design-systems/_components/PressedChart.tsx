// A celestial chart pressed into the paper, drawn after the Storywriter mood board's bound books:
// broken orbit rings, planets, fans of fine lines, dial ticks, small glyphs and star dust.
// Each shape is drawn three times (dark edge top-left, light edge bottom-right, slightly darker
// fill) so it reads as debossed. Everything stays low contrast so ticket text reads over it.
type Prim =
  | { k: "path"; d: string; w?: number; fill?: boolean }
  | { k: "circle"; cx: number; cy: number; r: number; w?: number; fill?: boolean };

const CX = 235;
const CY = 150;
const rad = (deg: number) => (deg * Math.PI) / 180;
const pt = (r: number, a: number): [number, number] => [CX + r * Math.cos(rad(a)), CY + r * Math.sin(rad(a))];
const f = (n: number) => n.toFixed(1);

function arc(r: number, a0: number, a1: number) {
  const [x0, y0] = pt(r, a0);
  const [x1, y1] = pt(r, a1);
  return `M${f(x0)} ${f(y0)}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${f(x1)} ${f(y1)}`;
}

function seeded(seed: number) {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function buildChart(): Prim[] {
  const out: Prim[] = [];

  // sun disc, with an inner ring
  out.push({ k: "circle", cx: CX, cy: CY, r: 15, fill: true });
  out.push({ k: "circle", cx: CX, cy: CY, r: 9.5, w: 1 });

  // orbit rings, each broken into arcs of its own length
  const rings: [number, number, [number, number][]][] = [
    [30, 1.4, [[-80, 10], [40, 150], [175, 260]]],
    [44, 2.2, [[-30, 95], [120, 215], [240, 320]]],
    [60, 1.1, [[10, 70], [85, 200], [215, 300]]],
    [78, 2.6, [[-100, -10], [20, 130], [160, 230]]],
    [98, 1.2, [[-60, 40], [70, 150], [185, 250], [270, 310]]],
  ];
  for (const [r, w, arcs] of rings) for (const [a0, a1] of arcs) out.push({ k: "path", d: arc(r, a0, a1), w });

  // dial ticks on a partial ring, long every fifth
  let ticks = "";
  for (let a = 190; a <= 350; a += 4) {
    const long = (a - 190) % 20 === 0;
    const [x0, y0] = pt(88, a);
    const [x1, y1] = pt(88 + (long ? 7 : 3.5), a);
    ticks += `M${f(x0)} ${f(y0)}L${f(x1)} ${f(y1)}`;
  }
  out.push({ k: "path", d: ticks, w: 0.9 });

  // planets riding the rings: [ring, angle, size, filled]
  const planets: [number, number, number, boolean][] = [
    [30, -30, 2.6, true], [30, 100, 1.8, false], [44, 40, 3.6, true], [44, 170, 2.2, false], [44, -70, 2.6, true],
    [60, 35, 2.4, true], [60, 250, 3, false], [78, -50, 4.2, true], [78, 90, 2.6, true], [98, 0, 3.2, false],
    [98, 200, 2.4, true], [98, -80, 3.8, true],
  ];
  for (const [r, a, size, filled] of planets) {
    const [x, y] = pt(r, a);
    out.push({ k: "circle", cx: +f(x), cy: +f(y), r: size, fill: filled, w: 1 });
  }

  // fans of fine radiating lines
  const fans: [number, number, number, number, number][] = [
    [-118, -72, 4.6, 108, 148], [28, 62, 4.4, 108, 146], [168, 204, 4, 108, 140],
  ];
  for (const [a0, a1, step, r0, r1] of fans) {
    let d = "";
    for (let a = a0; a <= a1; a += step) {
      const [x0, y0] = pt(r0, a);
      const [x1, y1] = pt(r1, a);
      d += `M${f(x0)} ${f(y0)}L${f(x1)} ${f(y1)}`;
    }
    out.push({ k: "path", d, w: 0.9 });
  }

  // small glyphs around the outer ring, skipping the fans
  const inFan = (a: number) => fans.some(([a0, a1]) => ((a % 360) + 360) % 360 >= ((a0 % 360) + 360) % 360 - 6 && ((a % 360) + 360) % 360 <= ((a1 % 360) + 360) % 360 + 6);
  const glyphs = ["tri", "cross", "ring", "diamond", "arc", "dot"];
  let gi = 0;
  for (let a = 0; a < 360; a += 22) {
    if (inFan(a)) continue;
    const [x, y] = pt(113, a);
    const g = glyphs[gi++ % glyphs.length];
    const s = 3.4;
    if (g === "tri") out.push({ k: "path", d: `M${f(x)} ${f(y - s)}L${f(x + s * 0.87)} ${f(y + s * 0.5)}L${f(x - s * 0.87)} ${f(y + s * 0.5)}Z`, fill: true, w: 0.8 });
    if (g === "cross") out.push({ k: "path", d: `M${f(x - s)} ${f(y)}H${f(x + s)}M${f(x)} ${f(y - s)}V${f(y + s)}`, w: 1 });
    if (g === "ring") out.push({ k: "circle", cx: +f(x), cy: +f(y), r: 2.6, w: 1 });
    if (g === "diamond") out.push({ k: "path", d: `M${f(x)} ${f(y - s)}L${f(x + s)} ${f(y)}L${f(x)} ${f(y + s)}L${f(x - s)} ${f(y)}Z`, w: 1 });
    if (g === "arc") out.push({ k: "path", d: `M${f(x - s)} ${f(y + 1)}A${s} ${s} 0 0 1 ${f(x + s)} ${f(y + 1)}`, w: 1.2 });
    if (g === "dot") out.push({ k: "circle", cx: +f(x), cy: +f(y), r: 1.5, fill: true, w: 0.6 });
  }

  // a constellation reaching in from the left
  const stars: [number, number, number][] = [
    [30, 205, 3], [70, 175, 2.4], [105, 190, 3.4], [140, 160, 2.6], [60, 120, 2.2], [100, 95, 3], [150, 60, 2.4], [175, 115, 2],
  ];
  const links: [number, number][] = [[0, 1], [1, 2], [2, 3], [1, 4], [4, 5], [5, 6], [3, 7], [5, 7]];
  out.push({ k: "path", d: links.map(([a, b]) => `M${stars[a][0]} ${stars[a][1]}L${stars[b][0]} ${stars[b][1]}`).join(""), w: 1.1 });
  for (const [x, y, r] of stars) out.push({ k: "circle", cx: x, cy: y, r, fill: true, w: 0.8 });

  // plus-marks and rings scattered in the margins, as on the black-cover reference
  out.push({ k: "path", d: "M22 28H38M30 20V36M22 56H38M30 48V64", w: 1 });
  out.push({ k: "circle", cx: 30, cy: 82, r: 3, w: 1 });
  out.push({ k: "path", d: "M335 262H349M342 255V269", w: 1 });
  out.push({ k: "circle", cx: 318, cy: 280, r: 2.4, w: 1 });

  // star dust in two drifts
  const rnd = seeded(7);
  const drift = (cx: number, cy: number, spread: number, n: number) => {
    for (let i = 0; i < n; i++) {
      const a = rnd() * Math.PI * 2;
      const d = (rnd() + rnd() + rnd()) / 3 * spread * 1.6;
      out.push({ k: "circle", cx: +f(cx + Math.cos(a) * d), cy: +f(cy + Math.sin(a) * d), r: +(0.5 + rnd() * 0.9).toFixed(1), fill: true, w: 0.4 });
    }
  };
  drift(300, 235, 26, 24);
  drift(150, 40, 22, 16);
  drift(35, 160, 18, 10);
  return out;
}

const CHART = buildChart();

export function PressedChart() {
  const layer = (cls: string, dx: number, dy: number) => (
    <g className={cls} transform={`translate(${dx} ${dy})`}>
      {CHART.map((p, i) =>
        p.k === "path" ? (
          <path key={i} d={p.d} strokeWidth={p.w} fill={p.fill ? undefined : "none"} />
        ) : (
          <circle key={i} cx={p.cx} cy={p.cy} r={p.r} strokeWidth={p.w} fill={p.fill ? undefined : "none"} />
        ),
      )}
    </g>
  );
  return (
    <svg className="ticket-art" viewBox="0 0 380 300" aria-hidden focusable="false">
      {layer("art-shadow", -1, -1.1)}
      {layer("art-light", 1.2, 1.4)}
      {layer("art-base", 0, 0)}
    </svg>
  );
}
