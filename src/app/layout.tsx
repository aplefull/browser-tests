import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { routes } from '@/utils/routes';
import { useDoubleKeyPress } from '@/utils/hooks';
import { Header } from '@/app/components/Header/Header';
import { Error } from '@/app/components/Error/Error';
import { Provider, useDispatch } from 'react-redux';
import { AppDispatch, store } from './redux/store';
import styles from './pages/home/styles.module.scss';
import './globals.scss';
import { useEffect } from 'react';
import { setSectionsState } from '@/app/redux/slices/settings';

const RootLayout = () => {
  const dispatch = useDispatch<AppDispatch>();

  const onDoubleU = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useDoubleKeyPress('u', onDoubleU);

  useEffect(() => {
    window.addEventListener('storage', (event) => {
      if (event.key !== 'settings-sections-state' || !event.newValue) return;

      dispatch(setSectionsState(JSON.parse(event.newValue)));
    });

    const savedState = localStorage.getItem('settings-sections-state');
    if (!savedState) return;

    dispatch(setSectionsState(JSON.parse(savedState)));

    // TODO move or remove listener on unmount
  }, []);

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
