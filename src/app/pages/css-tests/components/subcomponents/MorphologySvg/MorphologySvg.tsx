import styles from './styles.module.scss';
import { TDimensions } from '@/types';
import flyingCat from '@assets/images/flying_cat/flying-cat.webp';

export const MorphologySvg = ({ width, height }: TDimensions) => {
  const imageWidth = width / 4;
  const imageHeight = (imageWidth * 2) / 3;

  return (
    <svg width={width} height={height}>
      <defs>
        <filter id="erode">
          <feMorphology operator="erode" radius="1" />
        </filter>
        <filter id="dilate">
          <feMorphology operator="dilate" radius="1" />
        </filter>
        <filter id="erode-strong">
          <feMorphology operator="erode" radius="10" />
        </filter>
        <filter id="dilate-strong">
          <feMorphology operator="dilate" radius="10" />
        </filter>
      </defs>
      <text x={width / 2} y={180} className={styles.text} style={{ filter: 'url(#erode)', fontSize: '1.2rem' }}>
        {width >= 400 && 'This is thinned text 💕 🐞 🔥 🆒🆒🆒🆒'}
        {width < 400 && (
          <>
            <tspan x={width / 2}>This is thinned text</tspan>
            <tspan dy={30} x={width / 2}>
              💕 🐞 🔥 🆒🆒🆒🆒
            </tspan>
          </>
        )}
      </text>
      <text x={width / 2} y={250} className={styles.text} style={{ filter: 'url(#dilate)', fontSize: '1.2rem' }}>
        {width >= 400 && 'This is fattened text 💕 🐞 🔥 🆒🆒🆒🆒'}
        {width < 400 && (
          <>
            <tspan x={width / 2}>This is fattened text</tspan>
            <tspan dy={30} x={width / 2}>
              💕 🐞 🔥 🆒🆒🆒🆒
            </tspan>
          </>
        )}
      </text>
      <image
        preserveAspectRatio="xMidYMid slice"
        xlinkHref={flyingCat}
        x={0}
        y={0}
        width={imageWidth}
        height={imageHeight}
        style={{ filter: 'url(#erode-strong)', transform: 'translate(-10px, -10px)' }}
      />
      <image
        preserveAspectRatio="xMidYMid slice"
        xlinkHref={flyingCat}
        x={`calc(100% - ${imageWidth}px)`}
        y={0}
        width={imageWidth}
        height={imageHeight}
        style={{ filter: 'url(#dilate-strong)', transform: 'translate(10px, -30px)' }}
      />
    </svg>
  );
};
