import styles from './styles.module.scss';

export default function TestSupportsRule() {
  return (
    <section className={styles.supportsRule}>
      <h1>@supports</h1>
      <p>This text is green if browser cares about @supports</p>
    </section>
  );
}
