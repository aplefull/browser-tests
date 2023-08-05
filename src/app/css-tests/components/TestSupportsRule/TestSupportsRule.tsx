import styles from './styles.module.scss';
import { Section } from '@/app/components/Section/Section';

export const TestSupportsRule = () => {
  return (
    <Section className={styles.supportsRule} title="@supports">
      <p>This text is green if browser cares about @supports</p>
    </Section>
  );
};
