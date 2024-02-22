import styles from '@/app/pages/misc-tests/components/TestLayouts/layouts.module.scss';
import React from 'react';

export const CSSMasonry = ({ urls }: { urls: string[] }) => {
  return (
    <div className={styles.masonryContainer}>
      <div className={styles.masonry}>
        {urls.map((url, i) => {
          return (
            <div key={i} className={styles.item}>
              <img src={url} alt="image" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
