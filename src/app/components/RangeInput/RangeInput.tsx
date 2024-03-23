import styles from './styles.module.scss';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { calculateThumbPosition, clamp, map, wait } from '@/utils/utils';
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

const updateValue = (
  event: MouseEvent | TouchEvent,
  element: HTMLDivElement,
  min: number,
  max: number,
  step: number,
  onChange: (value: number) => void,
) => {
  const { left } = element.getBoundingClientRect();
  const currentX = getStartX(event);

  const value = map(currentX - left, 0, element.offsetWidth, min, max);
  const stepValue = Math.round(value / step) * step;

  onChange(clamp(stepValue, min, max));
};

const updateValueOnPointerDown = (
  event: PointerEvent,
  element: HTMLDivElement,
  min: number,
  max: number,
  step: number,
  onChange: (value: number) => void,
) => {
  const startX = getStartX(event);
  const { left } = element.getBoundingClientRect();

  const progress = (startX - left) / element.offsetWidth;
  const value = map(progress, 0, 1, min, max);
  const stepValue = Math.round(value / step) * step;

  onChange(clamp(stepValue, min, max));
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
  const [percentage, setPercentage] = useState(0);

  const ref = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const onMouseDown = (event: React.MouseEvent) => {
    const element = ref.current;
    if (!element) return;

    document.body.style.userSelect = 'none';

    updateValueOnPointerDown(event, element, min, max, step, onChange);

    const onMouseMove = (event: MouseEvent) => {
      updateValue(event, element, min, max, step, onChange);
    };

    const onMouseUp = () => {
      document.body.style.userSelect = '';

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('focusout', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    window.addEventListener('blur', onMouseUp);
  };

  const onTouchStart = (event: React.TouchEvent) => {
    const element = ref.current;
    if (!element) return;

    document.body.style.userSelect = 'none';

    updateValueOnPointerDown(event, element, min, max, step, onChange);

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

  const calculatePercentage = async (shouldWait?: boolean) => {
    if (shouldWait) {
      await wait(50);
    }

    const { width: thumbWidth = 13 } = thumbRef.current?.getBoundingClientRect() || {};
    const { width: containerWidth = 100 } = thumbRef.current?.parentElement?.getBoundingClientRect() || {};

    const minThumbLeft = calculateThumbPosition(min, min, max, thumbWidth, containerWidth);
    const maxThumbLeft = calculateThumbPosition(max, min, max, thumbWidth, containerWidth);

    const percentage = clamp(map(value, min, max, 0, 100), minThumbLeft, maxThumbLeft);

    setPercentage(percentage);
  };

  useEffect(() => {
    calculatePercentage(true).catch(console.error);
  }, []);

  useEffect(() => {
    calculatePercentage().catch(console.error);
  }, [value, min, max]);

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
      <div className={styles.input} onMouseDown={onMouseDown} onTouchStart={onTouchStart} ref={ref}>
        <div className={styles.background} />
        <div className={styles.foreground} style={{ width: `${percentage}%` }} />
        <div ref={thumbRef} className={styles.thumb} style={{ left: `${percentage}%` }} />
      </div>
    </div>
  );
};
