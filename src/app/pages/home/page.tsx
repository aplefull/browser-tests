import styles from './styles.module.scss';

export const IndexPage = () => {
  return (
    <div className={styles.index}>
      <p className={styles.mainText}>
        Heeey :) Welcome to the whatever this website is! <br />
        It's made to test browsers for their support of different features. <br />
        Currently not a single browser supports all of them :^) <br />
        (I think it says a lot about <span>society</span> how web is a big mess)
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
