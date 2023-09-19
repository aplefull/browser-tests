import { Section } from '@/app/components/Section/Section';
import { sections } from '@/app/pages/html-tests/sections';

export const HTMLTestsPage = () => {
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
