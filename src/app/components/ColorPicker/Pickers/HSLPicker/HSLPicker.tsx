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

  useEffect(() => {
    const { h, s, l, a } = value.toHSLA();

    setHue(h);
    setSaturation(s);
    setLightness(l);
    setAlpha(a);
  }, [value]);

  console.log(value.toHSLString());

  const alphaBGStyle = {
    background: `linear-gradient(to top, rgba(0, 0, 0, 0), ${currentColor.toRGBString()})`,
  };

  const alphaValuePercent = (1 - alpha) * 100;
  const saturationValuePercent = saturation * 100;

  return (
    <>
      <HSLPalette
        setHueAndLightness={handleHueAndLightnessChange}
        hue={hue}
        saturation={saturation}
        lightness={lightness}
      />
      <div className={styles.tracks}>
        <DraggableTrack
          className={styles.saturation}
          value={saturationValuePercent}
          onChange={handleSaturationChange}
        />
        <DraggableTrack onChange={handleAlphaChange} value={alphaValuePercent}>
          <div className={classNames(styles.bg, styles.checkered)} />
          <div className={styles.bg} style={alphaBGStyle} />
        </DraggableTrack>
      </div>
    </>
  );
};
