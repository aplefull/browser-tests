import { Link, useLocation } from 'react-router-dom';
import { routes } from '@/utils/routes';
import styles from './styles.module.scss';
import classNames from 'classnames';

export const Header = () => {
  const location = useLocation();

  return (
    <header className={styles.header}>
      <nav>
        {routes.map((route) => {
          if (!route.navText) return null;

          const isActive = location.pathname === route.path;

          return (
            <Link className={classNames(styles.link, { [styles.active]: isActive })} key={route.path} to={route.path}>
              {route.navText}
            </Link>
          );
        })}
      </nav>
    </header>
  );
};
