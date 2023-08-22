import cat from '@assets/images/cats/cat-2.jpg';
import catGif from '@assets/images/gifs/cat-vibing.gif';
import { TDimensions } from '@/types';

type TEmbeddedImageSvgProps = TDimensions & {
  useAnimatedImage: boolean;
};

export const EmbeddedImageSvg = ({ width, height, useAnimatedImage }: TEmbeddedImageSvgProps) => {
  return (
    <svg width={width} height={height}>
      <defs>
        <clipPath id="circleView">
          <circle cx={width / 2} cy="150" r="100" fill="#FFFFFF" />
        </clipPath>
      </defs>
      <image
        x={(width - 447) / 2}
        height="100%"
        xlinkHref={useAnimatedImage ? catGif : cat}
        clipPath="url(#circleView)"
      />
    </svg>
  );
};
