import { IndexPage } from '@/app/pages/home/page';
import { NotFound } from '@/app/pages/not-found/NotFound';
import { Settings } from '@/app/pages/settings/Settings';
import { OthersProjectsPage } from '@/app/pages/others-projects/page';
import { DevDemoPage } from '@/app/pages/dev-demo/page';
import { Section } from '@/app/components/Section/Section';
import { Loader } from '@/app/components/Loader/Loader';
import { SectionErrorBoundary } from '@/app/components/SectionErrorBoundary/SectionErrorBoundary';

import { JSX, LazyExoticComponent, Suspense } from 'react';

import { sections as htmlSections } from '@/app/pages/html-tests/sections';
import { sections as cssSections } from '@/app/pages/css-tests/sections';
import { sections as jsSections } from '@/app/pages/js-tests/sections';
import { sections as miscSections } from '@/app/pages/misc-tests/sections';

const Page = ({sections}: {sections: {Component: (() => JSX.Element | null) | (LazyExoticComponent<() => JSX.Element>); name: string}[]}) => {
  return (
    <div>
      {sections.map(({ Component, name }, index) => (
        <Section key={name} title={name}>
          <SectionErrorBoundary>
            <Suspense fallback={<Loader fillContainer />}>
              <Component key={index} />
            </Suspense>
          </SectionErrorBoundary>
        </Section>
      ))}
    </div>
  );
}

const baseRoutes = [
  {
    path: '/',
    element: <IndexPage />,
  },
  {
    path: '/html-tests',
    element: <Page sections={htmlSections} />,
    navText: 'HTML',
  },
  {
    path: '/css-tests',
    element: <Page sections={cssSections} />,
    navText: 'CSS',
  },
  {
    path: '/js-tests',
    element: <Page sections={jsSections} />,
    navText: 'JS',
  },
  {
    path: '/misc-tests',
    element: <Page sections={miscSections} />,
    navText: 'MISC',
  },
  {
    path: '/others-projects',
    element: <OthersProjectsPage />,
    navText: 'OTHER',
  },
  {
    path: '/settings',
    element: <Settings />,
    navText: 'SETTINGS',
  },
];

const devRoutes = import.meta.env.DEV ? [
  {
    path: '/dev-demo',
    element: <DevDemoPage />,
    navText: 'DEV',
  },
] : [];

export const routes = [
  ...baseRoutes,
  ...devRoutes,
  {
    path: '*',
    element: <NotFound />,
  },
];
