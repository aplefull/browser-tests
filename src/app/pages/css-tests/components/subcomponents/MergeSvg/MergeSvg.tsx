import { TDimensions } from '@/types';
import styles from './styles.module.scss';

export const MergeSvg = ({ width, height }: TDimensions) => {
  return (
    <svg width={width} height={height}>
      <defs>
        <filter id="merge" x="0" y="0" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
          <feOffset in="blur" dx="4" dy="4" result="offsetBlur" />
          <feSpecularLighting
            in="blur"
            surfaceScale="5"
            specularConstant=".75"
            specularExponent="20"
            lightingColor="#bbbbbb"
            result="specOut"
          >
            <fePointLight x="-5000" y="-10000" z="20000" />
          </feSpecularLighting>
          <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut" />
          <feComposite
            in="SourceGraphic"
            in2="specOut"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1"
            k4="0"
            result="litPaint"
          />
          <feMerge>
            <feMergeNode in="offsetBlur" />
            <feMergeNode in="litPaint" />
          </feMerge>
        </filter>
      </defs>

      <g style={{ filter: 'url(#merge)' }}>
        <rect x="5%" y="5%" width="90%" height="90%" rx="15" ry="15" className={styles.rect} />

        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className={styles.text}
          style={{ filter: 'url(#merge)' }}
        >
          Well hello there
        </text>
      </g>
    </svg>
  );
};
