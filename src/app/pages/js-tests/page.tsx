import { sections } from '@/app/pages/js-tests/sections';
import { Section } from '@/app/components/Section/Section';
import { SectionErrorBoundary } from '@/app/components/SectionErrorBoundary/SectionErrorBoundary';

export const JSTestsPage = () => {
  return (
    <>
      {sections.map(({ Component, name }, index) => (
        <Section key={name} title={name}>
          <SectionErrorBoundary>
            <Component key={index} />
          </SectionErrorBoundary>
        </Section>
      ))}
    </>
  );
};
