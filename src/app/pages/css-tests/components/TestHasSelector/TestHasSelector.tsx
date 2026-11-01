import { SelectorChecks, TSelectorCase } from '@/app/components/SelectorChecks/SelectorChecks';
import styles from './styles.module.scss';

const input = (root: HTMLElement) => root.querySelector('input') as HTMLInputElement;

const cases: TSelectorCase[] = [
  {
    selector: ':has(> .marker)',
    className: styles.child,
    fixture: (
      <div className={styles.target}>
        <span className={styles.marker} />
      </div>
    ),
  },
  {
    selector: ':has(span)',
    className: styles.descendant,
    fixture: (
      <div className={styles.target}>
        <div>
          <span />
        </div>
      </div>
    ),
  },
  {
    selector: ':has(*)',
    className: styles.any,
    fixture: (
      <div className={styles.target}>
        <span />
      </div>
    ),
  },
  {
    selector: ':not(:has(*))',
    className: styles.empty,
    fixture: <div className={styles.target} />,
  },
  {
    selector: ':has(+ .marker)',
    className: styles.nextSibling,
    fixture: (
      <>
        <div className={styles.target} />
        <span className={styles.marker} />
      </>
    ),
  },
  {
    selector: ':has(~ .marker)',
    className: styles.subsequentSibling,
    fixture: (
      <>
        <div className={styles.target} />
        <span />
        <span className={styles.marker} />
      </>
    ),
  },
  {
    selector: ':has(> div):has(pre)',
    className: styles.chained,
    fixture: (
      <div className={styles.target}>
        <div>
          <pre />
        </div>
      </div>
    ),
  },
  {
    selector: ':has(:is(em, strong))',
    className: styles.is,
    fixture: (
      <div className={styles.target}>
        <strong />
      </div>
    ),
  },
  {
    selector: ':has(p:lang(de))',
    className: styles.lang,
    fixture: (
      <div className={styles.target}>
        <p lang="de" />
      </div>
    ),
  },
  {
    selector: '.scope:has(.marker) .target',
    className: styles.ancestor,
    fixture: (
      <div className={styles.scope}>
        <span className={styles.marker} />
        <div className={styles.target} />
      </div>
    ),
  },
  {
    selector: ':has(:has(*)) is invalid',
    className: styles.nested,
    fixture: (
      <div className={styles.target}>
        <div>
          <span />
        </div>
      </div>
    ),
  },
  {
    selector: ':has(input:checked)',
    className: styles.checked,
    fixture: (
      <div className={styles.target}>
        <input type="checkbox" tabIndex={-1} />
      </div>
    ),
    matches: false,
    steps: [
      { apply: (root) => (input(root).checked = true), matches: true },
      { apply: (root) => (input(root).checked = false), matches: false },
    ],
  },
  {
    selector: ':has(input:focus)',
    className: styles.focus,
    fixture: (
      <div className={styles.target}>
        <input type="text" tabIndex={-1} />
      </div>
    ),
    matches: false,
    steps: [
      { apply: (root) => input(root).focus({ preventScroll: true }), matches: true },
      { apply: (root) => input(root).blur(), matches: false },
    ],
  },
  {
    selector: ':has(input:not(:placeholder-shown))',
    className: styles.placeholder,
    fixture: (
      <div className={styles.target}>
        <input type="text" placeholder="a" tabIndex={-1} />
      </div>
    ),
    matches: false,
    steps: [
      { apply: (root) => (input(root).value = 'a'), matches: true },
      { apply: (root) => (input(root).value = ''), matches: false },
    ],
  },
  {
    selector: ':has(.on) after class change',
    className: styles.classChange,
    fixture: (
      <div className={styles.target}>
        <span />
      </div>
    ),
    matches: false,
    steps: [
      { apply: (_, target) => target?.firstElementChild?.classList.add(styles.on), matches: true },
      { apply: (_, target) => target?.firstElementChild?.classList.remove(styles.on), matches: false },
      { apply: (_, target) => target?.firstElementChild?.classList.add(styles.on), matches: true },
    ],
  },
  {
    selector: ':has(b) after insertion',
    className: styles.insertion,
    fixture: <div className={styles.target} />,
    matches: false,
    steps: [
      { apply: (_, target) => target?.append(document.createElement('b')), matches: true },
      { apply: (_, target) => target?.querySelector('b')?.remove(), matches: false },
      { apply: (_, target) => target?.append(document.createElement('b')), matches: true },
    ],
  },
];

export const TestHasSelector = () => {
  const isSupported = CSS.supports('selector(:has(*))');

  return (
    <SelectorChecks cases={cases} targetClassName={styles.target}>
      <span>
        Supported: <span className={isSupported ? styles.success : styles.error}>{isSupported ? 'Yes' : 'No'}</span>
      </span>
    </SelectorChecks>
  );
};
