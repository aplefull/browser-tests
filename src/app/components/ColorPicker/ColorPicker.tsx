import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './styles.module.scss';
import { clamp, nextElement } from '@/utils/utils';
import classNames from 'classnames';
import { Popover } from '@/app/components/Popover/Popover';
import { DraggableTrack } from '@/app/components/ColorPicker/DraggableTrack';
import { Color } from '@/app/components/ColorPicker/Color';
import { Input } from '@/app/components/Input/Input';
import { NumberInput } from '@/app/components/NumberInput/NumberInput';

const ColorPreview = ({ color }: { color: Color }) => {
  return (
    <div className={styles.colorPreview}>
      <div style={{ backgroundColor: color.toRGBAString() }} />
    </div>
  );
};

type TColorInputProps = {
  color: Color;
};

const ColorInput = ({ color }: TColorInputProps) => {
  const VALUE_MODES = ['rgba', 'hsla', 'hsva', 'hex'] as const;
  type TValueMode = (typeof VALUE_MODES)[number];

  const [valueMode, setValueMode] = useState<TValueMode>(VALUE_MODES[0]);

  const changeValueMode = () => {
    setValueMode(nextElement(VALUE_MODES, valueMode));
  };

  const noop = () => {};

  const renderInputs = (mode: TValueMode) => {
    switch (mode) {
      case 'rgba':
        const { r, g, b, a: a1 } = color.toRGBA();
        return (
          <>
            <NumberInput value={r} onChange={noop} min={0} max={255} />
            <NumberInput value={g} onChange={noop} min={0} max={255} />
            <NumberInput value={b} onChange={noop} min={0} max={255} />
            <NumberInput value={a1} onChange={noop} min={0} max={1} />
          </>
        );

      case 'hsla':
        const { h, s, l, a: a2 } = color.toHSLA();
        return (
          <>
            <NumberInput value={h} onChange={noop} min={0} max={360} />
            <NumberInput value={s} onChange={noop} min={0} max={100} />
            <NumberInput value={l} onChange={noop} min={0} max={100} />
            <NumberInput value={a2} onChange={noop} min={0} max={1} />
          </>
        );

      case 'hsva':
        const { h: h2, s: s2, v, a: a3 } = color.toHSVA();
        return (
          <>
            <NumberInput value={h2} onChange={noop} min={0} max={360} />
            <NumberInput value={s2} onChange={noop} min={0} max={100} />
            <NumberInput value={v} onChange={noop} min={0} max={100} />
            <NumberInput value={a3} onChange={noop} min={0} max={1} />
          </>
        );

      case 'hex':
        const hex = color.toHexaString();
        return <Input value={hex} onChange={noop} />;
    }
  };

  return (
    <div className={styles.value}>
      {/*TODO replace render function with component*/}
      <div className={styles.valueInputs}>{renderInputs(valueMode)}</div>
      <button className={styles.modeButton} onClick={changeValueMode}>
        {valueMode}
      </button>
    </div>
  );
};

type TColorPickerProps = {
  onChange?: (color: string) => void;
  value: string;
  type?: 'HSV' | 'HSL';
};

type TCommonPickerProps = {
  onChange: (color: Color) => void;
  value: Color;
  type?: 'HSV' | 'HSL';
};

type TPickerProps = {
  onChange: (color: Color) => void;
  type?: 'HSV' | 'HSL';
};

type THSVPaletteProps = {
  setSaturationAndValue: ({ saturation, value }: { saturation: number; value: number }) => void;
  hue: number;
};

type THSLPaletteProps = {
  setHue: (value: number) => void;
  setLightness: (value: number) => void;
};

const HSLPalette = ({ setHue, setLightness }: THSLPaletteProps) => {
  const [draggablePos, setDraggablePos] = useState({
    x: 0,
    y: 0,
  });

  const paletteRef = useRef<HTMLDivElement>(null);

  const cartesianToPolar = (x: number, y: number) => {
    const angle = (Math.atan2(y, x) * 180) / Math.PI;
    return angle < 0 ? angle + 360 : angle;
  };

  function limitPointToCircle(x, y, cx, cy, r) {
    // Calculate the distance between (x, y) and the center of the circle
    const distance = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));

    // If the distance is greater than the radius, limit (x, y) to the circle boundary
    if (distance > r) {
      const angle = Math.atan2(y - cy, x - cx);
      x = cx + r * Math.cos(angle);
      y = cy + r * Math.sin(angle);
    }

    return { x, y };
  }

  const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const { current } = paletteRef;

    if (!current) return;

    event.preventDefault();

    const onMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const { width, height, left, top } = current.getBoundingClientRect();

      const x = clientX - left;
      const y = clientY - top;

      const xPercent = clamp(x / width, 0, 1);
      const yPercent = clamp(y / height, 0, 1);

      const distanceToCenter = Math.sqrt((xPercent - 0.5) ** 2 + (yPercent - 0.5) ** 2);
      const lightness = clamp(1 - distanceToCenter * 2, 0, 1);
      const hue = cartesianToPolar(xPercent - 0.5, yPercent - 0.5);

      const xLimited = limitPointToCircle(x, y, width / 2, height / 2, width / 2).x;
      const yLimited = limitPointToCircle(x, y, width / 2, height / 2, height / 2).y;

      setHue(hue);
      setLightness(lightness);

      setDraggablePos({
        x: xLimited,
        y: yLimited,
      });
    };

    onMouseMove(event.nativeEvent);

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div ref={paletteRef} className={styles.paletteHsl} onMouseDown={onMouseDown}>
      <div className={classNames(styles.paletteBg, styles.hueBg)} />
      <div className={classNames(styles.paletteBg, styles.lightnessBg)} />
      <div className={styles.draggable} style={{ left: draggablePos.x, top: draggablePos.y }} />
    </div>
  );
};

const HSVPalette = ({ setSaturationAndValue, hue }: THSVPaletteProps) => {
  const [draggablePos, setDraggablePos] = useState({
    x: 0,
    y: 0,
  });

  const paletteRef = useRef<HTMLDivElement>(null);

  const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const { current } = paletteRef;

    if (!current) return;

    event.preventDefault();

    const onMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const { width, height, left, top } = current.getBoundingClientRect();

      const x = clientX - left;
      const y = clientY - top;

      const xPercent = clamp(x / width, 0, 1);
      const yPercent = clamp(y / height, 0, 1);

      const saturation = xPercent;
      const value = 1 - yPercent;

      setSaturationAndValue({ saturation, value });

      setDraggablePos({
        x: clamp(x, 0, width),
        y: clamp(y, 0, height),
      });
    };

    onMouseMove(event.nativeEvent);

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const paletteStyle = {
    backgroundColor: new Color().fromHSL(hue, 100, 50).toRGBString(),
  };

  return (
    <div ref={paletteRef} className={styles.palette} onMouseDown={onMouseDown} style={paletteStyle}>
      <div className={classNames(styles.paletteBg, styles.whiteBg)} />
      <div className={classNames(styles.paletteBg, styles.blackBg)} />
      <div className={styles.draggable} style={{ left: draggablePos.x, top: draggablePos.y }} />
    </div>
  );
};

// TODO finish HSLPicker
const HSLPicker = ({ onChange }: TPickerProps) => {
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [lightness, setLightness] = useState(0);
  const [alpha, setAlpha] = useState(1);

  const currentColor = new Color().fromHSLA(hue, saturation, lightness, alpha);

  const handleHueChange = (hue: number) => {
    setHue(hue);

    const color = new Color().fromHSLA(hue, saturation, lightness, alpha);
    onChange(currentColor);
  };

  const handleSaturationChange = (saturation: number) => {
    setSaturation(saturation);

    const color = new Color().fromHSLA(hue, saturation, lightness, alpha);
    onChange(currentColor);
  };

  const handleLightnessChange = (lightness: number) => {
    setLightness(lightness);

    const color = new Color().fromHSLA(hue, saturation, lightness, alpha);
    onChange(currentColor);
  };

  const handleAlphaChange = (alpha: number) => {
    setAlpha(alpha);

    const color = new Color().fromHSLA(hue, saturation, lightness, alpha);
    onChange(color);
  };

  const alphaBGStyle = {
    background: `linear-gradient(to top, rgba(0, 0, 0, 0), ${currentColor.toRGBString()})`,
  };

  return (
    <>
      <HSLPalette setHue={handleHueChange} setLightness={handleLightnessChange} />
      <div className={styles.tracks}>
        <DraggableTrack className={styles.saturation} onChange={handleSaturationChange} />
        <DraggableTrack onChange={handleAlphaChange}>
          <div className={classNames(styles.bg, styles.checkered)} />
          <div className={styles.bg} style={alphaBGStyle} />
        </DraggableTrack>
      </div>
    </>
  );
};

const HSVPicker = ({ onChange }: TPickerProps) => {
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [value, setValue] = useState(0);
  const [alpha, setAlpha] = useState(1);

  const currentColor = new Color().fromHSVA(hue, saturation, value, alpha);

  const handleHueChange = (newHue: number) => {
    setHue(newHue * 360);

    const color = new Color().fromHSVA(newHue * 360, saturation, value, alpha);
    onChange(color);
  };

  const updateSaturationAndValue = ({ saturation, value: newValue }: { saturation: number; value: number }) => {
    setSaturation(saturation);
    setValue(newValue);

    const color = new Color().fromHSVA(hue, saturation, newValue, alpha);
    onChange(color);
  };

  const handleAlphaChange = (newAlpha: number) => {
    setAlpha(1 - newAlpha);

    const color = new Color().fromHSVA(hue, saturation, value, 1 - newAlpha);
    onChange(color);
  };

  const alphaBGStyle = {
    background: `linear-gradient(to top, rgba(0, 0, 0, 0), ${currentColor.toRGBString()})`,
  };

  return (
    <>
      <HSVPalette setSaturationAndValue={updateSaturationAndValue} hue={hue} />
      <div className={styles.tracks}>
        <DraggableTrack className={styles.gradient} onChange={handleHueChange} />
        <DraggableTrack onChange={handleAlphaChange}>
          <div className={classNames(styles.bg, styles.checkered)} />
          <div className={styles.bg} style={alphaBGStyle} />
        </DraggableTrack>
      </div>
    </>
  );
};

const Picker = memo(({ onChange, value, type }: TCommonPickerProps) => {
  const CurrentPicker = useMemo(() => {
    switch (type) {
      case 'HSL':
        return HSLPicker;

      case 'HSV':
        return HSVPicker;

      default:
        return HSVPicker;
    }
  }, [type]);

  const handleChange = (color: Color) => {
    onChange(color);
  };

  return (
    <div className={styles.picker}>
      <div className={styles.inputs}>
        <CurrentPicker onChange={handleChange} />
      </div>
      <ColorPreview color={value} />
      <ColorInput color={value} />
    </div>
  );
});

export const ColorPicker = ({ onChange, value, type = 'HSV' }: TColorPickerProps) => {
  const [color, setColor] = useState(new Color().parse(value));
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const togglePopover = () => setIsPopoverOpen((isOpen) => !isOpen);

  const handleChange = useCallback(
    (color: Color) => {
      setColor(color);
      onChange?.(color.toHexaString());
    },
    [color],
  );

  const inputStyle = {
    backgroundColor: color.toRGBAString(),
  };

  return (
    <Popover isOpen={isPopoverOpen} content={<Picker type={type} onChange={handleChange} value={color} />}>
      <div onClick={togglePopover} className={styles.colorPickerInput} style={inputStyle} />
    </Popover>
  );
};
