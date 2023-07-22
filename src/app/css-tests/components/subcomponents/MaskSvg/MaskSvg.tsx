import { TDimensions } from '@/types';

export const MaskSvg = ({ width, height }: TDimensions) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height}>
      <rect width="100%" height="100%" fill="blue" />

      <mask id="gradient-mask">
        <linearGradient id="mask-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="40%" stopColor="white" stopOpacity="1" />
        </linearGradient>
        <rect width="100%" height="100%" fill="url(#mask-gradient)" />
      </mask>

      <rect width={width / 2} height={height / 2} fill="red" mask="url(#gradient-mask)" />
    </svg>
  );
};
