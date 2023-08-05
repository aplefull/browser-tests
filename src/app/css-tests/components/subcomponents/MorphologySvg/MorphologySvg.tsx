import styles from './styles.module.scss';
import { TDimensions } from '@/types';
import catGif from '@assets/images/gifs/cat-vibing.gif';
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
      <text x={width / 2} y={100} className={styles.text} style={{ filter: 'url(#erode)' }}>
        Thinned text 💔 💌 💕 💞 💓 💗 💖 💘
      </text>
      <text x={width / 2} y={200} className={styles.text} style={{ filter: 'url(#dilate)' }}>
        Fattened text 💔 💌 💕 💞 💓 💗 💖 💘
      </text>
      <image
        preserveAspectRatio="xMidYMid slice"
        xlinkHref={flyingCat}
        x={0}
        y={0}
        width={imageWidth}
        height={imageHeight}
        style={{ filter: 'url(#erode-strong)' }}
      />
      <image
        preserveAspectRatio="xMidYMid slice"
        xlinkHref={flyingCat}
        x={`calc(100% - ${imageWidth}px)`}
        y={0}
        width={imageWidth}
        height={imageHeight}
        style={{ filter: 'url(#dilate-strong)' }}
      />
      <image
        preserveAspectRatio="xMidYMid slice"
        xlinkHref={catGif}
        x={0}
        y={`calc(100% - ${imageHeight}px)`}
        width={imageWidth}
        height={imageHeight}
        style={{ filter: 'url(#erode-strong)' }}
      />
      <image
        preserveAspectRatio="xMidYMid slice"
        xlinkHref={catGif}
        x={`calc(100% - ${imageWidth}px)`}
        y={`calc(100% - ${imageHeight}px)`}
        width={imageWidth}
        height={imageHeight}
        style={{ filter: 'url(#dilate-strong)' }}
      />
    </svg>
  );
};
