import styles from './styles.module.scss';

export default function TestSelection() {
  return (
    <section className={styles.selection}>
      <h1>Selection styling</h1>
      <p id={styles['selection-color']}>This text should have a red background and dark gray color when selected</p>
      <p id={styles['selection-shadow']}>This text should have a shadow when selected</p>
      <p id={styles['selection-none']}>This text is not selectable</p>
    </section>
  );
}
