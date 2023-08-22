import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { routes } from '@/utils/routes';
import { useDoubleKeyPress } from '@/utils/hooks';
import { Header } from '@/app/components/Header/Header';
import { Error } from '@/app/components/Error/Error';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import styles from './pages/home/styles.module.scss';
import './globals.scss';

const RootLayout = () => {
  const onDoubleU = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useDoubleKeyPress('u', onDoubleU);

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
    errorElement: <Error />,
  },
]);

export const App = () => {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
};
