import styles from './styles.module.scss';
import flyingCat from '@assets/images/cats/flying-cat.png';
import { Section } from '@/app/components/Section/Section';

export const TestObjectViewBox = () => {
  return (
    <Section className={styles.objectViewBox} title="Object view box">
      <p>Hover over images</p>
      <div>
        <div className={styles.inset}>
          <img src={flyingCat} alt="cat" />
        </div>
        <div className={styles.zoomOut}>
          <img src={flyingCat} alt="cat" />
        </div>
      </div>
    </Section>
  );
};
