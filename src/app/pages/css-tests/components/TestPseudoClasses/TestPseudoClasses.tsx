import { Section } from '@/app/components/Section/Section';
import styles from './styles.module.scss';

export const TestPseudoClasses = () => {
  return (
    <Section title="Pseudo-classes">
      <div className={styles.pseudo}>
        <h3>::before</h3>
        <div className={styles.before} />
        <h3>::after</h3>
        <div className={styles.after} />
        <h3>::first-letter</h3>
        <div className={styles.firstLetter} />
        <h3>::first-line</h3>
        <div className={styles.firstLine} />
        <h3>::placeholder</h3>
        <div className={styles.placeholder}>
          <input type="text" placeholder="Placeholder" />
        </div>
        <h3>::selection</h3>
        <div className={styles.selection}>
          <span>Select me</span>
        </div>
        <h3>:active</h3>
        <div className={styles.active}>
          <span>Text is green when button is active</span>
          <button className={styles.active}>Hello!</button>
        </div>
        <h3>:hover</h3>
        <div className={styles.hover}>
          <span>Text is green when button is hovered</span>
          <button className={styles.hover}>Hello!</button>
        </div>
        <h3>:empty</h3>
        <div className={styles.empty}>
          <p>First span should be green, second should be red</p>
          <span></span>
          <span> </span>
        </div>
        <h3>:checked</h3>
        <h3>:disabled</h3>
        <h3>:enabled</h3>
        <h3>:focus</h3>
        <h3>:default</h3>
        <h3>:dir(ltr)</h3>
        <h3>:first</h3>
        <h3>:first-child</h3>
        <h3>:first-of-type</h3>
        <h3>:fullscreen</h3>
        <h3>:in-range</h3>
        <h3>:indeterminate</h3>
        <h3>:invalid</h3>
        <h3>:lang(en)</h3>
        <h3>:last-child</h3>
        <h3>:last-of-type</h3>
        <h3>:left</h3>
        <h3>:link</h3>
        <h3>:not(selector)</h3>
        <h3>:nth-child(2)</h3>
        <h3>:nth-last-child(2)</h3>
        <h3>:nth-last-of-type(2)</h3>
        <h3>:nth-of-type(2)</h3>
        <h3>:only-child</h3>
        <h3>:only-of-type</h3>
        <h3>:optional</h3>
        <h3>:out-of-range</h3>
        <h3>:read-only</h3>
        <h3>:read-write</h3>
        <h3>:required</h3>
        <h3>:right</h3>
        <h3>:root</h3>
        <h3>:scope</h3>
        <h3>:target</h3>
        <h3>:valid</h3>
        <h3>:visited</h3>
      </div>
    </Section>
  );
};
