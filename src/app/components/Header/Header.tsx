import { Link } from 'react-router-dom';
import { Button } from '@/app/components/Button/Button';
import { routes } from '@/utils/routes';
import styles from './styles.module.scss';

export const Header = () => {
  return (
    <header className={styles.header}>
      <nav>
        {routes.map((route) => {
          if (!route.navText) return null;

          return (
            <Link className={styles.link} key={route.path} to={route.path}>
              {route.navText}
            </Link>
          );
        })}
      </nav>
    </header>
  );
};
