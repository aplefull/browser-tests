import { TDimensions } from '@/types';
import svgData from '@assets/data/bad-apple-svg.json';

const fitToBox = (originalWidth: number, originalHeight: number, boxWidth: number, boxHeight: number) => {
  const originalAspectRatio = originalWidth / originalHeight;
  const boxAspectRatio = boxWidth / boxHeight;

  if (originalAspectRatio > boxAspectRatio) {
    return {
      width: boxWidth,
      height: boxWidth / originalAspectRatio,
    };
  }

  return {
    width: boxHeight * originalAspectRatio,
    height: boxHeight,
  };
};

export const DifficultAnimationSvg = ({ width, height }: TDimensions) => {
  const animationWidth = 512;
  const animationHeight = 384;

  const { width: fitWidth, height: fitHeight } = fitToBox(animationWidth, animationHeight, width, height);

  const viewBox = `0 0 ${fitWidth} ${fitHeight}`;
  const xOffset = (width - fitWidth) / 2;
  const yOffset = (height - fitHeight) / 2;

  const scale = fitWidth / animationWidth;
  const transform = `scale(${scale})`;
  const style = { transform };

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
            values={svgData.values}
            keyTimes={svgData.keyTimes}
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
