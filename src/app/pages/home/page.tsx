import styles from './styles.module.scss';

const shortcuts = [
  { key: 'U', description: 'Scroll to top' },
  { key: 'C', description: 'Collapse all sections on current page' },
  { key: 'F', description: 'Search sections' },
];

export const IndexPage = () => {
  return (
    <div className={styles.index}>
      <div className={styles.intro}>
        <p>
          Hello there! This website began as a simple tool for testing layouts in the Ladybird browser during its
          development. It has since expanded to include a variety of HTML, CSS, JavaScript, and Web API tests. You can
          use these tests to check browser support for specific features. Use the navigation bar above to head to test
          pages.
        </p>
        <p>Currently not a single browser supports all features :^)</p>
      </div>
      <div className={styles.shortcuts}>
        <h2>Shortcuts</h2>
        <dl>
          {shortcuts.map(({ key, description }) => (
            <div key={key} className={styles.shortcut}>
              <dt>
                <kbd>{key}</kbd>
                <kbd>{key}</kbd>
              </dt>
              <dd>{description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};
