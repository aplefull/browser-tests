import {
  hexToRGBA,
  HSLToRGB,
  HSVToRGB,
  parseColor,
  RGBAToHex,
  RGBToHSL,
  RGBToHSV,
} from '@/app/components/ColorPicker/utils.color';

export class Color {
  r: number;
  g: number;
  b: number;
  a: number;

  h: number;
  s: number;
  v: number;

  hsv: {
    h: number;
    s: number;
    v: number;
  };

  hsl: {
    h: number;
    s: number;
    l: number;
  };

  constructor() {
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 1;

    this.h = 0;
    this.s = 0;
    this.v = 0;

    this.hsv = {
      h: 0,
      s: 0,
      v: 0,
    };

    this.hsl = {
      h: 0,
      s: 0,
      l: 0,
    };
  }

  fromRGB(r: number, g: number, b: number) {
    this.r = r;
    this.g = g;
    this.b = b;

    this.hsv = RGBToHSV(r, g, b);
    this.hsl = RGBToHSL(r, g, b);

    return this;
  }

  fromRGBA(r: number, g: number, b: number, a: number) {
    this.fromRGB(r, g, b);
    this.a = a;

    return this;
  }

  fromHSL(h: number, s: number, l: number) {
    const rgb = HSLToRGB(h, s, l);
    const hsv = RGBToHSV(rgb.r, rgb.g, rgb.b);

    this.r = rgb.r;
    this.g = rgb.g;
    this.b = rgb.b;

    this.h = h;
    this.s = s;
    this.v = hsv.v;

    this.hsv = hsv;
    this.hsl = {
      h,
      s,
      l,
    };

    return this;
  }

  fromHSLA(h: number, s: number, l: number, a: number) {
    this.fromHSL(h, s, l);
    this.a = a;

    return this;
  }

  fromHSV(h: number, s: number, v: number) {
    const rgb = HSVToRGB(h, s, v);

    this.r = rgb.r;
    this.g = rgb.g;
    this.b = rgb.b;

    this.h = h;
    this.s = s;
    this.v = v;

    this.hsv = {
      h,
      s,
      v,
    };
    this.hsl = RGBToHSL(rgb.r, rgb.g, rgb.b);

    return this;
  }

  fromHSVA(h: number, s: number, v: number, a: number) {
    this.fromHSV(h, s, v);
    this.a = a;

    return this;
  }

  fromHex(hex: string) {
    const rgba = hexToRGBA(hex);

    this.r = rgba.r;
    this.g = rgba.g;
    this.b = rgba.b;
    this.a = rgba.a;

    return this;
  }

  toRGB() {
    return {
      r: this.r,
      g: this.g,
      b: this.b,
    };
  }

  toRGBA() {
    return {
      ...this.toRGB(),
      a: this.a,
    };
  }

  toRGBString() {
    return `rgb(${this.r}, ${this.g}, ${this.b})`;
  }

  toRGBAString() {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }

  toHSL() {
    return this.hsl;
  }

  toHSLA() {
    return {
      ...this.toHSL(),
      a: this.a,
    };
  }

  toHSLString() {
    const { h, s, l } = this.toHSL();

    return `hsl(${h}, ${s}%, ${l}%)`;
  }

  toHSLAString() {
    const { h, s, l, a } = this.toHSLA();

    return `hsla(${h}, ${s}%, ${l}%, ${a})`;
  }

  toHSV() {
    return {
      h: this.h,
      s: this.s,
      v: this.v,
    };
  }

  toHSVA() {
    return {
      ...this.toHSV(),
      a: this.a,
    };
  }

  toHSVString() {
    const { h, s, v } = this.toHSV();

    return `hsv(${h}, ${s}%, ${v}%)`;
  }

  toHSVAString() {
    const { h, s, v, a } = this.toHSVA();

    return `hsva(${h}, ${s}%, ${v}%, ${a})`;
  }

  toHex() {
    return RGBAToHex(this.r, this.g, this.b, this.a);
  }

  toHexString() {
    const components = this.toHex();

    return `#${components.r}${components.g}${components.b}`;
  }

  toHexaString() {
    const components = this.toHex();

    return `${this.toHexString()}${components.a}`;
  }

  parse(color: string) {
    return parseColor(color);
  }
}
