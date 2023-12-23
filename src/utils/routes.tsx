import { IndexPage } from '@/app/pages/home/page';
import { NotFound } from '@/app/pages/not-found/NotFound';
import { Settings } from '@/app/pages/settings/Settings';
import { HTMLTestsPage } from '@/app/pages/html-tests/HTMLTestsPage';
import { CSSTestsPage } from '@/app/pages/css-tests/page';
import { JSTestsPage } from '@/app/pages/js-tests/page';
import { MiscTestsPage } from '@/app/pages/misc-tests/page';
import { OthersProjectsPage } from '@/app/pages/others-projects/page';

import { lazy, ReactNode, Suspense } from 'react';
import { Loader } from '@/app/components/Loader/Loader';

// TODO maybe use in separate heavy components
const importer = (path: string) => {
  return lazy<() => ReactNode>(async () => {
    try {
      /* @vite-ignore */
      const module = await import(path);
      const moduleName = Object.keys(module)[0];

      if (!moduleName) throw new Error('Module name is not defined');

      return { default: module[moduleName] };
    } catch (error) {
      console.error(error);
      return { default: () => null };
    }
  });
};

const Async = ({ path }: { path: string }) => {
  const Component = importer(path);

  return (
    <Suspense fallback={<Loader fillPage />}>
      <Component />
    </Suspense>
  );
};

export const routes = [
  {
    path: '/',
    element: <IndexPage />,
  },
  {
    path: '/html-tests',
    element: <HTMLTestsPage />,
    navText: 'HTML',
  },
  {
    path: '/css-tests',
    element: <CSSTestsPage />,
    navText: 'CSS',
  },
  {
    path: '/js-tests',
    element: <JSTestsPage />,
    navText: 'JS',
  },
  {
    path: '/misc-tests',
    element: <MiscTestsPage />,
    navText: 'MISC',
  },
  {
    path: '/others-projects',
    element: <OthersProjectsPage />,
    navText: 'HEY',
  },
  {
    path: '/settings',
    element: <Settings />,
    navText: 'SETTINGS',
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
