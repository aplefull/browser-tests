import styles from './styles.module.scss';
import { Checkbox } from '@/app/components/Checkbox/Checkbox';
import classNames from 'classnames';
import { useState } from 'react';
import hugeImage from '@assets/images/huge.avif';

export const TestLargeImage = () => {
  const [animationEnabled, setAnimationEnabled] = useState(false);

  return (
    <div className={styles.testLargeImage}>
      <Checkbox checked={animationEnabled} onChange={setAnimationEnabled} label="Enable animation" />
      <div className={styles.imageContainer}>
        <div className={classNames(animationEnabled && styles.animated, styles.imageWrapper)}>
          <img src={hugeImage} alt="very large image" />
        </div>
      </div>
    </div>
  );
};
