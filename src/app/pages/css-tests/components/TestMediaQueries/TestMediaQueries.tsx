import styles from './styles.module.scss';

export const TestMediaQueries = () => {
  return (
    <div className={styles.mediaQueries}>
      <div className={styles.rangeSyntax}>
        <h2>Range syntax</h2>
        <span>
          This text will appear green if browser window is 400px &lt; width &lt;= 2000px and browser supports range
          syntax.
        </span>
      </div>
      <div className={styles.supportsRule}>
        <h2>Supports</h2>
        <span>This text is green if browser cares about @supports.</span>
      </div>
    </div>
  );
};
