import styles from './styles.module.scss';
import { Masonry } from '@/app/js-tests/components/subcomponents/Masonry/Masonry';
import { useRef } from 'react';
import { TImageModule } from '@/types';
import { Section } from '@/app/components/Section/Section';

const images = import.meta.glob<TImageModule>('/src/assets/images/masonry_images/*.jpeg', { eager: true });

export const TestMasonry = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imagePaths = Object.values(images).map((image) => image.default);

  return (
    <Section className={styles.masonry} title="Masonry">
      <div className={styles.container} ref={containerRef}>
        <Masonry images={imagePaths} containerRef={containerRef} />
      </div>
    </Section>
  );
};
