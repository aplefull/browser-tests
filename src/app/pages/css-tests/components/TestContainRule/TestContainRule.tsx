import { Section } from '@/app/components/Section/Section';
import styles from './styles.module.scss';

export const TestContainRule = () => {
  return (
    <Section title="Contain">
      <div>
        <h2>Size</h2>
        <div className={styles.size}>
          <div className={styles.parent}>
            <div className={styles.child} />
          </div>
        </div>
        <h2>Layout</h2>
        <div className={styles.layout}>
          <div className={styles.parent}>
            <div className={styles.child} />
          </div>
          <div className={styles.uncle} />
        </div>
        <h2>Paint</h2>
        <div className={styles.paint}>
          <div className={styles.parent}>
            <div className={styles.child} />
          </div>
        </div>
        <h2>Strict</h2>
        <div className={styles.strict}>
          <div className={styles.parent}>
            <div className={styles.child} />
          </div>
        </div>
      </div>
    </Section>
  );
};
