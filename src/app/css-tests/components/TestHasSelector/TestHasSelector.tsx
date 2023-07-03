import styles from './styles.module.scss';

export default function TestHasSelector() {
  return (
    <section className={styles.hasSelector}>
      <h1>:has selector</h1>
      <div>
        <div>
          <pre className={styles.iHaveAClass} />
        </div>
        <div>
          <span></span>
        </div>
        <div>
          <div></div>
        </div>
        <div></div>
        <div>
          <input type="checkbox" defaultChecked={true} />
        </div>
        <div>
          <div>
            <pre></pre>
          </div>
        </div>
        <div>
          <input type="text" placeholder="Focus me" />
        </div>
        <div>
          <input type="text" placeholder="Type in something" />
        </div>
        <div>
          <p lang="en" />
        </div>
      </div>
    </section>
  );
}
