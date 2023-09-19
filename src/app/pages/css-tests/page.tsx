import { sections } from '@/app/pages/css-tests/sections';
import { Section } from '@/app/components/Section/Section';

export const CSSTestsPage = () => {
  return (
    <>
      {sections.map(({ Component, name }, index) => (
        <Section key={name} title={name}>
          <Component key={index} />
        </Section>
      ))}
    </>
  );
};
