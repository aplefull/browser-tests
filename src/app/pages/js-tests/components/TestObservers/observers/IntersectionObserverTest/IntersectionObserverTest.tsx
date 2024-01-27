import styles from './styles.module.scss';
import { Code } from '@/app/components/Code/Code';
import { QMath } from '@/utils/math';
import { useEffect, useRef, useState } from 'react';
import { range } from '@/utils/utils';
import { NumberInput } from '@/app/components/NumberInput/NumberInput';
import classNames from 'classnames';
import { Checkbox } from '@/app/components/Checkbox/Checkbox';

type TIntersectionObserverResults = {
  viewport?: {
    isIntersecting: boolean;
    ratio: number;
  };
  element?: {
    isIntersecting: boolean;
    ratio: number;
  };
};

export const IntersectionObserverTest = () => {
  const [verticalOverflow, setVerticalOverflow] = useState(true);
  const [horizontalOverflow, setHorizontalOverflow] = useState(false);
  const [intersectionObserverResults, setIntersectionObserverResults] = useState<TIntersectionObserverResults | null>(
    null,
  );
  const [rootMargins, setRootMargins] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  const intersectionElementRef = useRef<HTMLDivElement>(null);

  const handleRootMarginChange = (key: keyof typeof rootMargins) => (value: number) => {
    if (Number.isNaN(value)) return;

    setRootMargins((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  useEffect(() => {
    const intersectionElement = intersectionElementRef.current;

    if (!intersectionElement) return;

    const onIntersectionWithViewport = (entries: IntersectionObserverEntry[]) => {
      const isIntersecting = entries[0].isIntersecting;
      const ratio = entries[0].intersectionRatio;

      const updateState = (prevState: TIntersectionObserverResults | null) => {
        const viewport = {
          isIntersecting,
          ratio,
        };

        return {
          ...prevState,
          viewport,
        };
      };

      setIntersectionObserverResults(updateState);
    };

    const onIntersection = (entries: IntersectionObserverEntry[]) => {
      const isIntersecting = entries[0].isIntersecting;
      const ratio = entries[0].intersectionRatio;

      const updateState = (prevState: TIntersectionObserverResults | null) => {
        const element = {
          isIntersecting,
          ratio,
        };

        return {
          ...prevState,
          element,
        };
      };

      setIntersectionObserverResults(updateState);
    };

    const intersectionObserverSettings = {
      root: intersectionElement.parentElement,
      threshold: range(0, 1, 0.01),
      rootMargin: `${rootMargins.top}px ${rootMargins.right}px ${rootMargins.bottom}px ${rootMargins.left}px`,
    };

    const intersectionViewportObserverSettings = {
      root: null,
      threshold: range(0, 1, 0.01),
      rootMargin: `${rootMargins.top}px ${rootMargins.right}px ${rootMargins.bottom}px ${rootMargins.left}px`,
    };

    const intersectionObserver = new IntersectionObserver(onIntersection, intersectionObserverSettings);
    const intersectionViewportObserver = new IntersectionObserver(
      onIntersectionWithViewport,
      intersectionViewportObserverSettings,
    );

    intersectionObserver.observe(intersectionElement);
    intersectionViewportObserver.observe(intersectionElement);

    return () => {
      intersectionObserver.disconnect();
      intersectionViewportObserver.disconnect();
    };
  }, [rootMargins]);

  const viewport = {
    visible: intersectionObserverResults?.viewport?.isIntersecting ? 'yes' : 'no',
    percentage: QMath.roundTo((intersectionObserverResults?.viewport?.ratio || 0) * 100, 2).toString(),
  };

  const element = {
    visible: intersectionObserverResults?.element?.isIntersecting ? 'yes' : 'no',
    percentage: QMath.roundTo((intersectionObserverResults?.element?.ratio || 0) * 100, 2).toString(),
  };

  return (
    <div className={styles.intersectionObserver}>
      <div
        className={classNames(styles.scrollContainer, {
          [styles.vertical]: verticalOverflow,
          [styles.horizontal]: horizontalOverflow,
        })}
      >
        <div ref={intersectionElementRef} className={styles.intersectionElement} />
      </div>
      <div className={styles.checkboxes}>
        <Checkbox checked={verticalOverflow} onChange={setVerticalOverflow} label="Vertical overflow" />
        <Checkbox checked={horizontalOverflow} onChange={setHorizontalOverflow} label="Horizontal overflow" />
      </div>
      <div>
        <span>Root margins:</span>
        <div className={styles.numberInputs}>
          <span>Top:</span>
          <NumberInput onChange={handleRootMarginChange('top')} min={-10000} max={10000} value={rootMargins.top} />
          <span>Right:</span>
          <NumberInput onChange={handleRootMarginChange('right')} min={-10000} max={10000} value={rootMargins.right} />
          <span>Bottom:</span>
          <NumberInput
            onChange={handleRootMarginChange('bottom')}
            min={-10000}
            max={10000}
            value={rootMargins.bottom}
          />
          <span>Left:</span>
          <NumberInput onChange={handleRootMarginChange('left')} min={-10000} max={10000} value={rootMargins.left} />
        </div>
      </div>
      <div>
        {intersectionObserverResults && (
          <div className={styles.results}>
            <span>Relative to viewport:</span>
            <div>
              <Code>Visible: {viewport.visible}</Code>
              <Code>Percentage visible: {viewport.percentage}%</Code>
            </div>
            <span>Relative to scroll container:</span>
            <div>
              <Code>Visible: {element.visible}</Code>
              <Code>Percentage visible: {element.percentage}%</Code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
