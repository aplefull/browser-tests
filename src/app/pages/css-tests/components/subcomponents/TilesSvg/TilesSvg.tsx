import catImage from '@assets/images/gifs/cat-vibing.gif';
import { TDimensions } from '@/types';

export const TilesSvg = ({ width, height }: TDimensions) => {
  return (
    <svg width={width} height={height}>
      <defs>
        <filter id="tile" x="0" y="0" width="100%" height="100%">
          <feTile in="SourceGraphic" x={width / 3} y="80" width={width / 4} height="100" />
          <feTile />
        </filter>
      </defs>

      <image xlinkHref={catImage} x="0" y="0" width="100%" height="100%" style={{ filter: 'url(#tile)' }} />
    </svg>
  );
};
