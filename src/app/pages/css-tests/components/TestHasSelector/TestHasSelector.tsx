import styles from './styles.module.scss';

export const TestHasSelector = () => {
  return (
    <div className={styles.hasSelector}>
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
        <label>
          <input type="checkbox" defaultChecked={true} />
        </label>
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
  );
};
