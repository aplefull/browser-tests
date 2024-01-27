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
      <p>
        "animation-timeline: scroll()" allows developers to do some ridiculous things. Like changing scroll content
        height depending on the scroll progress 😬. Obviously, the fact that we can do this doesn't mean we should, but
        we might as well try to see what happens. That's exactly what's happening below:
      </p>
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
        <span className={styles.squareText}>
          The square below should appear without any scrollbars, but we can rotate it by scrolling on it using only CSS.
          Kinda cool.
        </span>
        <div className={styles.scrollRotate} />
      </div>
    </div>
  );
};
