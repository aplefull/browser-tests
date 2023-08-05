import styles from './styles.module.scss';
import { Section } from '@/app/components/Section/Section';

export const TestWritingModes = () => {
  return (
    <Section className={styles.writingModes} title="Writing modes">
      <div className={styles.rectangleContainer}>
        <span>Lorem ipsum dolor sit amet.</span>
        <span>Lorem ipsum dolor sit amet.</span>
        <span>Lorem ipsum dolor sit amet.</span>
        <span>Lorem ipsum dolor sit amet.</span>
      </div>
      <div className={styles.direction}>
        <span>Normal text.</span>
        <span>日本語のテキスト。</span>
        <span>👍🏻👍🏼👍🏽👍🏾👍🏿</span>
        <span>The ‮quick brown fox‬ jumped. (Bi-directional)</span>
      </div>
    </Section>
  );
};
