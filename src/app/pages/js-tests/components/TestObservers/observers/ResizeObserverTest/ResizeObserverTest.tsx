import styles from './styles.module.scss';
import { useEffect, useRef, useState } from 'react';
import { Select } from '@/app/components/Select/Select';
import { Json } from '@/app/pages/js-tests/components/subcomponents/Json/Json';
import { isOneOf } from '@/utils/utils';
import { QMath } from '@/utils/math';

type TResizeObserverResults = {
  width: number;
  height: number;
  additionalData: {
    contentRect: DOMRectReadOnly;
    borderBoxSize: ResizeObserverSize;
    contentBoxSize: ResizeObserverSize;
    devicePixelContentBoxSize: ResizeObserverSize;
  };
};

const getRectData = (rect: DOMRectReadOnly | ResizeObserverSize) => {
  if (rect instanceof DOMRectReadOnly)
    return {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left,
    };

  return {
    inlineSize: rect.inlineSize,
    blockSize: rect.blockSize,
  };
};

const resizeObserverTypes = ['border-box', 'content-box', 'device-pixel-content-box'] as const;

export const ResizeObserverTest = () => {
  const [resizeObserverType, setResizeObserverType] = useState<ResizeObserverBoxOptions>(resizeObserverTypes[0]);
  const [resizeObserverResults, setResizeObserverResults] = useState<TResizeObserverResults | null>(null);

  const resizeElementRef = useRef<HTMLDivElement>(null);

  const handleTypeChange = (value: string) => {
    if (!isOneOf(value, resizeObserverTypes)) return;

    setResizeObserverType(value);
  };

  useEffect(() => {
    const resizeElement = resizeElementRef.current;

    if (!resizeElement) return;

    const onResize = (entries: ResizeObserverEntry[]) => {
      setResizeObserverResults({
        width: entries[0].contentBoxSize[0].inlineSize,
        height: entries[0].contentBoxSize[0].blockSize,
        additionalData: {
          contentRect: entries[0].contentRect,
          borderBoxSize: entries[0].borderBoxSize[0],
          contentBoxSize: entries[0].contentBoxSize[0],
          devicePixelContentBoxSize: entries[0].devicePixelContentBoxSize[0],
        },
      });
    };

    const resizeObserver = new ResizeObserver(onResize);

    resizeObserver.observe(resizeElement, {
      box: resizeObserverType,
    });

    return () => {
      resizeObserver.disconnect();
    };
  }, [resizeObserverType]);

  const elementWidth = QMath.toFixed(resizeObserverResults?.width || 0, 3);
  const elementHeight = QMath.toFixed(resizeObserverResults?.height || 0, 3);

  return (
    <div className={styles.resizeObserver}>
      <span>
        You can select the box type of the resize observer. Both "border-box" and "content-box" work as you might
        expect. The "device-pixel-content-box" observes size changes in relation to actual pixels on your screen. For
        example, when changing the zoom level, not all elements will change size in CSS pixels, but they will in device
        pixels. In such cases, only the observer with "device-pixel-content-box" setting will fire.
      </span>
      <Select
        className={styles.select}
        options={resizeObserverTypes}
        onChange={handleTypeChange}
        value={resizeObserverType}
      />
      <div className={styles.resizeObserver}>
        <div className={styles.container}>
          <div ref={resizeElementRef} className={styles.resizeElement}>
            <span className={styles.textContainer}>{`${elementWidth}x${elementHeight}`}</span>
          </div>
        </div>
        {resizeObserverResults && (
          <div className={styles.results}>
            <Json
              data={{
                devicePixelContentBoxSize: getRectData(resizeObserverResults.additionalData.devicePixelContentBoxSize),
                contentBoxSize: getRectData(resizeObserverResults.additionalData.contentBoxSize),
                borderBoxSize: getRectData(resizeObserverResults.additionalData.borderBoxSize),
                contentRect: getRectData(resizeObserverResults.additionalData.contentRect),
              }}
              settings={{
                collapseLevel: 1,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
