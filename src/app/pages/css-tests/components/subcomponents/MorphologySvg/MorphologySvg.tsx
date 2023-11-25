import styles from './styles.module.scss';
import { TDimensions } from '@/types';
import flyingCat from '@assets/images/flying_cat/flying-cat.webp';
import vibingCat from '@assets/images/gifs/cat-vibing.gif';
import { useEffect, useRef, useState } from 'react';
import { RangeInput } from '@/app/components/RangeInput/RangeInput';
import { clamp, map } from '@/utils/utils';

type TMorphologySvgProps = TDimensions & {
  useAnimatedImage: boolean;
};

type TBox = {
  width: number;
  height: number;
  x: number;
  y: number;
};

const defaultBox = {
  width: 0,
  height: 0,
  x: 0,
  y: 0,
};

const getImageSize = (width: number, height: number) => {
  let imgWidth = (width * 0.9) / 2;
  let imgHeight = (imgWidth * 3) / 4;

  if (imgHeight > height / 2) {
    imgHeight = height / 2;
    imgWidth = (imgHeight * 4) / 3;
  }

  return {
    width: imgWidth,
    height: imgHeight,
  };
};

export const MorphologySvg = ({ width, height, useAnimatedImage }: TMorphologySvgProps) => {
  const [erodedTextBox, setErodedTextBox] = useState<TBox>(defaultBox);
  const [dilatedTextBox, setDilatedTextBox] = useState<TBox>(defaultBox);
  const [imageBox, setImageBox] = useState<TBox>(defaultBox);
  const [erosionStrength, setErosionStrength] = useState(50);

  const erodedTextRef = useRef<SVGTextElement>(null);
  const dilatedTextRef = useRef<SVGTextElement>(null);

  useEffect(() => {
    const erodedText = erodedTextRef.current;
    const dilatedText = dilatedTextRef.current;

    if (!erodedText || !dilatedText) return;

    const imgBox = getImageSize(width, height);
    setImageBox({
      width: imgBox.width,
      height: imgBox.height,
      x: 0,
      y: 0,
    });

    const erodedTextBB = erodedText.getBBox();
    const dilatedTextBB = dilatedText.getBBox();

    const erodedTextWidth = erodedTextBB.width;
    const dilatedTextWidth = dilatedTextBB.width;

    const smallScreen = erodedTextWidth + dilatedTextWidth > width * 0.9;
    const erodedTextX = smallScreen ? (width - erodedTextWidth) / 2 : (width / 2 - erodedTextWidth) / 2;
    const dilatedTextX = smallScreen ? (width - dilatedTextWidth) / 2 : width / 2 + (width / 2 - dilatedTextWidth) / 2;
    const erodedTextY = smallScreen ? height / 2 + erodedTextBB.height / 2 + 10 : height / 2 + 50;
    const dilatedTextY = smallScreen ? erodedTextY + erodedTextBB.height + 10 : height / 2 + 50;

    setDilatedTextBox({
      x: dilatedTextX,
      y: dilatedTextY,
      width: dilatedTextWidth,
      height: dilatedTextBox.height,
    });

    setErodedTextBox({
      x: erodedTextX,
      y: erodedTextY,
      width: erodedTextWidth,
      height: erodedTextBox.height,
    });
  }, [width, height]);

  const imageWidth = imageBox.width;
  const imageHeight = imageBox.height;
  const imageMorphologyRadius = map(erosionStrength, 0, 100, 0, 10);
  const textMorphologyRadius = map(erosionStrength, 0, 100, 0, 2);

  return (
    <div>
      <svg width={width} height={height} className={styles.morphology}>
        <defs>
          <filter id="erode">
            <feMorphology operator="erode" radius={textMorphologyRadius} />
          </filter>
          <filter id="dilate">
            <feMorphology operator="dilate" radius={textMorphologyRadius} />
          </filter>
          <filter id="erode-strong">
            <feMorphology operator="erode" radius={imageMorphologyRadius} />
          </filter>
          <filter id="dilate-strong">
            <feMorphology operator="dilate" radius={imageMorphologyRadius} />
          </filter>
        </defs>
        <image
          preserveAspectRatio="xMidYMid slice"
          xlinkHref={useAnimatedImage ? vibingCat : flyingCat}
          x={`calc((${width / 2}px - ${imageWidth + imageMorphologyRadius * 2}px) / 2)`}
          y={-imageMorphologyRadius}
          width={clamp(imageWidth + imageMorphologyRadius * 2, 0)}
          height={clamp(imageHeight + imageMorphologyRadius * 2, 0)}
          style={{ filter: 'url(#erode-strong)' }}
        />
        <image
          preserveAspectRatio="xMidYMid slice"
          xlinkHref={useAnimatedImage ? vibingCat : flyingCat}
          x={`calc(${width / 2}px + (${width / 2}px - ${imageWidth - imageMorphologyRadius * 2}px) / 2)`}
          y={imageMorphologyRadius}
          width={clamp(imageWidth - imageMorphologyRadius * 2, 0)}
          height={clamp(imageHeight - imageMorphologyRadius * 2, 0)}
          style={{ filter: 'url(#dilate-strong)' }}
        />
        <text
          ref={erodedTextRef}
          y={erodedTextBox.y}
          className={styles.text}
          style={{ filter: 'url(#erode)', fontSize: '1.2rem' }}
        >
          <tspan x={erodedTextBox.x + erodedTextBox.width / 2}>This is thinned text</tspan>
          <tspan x={erodedTextBox.x + erodedTextBox.width / 2} dy={30}>
            💕 🐞 🔥 🆒🆒🆒🆒
          </tspan>
        </text>
        <text
          ref={dilatedTextRef}
          y={dilatedTextBox.y}
          className={styles.text}
          style={{ filter: 'url(#dilate)', fontSize: '1.2rem' }}
        >
          <tspan x={dilatedTextBox.x + dilatedTextBox.width / 2}>This is fattened text</tspan>
          <tspan x={dilatedTextBox.x + dilatedTextBox.width / 2} dy={30}>
            💕 🐞 🔥 🆒🆒🆒🆒
          </tspan>
        </text>
      </svg>
      <RangeInput label="Erosion strength" value={erosionStrength} onChange={setErosionStrength} />
    </div>
  );
};
