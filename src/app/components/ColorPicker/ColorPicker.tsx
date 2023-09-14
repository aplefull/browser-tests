import React, { useMemo, useRef, useState } from 'react';
import styles from './styles.module.scss';
import { clamp, map, nextElement } from '@/utils/utils';
import classNames from 'classnames';

class Color {
  r: number;
  g: number;
  b: number;

  constructor() {
    this.r = 0;
    this.g = 0;
    this.b = 0;
  }

  fromRGB(r: number, g: number, b: number) {
    this.r = r;
    this.g = g;
    this.b = b;

    return this;
  }

  fromHSL(h: number, s: number, l: number) {
    const rgb = hslToRgb(h, s, l);

    this.r = rgb.r;
    this.g = rgb.g;
    this.b = rgb.b;

    return this;
  }

  fromHSV(h: number, s: number, v: number) {
    const rgb = hsvToRgb(h, s, v);

    this.r = rgb.r;
    this.g = rgb.g;
    this.b = rgb.b;

    return this;
  }

  fromHex(hex: string) {
    const rgb = hexToRgb(hex);

    if (rgb) {
      this.r = rgb.r;
      this.g = rgb.g;
      this.b = rgb.b;
    }

    return this;
  }

  toRGB() {
    return {
      r: this.r,
      g: this.g,
      b: this.b,
    };
  }

  toRGBString() {
    return `rgb(${this.r}, ${this.g}, ${this.b})`;
  }

  toHSL() {
    return rgbToHsl(this.r, this.g, this.b);
  }

  toHSLString() {
    const { h, s, l } = this.toHSL();

    return `hsl(${h}, ${s}%, ${l}%)`;
  }

  toHSV() {
    return rgbToHsv(this.r, this.g, this.b);
  }

  toHSVString() {
    const { h, s, v } = this.toHSV();

    return `hsv(${h}, ${s}%, ${v}%)`;
  }

  toHex() {
    return rgbToHex(this.r, this.g, this.b);
  }

  toHexString() {
    return `${this.toHex()}`;
  }
}

function componentToHex(c: number) {
  var hex = c.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
}

function rgbToHex(r: number, g: number, b: number) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

const hslToRgb = (h: number, s: number, l: number) => {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  return {
    r: Math.round(f(0) * 255),
    g: Math.round(f(8) * 255),
    b: Math.round(f(4) * 255),
  };
};

const hsvToRgb = (h: number, s: number, v: number) => {
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

const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const l = Math.max(r, g, b);
  const s = l - Math.min(r, g, b);
  const h = s ? (l === r ? (g - b) / s : l === g ? 2 + (b - r) / s : 4 + (r - g) / s) : 0;

  return {
    h: 60 * h < 0 ? 60 * h + 360 : 60 * h,
    s: 100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
    l: (100 * (2 * l - s)) / 2,
  };
};

const rgbToHsv = (r: number, g: number, b: number) => {
  let v = Math.max(r, g, b),
    c = v - Math.min(r, g, b);
  let h = c && (v == r ? (g - b) / c : v == g ? 2 + (b - r) / c : 4 + (r - g) / c);

  return {
    h: 60 * (h < 0 ? h + 6 : h),
    s: v && c / v,
    v: v,
  };
};

type TDraggableTrackProps = {
  onChange: (value: number) => void;
  className?: string;
};

const DraggableTrack = ({ onChange, className }: TDraggableTrackProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const draggableRef = useRef<HTMLDivElement>(null);

  const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();

    const rect = ref.current?.getBoundingClientRect();

    if (!rect) return;

    const onMouseMove = (event: MouseEvent) => {
      const { clientY } = event;

      const y = clientY - rect.top;
      const yPercent = clamp(y / rect.height, 0, 1);

      draggableRef.current?.style.setProperty('top', `${yPercent * 100}%`);
      onChange(yPercent);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div ref={ref} className={classNames(styles.dragTrack, className)} onMouseDown={onMouseDown}>
      <div ref={draggableRef} style={{ top: 0 }} />
    </div>
  );
};

type TColorPickerProps = {
  onChange?: (color: string) => void;
};

export const ColorPicker = ({ onChange }: TColorPickerProps) => {
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [value, setValue] = useState(0);
  const [alpha, setAlpha] = useState(1);
  const [valueMode, setValueMode] = useState('rgb');
  const [draggablePos, setDraggablePos] = useState({
    x: 0,
    y: 0,
  });

  const paletteRef = useRef<HTMLDivElement>(null);

  const currentColor = new Color().fromHSV(hue, saturation, value);

  const changeValueMode = () => {
    const modes = ['rgb', 'hsv', 'hsl', 'hex'];
    setValueMode(nextElement(modes, valueMode));
  };

  const getColorString = () => {
    switch (valueMode) {
      case 'rgb':
        return currentColor.toRGBString();
      case 'hsv':
        return currentColor.toHSVString();
      case 'hsl':
        return currentColor.toHSLString();
      case 'hex':
        return currentColor.toHexString();
    }
  };

  const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const { current } = paletteRef;

    if (!current) return;

    event.preventDefault();

    const rect = current.getBoundingClientRect();

    const onMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const xPercent = clamp(x / rect.width, 0, 1);
      const yPercent = clamp(y / rect.height, 0, 1);

      setSaturation(xPercent);
      setValue(1 - yPercent);

      onChange?.(new Color().fromHSV(hue, xPercent, 1 - yPercent).toHexString());

      setDraggablePos({
        x: clamp(x, 0, rect.width),
        y: clamp(y, 0, rect.height),
      });
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const handleHueChange = (value: number) => {
    setHue(value * 360);
    onChange?.(new Color().fromHSV(value * 360, saturation, value).toHexString());
  };

  const handleAlphaChange = (value: number) => {
    setAlpha(value);
  };

  const paletteStyle = {
    backgroundColor: new Color().fromHSL(hue, 100, 50).toRGBString(),
  };

  return (
    <div className={styles.picker}>
      <div className={styles.inputs}>
        <div ref={paletteRef} className={styles.palette} onMouseDown={onMouseDown} style={paletteStyle}>
          <div className={classNames(styles.paletteBg, styles.whiteBg)} />
          <div className={classNames(styles.paletteBg, styles.blackBg)} />
          <div className={styles.draggable} style={{ left: draggablePos.x, top: draggablePos.y }} />
        </div>
        <div className={styles.tracks}>
          <DraggableTrack className={styles.gradient} onChange={handleHueChange} />
          <DraggableTrack onChange={handleAlphaChange} />
        </div>
      </div>
      <div className={styles.colorPreview}>
        <div style={{ backgroundColor: currentColor.toRGBString() }} />
      </div>
      <div className={styles.value}>
        <div className={styles.valueInputs}>{getColorString()}</div>
        <button onClick={changeValueMode}>{valueMode}</button>
      </div>
    </div>
  );
};
