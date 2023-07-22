import styles from './styles.module.scss';
import { Masonry } from '@/app/js-tests/components/subcomponents/Masonry/Masonry';
import { useRef } from 'react';
import { TImageModule } from '@/types';

const images = import.meta.glob<TImageModule>('/src/assets/images/masonry_images/*.jpeg', { eager: true });

export default function TestMasonry() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imagePaths = Object.values(images).map((image) => image.default);

  return (
    <section className={styles.masonry}>
      <h1>Masonry</h1>
      <div className={styles.container} ref={containerRef}>
        <Masonry images={imagePaths} containerRef={containerRef} />
      </div>
    </section>
  );
}
