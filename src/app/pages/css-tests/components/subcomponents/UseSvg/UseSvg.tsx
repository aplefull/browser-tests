import { TDimensions } from '@/types';
import { COMPLEX_PATH } from '@/app/pages/js-tests/components/TestCanvas/utils.canvas';
import { GRADIENT_STOPS } from '@/utils/constants';

type TUseSvgProps = TDimensions & {
  useAnimatedImage: boolean;
};

export const UseSvg = ({ width, height, useAnimatedImage }: TUseSvgProps) => {
  return (
    <svg width={width} height={height}>
      <defs>
        <linearGradient id="use-gradient">
          {GRADIENT_STOPS.map(({ stop, color }) => {
            return <stop key={stop} offset={`${stop * 100}%`} stopColor={color} />;
          })}
        </linearGradient>
        <g id="use-1">
          <rect x="0" y="0" width="100" height="100" fill="red" />
          {/*<path d={COMPLEX_PATH} strokeWidth={1} stroke="url(#use-gradient)" />*/}
        </g>
        <g id="use-2">
          <text x="50" y="50" fill="white" textAnchor="middle" dominantBaseline="middle">
            {`use-2`}
          </text>
        </g>
      </defs>

      {/*<use href="#use-1" x="0" y="0" width="100" height="100" />*/}
      <use href="#use-2" x="100" y="0" width="100" height="100" />

    </svg>
  );
};
