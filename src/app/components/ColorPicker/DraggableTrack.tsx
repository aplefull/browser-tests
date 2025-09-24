import React, { useRef, ReactNode, useState, useEffect } from 'react';
import { calculateThumbPosition, clamp, wait } from '@/utils/utils';
import classNames from 'classnames';
import styles from '@/app/components/ColorPicker/styles.module.scss';

type TDraggableTrackProps = {
  onChange: (value: number) => void;
  value: number;
  className?: string;
  children?: ReactNode;
};

export const DraggableTrack = ({ onChange, value, className, children }: TDraggableTrackProps) => {
  const [percentage, setPercentage] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();

    const rect = containerRef.current?.getBoundingClientRect();

    if (!rect) return;

    const onMouseMove = (event: MouseEvent) => {
      const { clientY } = event;
      const yPercent = clamp((clientY - rect.top) / rect.height, 0, 1);

      onChange(yPercent);
    };

    onMouseMove(event.nativeEvent);

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const calculatePercentage = async (shouldWait?: boolean) => {
    if (shouldWait) {
      await wait(50);
    }

    const containerHeight = containerRef.current?.getBoundingClientRect().height ?? 0;
    const thumbHeight = thumbRef.current?.getBoundingClientRect().height ?? 0;

    const minThumbPosition = calculateThumbPosition(0, 0, 100, thumbHeight, containerHeight);
    const maxThumbPosition = calculateThumbPosition(100, 0, 100, thumbHeight, containerHeight);

    const percentage = clamp(value, minThumbPosition, maxThumbPosition);

    setPercentage(percentage);
  };

  useEffect(() => {
    calculatePercentage(true).catch(console.error);
  }, []);

  useEffect(() => {
    calculatePercentage().catch(console.error);
  }, [value]);

  return (
    <div ref={containerRef} className={classNames(styles.dragTrack, className)} onMouseDown={onMouseDown}>
      <div
        ref={thumbRef}
        className={styles.handle}
        style={{
          top: `${percentage}%`,
        }}
      />
      {children}
    </div>
  );
};
