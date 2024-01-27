import { useEffect } from 'react';
import { PAGES } from '@/utils/constants';
import { useDispatch } from 'react-redux';
import { getCurrentPage } from '@/utils/utils';
import { AppDispatch } from '@/app/redux/store';
import { useDoubleKeyPress } from '@/utils/hooks';
import { sections as jsSections } from '@/app/pages/js-tests/sections';
import { sections as cssSections } from '@/app/pages/css-tests/sections';
import { sections as htmlSections } from '@/app/pages/html-tests/sections';
import { sections as miscSections } from '@/app/pages/misc-tests/sections';
import { closeAllSectionsOnPage, setSectionsState, TDropdown, TSections } from '@/app/redux/slices/settings';
import { SectionSearch } from '@/app/components/SectionSearch/SectionSearch';

export const Init = () => {
  const dispatch = useDispatch<AppDispatch>();

  const onDoubleU = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const onDoubleC = () => {
    const currentPage = getCurrentPage();

    if (currentPage === 'unknown') return;

    switch (currentPage) {
      case PAGES.HTML_TESTS:
        dispatch(closeAllSectionsOnPage('html'));
        return;

      case PAGES.CSS_TESTS:
        dispatch(closeAllSectionsOnPage('css'));
        return;

      case PAGES.JS_TESTS:
        dispatch(closeAllSectionsOnPage('js'));
        return;

      case PAGES.MISC_TESTS:
        dispatch(closeAllSectionsOnPage('misc'));
        return;

      default:
        return;
    }
  };

  useDoubleKeyPress('u', onDoubleU);
  useDoubleKeyPress('c', onDoubleC);

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

    const onStorage = (event: StorageEvent) => {
      if (event.key !== 'settings-sections-state' || !event.newValue) return;

      dispatch(setSectionsState(JSON.parse(event.newValue)));
    };

    window.addEventListener('storage', onStorage);

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

    return () => {
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return (
    <>
      <SectionSearch />
    </>
  );
};
