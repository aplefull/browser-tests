import styles from './styles.module.scss';
import { TDimensions } from '@/types';
import { decompressResponse } from '@/utils/utils';
import { useEffect, useState } from 'react';
import { Button } from '@/app/components/Button/Button';
import svgDataUrl from '@data/bad-apple-smil.bin?url';

type TSvgData = {
  width: number;
  height: number;
  dur: string;
  transform: string;
  values: string;
  keyTimes: string;
};

type TSvgProps = TDimensions & {
  data: TSvgData;
};

const Svg = ({ width, height, data }: TSvgProps) => {
  const firstFrame = data.values.split(';', 1)[0];

  return (
    <svg width={width} height={height} viewBox={`0 0 ${data.width} ${data.height}`}>
      <rect className={styles.background} width={data.width} height={data.height} />
      <path className={styles.frame} transform={data.transform} d={firstFrame}>
        <animate
          attributeName="d"
          values={data.values}
          keyTimes={data.keyTimes}
          dur={data.dur}
          calcMode="discrete"
          fill="freeze"
        />
      </path>
    </svg>
  );
};

const isSvgData = (data: unknown): data is TSvgData => {
  return (
    data instanceof Object &&
    'width' in data &&
    'height' in data &&
    'dur' in data &&
    'transform' in data &&
    'values' in data &&
    'keyTimes' in data &&
    typeof data.width === 'number' &&
    typeof data.height === 'number' &&
    typeof data.dur === 'string' &&
    typeof data.transform === 'string' &&
    typeof data.values === 'string' &&
    typeof data.keyTimes === 'string'
  );
};

export const DifficultAnimationSvg = ({ width, height }: TDimensions) => {
  const [show, setShow] = useState(false);
  const [svgData, setSvgData] = useState<TSvgData | null>(null);

  useEffect(() => {
    if (!show || svgData) return;

    const loadSvgData = async () => {
      const response = await fetch(svgDataUrl);
      const decompressedResponse = await decompressResponse(response);
      const svgData = await decompressedResponse.json();

      if (!isSvgData(svgData)) return;

      setSvgData(svgData);
    };

    loadSvgData().catch(console.error);
  }, [show, svgData]);

  return (
    <>
      <p>This animation is pretty heavy, so it's hidden by default. You can open/close it with the button below.</p>
      <Button className={styles.button} text={show ? 'Hide' : 'Show'} onClick={() => setShow(!show)} />
      {show && svgData && <Svg width={width} height={height} data={svgData} />}
    </>
  );
};
