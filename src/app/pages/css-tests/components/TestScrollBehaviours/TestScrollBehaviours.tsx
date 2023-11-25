import styles from './styles.module.scss';
import { lorem } from '@/utils/utils';
import { Br } from '@/app/pages/css-tests/components/subcomponents/Br/Br';
import flyingCat from '@assets/images/cats/flying-cat.png';
import classNames from 'classnames';

export const TestScrollBehaviours = () => {
  return (
    <div className={styles.scrollBehaviours}>
      <h2>Smooth scroll:</h2>
      <div className={styles.smoothScroll}>
        <a href="#p2" id="p1">
          Go down
        </a>
        <Br n={10} />
        <a href="#p1" id="p2">
          Go up
        </a>
      </div>
      <h2>Scroll snap</h2>
      <div className={styles.scrollSnap}>
        <div>
          <img src={flyingCat} alt="cat image" />
          <img src={flyingCat} alt="cat image" />
          <img src={flyingCat} alt="cat image" />
        </div>
      </div>
      <h2>Nested scrolls</h2>
      <div className={styles.nestedScrolls}>
        <div>
          <div>
            <div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
      <h2>Scroll gutter</h2>
      <div className={styles.scrollGutter}>
        <div>
          <span>
            The space to the right of this text should leave space for the scrollbar, even though there is currently no
            overflow.
          </span>
          <Br n={3} />
          {lorem(5)}
        </div>
      </div>
      <h2>Scroll timeline</h2>
      <div className={styles.scrollTimeline}>
        <div className={styles.scrollTimelineInner}>
          <div className={styles.scrollTimelineContainer}>
            <div className={classNames(styles.scrollContent, styles.view)} />
          </div>
          <div className={styles.scrollTimelineContainer}>
            <div className={classNames(styles.scrollContent, styles.scroll)} />
          </div>
          <div className={classNames(styles.scrollTimelineContainer, styles.rotate)}>
            <div className={classNames(styles.scrollContent)} />
          </div>
        </div>
        <div className={styles.scrollRotate} />
      </div>
    </div>
  );
};
