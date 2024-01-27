import React, { useEffect, useState } from 'react';
import { Color } from '@/app/components/ColorPicker/Color';
import { HSVPalette } from '@/app/components/ColorPicker/Palettes/HSVPalette';
import styles from '@/app/components/ColorPicker/styles.module.scss';
import { DraggableTrack } from '@/app/components/ColorPicker/DraggableTrack';
import classNames from 'classnames';
import { TPickerProps } from '@/app/components/ColorPicker/ColorPicker';

export const HSVPicker = ({ onChange, value: colorValue }: TPickerProps) => {
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

  const alphaValuePercent = (1 - alpha) * 100;
  const hueValuePercent = (hue / 360) * 100;
  const xPercent = saturation * 100;
  const yPercent = (1 - value) * 100;

  return (
    <>
      <HSVPalette setSaturationAndValue={updateSaturationAndValue} hue={hue} xPercent={xPercent} yPercent={yPercent} />
      <div className={styles.tracks}>
        <DraggableTrack className={styles.gradient} value={hueValuePercent} onChange={handleHueChange} />
        <DraggableTrack onChange={handleAlphaChange} value={alphaValuePercent}>
          <div className={classNames(styles.bg, styles.checkered)} />
          <div className={styles.bg} style={alphaBGStyle} />
        </DraggableTrack>
      </div>
    </>
  );
};
