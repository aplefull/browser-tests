import video from '@assets/videos/1x1.webm';
import catsVideo from '@assets/videos/cats_vp8.webm';
import classNames from 'classnames';
import { useRef } from 'react';
import { Button } from '@/app/components/Button/Button';
import { SelectorChecks, TSelectorCase } from '@/app/components/SelectorChecks/SelectorChecks';
import styles from './styles.module.scss';

const unvisitedHref = `/${crypto.randomUUID()}`;

let elementCount = 0;
let viewTransition: ViewTransition | null = null;
let savedLocation: { url: string; state: unknown } | null = null;

const uniqueName = () => `pseudo-check-${Date.now()}-${elementCount++}`;

const createTarget = (tagName: string) => {
  const element = document.createElement(tagName);
  element.className = styles.target;
  return element;
};

const input = (root: HTMLElement) => root.querySelector('input') as HTMLInputElement;
const media = (root: HTMLElement) => root.querySelector('video') as HTMLVideoElement;

const attachShadow = (host: Element | null, css: string, html = '') => {
  if (!host) return;

  const shadow = host.attachShadow({ mode: 'open' });
  shadow.innerHTML = `<style>${css}</style>${html}`;
};

const waitFor = (element: HTMLElement, event: string) => {
  return new Promise((resolve) => element.addEventListener(event, resolve, { once: true }));
};

const loaded = (element: HTMLVideoElement) => {
  return element.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA ? undefined : waitFor(element, 'loadeddata');
};

const play = async (root: HTMLElement) => {
  await loaded(media(root));
  await media(root).play();
};

const startViewTransition = (options: ViewTransitionUpdateCallback | StartViewTransitionOptions) => {
  viewTransition = document.startViewTransition(options);
  viewTransition.ready.catch(() => {});
};

class StateElement extends HTMLElement {
  internals = this.attachInternals();
}

const fixtureVideo = <video className={styles.target} src={video} muted playsInline preload="auto" />;

const cases: TSelectorCase[] = [
  {
    selector: ':root',
    supports: ':root',
    className: styles.root,
    fixture: <span className={styles.target} />,
  },
  {
    selector: ':empty',
    supports: ':empty',
    className: styles.empty,
    fixture: <span className={styles.target} />,
    steps: [
      { apply: (_, target) => target?.append('a'), matches: false },
      { apply: (_, target) => target?.replaceChildren(), matches: true },
    ],
  },
  {
    selector: ':first-child',
    supports: ':first-child',
    className: styles.firstChild,
    fixture: (
      <>
        <span className={styles.target} />
        <span />
      </>
    ),
  },
  {
    selector: ':last-child',
    supports: ':last-child',
    className: styles.lastChild,
    fixture: (
      <>
        <span />
        <span className={styles.target} />
      </>
    ),
  },
  {
    selector: ':only-child',
    supports: ':only-child',
    className: styles.onlyChild,
    fixture: <span className={styles.target} />,
    steps: [{ apply: (root) => root.append(document.createElement('span')), matches: false }],
  },
  {
    selector: ':nth-child(2)',
    supports: ':nth-child(2)',
    className: styles.nthChild,
    fixture: (
      <>
        <span />
        <span className={styles.target} />
        <span />
      </>
    ),
  },
  {
    selector: ':nth-last-child(2)',
    supports: ':nth-last-child(2)',
    className: styles.nthLastChild,
    fixture: (
      <>
        <span />
        <span className={styles.target} />
        <span />
      </>
    ),
  },
  {
    selector: ':nth-child(2 of .item)',
    supports: ':nth-child(2 of .item)',
    className: styles.nthChildOf,
    fixture: (
      <>
        <span className={styles.item} />
        <span />
        <span className={classNames(styles.target, styles.item)} />
      </>
    ),
  },
  {
    selector: ':first-of-type',
    supports: ':first-of-type',
    className: styles.firstOfType,
    fixture: (
      <>
        <b />
        <span className={styles.target} />
        <span />
      </>
    ),
  },
  {
    selector: ':last-of-type',
    supports: ':last-of-type',
    className: styles.lastOfType,
    fixture: (
      <>
        <span />
        <span className={styles.target} />
        <b />
      </>
    ),
  },
  {
    selector: ':only-of-type',
    supports: ':only-of-type',
    className: styles.onlyOfType,
    fixture: (
      <>
        <b />
        <span className={styles.target} />
        <b />
      </>
    ),
  },
  {
    selector: ':nth-of-type(2)',
    supports: ':nth-of-type(2)',
    className: styles.nthOfType,
    fixture: (
      <>
        <span />
        <b />
        <span className={styles.target} />
      </>
    ),
  },
  {
    selector: ':nth-last-of-type(2)',
    supports: ':nth-last-of-type(2)',
    className: styles.nthLastOfType,
    fixture: (
      <>
        <span className={styles.target} />
        <b />
        <span />
      </>
    ),
  },
  {
    selector: ':not(.a, .b)',
    supports: ':not(.a, .b)',
    className: styles.not,
    fixture: <span className={styles.target} />,
  },
  {
    selector: ':is(.a, .b)',
    supports: ':is(.a, .b)',
    className: styles.is,
    fixture: <span className={styles.target} />,
  },
  {
    selector: ':where() zero specificity',
    supports: ':where(.a)',
    className: styles.where,
    fixture: <span className={styles.target} />,
  },
  {
    selector: ':enabled',
    supports: ':enabled',
    className: styles.enabled,
    fixture: <input className={styles.target} />,
    steps: [{ apply: (root) => (input(root).disabled = true), matches: false }],
  },
  {
    selector: ':disabled',
    supports: ':disabled',
    className: styles.disabled,
    fixture: <input className={styles.target} disabled />,
    steps: [{ apply: (root) => (input(root).disabled = false), matches: false }],
  },
  {
    selector: ':read-only',
    supports: ':read-only',
    className: styles.readOnly,
    fixture: <input className={styles.target} readOnly />,
    steps: [{ apply: (root) => (input(root).readOnly = false), matches: false }],
  },
  {
    selector: ':read-write',
    supports: ':read-write',
    className: styles.readWrite,
    fixture: <input className={styles.target} />,
    steps: [{ apply: (root) => (input(root).readOnly = true), matches: false }],
  },
  {
    selector: ':placeholder-shown',
    supports: ':placeholder-shown',
    className: styles.placeholderShown,
    fixture: <input className={styles.target} placeholder="a" />,
    steps: [{ apply: (root) => (input(root).value = 'a'), matches: false }],
  },
  {
    selector: ':default',
    supports: ':default',
    className: styles.defaultState,
    fixture: <input type="checkbox" className={styles.target} defaultChecked />,
    steps: [{ apply: (root) => (input(root).checked = false), matches: true }],
  },
  {
    selector: ':checked',
    supports: ':checked',
    className: styles.checked,
    fixture: <input type="checkbox" className={styles.target} />,
    matches: false,
    steps: [
      { apply: (root) => (input(root).checked = true), matches: true },
      { apply: (root) => (input(root).checked = false), matches: false },
    ],
  },
  {
    selector: ':indeterminate checkbox',
    supports: ':indeterminate',
    className: styles.indeterminate,
    fixture: <input type="checkbox" className={styles.target} />,
    matches: false,
    steps: [{ apply: (root) => (input(root).indeterminate = true), matches: true }],
  },
  {
    selector: ':indeterminate radio',
    supports: ':indeterminate',
    className: styles.indeterminateRadio,
    fixture: (
      <>
        <input type="radio" name="pseudo-indeterminate" className={styles.target} />
        <input type="radio" name="pseudo-indeterminate" />
      </>
    ),
    steps: [{ apply: (root) => (root.querySelectorAll('input')[1].checked = true), matches: false }],
  },
  {
    selector: ':valid',
    supports: ':valid',
    className: styles.valid,
    fixture: <input className={styles.target} defaultValue="a" required />,
    steps: [{ apply: (root) => (input(root).value = ''), matches: false }],
  },
  {
    selector: ':invalid',
    supports: ':invalid',
    className: styles.invalid,
    fixture: <input className={styles.target} required />,
    steps: [{ apply: (root) => (input(root).value = 'a'), matches: false }],
  },
  {
    selector: ':in-range',
    supports: ':in-range',
    className: styles.inRange,
    fixture: <input type="number" className={styles.target} min={0} max={10} defaultValue={5} />,
    steps: [{ apply: (root) => (input(root).value = '11'), matches: false }],
  },
  {
    selector: ':out-of-range',
    supports: ':out-of-range',
    className: styles.outOfRange,
    fixture: <input type="number" className={styles.target} min={0} max={10} defaultValue={11} />,
    steps: [{ apply: (root) => (input(root).value = '5'), matches: false }],
  },
  {
    selector: ':required',
    supports: ':required',
    className: styles.required,
    fixture: <input className={styles.target} required />,
    steps: [{ apply: (root) => (input(root).required = false), matches: false }],
  },
  {
    selector: ':optional',
    supports: ':optional',
    className: styles.optional,
    fixture: <input className={styles.target} />,
    steps: [{ apply: (root) => (input(root).required = true), matches: false }],
  },
  {
    selector: ':user-valid before input',
    supports: ':user-valid',
    className: styles.userValid,
    fixture: <input className={styles.target} defaultValue="a" required />,
    matches: false,
  },
  {
    selector: ':user-invalid before input',
    supports: ':user-invalid',
    className: styles.userInvalid,
    fixture: <input className={styles.target} required />,
    matches: false,
    steps: [
      { apply: (root) => (input(root).value = 'a'), matches: false },
      { apply: (root) => (input(root).value = ''), matches: false },
    ],
  },
  {
    selector: ':lang(de)',
    supports: ':lang(de)',
    className: styles.lang,
    fixture: (
      <div lang="de-AT">
        <span className={styles.target} />
      </div>
    ),
  },
  {
    selector: ':lang(fr, de)',
    supports: ':lang(fr, de)',
    className: styles.langList,
    fixture: <span lang="de" className={styles.target} />,
  },
  {
    selector: ':lang("*-CH")',
    supports: ':lang("*-CH")',
    className: styles.langWildcard,
    fixture: <span lang="de-CH" className={styles.target} />,
  },
  {
    selector: ':dir(rtl)',
    supports: ':dir(rtl)',
    className: styles.dir,
    fixture: (
      <div dir="rtl">
        <span className={styles.target} />
      </div>
    ),
  },
  {
    selector: ':dir(rtl) with dir="auto"',
    supports: ':dir(rtl)',
    className: styles.dirAuto,
    fixture: (
      <span dir="auto" className={styles.target}>
        שלום
      </span>
    ),
  },
  {
    selector: ':any-link',
    supports: ':any-link',
    className: styles.anyLink,
    fixture: <a href={unvisitedHref} className={styles.target} />,
    steps: [{ apply: (_, target) => target?.removeAttribute('href'), matches: false }],
  },
  {
    selector: ':link',
    supports: ':link',
    className: styles.link,
    fixture: <a href={unvisitedHref} className={styles.target} />,
  },
  {
    selector: ':target',
    supports: ':target',
    className: styles.targetState,
    fixture: <span id="pseudo-target-check" className={styles.target} />,
    matches: false,
    steps: [
      {
        apply: () => {
          savedLocation = { url: location.href, state: history.state };
          location.replace('#pseudo-target-check');
        },
        matches: true,
      },
      {
        apply: () => {
          location.replace('#pseudo-target-none');

          if (savedLocation) {
            history.replaceState(savedLocation.state, '', savedLocation.url);
          }
        },
        matches: false,
      },
    ],
  },
  {
    selector: ':scope',
    supports: ':scope',
    className: styles.scope,
    fixture: <span className={styles.target} />,
  },
  {
    selector: ':focus',
    supports: ':focus',
    className: styles.focus,
    fixture: <input className={styles.target} tabIndex={-1} />,
    matches: false,
    steps: [
      { apply: (root) => input(root).focus({ preventScroll: true }), matches: true },
      { apply: (root) => input(root).blur(), matches: false },
    ],
  },
  {
    selector: ':focus-visible text input',
    supports: ':focus-visible',
    className: styles.focusVisible,
    fixture: <input className={styles.target} tabIndex={-1} />,
    matches: false,
    steps: [
      { apply: (root) => input(root).focus({ preventScroll: true }), matches: true },
      { apply: (root) => input(root).blur(), matches: false },
    ],
  },
  {
    selector: ':focus-within',
    supports: ':focus-within',
    className: styles.focusWithin,
    fixture: (
      <div className={styles.target}>
        <input tabIndex={-1} />
      </div>
    ),
    matches: false,
    steps: [
      { apply: (root) => input(root).focus({ preventScroll: true }), matches: true },
      { apply: (root) => input(root).blur(), matches: false },
    ],
  },
  {
    selector: ':open',
    supports: ':open',
    className: styles.open,
    fixture: (
      <details className={styles.target}>
        <summary />
      </details>
    ),
    matches: false,
    steps: [
      { apply: (_, target) => ((target as HTMLDetailsElement).open = true), matches: true },
      { apply: (_, target) => ((target as HTMLDetailsElement).open = false), matches: false },
    ],
  },
  {
    selector: ':popover-open',
    supports: ':popover-open',
    className: styles.popoverOpen,
    fixture: <div popover="manual" className={styles.target} />,
    matches: false,
    steps: [
      { apply: (_, target) => (target as HTMLElement).showPopover(), matches: true },
      { apply: (_, target) => (target as HTMLElement).hidePopover(), matches: false },
    ],
  },
  {
    selector: ':modal',
    supports: ':modal',
    className: styles.modal,
    fixture: <dialog className={styles.target} />,
    matches: false,
    steps: [
      { apply: (_, target) => (target as HTMLDialogElement).showModal(), matches: true },
      { apply: (_, target) => (target as HTMLDialogElement).close(), matches: false },
    ],
  },
  {
    selector: ':defined',
    supports: ':defined',
    className: styles.defined,
    matches: false,
    steps: [
      { apply: (root) => root.append(createTarget(uniqueName())), matches: false },
      {
        apply: (_, target) => target && customElements.define(target.localName, class extends HTMLElement {}),
        matches: true,
      },
    ],
  },
  {
    selector: ':state()',
    supports: ':state(on)',
    className: styles.state,
    matches: false,
    steps: [
      {
        apply: (root) => {
          const name = uniqueName();
          customElements.define(name, class extends StateElement {});
          root.append(createTarget(name));
        },
        matches: false,
      },
      { apply: (_, target) => (target as StateElement).internals.states.add('on'), matches: true },
    ],
  },
  {
    selector: ':heading',
    supports: ':heading',
    className: styles.heading,
    fixture: <h3 className={styles.target} />,
  },
  {
    selector: ':host',
    supports: ':host',
    className: styles.host,
    fixture: <section className={styles.target} />,
    setup: (root) => attachShadow(root.firstElementChild, ':host { color: var(--color-green); }'),
  },
  {
    selector: ':host(.on)',
    supports: ':host(.on)',
    className: styles.hostFunction,
    fixture: <section className={styles.target} />,
    setup: (root) => attachShadow(root.firstElementChild, ':host(.on) { color: var(--color-green); }'),
    matches: false,
    steps: [{ apply: (_, target) => target?.classList.add('on'), matches: true }],
  },
  {
    selector: ':host-context()',
    supports: ':host-context(.on)',
    className: classNames(styles.hostContext, 'on'),
    fixture: <section className={styles.target} />,
    setup: (root) => attachShadow(root.firstElementChild, ':host-context(.on) { color: var(--color-green); }'),
  },
  {
    selector: ':has-slotted',
    supports: ':has-slotted',
    className: styles.hasSlotted,
    fixture: <div />,
    setup: (root) =>
      attachShadow(root.firstElementChild, 'slot:has-slotted { color: var(--color-green); }', '<slot></slot>'),
    target: (root) => root.firstElementChild?.shadowRoot?.querySelector('slot'),
    matches: false,
    steps: [
      { apply: (root) => root.firstElementChild?.append(document.createElement('span')), matches: true },
      { apply: (root) => root.firstElementChild?.replaceChildren(), matches: false },
    ],
  },
  {
    selector: ':paused',
    supports: ':paused',
    className: styles.paused,
    fixture: fixtureVideo,
    steps: [
      { apply: play, matches: false },
      { apply: (root) => media(root).pause(), matches: true },
    ],
  },
  {
    selector: ':playing',
    supports: ':playing',
    className: styles.playing,
    fixture: fixtureVideo,
    matches: false,
    steps: [
      { apply: play, matches: true },
      { apply: (root) => media(root).pause(), matches: false },
    ],
  },
  {
    selector: ':muted',
    supports: ':muted',
    className: styles.muted,
    fixture: fixtureVideo,
    steps: [{ apply: (root) => (media(root).muted = false), matches: false }],
  },
  {
    selector: ':seeking',
    supports: ':seeking',
    className: styles.seeking,
    fixture: fixtureVideo,
    matches: false,
    steps: [
      { apply: (root) => loaded(media(root)), matches: false },
      { apply: (root) => (media(root).currentTime = 5), matches: true },
      { apply: (root) => (media(root).seeking ? waitFor(media(root), 'seeked') : undefined), matches: false },
    ],
  },
  {
    selector: ':active-view-transition',
    supports: ':active-view-transition',
    className: styles.activeViewTransition,
    fixture: <span className={styles.target} />,
    matches: false,
    steps: [
      { apply: () => startViewTransition(() => {}), matches: true },
      { apply: () => viewTransition?.finished, matches: false },
    ],
  },
  {
    selector: ':active-view-transition-type()',
    supports: ':active-view-transition-type(check)',
    className: styles.activeViewTransitionType,
    fixture: <span className={styles.target} />,
    matches: false,
    steps: [
      { apply: () => startViewTransition({ update: () => {}, types: ['check'] }), matches: true },
      { apply: () => viewTransition?.finished, matches: false },
    ],
  },
  { selector: ':hover', supports: ':hover', manual: true },
  { selector: ':active', supports: ':active', manual: true },
  { selector: ':visited', supports: ':visited', manual: true },
  { selector: ':user-valid', supports: ':user-valid', manual: true },
  { selector: ':user-invalid', supports: ':user-invalid', manual: true },
  { selector: ':autofill', supports: ':autofill', manual: true },
  { selector: ':fullscreen', supports: ':fullscreen', manual: true },
  { selector: ':picture-in-picture', supports: ':picture-in-picture', manual: true },
  { selector: ':interest-source', supports: ':interest-source', manual: true },
  { selector: ':interest-target', supports: ':interest-target', manual: true },
  { selector: ':target-current', supports: ':target-current', manual: true },
  { selector: ':target-before', supports: ':target-before', manual: true },
  { selector: ':target-after', supports: ':target-after', manual: true },
  { selector: '@page :first', manual: true },
  { selector: '@page :left', manual: true },
  { selector: '@page :right', manual: true },
];

export const TestPseudoClasses = () => {
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const pipVideoRef = useRef<HTMLVideoElement>(null);

  const toggleFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    await fullscreenRef.current?.requestFullscreen();
  };

  const togglePictureInPicture = async () => {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
      return;
    }

    await pipVideoRef.current?.requestPictureInPicture();
  };

  return (
    <div className={styles.pseudoClasses}>
      <SelectorChecks cases={cases} targetClassName={styles.target} />
      <h2>Manual</h2>
      <div className={styles.demo}>
        <h3>:hover, :active</h3>
        <div className={styles.row}>
          <Button className={styles.hover} text="Hover me" />
          <Button className={styles.active} text="Press me" />
        </div>
      </div>
      <div className={styles.demo}>
        <h3>:visited</h3>
        <a className={styles.visited} href={unvisitedHref} target="_blank" rel="noreferrer noopener">
          Green after visiting
        </a>
      </div>
      <div className={styles.demo}>
        <h3>:user-valid, :user-invalid</h3>
        <input className={styles.userValidity} placeholder="Type hello, then leave" pattern="hello" required />
      </div>
      <form className={styles.demo}>
        <h3>:autofill</h3>
        <div className={styles.row}>
          <input className={styles.autofill} name="name" autoComplete="name" placeholder="Name" />
          <input className={styles.autofill} name="email" autoComplete="email" placeholder="Email" />
        </div>
      </form>
      <div ref={fullscreenRef} className={classNames(styles.demo, styles.fullscreen)}>
        <h3>:fullscreen</h3>
        <span>Green in fullscreen</span>
        <Button text="Toggle fullscreen" onClick={toggleFullscreen} />
      </div>
      <div className={styles.demo}>
        <h3>:picture-in-picture</h3>
        <div className={styles.media}>
          <video ref={pipVideoRef} src={catsVideo} muted loop playsInline preload="metadata" />
          <span>Green in picture-in-picture</span>
        </div>
        <Button text="Toggle picture-in-picture" onClick={togglePictureInPicture} />
      </div>
      <div className={styles.demo}>
        <h3>:interest-source, :interest-target</h3>
        <button
          className={styles.interestSource}
          ref={(element) => element?.setAttribute('interestfor', 'pseudo-interest-target')}
        >
          Hover me
        </button>
        <div id="pseudo-interest-target" className={styles.interestTarget} popover="hint">
          Target
        </div>
      </div>
      <div className={styles.demo}>
        <h3>:target-current, :target-before, :target-after</h3>
        <div className={styles.scrollMarkers}>
          <a href="#pseudo-slide-1">1</a>
          <a href="#pseudo-slide-2">2</a>
          <a href="#pseudo-slide-3">3</a>
        </div>
        <div className={styles.slides}>
          <div id="pseudo-slide-1">1</div>
          <div id="pseudo-slide-2">2</div>
          <div id="pseudo-slide-3">3</div>
        </div>
      </div>
      <div className={styles.demo}>
        <h3>@page :first, :left, :right</h3>
        <span>
          Check print preview. First page: 1in top margin. Left pages: 1in left margin. Right pages: 1in right margin.
        </span>
      </div>
    </div>
  );
};
