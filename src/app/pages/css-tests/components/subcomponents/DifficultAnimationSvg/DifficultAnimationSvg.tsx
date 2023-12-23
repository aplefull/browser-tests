import styles from './styles.module.scss';
import { TDimensions } from '@/types';
import { fitToBox } from '@/utils/utils';
import { useEffect, useState } from 'react';
import { Button } from '@/app/components/Button/Button';

type TSvgProps = {
  width: number;
  height: number;
  fitWidth: number;
  fitHeight: number;
  xOffset: number;
  yOffset: number;
  scale: number;
  data: {
    values: string;
    keyTimes: string;
  };
};

const Svg = ({ width, height, fitWidth, fitHeight, data, yOffset, xOffset, scale }: TSvgProps) => {
  const transform = `scale(${scale})`;
  const style = { transform };
  const viewBox = `0 0 ${fitWidth} ${fitHeight}`;

  return (
    <svg width={width} height={height}>
      <svg
        version="1.0"
        xmlns="http://www.w3.org/2000/svg"
        x={xOffset}
        y={yOffset}
        width={fitWidth}
        height={fitHeight}
        viewBox={viewBox}
      >
        <defs>
          <animate
            xmlns="http://www.w3.org/2000/svg"
            xlinkHref="#frame"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            attributeName="d"
            values={data.values}
            keyTimes={data.keyTimes}
            dur="219.1s"
            repeatCount="1"
            calcMode="discrete"
          />
        </defs>
        <path id="frame" d="M0 192v192h512V0H0v192z" style={style} />
      </svg>
    </svg>
  );
};

const isSvgData = (data: unknown): data is { values: string; keyTimes: string } => {
  return (
    data instanceof Object &&
    'values' in data &&
    'keyTimes' in data &&
    typeof data.values === 'string' &&
    typeof data.keyTimes === 'string'
  );
};

export const DifficultAnimationSvg = ({ width, height }: TDimensions) => {
  const [show, setShow] = useState(false);
  const [svgData, setSvgData] = useState<{
    values: string;
    keyTimes: string;
  } | null>(null);

  const animationWidth = 512;
  const animationHeight = 384;

  const { width: fitWidth, height: fitHeight } = fitToBox(animationWidth, animationHeight, width, height);

  const xOffset = (width - fitWidth) / 2;
  const yOffset = (height - fitHeight) / 2;

  const scale = fitWidth / animationWidth;

  useEffect(() => {
    const loadSvgData = async () => {
      const svgDataRes = await fetch('https://files.catbox.moe/76gavq.json');
      const svgData = await svgDataRes.json();
      if (!isSvgData(svgData)) {
        return;
      }

      setSvgData(svgData);
    };

    loadSvgData().catch(console.error);
  }, []);

  return (
    <>
      <p>This animation is pretty heavy, so it's hidden by default. You can open/close it with the button below.</p>
      <Button className={styles.button} text={show ? 'Hide' : 'Show'} onClick={() => setShow(!show)} />
      {show && svgData && (
        <Svg
          width={width}
          height={height}
          fitWidth={fitWidth}
          fitHeight={fitHeight}
          xOffset={xOffset}
          yOffset={yOffset}
          scale={scale}
          data={svgData}
        />
      )}
    </>
  );
};
