import React, { useRef, useState } from 'react';
import { clamp } from '@/utils/utils';
import { Color } from '@/app/components/ColorPicker/Color';
import styles from '@/app/components/ColorPicker/styles.module.scss';
import classNames from 'classnames';

type THSVPaletteProps = {
  setSaturationAndValue: ({ saturation, value }: { saturation: number; value: number }) => void;
  hue: number;
};

export const HSVPalette = ({ setSaturationAndValue, hue }: THSVPaletteProps) => {
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
