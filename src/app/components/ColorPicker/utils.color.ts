export type TRGBA = { r: number; g: number; b: number; a: number };
export type THSVA = { h: number; s: number; v: number; a: number };
export type THSLA = { h: number; s: number; l: number; a: number };

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

const normalizeHue = (hue: number) => ((hue % 360) + 360) % 360;

const toHexPart = (value: number) => Math.round(value).toString(16).padStart(2, '0');

export const RGBToHSV = (r: number, g: number, b: number) => {
  const [rn, gn, bn] = [r / 255, g / 255, b / 255];
  const max = Math.max(rn, gn, bn);
  const delta = max - Math.min(rn, gn, bn);

  let h = 0;
  if (delta) {
    if (max === rn) h = ((gn - bn) / delta) % 6;
    else if (max === gn) h = (bn - rn) / delta + 2;
    else h = (rn - gn) / delta + 4;
  }

  return { h: normalizeHue(h * 60), s: max ? delta / max : 0, v: max };
};

export const HSVToRGB = (h: number, s: number, v: number) => {
  const f = (n: number) => {
    const k = (n + normalizeHue(h) / 60) % 6;
    return Math.round((v - v * s * Math.max(0, Math.min(k, 4 - k, 1))) * 255);
  };

  return { r: f(5), g: f(3), b: f(1) };
};

export const RGBToHSL = (r: number, g: number, b: number) => {
  const { h, s, v } = RGBToHSV(r, g, b);
  return { h, ...HSVToHSL(s, v) };
};

export const HSLToRGB = (h: number, s: number, l: number) => {
  const { s: sv, v } = HSLToHSV(s, l);
  return HSVToRGB(h, sv, v);
};

export const HSVToHSL = (s: number, v: number) => {
  const l = v * (1 - s / 2);
  const sl = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);

  return { s: sl, l };
};

export const HSLToHSV = (s: number, l: number) => {
  const v = l + s * Math.min(l, 1 - l);
  const sv = v === 0 ? 0 : 2 * (1 - l / v);

  return { s: sv, v };
};

export const RGBAToHex = ({ r, g, b, a }: TRGBA, withAlpha = a < 1) => {
  return `#${toHexPart(r)}${toHexPart(g)}${toHexPart(b)}${withAlpha ? toHexPart(a * 255) : ''}`;
};

export const hexToRGBA = (hex: string): TRGBA | null => {
  const match = /^#?([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(hex.trim());
  if (!match) return null;

  const digits = match[1].length <= 4 ? [...match[1]].map((digit) => digit + digit).join('') : match[1];
  const [r, g, b, a = 255] = (digits.match(/../g) ?? []).map((part) => parseInt(part, 16));

  return { r, g, b, a: a / 255 };
};

let context: CanvasRenderingContext2D | null = null;

const parseCssColor = (color: string): TRGBA | null => {
  context ??= document.createElement('canvas').getContext('2d');
  const ctx = context;
  if (!ctx) return null;

  const results = ['#010203', '#040506'].map((sentinel) => {
    ctx.fillStyle = sentinel;
    ctx.fillStyle = color;
    return String(ctx.fillStyle);
  });

  if (results[0] !== results[1]) return null;

  const normalized = results[0];
  if (normalized.startsWith('#')) return hexToRGBA(normalized);

  const channels = /rgba?\(([^)]+)\)/
    .exec(normalized)?.[1]
    .split(/[\s,/]+/)
    .filter(Boolean)
    .map(Number);
  if (!channels || channels.length < 3) return null;

  const [r, g, b, a = 1] = channels;
  return { r, g, b, a };
};

export const parseColor = (color: string): TRGBA | null => {
  const hsv = /^hsva?\(\s*([\d.]+)(?:deg)?[\s,]+([\d.]+)%?[\s,]+([\d.]+)%?(?:[\s,/]+([\d.]+)(%?))?\s*\)$/i.exec(
    color.trim(),
  );

  if (hsv) {
    const [, h, s, v, a, alphaPercent] = hsv;
    const alpha = a === undefined ? 1 : Number(a) / (alphaPercent ? 100 : 1);

    return { ...HSVToRGB(Number(h), Number(s) / 100, Number(v) / 100), a: clamp01(alpha) };
  }

  return parseCssColor(color);
};

export { clamp01, normalizeHue };
