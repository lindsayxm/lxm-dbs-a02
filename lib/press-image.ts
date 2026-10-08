// Turns a band's image into a blind emboss, entirely in the browser.
// The image becomes a height map (anything that differs from the paper is pressed in),
// then a relief is drawn with a dark edge top-left and a soft grey edge bottom-right,
// matching the pressed chart on the ticket. Nothing is uploaded anywhere.

export const PRESS_W = 760;
export const PRESS_H = 600;

const SHADOW_ALPHA = 0.55;
const LIGHT_ALPHA = 0.24;
const BASE_ALPHA = 0.22;
const LIGHT = [206, 211, 216];

function percentile(values: Float32Array, p: number) {
  const copy = Float32Array.from(values).sort();
  return copy[Math.min(copy.length - 1, Math.floor(copy.length * p))];
}

function median(values: number[]) {
  if (!values.length) return 0;
  const s = [...values].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

function blur(src: Float32Array, w: number, h: number, sigma: number) {
  const r = Math.ceil(sigma * 3);
  const k: number[] = [];
  let sum = 0;
  for (let i = -r; i <= r; i++) {
    const v = Math.exp(-(i * i) / (2 * sigma * sigma));
    k.push(v);
    sum += v;
  }
  const norm = k.map((v) => v / sum);
  const tmp = new Float32Array(src.length);
  const out = new Float32Array(src.length);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      let s = 0;
      for (let i = -r; i <= r; i++) s += norm[i + r] * src[y * w + Math.min(w - 1, Math.max(0, x + i))];
      tmp[y * w + x] = s;
    }
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      let s = 0;
      for (let i = -r; i <= r; i++) s += norm[i + r] * tmp[Math.min(h - 1, Math.max(0, y + i)) * w + x];
      out[y * w + x] = s;
    }
  return out;
}

export function pressImage(img: HTMLImageElement): HTMLCanvasElement {
  const sw = img.naturalWidth || 512;
  const sh = img.naturalHeight || 512;
  const scale = Math.min(PRESS_W / sw, PRESS_H / sh) * 0.92;
  const dw = Math.max(2, Math.round(sw * scale));
  const dh = Math.max(2, Math.round(sh * scale));
  const dx = Math.round((PRESS_W - dw) / 2);
  const dy = Math.round((PRESS_H - dh) / 2);

  const work = document.createElement("canvas");
  work.width = PRESS_W;
  work.height = PRESS_H;
  const wctx = work.getContext("2d", { willReadFrequently: true });
  if (!wctx) throw new Error("Canvas is not available.");
  wctx.drawImage(img, dx, dy, dw, dh);
  const px = wctx.getImageData(0, 0, PRESS_W, PRESS_H).data;

  // luminance and coverage inside the image rectangle
  const n = PRESS_W * PRESS_H;
  const lum = new Float32Array(n);
  const alpha = new Float32Array(n);
  let transparent = 0;
  const opaqueLum: number[] = [];
  const ringLum: number[] = [];
  for (let y = dy; y < dy + dh; y++)
    for (let x = dx; x < dx + dw; x++) {
      const i = y * PRESS_W + x;
      const a = px[i * 4 + 3] / 255;
      const l = (0.299 * px[i * 4] + 0.587 * px[i * 4 + 1] + 0.114 * px[i * 4 + 2]) / 255;
      alpha[i] = a;
      lum[i] = l;
      if (a < 0.5) transparent++;
      else {
        if ((x + y) % 7 === 0) opaqueLum.push(l);
        if (x - dx < 3 || y - dy < 3 || dx + dw - x <= 3 || dy + dh - y <= 3) ringLum.push(l);
      }
    }
  const hasAlpha = transparent / (dw * dh) > 0.06;

  const height = new Float32Array(n);
  if (hasAlpha) {
    // a cut-out logo: press the whole silhouette, with detail from its own tones
    const m = median(opaqueLum);
    for (let y = dy; y < dy + dh; y++)
      for (let x = dx; x < dx + dw; x++) {
        const i = y * PRESS_W + x;
        height[i] = alpha[i] * (0.6 + 0.4 * Math.min(1, Math.abs(lum[i] - m) * 2.5));
      }
  } else {
    // a flat picture: press whatever differs from the paper around it
    const bg = median(ringLum.length ? ringLum : opaqueLum);
    const detail = new Float32Array(n);
    for (let y = dy; y < dy + dh; y++)
      for (let x = dx; x < dx + dw; x++) {
        const i = y * PRESS_W + x;
        detail[i] = Math.abs(lum[i] - bg);
      }
    const scaleTo = Math.max(0.15, percentile(detail, 0.995));
    for (let y = dy; y < dy + dh; y++)
      for (let x = dx; x < dx + dw; x++) {
        const i = y * PRESS_W + x;
        const edge = Math.min(x - dx, y - dy, dx + dw - 1 - x, dy + dh - 1 - y);
        height[i] = Math.min(1, detail[i] / scaleTo) * Math.min(1, edge / 10);
      }
  }

  const soft = blur(height, PRESS_W, PRESS_H, 1.3);

  // relief: light from the top-left, so walls facing away are in shadow
  const g = new Float32Array(n);
  const s = 2;
  for (let y = 0; y < PRESS_H; y++)
    for (let x = 0; x < PRESS_W; x++) {
      const x1 = Math.min(PRESS_W - 1, x + s);
      const y1 = Math.min(PRESS_H - 1, y + s);
      const x0 = Math.max(0, x - s);
      const y0 = Math.max(0, y - s);
      g[y * PRESS_W + x] = soft[y1 * PRESS_W + x1] - soft[y0 * PRESS_W + x0];
    }
  const mags = new Float32Array(n);
  for (let i = 0; i < n; i++) mags[i] = Math.abs(g[i]);
  const ref = Math.max(0.03, percentile(mags, 0.995));

  const out = document.createElement("canvas");
  out.width = PRESS_W;
  out.height = PRESS_H;
  const octx = out.getContext("2d");
  if (!octx) throw new Error("Canvas is not available.");
  const result = octx.createImageData(PRESS_W, PRESS_H);
  for (let i = 0; i < n; i++) {
    const t = Math.max(-1, Math.min(1, g[i] / ref));
    const aShadow = t > 0 ? t * SHADOW_ALPHA : 0;
    const aLight = t < 0 ? -t * LIGHT_ALPHA : 0;
    const darkA = Math.min(1, aShadow + soft[i] * BASE_ALPHA);
    const a = aLight + darkA * (1 - aLight);
    for (let c = 0; c < 3; c++) result.data[i * 4 + c] = a > 0 ? Math.round((LIGHT[c] * aLight) / a) : 0;
    result.data[i * 4 + 3] = Math.round(a * 255);
  }
  octx.putImageData(result, 0, 0);
  return out;
}

export const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"];
export const MAX_BYTES = 8 * 1024 * 1024;
