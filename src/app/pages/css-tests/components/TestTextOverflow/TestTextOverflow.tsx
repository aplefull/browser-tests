import styles from './styles.module.scss';
import { Section } from '@/app/components/Section/Section';

export const TestTextOverflow = () => {
  const paragraphs = [
    {
      text: 'This text should appear with ellipsis',
      className: styles.textOverflowEllipsis,
    },
    {
      text: 'This text should be clipped',
      className: styles.textOverflowClip,
    },
    {
      text: 'This text should be clipped with string',
      className: styles.textOverflowString,
    },
    {
      text: 'This text should be faded',
      className: styles.textOverflowFade,
    },
  ];

  return (
    <Section className={styles.textOverflow} title="Text-overflow">
      <span>Hover over paragraphs to see full line</span>
      <div>
        <br />
        {paragraphs.map((paragraph, index) => (
          <p title={paragraph.text} key={index} className={paragraph.className}>
            {paragraph.text}
          </p>
        ))}
      </div>
    </Section>
  );
};
