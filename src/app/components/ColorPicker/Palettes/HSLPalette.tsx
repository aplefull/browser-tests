import React, { useRef, useState } from 'react';
import { clamp } from '@/utils/utils';
import styles from '@/app/components/ColorPicker/styles.module.scss';
import classNames from 'classnames';

type THSLPaletteProps = {
  setHueAndSaturation: ({ hue, saturation }: { hue: number; saturation: number }) => void;
};

const cartesianToPolar = (x: number, y: number) => {
  const angle = (-Math.atan2(y, x) * 180) / Math.PI;
  return angle < 0 ? angle + 360 : angle;
};

const limitPointToCircle = (x: number, y: number, cx: number, cy: number, r: number) => {
  const distance = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));

  if (distance > r) {
    const angle = Math.atan2(y - cy, x - cx);
    x = cx + r * Math.cos(angle);
    y = cy + r * Math.sin(angle);
  }

  return { x, y };
};

export const HSLPalette = ({ setHueAndSaturation }: THSLPaletteProps) => {
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

      const distanceToCenter = Math.sqrt((xPercent - 0.5) ** 2 + (yPercent - 0.5) ** 2);

      const saturation = 1 - clamp(1 - distanceToCenter * 2, 0, 1);
      const hue = cartesianToPolar(xPercent - 0.5, yPercent - 0.5);

      const xLimited = limitPointToCircle(x, y, width / 2, height / 2, width / 2).x;
      const yLimited = limitPointToCircle(x, y, width / 2, height / 2, height / 2).y;

      setHueAndSaturation({ hue, saturation });

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
