import styles from './styles.module.scss';
import { Section } from '@/app/components/Section/Section';

export const TestLargeImage = () => {
  return (
    <Section className={styles.testLargeImage} title="Very large image">
      <div>
        <input type="checkbox" id="large-image-animation" defaultChecked={false} />
        <label htmlFor="large-image-animation">Enable animation</label>
        <div>
          <img src="https://files.catbox.moe/zjiokj.png" alt="very large image" />
        </div>
      </div>
    </Section>
  );
};
