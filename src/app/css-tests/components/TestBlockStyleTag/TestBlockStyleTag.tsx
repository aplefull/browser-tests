import styles from './styles.module.scss';
import { Section } from '@/app/components/Section/Section';

export const TestBlockStyleTag = () => {
  return (
    <Section className={styles.blockStyleTag} title="Block style tag and contenteditable attribute">
      <style className="block-style" contentEditable suppressContentEditableWarning>
        {`
          .block-style {
            color: #45dec5;
          }
        `}
      </style>
    </Section>
  );
};
