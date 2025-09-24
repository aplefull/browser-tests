import { TDimensions } from '@/types';
import { COMPLEX_PATH } from '@/app/pages/js-tests/components/TestCanvas/utils.canvas';
import { GRADIENT_STOPS } from '@/utils/constants';
import { useEffect, useRef, useState } from 'react';

type TUseSvgProps = TDimensions;

export const UseSvg = ({ width, height }: TUseSvgProps) => {
  const [scale, setScale] = useState(1);
  const [useBox, setUseBox] = useState({
    width: 0,
    height: 0,
  });

  const useElementRef = useRef<SVGUseElement>(null);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const { width: useWidth, height: useHeight } = entries[0].contentRect;

      setUseBox({
        width: useWidth,
        height: useHeight,
      });

      setScale(Math.min(width / useWidth, height / useHeight) * 0.9);
    });

    if (useElementRef.current) {
      observer.observe(useElementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [width, height]);

  return (
    <svg width={width} height={height}>
      <defs>
        <linearGradient id="use-gradient">
          {GRADIENT_STOPS.map(({ stop, color }) => {
            return <stop key={stop} offset={`${stop * 100}%`} stopColor={color} />;
          })}
        </linearGradient>
        <g id="use-1">
          <path d={COMPLEX_PATH} strokeWidth={1} stroke="url(#use-gradient)" />
        </g>
      </defs>

      <use
        ref={useElementRef}
        href="#use-1"
        x={(width - useBox.width) / 2}
        y={(height - useBox.height) / 2}
        style={{
          scale: `${scale}`,
          transformOrigin: 'center',
        }}
      />
    </svg>
  );
};
