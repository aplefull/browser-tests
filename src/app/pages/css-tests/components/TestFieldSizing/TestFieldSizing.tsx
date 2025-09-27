import styles from './styles.module.scss';

export const TestFieldSizing = () => {
  return (
    <>
      <p>Inputs and textareas with field-sizing: content; should resize to fit their content.</p>
      <div className={styles.container}>
        <input defaultValue="Some default content" className={styles.autoResize} type="text" />
        <input defaultValue={42} className={styles.autoResize} type="number" />
        <input className={styles.autoResize} type="file" />
        <textarea defaultValue="Some default content in a textarea" className={styles.autoResize} rows={5} />
        <textarea defaultValue="Same here but no explicit rows" className={styles.autoResize} />
      </div>
    </>
  );
};
