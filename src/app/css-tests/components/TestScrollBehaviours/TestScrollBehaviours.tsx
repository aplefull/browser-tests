import styles from './styles.module.scss';
import { lorem } from '@/utils/utils';
import { Br } from '@/app/css-tests/components/subcomponents/Br/Br';
import flyingCat from '@assets/images/cats/flying-cat.png';
import { Section } from '@/app/components/Section/Section';

export const TestScrollBehaviours = () => {
  return (
    <Section className={styles.scrollBehaviours} title="Scroll Behaviours">
      <div>
        <div className={styles.smoothScroll}>
          <h2>Smooth scroll:</h2>
          <a href="#p2" id="p1">
            Go down
          </a>
          <Br n={10} />
          <a href="#p1" id="p2">
            Go up
          </a>
        </div>
        <div className={styles.scrollSnap}>
          <h2>Scroll snap</h2>
          <div>
            <img src={flyingCat} alt="cat image" />
            <img src={flyingCat} alt="cat image" />
            <img src={flyingCat} alt="cat image" />
          </div>
        </div>
        <div className={styles.nestedScrolls}>
          <h2>Nested scrolls</h2>
          <div>
            <div>
              <div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.scrollGutter}>
          <h2>Scroll gutter</h2>
          <div>
            <span>
              The space to the right of this text should leave space for the scrollbar, even though there is currently
              no overflow.
            </span>
            <Br n={3} />
            {lorem(5)}
          </div>
        </div>
      </div>
    </Section>
  );
};
