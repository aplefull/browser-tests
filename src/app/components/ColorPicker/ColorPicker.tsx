import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styles from './styles.module.scss';
import { nextElement } from '@/utils/utils';
import classNames from 'classnames';
import { Popover } from '@/app/components/Popover/Popover';
import { DraggableTrack } from '@/app/components/ColorPicker/DraggableTrack';
import { Color } from '@/app/components/ColorPicker/Color';
import { Input } from '@/app/components/Input/Input';
import { NumberInput } from '@/app/components/NumberInput/NumberInput';
import { HSLPalette } from '@/app/components/ColorPicker/Palettes/HSLPalette';
import { HSVPalette } from '@/app/components/ColorPicker/Palettes/HSVPalette';

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
  value: Color;
  type?: 'HSV' | 'HSL';
};

const HSLPicker = ({ onChange, value }: TPickerProps) => {
  const [hue, setHue] = useState(value.toHSLA().h);
  const [saturation, setSaturation] = useState(value.toHSLA().s);
  const [lightness, setLightness] = useState(value.toHSLA().l);
  const [alpha, setAlpha] = useState(value.toHSLA().a);
  useEffect(() => {
    const { h, s, l, a } = value.toHSLA();

    setHue(h);
    setSaturation(s);
    setLightness(l);
    setAlpha(a);
  }, [value]);

  const currentColor = new Color().fromHSLA(hue, saturation, lightness, alpha);

  const handleSaturationChange = (newSaturation: number) => {
    const color = new Color().fromHSLA(hue, newSaturation, lightness, alpha);
    onChange(color);
  };

  const handleHueAndLightnessChange = ({
    hue: newHue,
    lightness: newLightness,
  }: {
    hue: number;
    lightness: number;
  }) => {
    const color = new Color().fromHSLA(newHue, saturation, newLightness, alpha);
    onChange(color);
  };

  const handleAlphaChange = (newAlpha: number) => {
    const color = new Color().fromHSLA(hue, saturation, lightness, 1 - newAlpha);
    onChange(color);
  };

  const alphaBGStyle = {
    background: `linear-gradient(to top, rgba(0, 0, 0, 0), ${currentColor.toRGBString()})`,
  };

  return (
    <>
      <HSLPalette setHueAndLightness={handleHueAndLightnessChange} />
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

const HSVPicker = ({ onChange, value: colorValue }: TPickerProps) => {
  const [hue, setHue] = useState(colorValue.toHSVA().h);
  const [saturation, setSaturation] = useState(colorValue.toHSVA().s);
  const [value, setValue] = useState(colorValue.toHSVA().v);
  const [alpha, setAlpha] = useState(colorValue.toHSVA().a);

  const currentColor = new Color().fromHSVA(hue, saturation, value, alpha);

  const handleHueChange = (newHue: number) => {
     const color = new Color().fromHSVA(newHue * 360, saturation, value, alpha);
    onChange(color);
  };

  const updateSaturationAndValue = ({ saturation, value: newValue }: { saturation: number; value: number }) => {
    const color = new Color().fromHSVA(hue, saturation, newValue, alpha);
    onChange(color);
  };

  const handleAlphaChange = (newAlpha: number) => {
    const color = new Color().fromHSVA(hue, saturation, value, 1 - newAlpha);
    onChange(color);
  };

  useEffect(() => {
    const { h, s, v, a } = colorValue.toHSVA();

    setHue(h);
    setSaturation(s);
    setValue(v);
    setAlpha(a);
  }, [colorValue]);

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
        <CurrentPicker onChange={handleChange} value={value} />
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
      onChange?.(color.toHexaString());
    },
    [color],
  );

  useEffect(() => {
    const newColor = new Color().parse(value);
    setColor(newColor);
  }, [value]);

  const inputStyle = {
    backgroundColor: color.toRGBAString(),
  };

  return (
    <Popover isOpen={isPopoverOpen} content={<Picker type={type} onChange={handleChange} value={color} />}>
      <div onClick={togglePopover} className={styles.colorPickerInput} style={inputStyle} />
    </Popover>
  );
};
