import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { routes } from '@/utils/routes';
import { Header } from '@/app/components/Header/Header';
import { Error } from '@/app/components/Error/Error';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { Init } from '@/app/components/Init/Init';
import styles from './pages/home/styles.module.scss';

import './styles/globals.scss';
// TODO remove
import './styles/temp.css';

const RootLayout = () => {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <Init />
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
