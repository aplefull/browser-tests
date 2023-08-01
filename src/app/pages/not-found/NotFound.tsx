import styles from './styles.module.scss';

export const NotFound = () => {
  return (
    <div className={styles.notFound}>
      <h2>404</h2>
      <p>Use one of the links above to actually get somewhere :)</p>
    </div>
  );
};
