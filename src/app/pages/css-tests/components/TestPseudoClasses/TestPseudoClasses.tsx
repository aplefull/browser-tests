import { Iframe } from '@/app/components/Iframe/Iframe';
import { Input, TInputProps } from '@/app/components/Input/Input';
import { Button } from '@/app/components/Button/Button';
import { Container } from '@/app/components/Container/Container';
import { useRef, useState } from 'react';
import styles from './styles.module.scss';
import rootTestStyles from './styles/rootTestStyles.module.scss?raw';
import { RadioButton } from '@/app/components/RadioButton/RadioButton';

type TUncontrolledInputProps = {
  defaultValue?: string;
} & Omit<TInputProps, 'value' | 'onChange'>;

const UncontrolledInput = (props: TUncontrolledInputProps) => {
  const [value, setValue] = useState(props.defaultValue || '');

  return <Input onChange={setValue} {...props} value={value} />;
};

export const TestPseudoClasses = () => {
  const fullscreenElementRef = useRef<HTMLDivElement | null>(null);

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    if (fullscreenElementRef.current) {
      await fullscreenElementRef.current.requestFullscreen();
    }
  };

  const resetTarget = () => {
    window.location.hash = window.crypto.randomUUID();
  };

  const randomHref = window.crypto.randomUUID();

  return (
    <div className={styles.pseudo}>
      <div>
        <h3>::before</h3>
        <div className={styles.before} />
      </div>
      <div>
        <h3>::after</h3>
        <div className={styles.after} />
      </div>
      <div>
        <h3>::first-letter</h3>
        <div className={styles.firstLetter} />
      </div>
      <div>
        <h3>::first-line</h3>
        <div className={styles.firstLine} />
      </div>
      <div>
        <h3>::placeholder</h3>
        <Input className={styles.placeholder} value="" placeholder="This text should be green!" />
      </div>
      <div className={styles.selection}>
        <h3>::selection</h3>
        <span>Select me! I should have a green background.</span>
      </div>
      <div className={styles.active}>
        <h3>:active</h3>
        <span>Text should be green when button is active</span>
        <Button text="Press me!" />
      </div>
      <div className={styles.hover}>
        <h3>:hover</h3>
        <span>Text should be green when button is hovered</span>
        <Button text="Hover me!" />
      </div>
      <Container className={styles.empty}>
        <h3>:empty</h3>
        <p>First rectangle should be green, second should be red</p>
        <Container direction="row">
          <span></span>
          <span> </span>
        </Container>
      </Container>
      <div className={styles.checked}>
        <h3>:checked</h3>
        <input type="checkbox" id="checkbox-checked" defaultChecked />
        <label htmlFor="checkbox-checked" />
      </div>
      <div className={styles.disabled}>
        <h3>:disabled</h3>
        <Input value="" placeholder="This text should be green" disabled />
        <span />
      </div>
      <div className={styles.enabled}>
        <h3>:enabled</h3>
        <Input value="" placeholder="This text should be green" />
        <span />
      </div>
      <div className={styles.focus}>
        <h3>:focus</h3>
        <Input value="This text should be green when input is focused" />
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
            <RadioButton checked={false} />
            <RadioButton checked={true} />
            <RadioButton checked={false} />
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
      <Container align="start" ref={fullscreenElementRef} className={styles.fullscreen}>
        <h3>:fullscreen</h3>
        <span className={styles.text}>This text should be green when in fullscreen mode!</span>
        <Button text="Toggle fullscreen" onClick={toggleFullscreen} />
      </Container>
      <h3>:indeterminate</h3>
      <div className={styles.indeterminate}>
        You should see green outlines until you choose something :)
        <form>
          <input type="radio" name="radio" />
          <input type="radio" name="radio" />
          <input type="radio" name="radio" />
        </form>
      </div>
      <div className={styles.valid}>
        <h3>:valid</h3>
        Input text should be green if it contains the word "hello".
        <UncontrolledInput defaultValue="Hello!" pattern=".*\b[Hh]ello\b.*" required />
      </div>
      <div className={styles.invalid}>
        <h3>:invalid</h3>
        Input text should be green if it doesn't contain the word "hello".
        <UncontrolledInput defaultValue="Hey!" pattern=".*\b[Hh]ello\b.*" required />
      </div>
      <div className={styles.langEn}>
        <h3>:lang(en)</h3>
        <p lang="ru-BY">
          Out of all of this text, only <span lang="en-US">this</span> and <span lang="en-Us">this</span> words should
          be green.
        </p>
      </div>
      <Container className={styles.dirLtr}>
        <h3>:dir(ltr)</h3>
        <span dir="ltr">This text should be green</span>
        <span dir="rtl">This text should be red</span>
      </Container>
      <Container gap={10} className={styles.link}>
        <h3>:link</h3>
        <span>
          Link should be green until you click it, opens in a new tab and leads to 404 page. You get a new link every
          time you refresh the page.
        </span>
        <a href={randomHref} target="_blank">
          Link
        </a>
      </Container>
      <Container gap={10} className={styles.visited}>
        <h3>:visited</h3>
        <span>
          Same here, but the opposite - link should be green only after you visit it. It leads to the same place as the
          link above, so they should change color at the same time!
        </span>
        <a href={randomHref} target="_blank">
          Link
        </a>
      </Container>
      <Container align="start" gap={10} className={styles.target}>
        <h3>:target</h3>
        <span>Link should be green after you click it.</span>
        <a href="#target" id="target">
          Click me
        </a>
        <Button text="Reset" onClick={resetTarget} />
      </Container>
      <h3>:optional</h3>
      <div className={styles.optional}>
        <input type="text" placeholder="You shouldn't see this input" />
        <span />
      </div>
      <h3>:required</h3>
      <div className={styles.required}>
        <input type="text" required placeholder="You shouldn't see this input" />
        <span />
      </div>
      <div className={styles.inRange}>
        <h3>:in-range</h3>
        <input type="number" min="0" max="10" />
        <span />
      </div>
      <div className={styles.outOfRange}>
        <h3>:out-of-range</h3>
        <input type="number" min="0" max="10" defaultValue="11" placeholder="You shouldn't see this input" />
        <span />
      </div>
      <h3>:read-only</h3>
      <div className={styles.readOnly}>
        <input type="text" readOnly placeholder="You shouldn't see this input" />
        <span />
      </div>
      <h3>:read-write</h3>
      <div className={styles.readWrite}>
        <input type="text" placeholder="You shouldn't see this input" />
        <span />
      </div>
      <h3>:root</h3>
      <div className={styles.root}>
        <Iframe className={styles.iframe} addDefaultStyles>
          <div />
          <style>{rootTestStyles}</style>
        </Iframe>
      </div>
      {/* TODO */}
      <h3>:scope</h3>
      <div className={styles.scope}>
        <Iframe className={styles.iframe}>
          <div>This text should be green</div>
          <div>And this should be white!</div>
          <style>
            {`
              :scope, body {
                font-family: sans-serif;
                margin: 0;
                padding: 0;
              }
            
              :scope > body > div:first-of-type {
                color: green;
              }
              
              div {
                color: white;
              }
            `}
          </style>
        </Iframe>
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
  );
};
