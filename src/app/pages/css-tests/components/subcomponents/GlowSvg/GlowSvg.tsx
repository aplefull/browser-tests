import styles from './styles.module.scss';
import { TDimensions } from '@/types';

export const GlowSvg = ({ width, height }: TDimensions) => {
  const rectWidth = 200;
  const rectHeight = 200;

  const viewBox = `-${width / 2} -${height / 2} ${width * 2} ${height * 2}`;

  const rectX = (width - rectWidth) / 2;
  const rectY = (height - rectHeight) / 2;

  return (
    <svg
      className={styles.glowSvg}
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={viewBox}
      fill="#FFDEFF"
    >
      <defs>
        <filter
          id="glow-svg-filter"
          x="-1039.6566"
          y="-1056.6566"
          width="3068.313"
          height="3068.313"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="bif" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="1.18639" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.871403 0 0 0 0 1 0 0 0 1 0" />
          <feBlend mode="normal" in2="bif" result="drop-shadow-1" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="2.37278" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.871403 0 0 0 0 1 0 0 0 1 0" />
          <feBlend mode="normal" in2="drop-shadow-1" result="drop-shadow-2" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="8.30472" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.871403 0 0 0 0 1 0 0 0 1 0" />
          <feBlend mode="normal" in2="drop-shadow-2" result="drop-shadow-3" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="16.6094" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.658824 0 0 0 0 0.239216 0 0 0 0 0.941176 0 0 0 1 0" />
          <feBlend mode="normal" in2="drop-shadow-3" result="drop-shadow-4" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="28.4733" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.658824 0 0 0 0 0.239216 0 0 0 0 0.941176 0 0 0 1 0" />
          <feBlend mode="normal" in2="drop-shadow-4" result="drop-shadow-5" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="49.8283" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.658824 0 0 0 0 0.239216 0 0 0 0 0.941176 0 0 0 1 0" />
          <feBlend mode="normal" in2="drop-shadow-5" result="drop-shadow-6" />
          <feBlend mode="normal" in="SourceGraphic" in2="drop-shadow-6" result="shape" />
        </filter>
      </defs>

      <g filter="url(#glow-svg-filter)">
        <rect x={rectX} y={rectY} width={rectWidth} height={rectHeight} ry="10" fill="#FFDEFF" />
      </g>
    </svg>
  );
};
