import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import styles from './styles.module.scss';
import { nextElement } from '@/utils/utils';
import { Popover } from '@/app/components/Popover/Popover';
import { Color } from '@/app/components/ColorPicker/Color';
import { Input } from '@/app/components/Input/Input';
import { NumberInput } from '@/app/components/NumberInput/NumberInput';
import { HSLPicker } from '@/app/components/ColorPicker/Pickers/HSLPicker/HSLPicker';
import { HSVPicker } from '@/app/components/ColorPicker/Pickers/HSVPicker/HSVPicker';

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

const VALUE_MODES = ['rgba', 'hsla', 'hsva', 'hex'] as const;
type TValueMode = (typeof VALUE_MODES)[number];
type TColorInputsProps = {
  mode: TValueMode;
  color: Color;
};

const ColorInputs = ({ mode, color }: TColorInputsProps) => {
  const noop = () => {};

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

const ColorInput = ({ color }: TColorInputProps) => {
  const [valueMode, setValueMode] = useState<TValueMode>(VALUE_MODES[0]);

  const changeValueMode = () => {
    setValueMode(nextElement(VALUE_MODES, valueMode));
  };

  return (
    <div className={styles.value}>
      <div className={styles.valueInputs}>
        <ColorInputs mode={valueMode} color={color} />
      </div>
      <button className={styles.modeButton} onClick={changeValueMode}>
        {valueMode}
      </button>
    </div>
  );
};

export type TPickerProps = {
  onChange: (color: Color) => void;
  value: Color;
  type?: 'HSV' | 'HSL';
};

const Picker = memo(({ onChange, value, type }: TPickerProps) => {
  const CurrentPicker = useMemo(() => {
    switch (type) {
      case 'HSV':
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

export const ColorPicker = ({ onChange, value, type = 'HSV' }: TPickerProps) => {
  const [color, setColor] = useState(value);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const togglePopover = () => setIsPopoverOpen((isOpen) => !isOpen);

  const handleChange = useCallback(
    (color: Color) => {
      onChange(color);
    },
    [color],
  );

  const handleClickOutside = useCallback(() => {
    setIsPopoverOpen(false);
  }, []);

  useEffect(() => {
    setColor(value);
  }, [value]);

  const inputStyle = {
    backgroundColor: color.toRGBAString(),
  };

  return (
    <Popover
      isOpen={isPopoverOpen}
      onClickOutside={handleClickOutside}
      content={<Picker type={type} onChange={handleChange} value={color} />}
    >
      <div onClick={togglePopover} className={styles.colorPickerInput} style={inputStyle} />
    </Popover>
  );
};
