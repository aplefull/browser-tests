import styles from './styles.module.scss';

export const IndexPage = () => {
  return (
    <div className={styles.index}>
      <p className={styles.mainText}>
        Hello there! This website began as a simple tool for testing layouts in the Ladybird browser during its
        development. It has since expanded to include a variety of HTML, CSS, JavaScript, and Web API tests. You can use
        these tests to check browser support for specific features. Use the navigation bar above to head to test pages.
        <br />
        <br />
        Currently not a single browser supports all features :^)
      </p>
      <p>There are some shortcuts available:</p>
      <div className={styles.notes}>
        <p>Double press "U" to scroll to the top on any page</p>
        <p>Double press "C" to close all sections on current page</p>
        <p>Double press "F" to open section search</p>
      </div>
    </div>
  );
};
