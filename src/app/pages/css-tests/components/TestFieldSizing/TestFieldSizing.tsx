import styles from './styles.module.scss';

export const TestFieldSizing = () => {
  return (
    <div className={styles.container}>
      <input className={styles.autoResize} type="text" />
      <input className={styles.autoResize} type="number" />
      <input className={styles.autoResize} type="file" />
      <input className={styles.autoResize} value="Button" type="button" />
      <textarea className={styles.autoResize} rows={5} />
      <textarea className={styles.autoResize} />
    </div>
  );
};
