import { sections } from '@/app/pages/css-tests/sections';
import { Section } from '@/app/components/Section/Section';
import styles from "./page.module.scss";

export const CSSTestsPage = () => {
  return (
    <div className={styles.container}>
      {sections.map(({ Component, name }, index) => (
        <Section key={name} title={name}>
          <Component key={index} />
        </Section>
      ))}
    </div>
  );
};