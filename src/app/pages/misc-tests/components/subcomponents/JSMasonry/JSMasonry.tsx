import styles from './styles.module.scss';
import { Masonry } from '@/app/pages/misc-tests/components/subcomponents/Masonry/Masonry';
import { useRef } from 'react';
import classNames from 'classnames';

type TJSMasonryProps = {
  urls: string[];
  className?: string;
};

export const JSMasonry = ({ urls, className }: TJSMasonryProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className={classNames(styles.masonry, className)} ref={containerRef}>
      <Masonry images={urls} containerRef={containerRef} />
    </div>
  );
};
