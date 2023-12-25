// utils

import { Color } from '@/app/components/ColorPicker/Color';

const componentToHex = (component: number) => {
  return component.toString(16).padStart(2, '0');
};

const alphaToHex = (alpha: number) => {
  return Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0');
};

// HEX

export const RGBToHex = (r: number, g: number, b: number) => {
  return {
    r: componentToHex(r),
    g: componentToHex(g),
    b: componentToHex(b),
  };
};

export const RGBAToHex = (r: number, g: number, b: number, a: number) => {

  return {
    r: componentToHex(r),
    g: componentToHex(g),
    b: componentToHex(b),
    a: alphaToHex(a),
  };
};

export const hexToRGB = (hex: string) => {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
};

export const hexToRGBA = (hex: string) => {
  const rgb = hexToRGB(hex);

  return {
    ...rgb,
    a: hex.length === 9 ? parseInt(hex.slice(7, 9), 16) / 255 : 1,
  };
};

// HSL

export const RGBToHSL = (r: number, g: number, b: number) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const l = Math.max(r, g, b);
  const s = l - Math.min(r, g, b);
  const h = s ? (l === r ? (g - b) / s : l === g ? 2 + (b - r) / s : 4 + (r - g) / s) : 0;

  const result = {
    h: 60 * h < 0 ? 60 * h + 360 : 60 * h,
    s: 100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
    l: (100 * (2 * l - s)) / 2,
  };

  return {
    h: result.h,
    s: result.s / 100,
    l: result.l / 100,
  };
};

export const RGBAToHSLA = (r: number, g: number, b: number, a: number) => {
  const hsl = RGBToHSL(r, g, b);

  return {
    ...hsl,
    a: a,
  };
};

export const HSLToRGB = (h: number, s: number, l: number) => {
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  return {
    r: Math.round(f(0) * 255),
    g: Math.round(f(8) * 255),
    b: Math.round(f(4) * 255),
  };
};

export const HSLAToRGBA = (h: number, s: number, l: number, a: number) => {
  const rgb = HSLToRGB(h, s, l);
  return {
    ...rgb,
    a: a,
  };
};

// HSV

export const RGBToHSV = (r: number, g: number, b: number) => {
  const v = Math.max(r, g, b);
  const c = v - Math.min(r, g, b);
  const h = c && (v == r ? (g - b) / c : v == g ? 2 + (b - r) / c : 4 + (r - g) / c);

  return {
    h: 60 * (h < 0 ? h + 6 : h),
    s: v && c / v,
    v: v / 255,
  };
};

export const RGBAToHSVA = (r: number, g: number, b: number, a: number) => {
  const hsv = RGBToHSV(r, g, b);

  return {
    ...hsv,
    a: a,
  };
};

export const HSVToRGB = (h: number, s: number, v: number) => {
  let d = 0.0166666666666666 * h;
  let c = v * s;
  let x = c - c * Math.abs((d % 2.0) - 1.0);
  let m = v - c;
  c += m;
  x += m;

  m = Math.round(m * 255);
  c = Math.round(c * 255);
  x = Math.round(x * 255);

  switch (d >>> 0) {
    case 0:
      return { r: c, g: x, b: m };
    case 1:
      return { r: x, g: c, b: m };
    case 2:
      return { r: m, g: c, b: x };
    case 3:
      return { r: m, g: x, b: c };
    case 4:
      return { r: x, g: m, b: c };
  }

  return { r: c, g: m, b: x };
};

export const HSVAToRGBA = (h: number, s: number, v: number, a: number) => {
  const rgb = HSVToRGB(h, s, v);

  return {
    ...rgb,
    a: a,
  };
};

// Parse

export const parseColor = (color: string) => {
  if (color === 'transparent') return new Color().fromRGBA(0, 0, 0, 0);

  if (color.startsWith('#')) return new Color().fromHex(color);

  if (color.startsWith('rgb')) {
    if (color.startsWith('rgba')) {
      const [r, g, b, a] = color
        .slice(5, -1)
        .split(',')
        .map((value) => parseInt(value, 10));

      return new Color().fromRGBA(r, g, b, a);
    }

    const [r, g, b] = color
      .slice(4, -1)
      .split(',')
      .map((value) => parseInt(value, 10));

    return new Color().fromRGB(r, g, b);
  }

  if (color.startsWith('hsl')) {
    if (color.startsWith('hsla')) {
      const [h, s, l, a] = color
        .slice(5, -1)
        .split(',')
        .map((value) => parseInt(value, 10));

      return new Color().fromHSLA(h, s, l, a);
    }
  }

  if (color.startsWith('hsv')) {
    if (color.startsWith('hsva')) {
      const [h, s, v, a] = color
        .slice(5, -1)
        .split(',')
        .map((value) => parseInt(value, 10));

      return new Color().fromHSVA(h, s, v, a);
    }
  }

  console.error('Unknown color format', color);

  return new Color();
};
