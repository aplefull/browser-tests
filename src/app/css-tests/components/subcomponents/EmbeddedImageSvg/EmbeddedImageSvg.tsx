import catGif from '@assets/images/gifs/cat-vibing.gif';
import { TDimensions } from '@/types';

export const EmbeddedImageSvg = ({ width, height }: TDimensions) => {
  return (
    <svg width={width} height={height}>
      <defs>
        <clipPath id="circleView">
          <circle cx={width / 2} cy="150" r="100" fill="#FFFFFF" />
        </clipPath>
      </defs>
      <image x={(width - 447) / 2} height="100%" xlinkHref={catGif} clipPath="url(#circleView)" />
    </svg>
  );
};
