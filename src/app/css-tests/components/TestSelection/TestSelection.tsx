import styles from './styles.module.scss';
import { Section } from '@/app/components/Section/Section';

export const TestSelection = () => {
  return (
    <Section className={styles.selection} title="Selection styling">
      <p className={styles.selectionColor}>This text should have a red background and dark gray color when selected</p>
      <p className={styles.selectionShadow}>This text should have a shadow when selected</p>
      <p className={styles.selectionNone}>This text is not selectable</p>
    </Section>
  );
};
