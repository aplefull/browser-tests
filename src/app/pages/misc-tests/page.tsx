import { sections } from '@/app/pages/misc-tests/sections';
import { Section } from '@/app/components/Section/Section';

export const MiscTestsPage = () => {
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
