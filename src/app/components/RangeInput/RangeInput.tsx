import styles from './styles.module.scss';
import React, { CSSProperties, useRef } from 'react';
import { clamp, map } from '@/utils/utils';
import classNames from 'classnames';
import { TLabelPosition } from '@/types';

type TRangeInputProps = {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  label?: string;
  labelPosition?: TLabelPosition;
  className?: string;
  disabled?: boolean;
};

type PointerEvent = React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent;

const getStartX = (event: PointerEvent) => {
  if ('touches' in event) {
    return event.touches[0].clientX;
  }

  if ('clientX' in event) {
    return event.clientX;
  }

  return 0;
};

const THUMB_SIZE = 14;

const getValueFromX = (clientX: number, element: HTMLDivElement, min: number, max: number, step: number) => {
  const { left, width } = element.getBoundingClientRect();
  const progress = clamp((clientX - left - THUMB_SIZE / 2) / (width - THUMB_SIZE), 0, 1);
  const value = Math.round(map(progress, 0, 1, min, max) / step) * step;

  return clamp(Number(value.toFixed(10)), min, max);
};

const updateValue = (
  event: PointerEvent,
  element: HTMLDivElement,
  min: number,
  max: number,
  step: number,
  onChange: (value: number) => void,
) => {
  onChange(getValueFromX(getStartX(event), element, min, max, step));
};

export const RangeInput = ({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  label,
  labelPosition,
  className,
  disabled,
}: TRangeInputProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseDown = (event: React.MouseEvent) => {
    const element = ref.current;
    if (!element) return;

    document.body.style.userSelect = 'none';

    updateValue(event, element, min, max, step, onChange);

    const onMouseMove = (event: MouseEvent) => {
      updateValue(event, element, min, max, step, onChange);
    };

    const onMouseUp = () => {
      document.body.style.userSelect = '';

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('blur', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    window.addEventListener('blur', onMouseUp);
  };

  const onTouchStart = (event: React.TouchEvent) => {
    const element = ref.current;
    if (!element) return;

    document.body.style.userSelect = 'none';

    updateValue(event, element, min, max, step, onChange);

    const onTouchMove = (event: TouchEvent) => {
      updateValue(event, element, min, max, step, onChange);
    };

    const onTouchEnd = () => {
      document.body.style.userSelect = '';

      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('touchcancel', onTouchEnd);
      window.removeEventListener('blur', onTouchEnd);
    };

    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', onTouchEnd);
    document.addEventListener('touchcancel', onTouchEnd);
    window.addEventListener('blur', onTouchEnd);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const bigStep = Math.max(step, (max - min) / 10);
    const steps: Record<string, number> = {
      ArrowRight: step,
      ArrowUp: step,
      ArrowLeft: -step,
      ArrowDown: -step,
      PageUp: bigStep,
      PageDown: -bigStep,
      Home: -Infinity,
      End: Infinity,
    };

    if (!(event.key in steps)) return;

    event.preventDefault();

    const next = Number.isFinite(steps[event.key])
      ? Number((Math.round((value + steps[event.key]) / step) * step).toFixed(10))
      : steps[event.key] > 0
        ? max
        : min;

    onChange(clamp(next, min, max));
  };

  const progress = max === min ? 0 : clamp((value - min) / (max - min), 0, 1);
  const trackStyle = { '--progress': progress, '--thumb-size': `${THUMB_SIZE}px` } as CSSProperties;

  return (
    <div
      className={classNames(styles.rangeInputContainer, className, {
        [styles.labelTop]: labelPosition === 'top' || (!labelPosition && label),
        [styles.labelBottom]: labelPosition === 'bottom',
        [styles.labelLeft]: labelPosition === 'left',
        [styles.labelRight]: labelPosition === 'right',
        [styles.disabled]: disabled,
      })}
    >
      {label && <span>{label}</span>}
      <div
        ref={ref}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-disabled={disabled}
        className={styles.input}
        style={trackStyle}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onKeyDown={onKeyDown}
      >
        <div className={styles.background} />
        <div className={styles.foreground} />
        <div className={styles.thumb} />
      </div>
    </div>
  );
};
