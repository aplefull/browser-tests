import React, { useRef, useState } from 'react';
import styles from './styles.module.scss';
import { clamp, nextElement } from '@/utils/utils';
import classNames from 'classnames';
import { Popover } from '@/app/components/Popover/Popover';
import { DraggableTrack } from '@/app/components/ColorPicker/DraggableTrack';
import { Color } from '@/app/components/ColorPicker/Color';

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
  const VALUE_MODES = ['rgb', 'hsl', 'hsv', 'hex'] as const;
  type TValueMode = (typeof VALUE_MODES)[number];

  const [valueMode, setValueMode] = useState<TValueMode>(VALUE_MODES[0]);

  const changeValueMode = () => {
    setValueMode(nextElement(VALUE_MODES, valueMode));
  };

  const noop = () => {};

  const renderInputs = (mode: TValueMode) => {
    switch (mode) {
      case 'rgb':
        const { r, g, b } = color.toRGB();
        return (
          <>
            <input type="number" value={r} onChange={noop} min={0} max={255} />
            <input type="number" value={g} onChange={noop} min={0} max={255} />
            <input type="number" value={b} onChange={noop} min={0} max={255} />
          </>
        );

      case 'hsl':
        const { h, s, l } = color.toHSL();
        return (
          <>
            <input type="number" value={h} onChange={noop} min={0} max={360} />
            <input type="number" value={s} onChange={noop} min={0} max={100} />
            <input type="number" value={l} onChange={noop} min={0} max={100} />
          </>
        );

      case 'hsv':
        const { h: h2, s: s2, v } = color.toHSV();
        return (
          <>
            <input type="number" value={h2} onChange={noop} min={0} max={360} />
            <input type="number" value={s2} onChange={noop} min={0} max={100} />
            <input type="number" value={v} onChange={noop} min={0} max={100} />
          </>
        );

      case 'hex':
        const hex = color.toHexaString();
        return <input type="text" value={hex} onChange={noop} />;
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
};

type TPickerProps = {
  onChange: (color: Color) => void;
};

type TPaletteProps = {
  setSaturation: (value: number) => void;
  setValue: (value: number) => void;
  hue: number;
};

const Palette = ({ setSaturation, setValue, hue }: TPaletteProps) => {
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

      setSaturation(saturation);
      setValue(value);

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

const Picker = ({ onChange }: TPickerProps) => {
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [value, setValue] = useState(0);
  const [alpha, setAlpha] = useState(1);

  const currentColor = new Color().fromHSVA(hue, saturation, value, alpha);

  const handleHueChange = (value: number) => {
    setHue(value * 360);

    const color = new Color().fromHSVA(value * 360, saturation, value, alpha);
    onChange(color);
  };

  const handleSaturationChange = (value: number) => {
    setSaturation(value);

    const color = new Color().fromHSVA(hue, value, value, alpha);
    onChange(color);
  };

  const handleValueChange = (value: number) => {
    setValue(value);

    const color = new Color().fromHSVA(hue, saturation, value, alpha);
    onChange(color);
  };

  const handleAlphaChange = (value: number) => {
    setAlpha(1 - value);

    const color = new Color().fromHSVA(hue, saturation, value, alpha);
    onChange(color);
  };

  const alphaBGStyle = {
    background: `linear-gradient(to top, rgba(0, 0, 0, 0), ${currentColor.toRGBString()})`,
  };

  return (
    <div className={styles.picker}>
      <div className={styles.inputs}>
        <Palette setSaturation={handleSaturationChange} setValue={handleValueChange} hue={hue} />
        <div className={styles.tracks}>
          <DraggableTrack className={styles.gradient} onChange={handleHueChange} />
          <DraggableTrack onChange={handleAlphaChange}>
            <div className={classNames(styles.bg, styles.checkered)} />
            <div className={styles.bg} style={alphaBGStyle} />
          </DraggableTrack>
        </div>
      </div>
      <ColorPreview color={currentColor} />
      <ColorInput color={currentColor} />
    </div>
  );
};

export const ColorPicker = ({ onChange }: TColorPickerProps) => {
  const [color, setColor] = useState(new Color());
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const togglePopover = () => setIsPopoverOpen((isOpen) => !isOpen);

  const handleChange = (color: Color) => {
    setColor(color);
    onChange?.(color.toHexaString());
  };

  const inputStyle = {
    backgroundColor: color.toRGBAString(),
  };

  return (
    <Popover isOpen={isPopoverOpen} content={<Picker onChange={handleChange} />}>
      <div onClick={togglePopover} className={styles.colorPickerInput} style={inputStyle} />
    </Popover>
  );
};
