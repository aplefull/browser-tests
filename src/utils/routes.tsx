import { IndexPage } from '@/app/home/page';
import { HTMLTestsPage } from '@/app/html-tests/HTMLTestsPage';
import { CSSTestsPage } from '@/app/css-tests/page';
import { JSTestsPage } from '@/app/js-tests/page';
import { MiscTestsPage } from '@/app/misc-tests/page';
import { OthersProjectsPage } from '@/app/others-projects/page';
import { NotFound } from '@/app/pages/not-found/NotFound';

export const routes = [
  {
    path: '/',
    element: <IndexPage />,
  },
  {
    path: '/html-tests',
    element: <HTMLTestsPage />,
  },
  {
    path: '/css-tests',
    element: <CSSTestsPage />,
  },
  {
    path: '/js-tests',
    element: <JSTestsPage />,
  },
  {
    path: '/misc-tests',
    element: <MiscTestsPage />,
  },
  {
    path: '/others-projects',
    element: <OthersProjectsPage />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
