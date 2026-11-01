import {
  clamp01,
  hexToRGBA,
  HSLToRGB,
  HSVToRGB,
  parseColor,
  RGBAToHex,
  RGBToHSL,
  RGBToHSV,
} from '@/app/components/ColorPicker/utils.color';

const round = (value: number, digits = 0) => Number(value.toFixed(digits));
const channel = (value: number) => Math.round(Math.min(Math.max(value, 0), 255));

export class Color {
  r = 0;
  g = 0;
  b = 0;
  a = 1;

  fromRGB(r: number, g: number, b: number) {
    this.r = channel(r);
    this.g = channel(g);
    this.b = channel(b);

    return this;
  }

  fromRGBA(r: number, g: number, b: number, a: number) {
    this.fromRGB(r, g, b);
    this.a = clamp01(a);

    return this;
  }

  fromHSL(h: number, s: number, l: number) {
    const { r, g, b } = HSLToRGB(h, clamp01(s), clamp01(l));
    return this.fromRGB(r, g, b);
  }

  fromHSLA(h: number, s: number, l: number, a: number) {
    this.fromHSL(h, s, l);
    this.a = clamp01(a);

    return this;
  }

  fromHSV(h: number, s: number, v: number) {
    const { r, g, b } = HSVToRGB(h, clamp01(s), clamp01(v));
    return this.fromRGB(r, g, b);
  }

  fromHSVA(h: number, s: number, v: number, a: number) {
    this.fromHSV(h, s, v);
    this.a = clamp01(a);

    return this;
  }

  fromHex(hex: string) {
    const rgba = hexToRGBA(hex);
    if (rgba) this.fromRGBA(rgba.r, rgba.g, rgba.b, rgba.a);

    return this;
  }

  parse(color: string) {
    const rgba = parseColor(color);

    if (!rgba) {
      console.error('Unknown color format', color);
      return this;
    }

    return this.fromRGBA(rgba.r, rgba.g, rgba.b, rgba.a);
  }

  clone() {
    return new Color().fromRGBA(this.r, this.g, this.b, this.a);
  }

  equals(color: Color) {
    return this.r === color.r && this.g === color.g && this.b === color.b && this.a === color.a;
  }

  toRGB() {
    return { r: this.r, g: this.g, b: this.b };
  }

  toRGBA() {
    return { ...this.toRGB(), a: this.a };
  }

  toHSL() {
    return RGBToHSL(this.r, this.g, this.b);
  }

  toHSLA() {
    return { ...this.toHSL(), a: this.a };
  }

  toHSV() {
    return RGBToHSV(this.r, this.g, this.b);
  }

  toHSVA() {
    return { ...this.toHSV(), a: this.a };
  }

  toRGBString() {
    return `rgb(${this.r}, ${this.g}, ${this.b})`;
  }

  toRGBAString() {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${round(this.a, 3)})`;
  }

  toHSLString() {
    const { h, s, l } = this.toHSL();
    return `hsl(${round(h)}, ${round(s * 100)}%, ${round(l * 100)}%)`;
  }

  toHSLAString() {
    const { h, s, l, a } = this.toHSLA();
    return `hsla(${round(h)}, ${round(s * 100)}%, ${round(l * 100)}%, ${round(a, 3)})`;
  }

  toHSVString() {
    const { h, s, v } = this.toHSV();
    return `hsv(${round(h)}, ${round(s * 100)}%, ${round(v * 100)}%)`;
  }

  toHSVAString() {
    const { h, s, v, a } = this.toHSVA();
    return `hsva(${round(h)}, ${round(s * 100)}%, ${round(v * 100)}%, ${round(a, 3)})`;
  }

  toHexString() {
    return RGBAToHex(this.toRGBA(), false);
  }

  toHexaString() {
    return RGBAToHex(this.toRGBA(), true);
  }
}
