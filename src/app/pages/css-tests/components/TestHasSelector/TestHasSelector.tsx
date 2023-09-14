import styles from './styles.module.scss';
import { Section } from '@/app/components/Section/Section';

export const TestHasSelector = () => {
  return (
    <Section className={styles.hasSelector} title=":has selector">
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
    </Section>
  );
};
