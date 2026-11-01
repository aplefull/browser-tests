import catsVideo from '@assets/videos/cats_vp8.webm';
import { useEffect, useMemo, useRef } from 'react';
import { Button } from '@/app/components/Button/Button';
import { SelectorChecks, TSelectorCase } from '@/app/components/SelectorChecks/SelectorChecks';
import styles from './styles.module.scss';

const HIGHLIGHT_NAME = 'pseudo-elements-check';

const subtitles = `WEBVTT

00:00:00.000 --> 00:00:30.000
One <00:00:02.000><c>two</c> <00:00:04.000><c>three</c> <00:00:06.000><c>four</c>
`;

let transitionPseudos: Promise<string[]> | null = null;

const getTransitionPseudos = () => {
  transitionPseudos ??= (async () => {
    const root = document.documentElement;
    root.classList.add(styles.checking);

    try {
      const transition = document.startViewTransition(() => {});
      await transition.ready;

      const names = document.getAnimations().map((animation) => {
        return (animation.effect as KeyframeEffect | null)?.pseudoElement ?? '';
      });

      await transition.finished;
      return names;
    } finally {
      root.classList.remove(styles.checking);
    }
  })().catch((error) => {
    transitionPseudos = null;
    throw error;
  });

  return transitionPseudos;
};

const hasTransitionPseudo = (prefix: string) => async () => {
  const names = await getTransitionPseudos();
  return names.some((name) => name === prefix || name.startsWith(`${prefix}(`));
};

const attachShadow = (host: Element | null, css: string, html = '') => {
  if (!host) return;

  const shadow = host.attachShadow({ mode: 'open' });
  shadow.innerHTML = `<style>${css}</style>${html}`;
};

const cases: TSelectorCase[] = [
  {
    selector: '::before',
    supports: '::before',
    className: styles.before,
    fixture: <span className={styles.target} />,
    pseudo: '::before',
  },
  {
    selector: '::after',
    supports: '::after',
    className: styles.after,
    fixture: <span className={styles.target} />,
    pseudo: '::after',
  },
  {
    selector: '::marker',
    supports: '::marker',
    className: styles.marker,
    fixture: (
      <ul>
        <li className={styles.target} />
      </ul>
    ),
    pseudo: '::marker',
  },
  {
    selector: '::part()',
    supports: '::part(label)',
    className: styles.part,
    fixture: <div className={styles.host} />,
    setup: (root) => attachShadow(root.firstElementChild, '', '<span part="label"></span>'),
    target: (root) => root.firstElementChild?.shadowRoot?.querySelector('span'),
  },
  {
    selector: '::slotted()',
    supports: '::slotted(b)',
    className: styles.slotted,
    fixture: (
      <div>
        <b className={styles.target} />
      </div>
    ),
    setup: (root) =>
      attachShadow(root.firstElementChild, '::slotted(b) { color: var(--color-green); }', '<slot></slot>'),
  },
  {
    selector: '::details-content',
    supports: '::details-content',
    className: styles.detailsContent,
    fixture: (
      <details open>
        <summary />
        <b className={styles.target} />
      </details>
    ),
  },
  {
    selector: '::view-transition',
    supports: '::view-transition',
    run: hasTransitionPseudo('::view-transition'),
  },
  {
    selector: '::view-transition-group()',
    supports: '::view-transition-group(*)',
    run: hasTransitionPseudo('::view-transition-group'),
  },
  {
    selector: '::view-transition-image-pair()',
    supports: '::view-transition-image-pair(*)',
    run: hasTransitionPseudo('::view-transition-image-pair'),
  },
  {
    selector: '::view-transition-old()',
    supports: '::view-transition-old(*)',
    run: hasTransitionPseudo('::view-transition-old'),
  },
  {
    selector: '::view-transition-new()',
    supports: '::view-transition-new(*)',
    run: hasTransitionPseudo('::view-transition-new'),
  },
  { selector: '::first-letter', supports: '::first-letter', manual: true },
  { selector: '::first-line', supports: '::first-line', manual: true },
  { selector: '::placeholder', supports: '::placeholder', manual: true },
  { selector: '::file-selector-button', supports: '::file-selector-button', manual: true },
  { selector: '::selection', supports: '::selection', manual: true },
  { selector: '::highlight()', supports: '::highlight(x)', manual: true },
  { selector: '::target-text', supports: '::target-text', manual: true },
  { selector: '::search-text', supports: '::search-text', manual: true },
  { selector: '::spelling-error', supports: '::spelling-error', manual: true },
  { selector: '::grammar-error', supports: '::grammar-error', manual: true },
  { selector: '::backdrop', supports: '::backdrop', manual: true },
  { selector: '::cue', supports: '::cue', manual: true },
  { selector: '::picker()', supports: '::picker(select)', manual: true },
  { selector: '::picker-icon', supports: '::picker-icon', manual: true },
  { selector: '::checkmark', supports: '::checkmark', manual: true },
  { selector: '::scroll-marker-group', supports: '::scroll-marker-group', manual: true },
  { selector: '::scroll-marker', supports: '::scroll-marker', manual: true },
  { selector: '::scroll-button()', supports: '::scroll-button(*)', manual: true },
  { selector: '::column', supports: '::column', manual: true },
];

export const TestPseudoElements = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);

  const subtitlesUrl = useMemo(() => URL.createObjectURL(new Blob([subtitles], { type: 'text/vtt' })), []);

  useEffect(() => {
    return () => URL.revokeObjectURL(subtitlesUrl);
  }, [subtitlesUrl]);

  useEffect(() => {
    const text = highlightRef.current?.firstChild;
    if (!text || !('highlights' in CSS)) return;

    const range = new Range();
    range.selectNodeContents(text);
    CSS.highlights.set(HIGHLIGHT_NAME, new Highlight(range));

    return () => {
      CSS.highlights.delete(HIGHLIGHT_NAME);
    };
  }, []);

  return (
    <div className={styles.pseudoElements}>
      <SelectorChecks cases={cases} targetClassName={styles.target} />
      <h2>Manual</h2>
      <div className={styles.demo}>
        <h3>::first-letter, ::first-line</h3>
        <p className={styles.firstLetter}>Green first letter</p>
        <p className={styles.firstLine}>
          Green first line
          <br />
          Plain second line
        </p>
      </div>
      <div className={styles.demo}>
        <h3>::placeholder, ::file-selector-button</h3>
        <div className={styles.row}>
          <input className={styles.placeholder} placeholder="Green placeholder" />
          <input className={styles.fileSelectorButton} type="file" />
        </div>
      </div>
      <div className={styles.demo}>
        <h3>::selection, ::highlight()</h3>
        <span className={styles.selection}>Select me</span>
        <span ref={highlightRef} className={styles.highlight}>
          Highlighted by script
        </span>
      </div>
      <div className={styles.demo}>
        <h3>::target-text, ::search-text</h3>
        <a className={styles.link} href="#:~:text=Highlighted%20by%20link">
          Highlight text below
        </a>
        <span>Highlighted by link</span>
        <span>Find &quot;needle&quot; with Ctrl+F: needle</span>
      </div>
      <div className={styles.demo}>
        <h3>::spelling-error, ::grammar-error</h3>
        <textarea className={styles.spelling} spellCheck defaultValue="Thiss sentense have erors." />
      </div>
      <div className={styles.demo}>
        <h3>::backdrop</h3>
        <Button text="Open dialog" onClick={() => dialogRef.current?.showModal()} />
        <dialog ref={dialogRef} className={styles.dialog}>
          <Button text="Close" onClick={() => dialogRef.current?.close()} />
        </dialog>
      </div>
      <div className={styles.demo}>
        <h3>::cue</h3>
        <span>Subtitles green, upcoming words dimmed</span>
        <video className={styles.cue} src={catsVideo} controls muted playsInline preload="metadata">
          <track kind="subtitles" src={subtitlesUrl} srcLang="en" label="Test" default />
        </video>
      </div>
      <div className={styles.demo}>
        <h3>::picker(), ::picker-icon, ::checkmark</h3>
        <select className={styles.customSelect} defaultValue="one">
          <option value="one">One</option>
          <option value="two">Two</option>
        </select>
      </div>
      <div className={styles.demo}>
        <h3>::scroll-marker-group, ::scroll-marker, ::scroll-button()</h3>
        <div className={styles.carouselWrapper}>
          <div className={styles.carousel}>
            <div>1</div>
            <div>2</div>
            <div>3</div>
          </div>
        </div>
      </div>
      <div className={styles.demo}>
        <h3>::column</h3>
        <div>
          <div className={styles.columns}>
            <p>1</p>
            <p>2</p>
            <p>3</p>
          </div>
        </div>
      </div>
    </div>
  );
};
