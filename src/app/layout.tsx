import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { routes } from '@/utils/routes';
import { useDoubleKeyPress } from '@/utils/hooks';
import { Header } from '@/app/components/Header/Header';
import { Error } from '@/app/components/Error/Error';
import { Provider, useDispatch } from 'react-redux';
import { AppDispatch, store } from './redux/store';
import styles from './pages/home/styles.module.scss';
import './styles/globals.scss';
import { useEffect } from 'react';
import { setSectionsState, TDropdown, TSections } from '@/app/redux/slices/settings';
import { sections as jsSections } from '@/app/pages/js-tests/sections';
import { sections as cssSections } from '@/app/pages/css-tests/sections';
import { sections as htmlSections } from '@/app/pages/html-tests/sections';
import { sections as miscSections } from '@/app/pages/misc-tests/sections';

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
    const mapper = (sections: TDropdown[], savedSections: TDropdown[]) => {
      return sections.map(({ name, initialState }) => {
        const savedSection = savedSections.find((section) => section.name === name);

        return {
          name,
          initialState: savedSection ? savedSection.initialState : initialState,
        };
      });
    };

    window.addEventListener('storage', (event) => {
      if (event.key !== 'settings-sections-state' || !event.newValue) return;

      dispatch(setSectionsState(JSON.parse(event.newValue)));
    });

    const savedState = localStorage.getItem('settings-sections-state');

    const savedSections: TSections = savedState
      ? JSON.parse(savedState)
      : {
          js: [],
          css: [],
          html: [],
          misc: [],
        };

    dispatch(
      setSectionsState({
        js: mapper(jsSections, savedSections.js),
        css: mapper(cssSections, savedSections.css),
        html: mapper(htmlSections, savedSections.html),
        misc: mapper(miscSections, savedSections.misc),
      }),
    );

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
