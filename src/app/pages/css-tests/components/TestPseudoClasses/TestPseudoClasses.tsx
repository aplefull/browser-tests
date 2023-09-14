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
          <div>Placeholder should be green</div>
          <input type="text" placeholder="Placeholder" />
        </div>
        <h3>::selection</h3>
        <div className={styles.selection}>
          <span>Select me! I should have green background.</span>
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
        <div className={styles.checked}>
          <input type="checkbox" id="checkbox-checked" defaultChecked />
          <label htmlFor="checkbox-checked" />
        </div>
        <h3>:disabled</h3>
        <div className={styles.disabled}>
          <input type="text" disabled />
          <span />
        </div>
        <h3>:enabled</h3>
        <div className={styles.enabled}>
          <input type="text" />
          <span />
        </div>
        <h3>:focus</h3>
        <div className={styles.focus}>
          <input type="text" placeholder="Focus me!" />
          <span />
        </div>
        <h3>:default</h3>
        <div className={styles.default}>
          <span>First checkbox and radio should have a green outline.</span>
          <form action="">
            <div className={styles.checks}>
              <input type="checkbox" name="checkbox-default" defaultChecked />
              <input type="checkbox" name="checkbox-default" />
              <input type="checkbox" name="checkbox-default" />
            </div>
            <div className={styles.radios}>
              <input type="radio" name="radio-default" defaultChecked />
              <input type="radio" name="radio-default" />
              <input type="radio" name="radio-default" />
            </div>
          </form>
        </div>
        <h3>:first-child</h3>
        <div className={styles.firstChild}>
          <span>You aren't supposed to see this text</span>
          <span>Pass</span>
        </div>
        <h3>:first-of-type</h3>
        <div className={styles.firstOfType}>
          <span>You aren't supposed to see this text</span>
          <span>Pass</span>
        </div>
        <h3>:last-of-type</h3>
        <div className={styles.lastOfType}>
          <span>Pass</span>
          <span>You aren't supposed to see this text</span>
        </div>
        <h3>:last-child</h3>
        <div className={styles.lastChild}>
          <span>Pass</span>
          <span>You aren't supposed to see this text</span>
        </div>
        <h3>:nth-child(2)</h3>
        <div className={styles.nthChild2}>
          <span>Pass</span>
          <span>You aren't supposed to see this text</span>
        </div>
        <h3>:nth-last-child(2)</h3>
        <div className={styles.nthLastChild2}>
          <span>You aren't supposed to see this text</span>
          <span>Pass</span>
        </div>
        <h3>:nth-last-of-type(2)</h3>
        <div className={styles.nthLastOfType2}>
          <span>You aren't supposed to see this text</span>
          <span>Pass</span>
        </div>
        <h3>:nth-of-type(2)</h3>
        <div className={styles.nthOfType2}>
          <span>Pass</span>
          <span>You aren't supposed to see this text</span>
        </div>
        <h3>:not(selector)</h3>
        <div className={styles.not}>
          <span>Pass</span>
          <span>You aren't supposed to see this text</span>
        </div>
        <h3>:only-child</h3>
        <div className={styles.onlyChild}>
          <div>
            <span>Pass</span>
          </div>
          <div>
            <span>You are not supposed to see this text</span>
            <span />
          </div>
        </div>
        <h3>:only-of-type</h3>
        <div className={styles.onlyOfType}>
          <span>Pass</span>
          <div>You are not supposed to see this text</div>
          <div />
        </div>
        <h3>:fullscreen</h3>
        <h3>:in-range</h3>
        <div className={styles.inRange}>
          <input type="number" min="0" max="10" />
          <span />
        </div>
        <h3>:indeterminate</h3>
        <div className={styles.indeterminate}>
          You should see green outlines :)
          <form>
            <input type="radio" name="radio" />
            <input type="radio" name="radio" />
            <input type="radio" name="radio" />
          </form>
        </div>
        <h3>:valid</h3>
        <div className={styles.valid}>
          This input will have a green outline if it contains the word "hello".
          <input type="text" pattern="\b[Hh]ello\b" required />
        </div>
        <h3>:invalid</h3>
        <div className={styles.invalid}>
          This input will have a green outline if it does not contain the word "hello".
          <input type="text" pattern="\b[Hh]ello\b" required />
        </div>
        <h3>:lang(en)</h3>
        <div className={styles.langEn}>
          <p lang="ru-BY">
            Out of all of this text, only <span lang="en-US">this</span> and <span lang="en-Us">this</span> words should
            be green.
          </p>
        </div>
        <h3>:dir(ltr)</h3>
        <div className={styles.dirLtr}>
          <span dir="ltr">This text should be green</span>
          <span dir="rtl">This text should be red</span>
        </div>
        <h3>:link</h3>
        <div className={styles.link}>
          <a href="#" target="_blank">
            Link
          </a>
        </div>
        <h3>:visited</h3>
        <div className={styles.visited}>
          <a href="#" target="_blank">
            Link
          </a>
        </div>
        <h3>:optional</h3>
        <div className={styles.optional}>
          <input type="text" />
          <span />
        </div>
        <h3>:required</h3>
        <div className={styles.required}>
          <input type="text" required />
          <span />
        </div>
        <h3>:out-of-range</h3>
        <div className={styles.outOfRange}>
          <input type="number" min="0" max="10" defaultValue="11" />
          <span />
        </div>
        <h3>:read-only</h3>
        <div className={styles.readOnly}>
          <input type="text" readOnly />
          <span />
        </div>
        <h3>:read-write</h3>
        <div className={styles.readWrite}>
          <input type="text" />
          <span />
        </div>
        <div className={styles.readWrite}></div>
        <h3>:root</h3>
        <div className={styles.root}></div>
        <h3>:scope</h3>
        <div className={styles.scope}></div>
        <h3>:target</h3>
        <div className={styles.target}>
          <a href="#target" id="target">
            Click me
          </a>
        </div>
        <h3>:first</h3>
        <div>Check print dialog!</div>
        <h3>:left</h3>
        <div>
          Check print dialog!
          <br />
          Every odd page will have left margin.
        </div>
        <h3>:right</h3>
        <div>
          Check print dialog!
          <br />
          Every even page will have right margin.
        </div>
      </div>
    </Section>
  );
};
