import { createBrowserRouter, Link, Outlet, RouterProvider } from 'react-router-dom';
import { Button } from '@/app/components/Button/Button';
import { routes } from '@/utils/routes';
import './globals.scss';
import styles from './home/styles.module.scss';

// TODO separate header to another component
const Header = () => {
  return (
    <header className={styles.header}>
      <nav>
        <Link to="/html-tests">
          <Button text="HTML" variant="dark" width={100} textVariant="large" />
        </Link>
        <Link to="/css-tests">
          <Button text="CSS" variant="dark" width={100} textVariant="large" />
        </Link>
        <Link to="/js-tests">
          <Button text="JS" variant="dark" width={100} textVariant="large" />
        </Link>
        <Link to="/misc-tests">
          <Button text="MISC" variant="dark" width={100} textVariant="large" />
        </Link>
        <Link to="/others-projects">
          <Button text="HEY" variant="dark" width={100} textVariant="large" />
        </Link>
      </nav>
    </header>
  );
};

const RootLayout = () => {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  );
};

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: routes,
  },
]);

export const App = () => {
  return <RouterProvider router={router} />;
};
