//import { IndexPage } from '@/app/pages/home/page';
import { NotFound } from '@/app/pages/not-found/NotFound';
import { Settings } from '@/app/pages/settings/Settings';

import { ComponentType, JSX, lazy, ReactNode, Suspense } from 'react';
import { Loader } from '@/app/components/Loader/Loader';

const HTMLTestsPage = lazy(() =>
  import('@/app/pages/html-tests/HTMLTestsPage').then(({ HTMLTestsPage }) => ({ default: HTMLTestsPage })),
);
const CSSTestsPage = lazy(() =>
  import('@/app/pages/css-tests/page').then(({ CSSTestsPage }) => ({ default: CSSTestsPage })),
);
const JSTestsPage = lazy(() =>
  import('@/app/pages/js-tests/page').then(({ JSTestsPage }) => ({ default: JSTestsPage })),
);
const MiscTestsPage = lazy(() =>
  import('@/app/pages/misc-tests/page').then(({ MiscTestsPage }) => ({ default: MiscTestsPage })),
);
const OthersProjectsPage = lazy(() =>
  import('@/app/pages/others-projects/page').then(({ OthersProjectsPage }) => ({ default: OthersProjectsPage })),
);

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

//const IndexPage = importer('/src/app/pages/home/page');
export const routes = [
  {
    path: '/',
    element: <Async path={'/src/app/pages/home/page'} />,
  },
  {
    path: '/html-tests',
    element: (
      <Suspense fallback={<Loader fillPage />}>
        <HTMLTestsPage />
      </Suspense>
    ),
    navText: 'HTML',
  },
  {
    path: '/css-tests',
    element: (
      <Suspense fallback={<Loader fillPage />}>
        <CSSTestsPage />
      </Suspense>
    ),
    navText: 'CSS',
  },
  {
    path: '/js-tests',
    element: (
      <Suspense fallback={<Loader fillPage />}>
        <JSTestsPage />
      </Suspense>
    ),
    navText: 'JS',
  },
  {
    path: '/misc-tests',
    element: (
      <Suspense fallback={<Loader fillPage />}>
        <MiscTestsPage />
      </Suspense>
    ),
    navText: 'MISC',
  },
  {
    path: '/others-projects',
    element: (
      <Suspense fallback={<Loader fillPage />}>
        <OthersProjectsPage />
      </Suspense>
    ),
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
