import { IndexPage } from '@/app/pages/home/page';
import { HTMLTestsPage } from '@/app/pages/html-tests/HTMLTestsPage';
import { CSSTestsPage } from '@/app/pages/css-tests/page';
import { JSTestsPage } from '@/app/pages/js-tests/page';
import { MiscTestsPage } from '@/app/pages/misc-tests/page';
import { OthersProjectsPage } from '@/app/pages/others-projects/page';
import { NotFound } from '@/app/pages/not-found/NotFound';
import { Settings } from '@/app/pages/settings/Settings';

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
