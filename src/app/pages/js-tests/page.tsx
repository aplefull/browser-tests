import { sections } from '@/app/pages/js-tests/sections';
import { Section } from '@/app/components/Section/Section';

export const JSTestsPage = () => {
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
