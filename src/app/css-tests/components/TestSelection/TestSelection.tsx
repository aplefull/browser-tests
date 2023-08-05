import styles from './styles.module.scss';
import { Section } from '@/app/components/Section/Section';

export const TestSelection = () => {
  return (
    <Section className={styles.selection} title="Selection styling">
      <p id={styles.selectionColor}>This text should have a red background and dark gray color when selected</p>
      <p id={styles.selectionShadow}>This text should have a shadow when selected</p>
      <p id={styles.selectionNone}>This text is not selectable</p>
    </Section>
  );
};
