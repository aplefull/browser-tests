import React, { useRef, ReactNode } from 'react';
import { calculateThumbPosition, clamp } from '@/utils/utils';
import classNames from 'classnames';
import styles from '@/app/components/ColorPicker/styles.module.scss';

type TDraggableTrackProps = {
  onChange: (value: number) => void;
  value: number;
  className?: string;
  children?: ReactNode;
};

export const DraggableTrack = ({ onChange, value, className, children }: TDraggableTrackProps) => {
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

  const containerHeight = containerRef.current?.getBoundingClientRect().height ?? 0;
  const thumbHeight = thumbRef.current?.getBoundingClientRect().height ?? 0;

  const minThumbPosition = calculateThumbPosition(0, 0, 100, thumbHeight, containerHeight);
  const maxThumbPosition = calculateThumbPosition(100, 0, 100, thumbHeight, containerHeight);

  const thumbPosition = clamp(value, minThumbPosition || 0, maxThumbPosition || 100);

  return (
    <div ref={containerRef} className={classNames(styles.dragTrack, className)} onMouseDown={onMouseDown}>
      <div
        ref={thumbRef}
        className={styles.handle}
        style={{
          top: `${thumbPosition}%`,
        }}
      />
      {children}
    </div>
  );
};
