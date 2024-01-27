import styles from './styles.module.scss';
import { Button } from '@/app/components/Button/Button';
import { useEffect, useRef, useState } from 'react';
import { Json } from '@/app/pages/js-tests/components/subcomponents/Json/Json';
import classNames from 'classnames';
import catImage from '@/assets/images/cats/flying-cat.png';

type TPerformanceObserverResults = Record<string, Record<string, unknown>>;

const getNodeData = (node: Node | Element | null): Record<string, unknown> | null => {
  if (!node) return null;

  return {
    nodeName: node.nodeName,
    id: 'id' in node ? node.id : null,
    className: 'className' in node ? node.className : null,
    localName: 'localName' in node ? node.localName : null,
    outerHTML: 'outerHTML' in node ? node.outerHTML : null,
  };
};

const getPerformanceEntryData = (entry: PerformanceEntry): Record<string, unknown> => {
  if (entry instanceof LayoutShift) {
    return {
      ...entry.toJSON(),
      sources: entry.sources.map((source) => ({
        currentRect: source.currentRect?.toJSON(),
        previousRect: source.previousRect?.toJSON(),
        node: getNodeData(source.node),
      })),
    };
  }

  if (entry instanceof PerformanceEventTiming) {
    return {
      ...entry.toJSON(),
      target: getNodeData(entry.target),
    };
  }

  if (entry instanceof PerformanceLongTaskTiming) {
    return {
      ...entry.toJSON(),
      attribution: entry.attribution.map((timing) => timing.toJSON()),
    };
  }

  if (entry instanceof PerformanceElementTiming) {
    return {
      ...entry.toJSON(),
      intersectionRect: entry.intersectionRect?.toJSON(),
    };
  }

  return entry.toJSON() || {};
};

export const PerformanceObserverTest = () => {
  const [showElements, setShowElements] = useState(false);
  const [performanceObserverResults, setPerformanceObserverResults] = useState<TPerformanceObserverResults | null>(
    null,
  );

  const performanceObserverRef = useRef<PerformanceObserver | null>(null);
  const observerStateRef = useRef<'enabled' | 'disabled'>('enabled');

  const runPerformanceMeasurements = async () => {
    performance.mark('performance-observer-mark-1-start');

    for (let i = 0; i < 500_000; i++) {
      const div = document.createElement('div');
      div.textContent = 'Performance';
    }

    performance.mark('performance-observer-mark-1-end');
    performance.measure(
      'performance-observer-measure',
      'performance-observer-mark-1-start',
      'performance-observer-mark-1-end',
    );
  };

  const runElementTiming = async () => {
    setShowElements(true);

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setShowElements(false);
        resolve();
      }, 500);
    });
  };

  const reset = () => {
    observerStateRef.current = 'disabled';
    performance.clearMarks();
    performance.clearMeasures();
    performance.clearResourceTimings();

    setPerformanceObserverResults(null);
    performanceObserverRef.current?.takeRecords();

    setTimeout(() => {
      observerStateRef.current = 'enabled';
    }, 50);
  };

  useEffect(() => {
    const onPerformance = (list: PerformanceObserverEntryList) => {
      if (observerStateRef.current === 'disabled') return;

      list.getEntries().forEach((entry) => {
        const entryType = entry.entryType;
        const name = entry.name;

        if ((entryType === 'mark' || entryType === 'measure') && !name.startsWith('performance-observer-')) return;

        setPerformanceObserverResults((prevState) => {
          if (prevState && prevState[entryType] && prevState[entryType][name]) {
            return prevState;
          }

          return {
            ...prevState,
            [entryType]: {
              ...(prevState?.[entryType] || {}),
              [name]: getPerformanceEntryData(entry),
            },
          };
        });
      });
    };

    const entries = [
      'element',
      'event',
      'first-input',
      'largest-contentful-paint',
      'layout-shift',
      'longtask',
      'mark',
      'measure',
      'navigation',
      'paint',
      'resource',
      'visibility-state',
    ];

    const performanceObserver = new PerformanceObserver(onPerformance);
    performanceObserverRef.current = performanceObserver;

    entries.forEach((entry) => {
      performanceObserver.observe({
        type: entry,
        buffered: true,
      });
    });

    return () => {
      performanceObserver.disconnect();
    };
  }, []);

  const jsonSettings = {
    maxStringLength: 200,
    collapseLevel: 1,
  };

  return (
    <div className={styles.performanceObserver}>
      <p>Only earliest entry of each type is shown below.</p>
      <Button text="Run performance measurements" onClick={runPerformanceMeasurements} />
      <Button text="Run elements timing" onClick={runElementTiming} />
      <Button text="Reset" onClick={reset} />
      <div
        className={classNames(styles.elementsContainer, {
          [styles.hidden]: !showElements,
        })}
      >
        <img src={catImage} alt="" elementtiming="image" />
        <p elementtiming="text">Element to test element timing events.</p>
      </div>
      {performanceObserverResults && <Json data={performanceObserverResults} settings={jsonSettings} />}
    </div>
  );
};
