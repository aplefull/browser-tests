import styles from './styles.module.scss';

export default function TestMediaQueries() {
  return (
    <section className={styles.mediaQueries}>
      <h1>Media queries</h1>
      <div className={styles.rangeSyntax}>
        <h2>Range syntax</h2>
        <span>
          This text will appear green if browser window is 400px &lt; width &lt;= 2000px and browser supports range
          syntax.
        </span>
      </div>
    </section>
  );
}
