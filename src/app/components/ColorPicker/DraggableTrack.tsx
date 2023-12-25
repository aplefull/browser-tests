import React, { useRef, ReactNode } from 'react';
import { clamp } from '@/utils/utils';
import classNames from 'classnames';
import styles from '@/app/components/ColorPicker/styles.module.scss';

type TDraggableTrackProps = {
  onChange: (value: number) => void;
  className?: string;
  children?: ReactNode;
};

export const DraggableTrack = ({ onChange, className, children }: TDraggableTrackProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const draggableRef = useRef<HTMLDivElement>(null);

  const onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();

    const rect = ref.current?.getBoundingClientRect();

    if (!rect) return;

    const onMouseMove = (event: MouseEvent) => {
      const { clientY } = event;

      const y = clientY - rect.top;
      const yPercent = clamp(y / rect.height, 0, 1);

      const draggableRect = draggableRef.current?.getBoundingClientRect();
      const containerRect = ref.current?.getBoundingClientRect();

      if (!draggableRect || !containerRect) return;

      const containerHeight = containerRect.height;
      const yOffset = clamp(yPercent * containerHeight, 0, containerHeight - draggableRect.height + 2);

      draggableRef.current?.style.setProperty('translate', `0 ${yOffset}px`);
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

  return (
    <div ref={ref} className={classNames(styles.dragTrack, className)} onMouseDown={onMouseDown}>
      <div className={styles.handle} ref={draggableRef} />
      {children}
    </div>
  );
};
