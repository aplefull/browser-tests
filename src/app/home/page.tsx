import styles from './styles.module.scss';

export const IndexPage = () => {
  return (
    <main className={styles.main}>
      <p className={styles.mainText}>
        Heeey :) Welcome to the whatever this website is! <br />
        It's made to test browsers for their support of different features. <br />
        Currently not a single browser supports all of them :^) <br />
        (I think it says a lot about <span>society</span> how web is a big mess)
      </p>
    </main>
  );
};
