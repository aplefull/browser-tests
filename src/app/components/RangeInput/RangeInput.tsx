import styles from './styles.module.scss';
import React, { useRef } from 'react';
import { clamp, map } from '@/utils/utils';
import classNames from 'classnames';
import { TLabelPosition } from '@/types';

type TRangeInputProps = {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  label?: string;
  labelPosition?: TLabelPosition;
  className?: string;
};

const getStartX = (event: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
  if ('touches' in event) {
    return event.touches[0].clientX;
  }

  if ('clientX' in event) {
    return event.clientX;
  }

  return 0;
};

export const RangeInput = ({
  value,
  min = 0,
  max = 100,
  onChange,
  label,
  labelPosition,
  className,
}: TRangeInputProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const onMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();

    const startX = getStartX(event);

    const { current: element } = ref;

    if (!element) {
      return;
    }

    const { left } = element.getBoundingClientRect();

    const progress = (startX - left) / element.offsetWidth;
    const value = map(progress, 0, 1, min, max);

    onChange(clamp(value, min, max));

    const onMouseMove = (event: MouseEvent | TouchEvent) => {
      const currentX = getStartX(event);

      const value = map(currentX - left, 0, element.offsetWidth, min, max);

      onChange(clamp(value, min, max));
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const onTouchStart = (event: React.TouchEvent) => {
    const startX = getStartX(event);

    const { current: element } = ref;

    if (!element) {
      return;
    }

    const { left } = element.getBoundingClientRect();

    const progress = (startX - left) / element.offsetWidth;
    const value = map(progress, 0, 1, min, max);

    onChange(clamp(value, min, max));

    const onTouchMove = (event: TouchEvent) => {
      const currentX = getStartX(event);

      const value = map(currentX - left, 0, element.offsetWidth, min, max);

      onChange(clamp(value, min, max));
    };

    const onTouchEnd = () => {
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('touchcancel', onTouchEnd);
    };

    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', onTouchEnd);
    document.addEventListener('touchcancel', onTouchEnd);
  };

  const { width: thumbWidth = 13 } = thumbRef.current?.getBoundingClientRect() || {};
  const { width: containerWidth = 100 } = thumbRef.current?.parentElement?.getBoundingClientRect() || {};

  const minPosition = (((thumbWidth || 0) / (containerWidth || 1)) * 100) / 2;
  const maxPosition = 100 - minPosition;
  const percentage = map(value, min, max, minPosition, maxPosition);

  return (
    <div
      className={classNames(styles.rangeInputContainer, className, {
        [styles.labelTop]: labelPosition === 'top' || !labelPosition,
        [styles.labelBottom]: labelPosition === 'bottom',
        [styles.labelLeft]: labelPosition === 'left',
        [styles.labelRight]: labelPosition === 'right',
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
