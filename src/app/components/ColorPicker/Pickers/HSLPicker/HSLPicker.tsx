import React, { useEffect, useState } from 'react';
import { Color } from '@/app/components/ColorPicker/Color';
import { HSLPalette } from '@/app/components/ColorPicker/Palettes/HSLPalette';
import styles from '@/app/components/ColorPicker/styles.module.scss';
import { DraggableTrack } from '@/app/components/ColorPicker/DraggableTrack';
import classNames from 'classnames';
import { TPickerProps } from '@/app/components/ColorPicker/ColorPicker';

export const HSLPicker = ({ onChange, value }: TPickerProps) => {
  const [hue, setHue] = useState(value.toHSLA().h);
  const [saturation, setSaturation] = useState(value.toHSLA().s);
  const [lightness, setLightness] = useState(value.toHSLA().l);
  const [alpha, setAlpha] = useState(value.toHSLA().a);

  const currentColor = new Color().fromHSLA(hue, saturation, lightness, alpha);

  const handleLightnessChange = (newLightness: number) => {
    const color = new Color().fromHSLA(hue, saturation, 1 - newLightness, alpha);
    onChange(color);
  };

  const handleHueAndSaturationChange = ({
    hue: newHue,
    saturation: newSaturation,
  }: {
    hue: number;
    saturation: number;
  }) => {
    const color = new Color().fromHSLA(newHue, newSaturation, lightness, alpha);
    onChange(color);
  };

  const handleAlphaChange = (newAlpha: number) => {
    const color = new Color().fromHSLA(hue, saturation, lightness, 1 - newAlpha);
    onChange(color);
  };

  useEffect(() => {
    const { h, s, l, a } = value.toHSLA();

    setHue(h);
    setSaturation(s);
    setLightness(l);
    setAlpha(a);
  }, [value]);

  const alphaBGStyle = {
    background: `linear-gradient(to top, rgba(0, 0, 0, 0), ${currentColor.toRGBString()})`,
  };

  const lightnessBGStyle = {
    background: `linear-gradient(to top, ${[0, 20, 40, 60, 80, 100].map((el) => `hsl(${hue}, ${saturation * 100}%, ${el}%)`).join(', ')})`,
  };

  const alphaValuePercent = (1 - alpha) * 100;
  const lightnessValuePercent = (1 - lightness) * 100;

  return (
    <>
      <HSLPalette setHueAndSaturation={handleHueAndSaturationChange} />
      <div className={styles.tracks}>
        <DraggableTrack value={lightnessValuePercent} onChange={handleLightnessChange}>
          <div className={styles.bg} style={lightnessBGStyle} />
        </DraggableTrack>
        <DraggableTrack onChange={handleAlphaChange} value={alphaValuePercent}>
          <div className={classNames(styles.bg, styles.checkered)} />
          <div className={styles.bg} style={alphaBGStyle} />
        </DraggableTrack>
      </div>
    </>
  );
};
