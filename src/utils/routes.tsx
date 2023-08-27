import { IndexPage } from '@/app/pages/home/page';
import { NotFound } from '@/app/pages/not-found/NotFound';
import { Settings } from '@/app/pages/settings/Settings';

import { lazy, Suspense } from 'react';
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

export const routes = [
  {
    path: '/',
    element: <IndexPage />,
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
