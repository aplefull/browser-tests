import styles from './styles.module.scss';
import { Checkbox } from '@/app/components/Checkbox/Checkbox';
import { useState } from 'react';

export const TestLargeImage = () => {
  const [animationEnabled, setAnimationEnabled] = useState(false);

  return (
    <div className={styles.testLargeImage}>
      <Checkbox
        checked={animationEnabled}
        onChange={setAnimationEnabled}
        label="Enable animation"
      />
      <div className={animationEnabled ? styles.animated : undefined}>
        <img src="https://files.catbox.moe/zjiokj.png" alt="very large image" />
      </div>
    </div>
  );
};
