import styles from './styles.module.scss';

export const TestSelection = () => {
  return (
    <div className={styles.selection}>
      <p className={styles.selectionColor}>This text should have a red background and dark gray color when selected</p>
      <p className={styles.selectionShadow}>This text should have a shadow when selected</p>
      <p className={styles.selectionNone}>This text is not selectable</p>
    </div>
  );
};
