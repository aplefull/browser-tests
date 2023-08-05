import { createBrowserRouter, Link, Outlet, RouterProvider, useRouteError } from 'react-router-dom';
import { Button } from '@/app/components/Button/Button';
import { routes } from '@/utils/routes';
import './globals.scss';
import styles from './home/styles.module.scss';
import { getErrorMessage } from '@/utils/utils';

// TODO separate header to another component
const Header = () => {
  return (
    <header className={styles.header}>
      <nav>
        <Link to="/html-tests">
          <Button text="HTML" variant="dark" width={100} textVariant="large" noHoverStyle />
        </Link>
        <Link to="/css-tests">
          <Button text="CSS" variant="dark" width={100} textVariant="large" noHoverStyle />
        </Link>
        <Link to="/js-tests">
          <Button text="JS" variant="dark" width={100} textVariant="large" noHoverStyle />
        </Link>
        <Link to="/misc-tests">
          <Button text="MISC" variant="dark" width={100} textVariant="large" noHoverStyle />
        </Link>
        <Link to="/others-projects">
          <Button text="HEY" variant="dark" width={100} textVariant="large" noHoverStyle />
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

const Error = () => {
  const error = useRouteError();

  const getStack = (error: unknown) => {
    if (typeof error === 'object' && !Array.isArray(error) && error !== null && 'stack' in error) {
      if (typeof error.stack === 'string') {
        return error.stack;
      }
    }

    return null;
  };

  return (
    <div className={styles.error}>
      <h1>Ooops, something went so bad that entire page crashed...</h1>
      <h2>
        A thing happened: <span>{getErrorMessage(error)}</span>
      </h2>
      <pre>{getStack(error)}</pre>
    </div>
  );
};

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: routes,
    errorElement: <Error />,
  },
]);

export const App = () => {
  return <RouterProvider router={router} />;
};
