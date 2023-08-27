import catImage from '@assets/images/cats/cat-1.jpeg';
import catGif from '@assets/images/gifs/cat-vibing.gif';
import { TDimensions } from '@/types';

type TConvolveMatrixSvgProps = TDimensions & {
  useAnimatedImage: boolean;
};

export const ConvolveMatrixSvg = ({ width, height, useAnimatedImage }: TConvolveMatrixSvgProps) => {
  const filters = [
    {
      matrix: '3 0 0 0 0 0 0 0 -2',
    },
    {
      matrix: '-1 -1  -1   -1    7     -1      -1       -1        -1',
    },
    {
      matrix: '0 0 0 0 2 3 4 0 -10',
    },
    {
      order: '5',
      matrix: '1  1   1  1  1 1 -2  -2 -2  1 1 -2 .01 -2  1 1 -2  -2 -2  1 1  1   1  1  1',
    },
    {
      order: '5',
      matrix: '-1 -1 -1 -1 -1 0 0 0 0 0 1 1 1 1 1 0 0 0 0 0 -1 -1 -1 -1 -1',
    },
    {
      order: '1',
      matrix: '0.0000000000000001',
    },
  ];

  const cols = 3;
  const imgHeight = 150;
  const imgWidth = width / cols;
  const img = useAnimatedImage ? catGif : catImage;

  return (
    <svg width={width} height={height}>
      <defs>
        {filters.map((filter, index) => {
          const currentCol = index % cols;
          const currentRow = Math.floor(index / cols);

          return (
            <filter key={index} id={`convolve-${index + 1}`} x="0" y="0" width="600%" height="600%">
              <feOffset dx={currentCol * imgWidth} dy={currentRow * imgHeight} />
              <feConvolveMatrix kernelMatrix={filter.matrix} order={filter.order || 3} />
            </filter>
          );
        })}
      </defs>

      {filters.map((_, index) => {
        return (
          <image
            key={index}
            xlinkHref={img}
            x="0"
            y="0"
            width={imgWidth}
            height={imgHeight}
            preserveAspectRatio="xMidYMid slice"
            style={{ filter: `url(#convolve-${index + 1})` }}
          />
        );
      })}

      {filters.map(({ matrix }, index) => {
        const currentCol = index % cols;
        const currentRow = Math.floor(index / cols);

        return (
          <rect
            key={index}
            x={currentCol * imgWidth}
            y={currentRow * imgHeight}
            width={imgWidth}
            height={imgHeight}
            fill="transparent"
            stroke="none"
          >
            <title>{matrix}</title>
          </rect>
        );
      })}
    </svg>
  );
};
