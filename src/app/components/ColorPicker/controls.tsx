import React, { CSSProperties, KeyboardEvent, ReactNode, useRef, useState } from 'react';
import classNames from 'classnames';
import styles from './styles.module.scss';
import { clamp } from '@/utils/utils';

type TPoint = { x: number; y: number };

const usePointerDrag = (onMove: (point: TPoint) => void) => {
  const draggingRef = useRef(false);

  const toPoint = (event: React.PointerEvent<HTMLElement>) => {
    const { left, top, width, height } = event.currentTarget.getBoundingClientRect();

    return {
      x: clamp((event.clientX - left) / width, 0, 1),
      y: clamp((event.clientY - top) / height, 0, 1),
    };
  };

  return {
    onPointerDown: (event: React.PointerEvent<HTMLElement>) => {
      if (event.button !== 0) return;

      event.preventDefault();
      event.currentTarget.focus({ preventScroll: true });
      event.currentTarget.setPointerCapture(event.pointerId);
      draggingRef.current = true;
      onMove(toPoint(event));
    },
    onPointerMove: (event: React.PointerEvent<HTMLElement>) => {
      if (draggingRef.current) onMove(toPoint(event));
    },
    onPointerUp: () => {
      draggingRef.current = false;
    },
    onPointerCancel: () => {
      draggingRef.current = false;
    },
  };
};

const getKeyStep = (event: KeyboardEvent) => (event.shiftKey ? 10 : 1);

type TAreaProps = {
  label: string;
  valueText: string;
  thumb: TPoint;
  thumbColor: string;
  onMove: (point: TPoint) => void;
  onKey: (dx: number, dy: number) => void;
  round?: boolean;
  children?: ReactNode;
  style?: CSSProperties;
};

export const ColorArea = ({
  label,
  valueText,
  thumb,
  thumbColor,
  onMove,
  onKey,
  round,
  children,
  style,
}: TAreaProps) => {
  const handlers = usePointerDrag(onMove);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = getKeyStep(event);
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, step],
      ArrowDown: [0, -step],
    };

    const move = moves[event.key];
    if (!move) return;

    event.preventDefault();
    event.stopPropagation();
    onKey(...move);
  };

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuetext={valueText}
      className={classNames(styles.area, { [styles.round]: round })}
      style={style}
      onKeyDown={handleKeyDown}
      {...handlers}
    >
      {children}
      <div
        className={styles.thumb}
        style={{ left: `${thumb.x * 100}%`, top: `${thumb.y * 100}%`, backgroundColor: thumbColor }}
      />
    </div>
  );
};

type TSliderProps = {
  label: string;
  value: number;
  max: number;
  onChange: (value: number) => void;
  background: string;
  thumbColor: string;
  checkered?: boolean;
  unit?: string;
};

export const ColorSlider = ({
  label,
  value,
  max,
  onChange,
  background,
  thumbColor,
  checkered,
  unit = '',
}: TSliderProps) => {
  const handlers = usePointerDrag(({ x }) => onChange(x * max));

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = (getKeyStep(event) * max) / 100;
    const values: Record<string, number> = {
      ArrowLeft: value - step,
      ArrowDown: value - step,
      ArrowRight: value + step,
      ArrowUp: value + step,
      PageDown: value - max / 10,
      PageUp: value + max / 10,
      Home: 0,
      End: max,
    };

    if (!(event.key in values)) return;

    event.preventDefault();
    event.stopPropagation();
    onChange(clamp(values[event.key], 0, max));
  };

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={Math.round(value)}
      aria-valuetext={`${Math.round(value)}${unit}`}
      className={classNames(styles.slider, { [styles.checkered]: checkered })}
      onKeyDown={handleKeyDown}
      {...handlers}
    >
      <div className={styles.sliderTrack} style={{ background }} />
      <div className={styles.thumb} style={{ left: `${(value / max) * 100}%`, backgroundColor: thumbColor }} />
    </div>
  );
};

type TChannelInputProps = {
  label: string;
  value: number;
  max: number;
  onChange: (value: number) => void;
};

export const ChannelInput = ({ label, value, max, onChange }: TChannelInputProps) => {
  const [draft, setDraft] = useState<string | null>(null);

  const commit = (text: string) => {
    setDraft(text);

    const number = Number(text);
    if (text.trim() !== '' && Number.isFinite(number)) {
      onChange(clamp(number, 0, max));
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;

    event.preventDefault();
    const step = getKeyStep(event) * (event.key === 'ArrowUp' ? 1 : -1);
    setDraft(null);
    onChange(clamp(Math.round(value) + step, 0, max));
  };

  return (
    <label className={styles.channel}>
      <input
        value={draft ?? String(Math.round(value))}
        inputMode="numeric"
        aria-label={label}
        onChange={(event) => commit(event.target.value)}
        onBlur={() => setDraft(null)}
        onKeyDown={handleKeyDown}
        onFocus={(event) => event.target.select()}
      />
      <span>{label}</span>
    </label>
  );
};
