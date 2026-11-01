import { ReactNode, useEffect, useRef, useState } from 'react';
import { Table } from '@/app/components/Table/Table';
import styles from './styles.module.scss';

export type TSelectorStep = {
  apply: (root: HTMLElement, target: Element | null) => unknown;
  matches: boolean;
};

export type TSelectorCase = {
  selector: string;
  supports?: string;
  className?: string;
  fixture?: ReactNode;
  setup?: (root: HTMLElement) => void;
  target?: (root: HTMLElement) => Element | null | undefined;
  pseudo?: string;
  matches?: boolean;
  steps?: TSelectorStep[];
  run?: () => Promise<boolean>;
  manual?: boolean;
};

type TResult = boolean | 'manual';

type TSelectorChecksProps = {
  cases: TSelectorCase[];
  targetClassName: string;
  children?: ReactNode;
};

const TIMEOUT = 5000;

const withTimeout = <T,>(value: T) => {
  return Promise.race([
    Promise.resolve(value),
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), TIMEOUT)),
  ]);
};

const restoreFocus = (element: Element | null) => {
  if (document.activeElement === element) return;

  if (element instanceof HTMLElement && element !== document.body) {
    element.focus({ preventScroll: true });
  } else if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
};

const runCase = async (testCase: TSelectorCase, root: HTMLElement, targetClassName: string, green: string) => {
  if (testCase.run) return await withTimeout(testCase.run());

  testCase.setup?.(root);

  const getTarget = () => (testCase.target ? testCase.target(root) : root.querySelector(`.${targetClassName}`)) ?? null;

  const isMatching = () => {
    const target = getTarget();
    return target !== null && getComputedStyle(target, testCase.pseudo).color === green;
  };

  let passed = isMatching() === (testCase.matches ?? true);

  for (const step of testCase.steps ?? []) {
    await withTimeout(step.apply(root, getTarget()));
    passed = isMatching() === step.matches && passed;
  }

  return passed;
};

const isSupported = (selector: string) => {
  try {
    return CSS.supports(`selector(${selector})`);
  } catch {
    return false;
  }
};

const Status = ({ value }: { value?: TResult }) => {
  if (value === undefined) return '-';
  if (value === 'manual') return <span className={styles.manual}>Manual</span>;

  return <span className={value ? styles.success : styles.error}>{value ? 'Pass' : 'Fail'}</span>;
};

const Supported = ({ value }: { value?: boolean }) => {
  if (value === undefined) return '-';

  return <span className={value ? styles.success : styles.error}>{value ? 'Yes' : 'No'}</span>;
};

export const SelectorChecks = ({ cases, targetClassName, children }: TSelectorChecksProps) => {
  const [results, setResults] = useState<TResult[]>([]);
  const rootRefs = useRef<(HTMLDivElement | null)[]>([]);
  const referenceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!referenceRef.current) return;

      const green = getComputedStyle(referenceRef.current).color;
      const nextResults: TResult[] = [];

      for (const [index, testCase] of cases.entries()) {
        if (cancelled) return;

        const root = rootRefs.current[index];

        if (testCase.manual) {
          nextResults.push('manual');
        } else if (root) {
          const previousFocus = document.activeElement;
          nextResults.push(await runCase(testCase, root, targetClassName, green).catch(() => false));
          restoreFocus(previousFocus);
        } else {
          nextResults.push(false);
        }

        if (!cancelled) setResults([...nextResults]);
      }
    };

    run().catch(console.error);

    return () => {
      cancelled = true;
    };
  }, [cases, targetClassName]);

  const automated = cases.filter((testCase) => !testCase.manual).length;
  const passed = results.filter((result) => result === true).length;
  const showSupported = cases.some((testCase) => testCase.supports);

  const columns = [
    { key: 'selector', header: 'Selector' },
    ...(showSupported ? [{ key: 'supported', header: 'Supported' }] : []),
    { key: 'result', header: 'Result' },
  ];

  const data = cases.map((testCase, index) => ({
    selector: testCase.selector,
    supported: <Supported value={testCase.supports ? isSupported(testCase.supports) : undefined} />,
    result: <Status value={results[index]} />,
  }));

  return (
    <div className={styles.selectorChecks}>
      <div className={styles.fixtures} aria-hidden>
        <div ref={referenceRef} className={styles.reference} />
        {cases.map((testCase, index) => (
          <div
            key={testCase.selector}
            ref={(element) => {
              rootRefs.current[index] = element;
            }}
            className={testCase.className}
          >
            {testCase.fixture}
          </div>
        ))}
      </div>
      <div className={styles.summary}>
        {children}
        <span>
          Passed: {passed}/{automated}
        </span>
      </div>
      <Table columns={columns} data={data} maxHeight={600} compact />
    </div>
  );
};
