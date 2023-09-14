import { Canvas } from '@/app/components/Canvas/Canvas';
import {
  adjustFontSize,
  bg,
  getCanvasDimensions,
  loadNotoFont,
  measureText,
} from '@/app/pages/js-tests/components/TestCanvas/utils.canvas';
import { useEffect, useState } from 'react';
import { getDataFromBlns, nextElement, prevElement, requestEmojis } from '@/utils/utils';
import blns from '@assets/data/blns.txt?raw';
import styles from './styles.module.scss';
import { Select } from '@/app/components/Select/Select';
import { Checkbox } from '@/app/components/Checkbox/Checkbox';
import globalStyles from '../../styles.module.scss';
import classNames from 'classnames';
import { Switcher } from '@/app/components/Switcher/Switcher';
import { type } from 'os';
import { TSeparator } from '@/types';

const fillText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number | boolean = true,
  maxHeight: number | boolean = false,
) => {
  const prevFont = ctx.font;

  const fitWidthTo = typeof maxWidth === 'number' ? maxWidth : maxWidth ? ctx.canvas.width * 0.9 : null;
  const fitHeightTo = typeof maxHeight === 'number' ? maxHeight : maxHeight ? ctx.canvas.height * 0.5 : null;

  const { fontSize, fontFamily } = getCanvasFont(ctx);
  const adjustedFontSize = adjustFontSize(text, fitWidthTo, fitHeightTo, fontFamily, fontSize);

  ctx.font = `${adjustedFontSize}px ${fontFamily}`;
  ctx.fillText(text, x, y);
  ctx.font = prevFont;
};

const getCanvasFont = (ctx: CanvasRenderingContext2D) => {
  const [fontSize, ...rest] = ctx.font.split(' ');
  const fontFamily = rest.join(' ');

  return {
    fontFamily,
    fontSize: parseInt(fontSize.replace('px', ''), 10),
  };
};

const printMeasurements = (
  ctx: CanvasRenderingContext2D,
  text: string,
  measurements?: {
    width: number;
    actualBoundingBoxAscent: number;
    actualBoundingBoxDescent: number;
  },
) => {
  const canvas = ctx.canvas;
  const measurement = ctx.measureText(text);
  const { width, actualBoundingBoxAscent, actualBoundingBoxDescent } = measurements || measurement;

  fillText(ctx, `Measured length: ${width}`, canvas.width / 2, canvas.height - 80);
  fillText(ctx, `Measured ascent: ${actualBoundingBoxAscent}`, canvas.width / 2, canvas.height - 50);
  fillText(ctx, `Measured descent: ${actualBoundingBoxDescent}`, canvas.width / 2, canvas.height - 20);
};

const drawText = (ctx: CanvasRenderingContext2D) => {
  const normalText = 'Normal text.';
  const hieroglyphsText = 'Hieroglyphs: 田中さんにあげて下さい';
  const mathText = 'Math symbols: ∑(n=1,∞) n²/2ⁿ';

  const { width, height } = getCanvasDimensions(ctx);

  ctx.font = '24px sans-serif';
  ctx.textBaseline = 'top';
  ctx.textAlign = 'center';

  bg(ctx);

  fillText(ctx, normalText, width / 2, 50);
  fillText(ctx, hieroglyphsText, width / 2, 100);
  fillText(ctx, mathText, width / 2, 150);
};

const drawEmojis = (ctx: CanvasRenderingContext2D) => {
  const { width, height } = getCanvasDimensions(ctx);
  const emojis = ['👋🏻👋🏼👋🏽👋🏾👋🏿', '❤️‍🔥', '🏻🦰🦱🦳', '🐻‍❄️🐻‍❄', '🐧🕊️🕊🍿🍪🍺🪜', '©️©®️®™️™', '#️⃣#⃣0️⃣0⃣'];

  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.font = '24px sans-serif';
  bg(ctx);

  const lineHeight = height / (emojis.length + (emojis.length - 1) * 0.5);
  const gap = (height - lineHeight * emojis.length) / (emojis.length - 1);

  emojis.forEach((emoji, i) => {
    fillText(ctx, emoji, width / 4, gap + i * lineHeight + gap * i, width / 4, lineHeight);
  });

  ctx.font = '24px Noto Color Emoji';

  emojis.forEach((emoji, i) => {
    fillText(ctx, emoji, (width / 4) * 3, gap + i * lineHeight + gap * i, width / 4, lineHeight);
  });
};

const drawBlnsText = (string: string, fitText: boolean) => async (ctx: CanvasRenderingContext2D) => {
  const { width, height } = getCanvasDimensions(ctx);

  bg(ctx);

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, 'rgb(255, 0, 128)');
  gradient.addColorStop(1, 'rgb(255, 153, 51)');
  ctx.fillStyle = gradient;

  ctx.font = '24px sans-serif';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';

  if (fitText) {
    fillText(ctx, string, width / 2, height / 4, true, (height * 0.9) / 4);
    const adjustedFontSize = adjustFontSize(string, width * 0.9, height * 0.5, 'sans-serif', 24);
    const {
      width: textWidth,
      actualBoundingBoxAscent,
      actualBoundingBoxDescent,
    } = measureText(string, `${adjustedFontSize}px sans-serif`);

    printMeasurements(ctx, string, {
      width: textWidth,
      actualBoundingBoxAscent: actualBoundingBoxAscent || 0,
      actualBoundingBoxDescent: actualBoundingBoxDescent || 0,
    });

    return;
  }

  ctx.fillText(string, width / 2, height / 4);
  printMeasurements(ctx, string);
};

const drawLargeEmojis = (emoji: string) => (ctx: CanvasRenderingContext2D) => {
  const { width, height } = getCanvasDimensions(ctx);

  ctx.font = `200px Noto Color Emoji`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  bg(ctx);
  fillText(ctx, emoji, width / 2, height / 2);
};

const emojis = ['🇯🇵', '🇦🇮', '🇦🇬', '🇦🇪🇦🇫', '🇮', '🇦'];
const lines = getDataFromBlns(blns).flatMap((data) => data.strings);

export const CanvasText = () => {
  const [fitText, setFitText] = useState(false);
  const [currentString, setCurrentString] = useState(lines[0]);
  const [loaded, setLoaded] = useState(false);
  const [emojis, setEmojis] = useState<(string | TSeparator)[]>([]);
  const [currentEmoji, setCurrentEmoji] = useState<string>('😀');

  const additionalEmojis = [
    '🇦',
    '🇧',
    '🇨',
    '🇩',
    '🇪',
    '🇫',
    '🇬',
    '🇭',
    '🇮',
    '🇯',
    '🇰',
    '🇱',
    '🇲',
    '🇳',
    '🇴',
    '🇵',
    '🇶',
    '🇷',
    '🇸',
    '🇹',
    '🇺',
    '🇻',
    '🇼',
    '🇽',
    '🇾',
    '🇿',
    '🇦🇧',
    '🇽🇾🇿',
    '🇦🇧🇨🇩🇪🇫🇬🇭🇮🇯🇰🇱🇲🇳🇴🇵🇶🇷🇸🇹🇺🇻🇼🇽🇾🇿',
  ];

  const nextString = () => {
    setCurrentString(nextElement(lines, currentString));
  };

  const prevString = () => {
    setCurrentString(prevElement(lines, currentString));
  };

  const filterEmoji = (emoji: string | TSeparator): emoji is string => typeof emoji === 'string';

  const nextEmoji = () => {
    const emojisWithoutSeparators = emojis.filter(filterEmoji);
    setCurrentEmoji(nextElement(emojisWithoutSeparators, currentEmoji));
  };

  const prevEmoji = () => {
    const emojisWithoutSeparators = emojis.filter(filterEmoji);
    setCurrentEmoji(prevElement(emojisWithoutSeparators, currentEmoji));
  };

  useEffect(() => {
    const load = async () => {
      const emojis = await requestEmojis();
      setEmojis([
        ...emojis.map((emoji) => emoji.char),
        {
          type: 'separator',
        },
        ...additionalEmojis,
      ]);

      await loadNotoFont();
      setLoaded(true);
    };

    load().catch(console.error);
  }, []);

  if (!loaded) return null;

  return (
    <div className={classNames(styles.canvasText, globalStyles.gridLayout)}>
      <div className={styles.canvasContainer}>
        <Canvas onResize={drawText} />
      </div>
      <div className={styles.canvasContainer}>
        <Canvas onResize={drawEmojis} />
      </div>
      <div className={styles.canvasContainer}>
        <Canvas onResize={drawBlnsText(currentString, fitText)} />
        <Switcher onNext={nextString} onPrev={prevString}>
          <Select options={lines} onChange={setCurrentString} value={currentString} />
        </Switcher>
        <Checkbox checked={fitText} onChange={setFitText} label="Always fit text to canvas (why?)" />
      </div>
      <div className={styles.canvasContainer}>
        <Canvas onResize={drawLargeEmojis(currentEmoji)} />
        <Switcher onNext={nextEmoji} onPrev={prevEmoji}>
          <Select options={emojis} onChange={setCurrentEmoji} value={currentEmoji} />
        </Switcher>
      </div>
    </div>
  );
};
