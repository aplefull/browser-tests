import { TDimensions } from '@/types';
import { COMPLEX_PATH } from '@/app/pages/js-tests/components/TestCanvas/utils.canvas';
import { GRADIENT_STOPS } from '@/utils/constants';
import { useEffect, useRef, useState } from 'react';

type TUseSvgProps = TDimensions;

export const UseSvg = ({ width, height }: TUseSvgProps) => {
  const [scale, setScale] = useState(1);
  const [pathBox, setPathBox] = useState({
    width: 0,
    height: 0,
  });

  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const resizeSvg = () => {
      if (!pathRef.current) return;

      const { width: pathWidth, height: pathHeight } = pathRef.current.getBBox();
      const newScale = Math.min(width / pathWidth, height / pathHeight) * 0.9;

      setScale(newScale);
      setPathBox({
        width: pathWidth,
        height: pathHeight,
      });
    };

    resizeSvg();

    window.addEventListener('resize', resizeSvg);

    return () => {
      window.removeEventListener('resize', resizeSvg);
    };
  }, []);

  return (
    <svg width={width} height={height}>
      <defs>
        <linearGradient id="use-gradient">
          {GRADIENT_STOPS.map(({ stop, color }) => {
            return <stop key={stop} offset={`${stop * 100}%`} stopColor={color} />;
          })}
        </linearGradient>
        <g id="use-1">
          <path
            ref={pathRef}
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'center',
            }}
            d={COMPLEX_PATH}
            strokeWidth={1}
            stroke="url(#use-gradient)"
          />
        </g>
      </defs>

      <use href="#use-1" x={(width - pathBox.width * scale) / 2} y={(height - pathBox.height * scale) / 2} />
    </svg>
  );
};
