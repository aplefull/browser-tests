import { Link, useLocation } from 'react-router-dom';
import { routes } from '@/utils/routes';
import styles from './styles.module.scss';
import classNames from 'classnames';
import { Search } from 'tabler-icons-react';
import { openSectionSearch } from '@/app/components/SectionSearch/SectionSearch';

export const Header = () => {
  const location = useLocation();

  const isSearchable = routes.some((route) => route.searchable && route.path === location.pathname);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <nav className={styles.nav}>
          {routes.map((route) => {
            if (!route.navText || !route.path) return null;

            const isActive = location.pathname === route.path;

            return (
              <Link
                className={classNames(styles.link, { [styles.active]: isActive })}
                key={route.path}
                to={route.path}
                aria-current={isActive ? 'page' : undefined}
              >
                {route.navText}
              </Link>
            );
          })}
        </nav>
        {isSearchable && (
          <button type="button" className={styles.search} onClick={openSectionSearch}>
            <Search size={15} />
            <span className={styles.searchLabel}>Search</span>
            <span className={styles.keys}>
              <kbd>F</kbd>
              <kbd>F</kbd>
            </span>
          </button>
        )}
      </div>
    </header>
  );
};
