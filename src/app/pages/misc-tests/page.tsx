import { sections } from '@/app/pages/misc-tests/sections';
import { Section } from '@/app/components/Section/Section';
import { Suspense } from 'react';
import { Loader } from '@/app/components/Loader/Loader';

export const MiscTestsPage = () => {
  return (
    <>
      {sections.map(({ Component, name }, index) => (
        <Section key={name} title={name}>
          <Suspense fallback={<Loader fillContainer />}>
            <Component key={index} />
          </Suspense>
        </Section>
      ))}
    </>
  );
};
