import styles from './styles.module.scss';
import { Section } from '@/app/components/Section/Section';

export const TestMediaQueries = () => {
  return (
    <Section className={styles.mediaQueries} title="Media queries">
      <div className={styles.rangeSyntax}>
        <h2>Range syntax</h2>
        <span>
          This text will appear green if browser window is 400px &lt; width &lt;= 2000px and browser supports range
          syntax.
        </span>
      </div>
    </Section>
  );
};
