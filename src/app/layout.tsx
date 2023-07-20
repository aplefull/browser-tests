import './globals.scss';
import styles from './home/styles.module.scss';
import { createBrowserRouter, Link, Route, RouterProvider, Routes } from 'react-router-dom';
import { IndexPage } from './home/page';
import { HTMLTestsPage } from './html-tests/HTMLTestsPage';
import { CSSTestsPage } from '@/app/css-tests/page';
import { JSTestsPage } from '@/app/js-tests/page';
import { MiscTestsPage } from '@/app/misc-tests/page';
import { OthersProjectsPage } from '@/app/others-projects/page';

const routes = [
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
  }
];

const RootLayout = () => {
  return (
    <>
      <header className={styles.header}>
        <nav>
          <Link to="/html-tests">
            <div>HTML</div>
          </Link>
          <Link to="/css-tests">
            <div>CSS</div>
          </Link>
          <Link to="/js-tests">
            <div>JS</div>
          </Link>
          <Link to="/misc-tests">
            <div>MISC</div>
          </Link>
          <Link to="/others-projects">
            <div>HEY</div>
          </Link>
        </nav>
      </header>
      <main>
        <Routes>
          {routes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
          <Route path="*" element={<div>404</div>} />
        </Routes>
      </main>
    </>
  );
};

const router = createBrowserRouter([
  {
    path: '*',
    element: <RootLayout />,
  },
]);

const Providers = () => {
  return <RouterProvider router={router} />;
};

export const App = () => {
  return <Providers />;
};
