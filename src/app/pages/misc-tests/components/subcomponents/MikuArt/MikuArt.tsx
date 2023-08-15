import classNames from 'classnames';
import styles from './styles.module.scss';

export const MikuArt = () => {
  return (
    <div className={styles.container}>
      {Array.from({ length: 3186 }, (_, i) => i).map((i) => (
        <div className={classNames(styles.component, styles[`component${i}`])} key={i} />
      ))}
    </div>
  );
};
