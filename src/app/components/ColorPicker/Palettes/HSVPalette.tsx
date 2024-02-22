import React, { useEffect, useRef, useState } from 'react';
import { clamp } from '@/utils/utils';
import { Color } from '@/app/components/ColorPicker/Color';
import styles from '@/app/components/ColorPicker/styles.module.scss';
import classNames from 'classnames';

type THSVPaletteProps = {
  setSaturationAndValue: ({ saturation, value }: { saturation: number; value: number }) => void;
  hue: number;
  xPercent: number;
  yPercent: number;
};

export const HSVPalette = ({ setSaturationAndValue, hue, xPercent, yPercent }: THSVPaletteProps) => {
  const [draggablePos, setDraggablePos] = useState({
    x: 0,
    y: 0,
  });

  const currentLocalColorRef = useRef<Color>(new Color().fromHSV(hue, xPercent / 100, 1 - yPercent / 100));
  const paletteRef = useRef<HTMLDivElement>(null);

  const percentageToPos = (percentage: { x: number; y: number }) => {
    const { current } = paletteRef;

    if (!current)
      return {
        x: 0,
        y: 0,
      };

    const { width, height } = current.getBoundingClientRect();

    const x = percentage.x * width;
    const y = percentage.y * height;

    return { x, y };
  };

  useEffect(() => {
    const { current } = paletteRef;
    if (!current) return;

    const { x, y } = percentageToPos({
      x: xPercent / 100,
      y: yPercent / 100,
    });

    const color = new Color().fromHSV(
      hue,
      x / current.getBoundingClientRect().width,
      1 - y / current.getBoundingClientRect().height,
    );

    if (currentLocalColorRef.current.toRGBString() !== color.toRGBString()) {
      setDraggablePos({
        x: clamp(x, 0, current.getBoundingClientRect().width),
        y: clamp(y, 0, current.getBoundingClientRect().height),
      });
    }
  }, [xPercent, yPercent]);

  const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const { current } = paletteRef;

    if (!current) return;

    event.preventDefault();

    const onMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const { width, height, left, top } = current.getBoundingClientRect();

      const x = clientX - left;
      const y = clientY - top;

      const xPercentLocal = clamp(x / width, 0, 1);
      const yPercentLocal = clamp(y / height, 0, 1);

      const saturation = xPercentLocal;
      const value = 1 - yPercentLocal;

      setSaturationAndValue({ saturation, value });

      currentLocalColorRef.current = new Color().fromHSV(hue, xPercentLocal, 1 - yPercentLocal);

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
    backgroundColor: new Color().fromHSL(hue, 1, 0.5).toRGBString(),
  };

  return (
    <div ref={paletteRef} className={styles.palette} onMouseDown={onMouseDown} style={paletteStyle}>
      <div className={classNames(styles.paletteBg, styles.whiteBg)} />
      <div className={classNames(styles.paletteBg, styles.blackBg)} />
      <div className={styles.draggable} style={{ left: draggablePos.x, top: draggablePos.y }} />
    </div>
  );
};
