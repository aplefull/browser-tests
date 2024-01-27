import styles from './styles.module.scss';
import { testQMath } from '@/utils/math';

export const IndexPage = () => {
  // TODO remove
  testQMath();

  return (
    <div className={styles.index}>
      <p className={styles.mainText}>
        Heeey :) Welcome to the whatever this website is! <br />
        It's made to test browsers for their support of different features. <br />
        Currently not a single browser supports all of them :^) <br />
        (I think it says a lot about <span>society</span> how web is a big mess)
      </p>
      <div className={styles.notes}>
        <p>You can double press "U" to scroll to the top on any page</p>
      </div>
    </div>
  );
};
