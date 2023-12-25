import styles from './styles.module.scss';
import { Masonry } from '@/app/pages/misc-tests/components/subcomponents/Masonry/Masonry';
import { useRef } from 'react';
import { TImageModule } from '@/types';

const images = import.meta.glob<TImageModule>('/src/assets/images/masonry_images/*.jpeg', { eager: true });

export const JSMasonry = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imagePaths = Object.values(images).map((image) => image.default);

  return (
    <div className={styles.masonry} ref={containerRef}>
      <Masonry images={imagePaths} containerRef={containerRef} />
    </div>
  );
};
