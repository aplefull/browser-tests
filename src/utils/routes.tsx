import { IndexPage } from '@/app/pages/home/page';
import { NotFound } from '@/app/pages/not-found/NotFound';
import { Settings } from '@/app/pages/settings/Settings';
import { OthersProjectsPage } from '@/app/pages/others-projects/page';
import { DevDemoPage } from '@/app/pages/dev-demo/page';
import { Section } from '@/app/components/Section/Section';
import { Loader } from '@/app/components/Loader/Loader';
import { SectionErrorBoundary } from '@/app/components/SectionErrorBoundary/SectionErrorBoundary';

import { ComponentType, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';

import { sections as htmlSections } from '@/app/pages/html-tests/sections';
import { sections as cssSections } from '@/app/pages/css-tests/sections';
import { sections as jsSections } from '@/app/pages/js-tests/sections';
import { sections as miscSections } from '@/app/pages/misc-tests/sections';

const Page = ({ sections }: { sections: { Component: ComponentType; name: string }[] }) => {
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
};

type TRoute = RouteObject & {
  navText?: string;
  searchable?: boolean;
};

const baseRoutes: TRoute[] = [
  {
    path: '/',
    element: <IndexPage />,
  },
  {
    path: '/html-tests',
    element: <Page sections={htmlSections} />,
    searchable: true,
    navText: 'HTML',
  },
  {
    path: '/css-tests',
    element: <Page sections={cssSections} />,
    searchable: true,
    navText: 'CSS',
  },
  {
    path: '/js-tests',
    element: <Page sections={jsSections} />,
    searchable: true,
    navText: 'JS',
  },
  {
    path: '/misc-tests',
    element: <Page sections={miscSections} />,
    searchable: true,
    navText: 'Misc',
  },
  {
    path: '/others-projects',
    element: <OthersProjectsPage />,
    navText: 'Other',
  },
  {
    path: '/settings',
    element: <Settings />,
    navText: 'Settings',
  },
];

const devRoutes: TRoute[] = import.meta.env.DEV
  ? [
      {
        path: '/dev-demo',
        element: <DevDemoPage />,
        navText: 'Dev',
      },
    ]
  : [];

export const routes: TRoute[] = [
  ...baseRoutes,
  ...devRoutes,
  {
    path: '*',
    element: <NotFound />,
  },
];
