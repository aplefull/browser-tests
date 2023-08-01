import { useRef, useState } from 'react';
import styles from './styles.module.scss';
import { Button } from '@/app/components/Button/Button';

// TODO that needs a lot of refactoring
export const TestCanvas = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);

  const paused = useRef<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const wait = (ms: number = 1000) =>
    new Promise<void>((resolve) => {
      setTimeout(async () => {
        while (paused.current) {
          await wait(1000);
        }

        resolve();
      }, ms);
    });

  const bg = (ctx: CanvasRenderingContext2D) => {
    const currentColor = ctx.fillStyle;
    ctx.fillStyle = 'aliceblue';
    ctx.fillRect(0, 0, 600, 600);
    ctx.fillStyle = currentColor;
  };

  const reset = (ctx: CanvasRenderingContext2D) => {
    ctx.reset();
  };

  const testShapes = async (ctx: CanvasRenderingContext2D) => {
    const canvas = ctx.canvas;
    bg(ctx);

    ctx.fillStyle = '#c04e9a';
    ctx.fillRect(canvas.width / 2 - 50, canvas.height / 2 - 50, 100, 100);
    await wait();
    bg(ctx);

    ctx.fillStyle = '#2e97f6';
    ctx.strokeRect(canvas.width / 2 - 50, canvas.height / 2 - 50, 100, 100);
    await wait();
    bg(ctx);

    ctx.fillStyle = '#f00';
    ctx.beginPath();
    ctx.moveTo(75, 40);
    ctx.bezierCurveTo(75, 37, 70, 25, 50, 25);
    ctx.bezierCurveTo(20, 25, 20, 62.5, 20, 62.5);
    ctx.bezierCurveTo(20, 80, 40, 102, 75, 120);
    ctx.bezierCurveTo(110, 102, 130, 80, 130, 62.5);
    ctx.bezierCurveTo(130, 62.5, 130, 25, 100, 25);
    ctx.bezierCurveTo(85, 25, 75, 37, 75, 40);
    ctx.fill();
    await wait();
    bg(ctx);

    ctx.fillStyle = '#8f44cc';
    const shape = new Path2D(
      'M203.5 29.2c-10.5 10-10.6 10-7.8 19.8.9 3.3 1.4 6.2 1.2 6.3-9.6 7.7-17.8 14.6-19.2 16.2-3.4 3.9-9.6 18.1-11.2 25.5-1.7 7.8-1.3 13.4 1 16 .7.8 1.6 2.6 2 4 .4 1.4 1.3 3.2 2 4 .7.8 1.5 2.4 1.8 3.5 1.5 5.3 3.6 10 4.4 9.8.4-.1 1.6.5 2.5 1.4.9.8 2.3 1.3 3 1 .7-.2 2.1.3 3.1 1.1 1.6 1.4 1.9 1.4 2.7.2.6-.8 1-1 1-.5 0 .6 1.4 1.9 3 2.8 3 1.8 3 1.8 3-.5.1-2 .2-2.1 1.1-.6 1.2 2.1-1.1 8.1-4.3 11.5-2.6 2.7-1.9 3.7 4.5 6.8 2.3 1.1 4.3 2.7 4.5 3.6.2.9 3.9 5.3 8.3 9.8 5.7 5.9 8.7 8.3 10.9 8.6 1.6.2 3.4.6 3.9.9.5.4 1.7-.1 2.6-1 1.5-1.5 1.7-1.5 2.2.5.8 3 2 2.6 2.8-1.1l.7-3.1 1.4 3.2c2.1 5.1 1.7 6.5-2.8 10.1-2.4 1.9-6.5 5.5-9.3 8.1-3.7 3.4-6.4 4.9-10.1 5.8-2.9.7-6.1 2.2-7.2 3.4-2.3 2.4-4.5 7.5-3.8 8.6.3.4-1.7 2.9-4.3 5.5-6.9 6.6-8.4 10.2-7.9 19 .3 6.9.1 7.4-5.2 18.3-3 6.2-5.8 11.3-6.2 11.3-.3 0-2.7-5.1-5.3-11.3-2.6-6.1-6.4-15-8.5-19.7-2-4.7-5.1-13.6-6.9-19.8-1.7-6.2-4-13.1-5.1-15.2-1.1-2.2-2-4.1-2-4.3 0-.5 3.2-1.1 21.5-3.7 16.8-2.5 24.5-4 24.5-5.1 0-1.8-9.7-1.9-29.9-.5-20.8 1.5-21.4 1.5-23.8-.4-3-2.3-12.5-6-15.6-6-1.2 0-3.3.7-4.7 1.5-1.4.8-4.1 2.2-6 3.1-1.9.9-4.5 2.7-5.7 4-3.9 4.3-5.9 3.2-10.2-5.5-2.2-4.3-4.7-8.1-5.6-8.5-3-1.1-8.4-.6-15.7 1.4-8.7 2.4-11.1 2.5-12.8.5-1-1.2-3-1.5-7.7-1.4-3.4.1-6.3.4-6.3.6 0 .6 5 10 15.5 29.3 6.2 11.4 10.2 19.8 10.3 21.9.4 5.9 6 24 10.4 33.7 1 2.2 1.8 4.8 1.8 5.7 0 1.1 2.4 2.9 6.5 4.9 3.5 1.8 13.2 7.9 21.4 13.6l15 10.3 1.6 5.6c2.2 7.3 3.3 8.8 22.1 28.1l16.1 16.5-1 3.6c-.6 2-2.2 4.9-3.6 6.6-6.2 7.1-8 14.9-4.7 20 .9 1.3 1.6 3.1 1.6 4 0 1.3 8.1 1.5 73.6 1.5h73.5l-2.1-2.9c-1.1-1.6-4.1-4.8-6.7-7-3.8-3.4-5.3-4.1-8.8-4.1-3 0-4.5-.5-4.9-1.6-1.8-4.7.3-47.9 2.9-59.1 2-8.7 1.9-12.5-.6-15.7-2.3-2.9-6.3-3.5-9.4-1.2-1.7 1.2-1.9 3-2.1 18.7-.2 15.2-2.3 36.1-3.7 37.5-.3.3-1.3-1.6-2.2-4.3-1-2.6-2.9-7.6-4.2-11.1l-2.5-6.3 1.7-10.2c2.7-16.7 6-29.3 7.6-28.8.8.2 5.9.6 11.3.9 9.7.5 9.9.4 9.3-1.7-.5-2-.1-2.1 4.9-2.1 5.8 0 5.9-.1 4.4-3.1-1-1.8-.7-1.9 6.2-1.9 9.6 0 11-.9 6.6-4.3l-3.3-2.7 3.2.3c2.6.2 3.3.7 3.8 3.2.7 3 .7 2.9 2.7-2.3 2.3-5.7 4.3-7 3.6-2.1-.3 2 0 3.3.9 3.6.7.3 1.3 1.5 1.3 2.7 0 2 .1 2 2-.4l2-2.5v2.3c0 1.2-.7 3.9-1.6 6-.8 2-2.4 7.4-3.4 12-1.5 6.7-1.6 8.1-.4 7.1 1.1-.9 1.4-.7 1.4 1.2v2.2l2.4-2.2 2.4-2.2-1.3 6.3c-.7 3.5-1.5 8.5-1.9 11.3-.6 4.5-.5 4.7.9 3 1.4-1.9 1.4-1.9 1.5 1v3l2.1-2.5 2-2.5-.6 6c-1.4 15.6-1.5 17.6-.4 16.9.6-.4 1.5 0 2 .7.8 1.2 1.1 1.2 1.9-.1.8-1.2 1-1.2.9.5 0 1.1-.4 4.1-.8 6.7-.7 4.2-.5 4.8 1.1 5.4 1.9.6 3.5-.3 9.5-5.1l3.1-2.6-1.9 7.6c-1.7 6.4-1.8 8.2-.8 11 .7 1.9 1.7 3.1 2.2 2.8.6-.4.8.5.5 2.2l-.6 2.8 2.7-3.3c1.4-1.9 3.1-4.1 3.8-4.9 1-1.4 1.2-1.1 1.3 1.7 0 2 .4 3.1 1 2.7 1.2-.8 1.3-1.1-.5 5.5-.8 3-1.5 5.6-1.5 5.7 0 .2 33.5.3 74.5.3H512V261.3l-5.1-9.9c-7.5-14.4-14.3-25.5-17.6-28.5-6.3-6-15.5-9.1-42.3-14.4-27-5.4-39-9-51.4-15.3-14.4-7.4-24.6-15.9-32-26.6-3.5-5-8.1-12.1-10.2-15.8-2.9-5.1-4-6.4-4.7-5.3-.4.8-1.4 1.5-2.1 1.5-.6 0-2 1.8-3 4s-3.3 5.2-5.3 6.7c-1.9 1.5-5.3 5.3-7.4 8.5-2.2 3.2-12.5 14.4-22.9 25-17.4 17.8-24.3 23.8-25.3 22-.3-.4-.8-3.6-1.1-7.1-.4-3.5-1.4-8.1-2.2-10.1-.9-2.1-1.4-5.5-1.2-7.6l.4-3.9 1.2 3c1 2.3 1.5 2.6 2.2 1.5.7-1.1 1-.8 1.5 1.3 1 3.9 2.1 3.3 3.1-1.6.8-3.6 1.3-4.2 3.2-4 1.4.2 2.1-.1 1.7-.7-.3-.6 0-1 .8-1s1.8.8 2.2 1.7c.5 1.4.9 1.1 2.3-1.7l1.6-3.4 1.2 4.5 1.1 4.4.8-7.4c.6-6.3.9-7.2 2-5.8.6.9 1.5 1.4 1.8 1 .4-.3 1.3-.1 2.1.6 1.8 1.5 2.6-.5 2.6-6.7l.1-4.7 2.9 3.5 3 3.5-2.5-5.8c-3-6.9-3-7-.6-5.7 2.3 1.2 7.4 1.4 6.9.2-.2-.4-1.4-2.8-2.8-5.4-2.6-5.2-2.3-6.6 1.1-4.8 2.2 1.2 2.1 1.1-.5-3.5-1.5-2.6-3.2-6-3.7-7.7l-.8-3 2.1 1.8c1.2 1.1 3 2.8 4 3.9 2 2.2-2.9-9.7-6.2-15-2.2-3.6-8.2-19.7-11.6-31.3-3.3-11.4-8.7-21.9-14.8-29-2.8-3.3-6.8-8.1-9-10.7-5.8-7-17-13.5-25.9-15-4-.6-4.8-1.6-6.7-9-.5-2.2-1.4-4.6-1.8-5.3-1-1.4-19.6-6.2-25.9-6.7-4.2-.2-4.6 0-13.8 8.7zm-10 108 1.6 3.3-2.1-2.4c-1.1-1.3-2-2.7-2-3.2 0-1.8 1-.8 2.5 2.3zm-72 82.5c1.1 2 4.1 6.2 6.7 9.1 3 3.5 5 6.8 5.4 9.1.3 2 1 5.3 1.4 7.3.4 2.1.4 3.8 0 3.8s-3.8-5.5-7.5-12.3c-3.8-6.7-7.9-14.1-9.3-16.5-2.2-3.9-2.3-4.2-.5-4.2 1.1 0 2.6 1.5 3.8 3.7zm17.1 39.6 2.2 6.8-5-5.1c-4.8-4.9-5-5.2-3.3-7.1 1-1 1.4-1.9.9-1.9-.5 0-.2-.5.6-1 1-.6 1.6-.5 1.9.3.2.7 1.4 4.3 2.7 8z'
    );
    ctx.fill(shape);
    await wait();
  };

  const testText = async (ctx: CanvasRenderingContext2D) => {
    const canvas = ctx.canvas;
    bg(ctx);

    const text1 = "Let's start easy with this text.";
    ctx.font = '24px monospace';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';
    ctx.fillText(text1, canvas.width / 2, 10);
    await wait(2000);

    const text2 = 'Now some hieroglyphs: ' + '田中さんにあげて下さい';
    ctx.fillText(text2, canvas.width / 2, 50);
    await wait(2000);

    const text3 = 'Some symbols: ' + '∑(n=1,∞) n²/2ⁿ';
    ctx.fillText(text3, canvas.width / 2, 100);
    await wait(2000);

    const text4 = 'And some emojis: ' + '👋🏻👋🏼👋🏽👋🏾👋🏿';
    ctx.fillText(text4, canvas.width / 2, 150);
    await wait(2000);

    const text5 = "Let's do some more complex ones:";
    const emojis = ['❤️‍🔥', '🏻🦰🦱🦳', '🐻‍❄️🐻‍❄', '🐧🕊️🕊🍿🍪🍺🪜', '©️©®️®™️™', '#️⃣#⃣0️⃣0⃣', '▪️▪'];
    ctx.fillText(text5, canvas.width / 2, 200);

    let i = 0;
    for (const emoji of emojis) {
      ctx.fillText(emoji, canvas.width / 2, 250 + i * 50);
      i++;
      await wait(2000);
    }

    const text6 = 'Same emojis, different font:';
    const fillStyle = ctx.fillStyle;
    ctx.fillStyle = 'aliceblue';
    ctx.fillRect(0, 195, 600, 600);
    ctx.fillStyle = fillStyle;
    ctx.fillText(text6, canvas.width / 2, 200);
    ctx.font = '24px Noto Color Emoji';
    i = 0;
    for (const emoji of emojis) {
      ctx.fillText(emoji, canvas.width / 2, 250 + i * 50);
      i++;
      await wait(2000);
    }

    bg(ctx);

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);

    gradient.addColorStop(0, 'rgb(255, 0, 128)');
    gradient.addColorStop(1, 'rgb(255, 153, 51)');
    ctx.fillStyle = gradient;

    const text7 = "Let's go ridiculous mode now:";
    ctx.fillText(text7, canvas.width / 2, 10);
    ctx.font = '24px sans-serif';

    const lines = [
      '\b',
      '',
      '­؀؁؂؃؄؅؜۝܏᠎​‌‍‎‏‪‫‬‭‮⁠⁡⁢⁣⁤⁦⁧⁨⁩⁪⁫⁬⁭⁮⁯﻿￹￺￻𑂽𛲠𛲡𛲢𛲣𝅳𝅴𝅵𝅶𝅷𝅸𝅹𝅺󠀁󠀠󠀡󠀢󠀣󠀤󠀥󠀦󠀧󠀨󠀩󠀪󠀫󠀬󠀭󠀮󠀯󠀰󠀱󠀲󠀳󠀴󠀵󠀶󠀷󠀸󠀹󠀺󠀻󠀼󠀽󠀾󠀿󠁀󠁁󠁂󠁃󠁄󠁅󠁆󠁇󠁈󠁉󠁊󠁋󠁌󠁍󠁎󠁏󠁐󠁑󠁒󠁓󠁔󠁕󠁖󠁗󠁘󠁙󠁚󠁛󠁜󠁝󠁞󠁟󠁠󠁡󠁢󠁣󠁤󠁥󠁦󠁧󠁨󠁩󠁪󠁫󠁬󠁭󠁮󠁯󠁰󠁱󠁲󠁳󠁴󠁵󠁶󠁷󠁸󠁹󠁺󠁻󠁼󠁽󠁾󠁿',
      `      	              ​
`,
      'Œ„´‰ˇÁ¨ˆØ∏”’',
      '`⁄€‹›ﬁﬂ‡°·‚—±',
      '⅛⅜⅝⅞',
      '٠١٢٣٤٥٦٧٨٩',
      'ด้้้้้็็็็็้้้้้็็็็็้้้้้้้้็็็็็้้้้้็็็็็้้้้้้้้็็็็็้้้้้็็็็็้้้้้้้้็็็็็้้้้้็็็็ ด้้้้้็็็็็้้้้้็็็็็้้้้้้้้็็็็็้้้้้็็็็็้้้้้้้้็็็็็้้้้้็็็็็้้้้้้้้็็็็็้้้้้็็็็ ด้้้้้็็็็็้้้้้็็็็็้้้้้้้้็็็็็้้้้้็็็็็้้้้้้้้็็็็็้้้้้็็็็็้้้้้้้้็็็็็้้้้้็็็็',
      '田中さんにあげて下さいパーティーへ行かないか和製漢語部落格사회과학원 어학연구소찦차를 타고 온 펲시맨과 쑛다리 똠방각하社會科學院語學研究所울란바토르𠜎𠜱𠝹𠱓𠱸𠲖𠳏',
      '表ポあA鷗ŒéＢ逍Üßªąñ丂㐀𠀀',
      '᚛ᚄᚓᚐᚋᚒᚄ ᚑᚄᚂᚑᚏᚅ᚜',
      '᚛                 ᚜',
      ` test `,
      '̡͓̞ͅI̗̘̦͝n͇͇͙v̮̫ok̲̫̙͈i̖͙̭̹̠̞n̡̻̮̣̺g̲͈͙̭͙̬͎ ̰t͔̦h̞̲e̢̤ ͍̬̲͖f̴̘͕̣è͖ẹ̥̩l͖͔͚i͓͚̦͠n͖͍̗͓̳̮g͍ ̨o͚̪͡f̘̣̬ ̖̘͖̟͙̮c҉͔̫͖͓͇͖ͅh̵̤̣͚͔á̗̼͕ͅo̼̣̥s̱͈̺̖̦̻͢.̛̖̞̠̫̰',
      'گچپژ',
    ];

    for (const line of lines) {
      bg(ctx);
      ctx.fillText(text7, canvas.width / 2, 10);
      ctx.fillText(line, canvas.width / 2, canvas.height / 2);
      i++;

      const measurement = ctx.measureText(line);
      const { width, actualBoundingBoxAscent, actualBoundingBoxDescent } = measurement;
      ctx.fillText(`Measured length: ${width}`, canvas.width / 2, canvas.height - 90);
      ctx.fillText(`Measured ascent: ${actualBoundingBoxAscent}`, canvas.width / 2, canvas.height - 60);
      ctx.fillText(`Measured descent: ${actualBoundingBoxDescent}`, canvas.width / 2, canvas.height - 30);
      await wait(2000);
    }

    bg(ctx);

    ctx.font = '20px sans-serif';
    const text8 = "How's your rasterizer? :^)";
    ctx.fillText(text8, canvas.width / 2, 10);
    const emojis2 = ['😀', '😼', '🧠', '🏻', '©️', '®', '🎌', '🇯🇵', '🇦🇮', '🇦🇬', '🇦🇪🇦🇫', '🇮', '🇦'];

    for (const emoji of emojis2) {
      bg(ctx);
      ctx.fillText(text8, canvas.width / 2, 10);
      ctx.font = '200px Noto Color Emoji';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji, canvas.width / 2, canvas.height / 2);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      ctx.font = '20px sans-serif';
      const measurement = ctx.measureText(emoji);
      const { width, actualBoundingBoxAscent, actualBoundingBoxDescent } = measurement;
      ctx.fillText(`Measured length: ${width}`, canvas.width / 2, canvas.height - 90);
      ctx.fillText(`Measured ascent: ${actualBoundingBoxAscent}`, canvas.width / 2, canvas.height - 60);
      ctx.fillText(`Measured descent: ${actualBoundingBoxDescent}`, canvas.width / 2, canvas.height - 30);

      await wait(2000);
    }
  };

  const testGradients = async (ctx: CanvasRenderingContext2D) => {
    const canvas = ctx.canvas;
    const width = canvas.width;
    const height = canvas.height;

    const gradient = ctx.createLinearGradient(0, 0, width, height);

    const gradientStops = [
      { stop: 0, color: 'rgb(167,20,235)' },
      { stop: 0.1, color: 'rgb(104,52,202)' },
      { stop: 0.19, color: 'rgb(64,135,186)' },
      { stop: 0.25, color: 'rgb(54,174,190)' },
      { stop: 0.34, color: 'rgb(61,194,140)' },
      { stop: 0.43, color: 'rgb(59,190,71)' },
      { stop: 0.57, color: 'rgb(150,198,41)' },
      { stop: 0.7, color: 'rgb(222,191,55)' },
      { stop: 0.86, color: 'rgb(218,121,58)' },
      { stop: 1, color: 'rgb(212,102,44)' },
    ];

    for (const stop of gradientStops) {
      gradient.addColorStop(stop.stop, stop.color);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      await wait(500);
    }

    await wait(2000);

    const gradient2 = ctx.createConicGradient(0, canvas.height / 2, canvas.width / 2);

    for (const stop of gradientStops) {
      gradient2.addColorStop(stop.stop, stop.color);
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, width, height);
      await wait(500);
    }

    await wait(2000);

    const gradient3 = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 2
    );
    for (const stop of gradientStops) {
      gradient3.addColorStop(stop.stop, stop.color);
      ctx.fillStyle = gradient3;
      ctx.fillRect(0, 0, width, height);
      await wait(500);
    }
  };

  const testClip = async (ctx: CanvasRenderingContext2D) => {
    // fill with gradient and clip with the same 2d path as above
    const canvas = ctx.canvas;
    const lingrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    lingrad.addColorStop(0, '#00ABEB');
    lingrad.addColorStop(0.5, '#fff');
    lingrad.addColorStop(0.5, '#26C000');
    lingrad.addColorStop(1, '#fff');

    ctx.fillStyle = lingrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    const path = new Path2D(
      'M203.5 29.2c-10.5 10-10.6 10-7.8 19.8.9 3.3 1.4 6.2 1.2 6.3-9.6 7.7-17.8 14.6-19.2 16.2-3.4 3.9-9.6 18.1-11.2 25.5-1.7 7.8-1.3 13.4 1 16 .7.8 1.6 2.6 2 4 .4 1.4 1.3 3.2 2 4 .7.8 1.5 2.4 1.8 3.5 1.5 5.3 3.6 10 4.4 9.8.4-.1 1.6.5 2.5 1.4.9.8 2.3 1.3 3 1 .7-.2 2.1.3 3.1 1.1 1.6 1.4 1.9 1.4 2.7.2.6-.8 1-1 1-.5 0 .6 1.4 1.9 3 2.8 3 1.8 3 1.8 3-.5.1-2 .2-2.1 1.1-.6 1.2 2.1-1.1 8.1-4.3 11.5-2.6 2.7-1.9 3.7 4.5 6.8 2.3 1.1 4.3 2.7 4.5 3.6.2.9 3.9 5.3 8.3 9.8 5.7 5.9 8.7 8.3 10.9 8.6 1.6.2 3.4.6 3.9.9.5.4 1.7-.1 2.6-1 1.5-1.5 1.7-1.5 2.2.5.8 3 2 2.6 2.8-1.1l.7-3.1 1.4 3.2c2.1 5.1 1.7 6.5-2.8 10.1-2.4 1.9-6.5 5.5-9.3 8.1-3.7 3.4-6.4 4.9-10.1 5.8-2.9.7-6.1 2.2-7.2 3.4-2.3 2.4-4.5 7.5-3.8 8.6.3.4-1.7 2.9-4.3 5.5-6.9 6.6-8.4 10.2-7.9 19 .3 6.9.1 7.4-5.2 18.3-3 6.2-5.8 11.3-6.2 11.3-.3 0-2.7-5.1-5.3-11.3-2.6-6.1-6.4-15-8.5-19.7-2-4.7-5.1-13.6-6.9-19.8-1.7-6.2-4-13.1-5.1-15.2-1.1-2.2-2-4.1-2-4.3 0-.5 3.2-1.1 21.5-3.7 16.8-2.5 24.5-4 24.5-5.1 0-1.8-9.7-1.9-29.9-.5-20.8 1.5-21.4 1.5-23.8-.4-3-2.3-12.5-6-15.6-6-1.2 0-3.3.7-4.7 1.5-1.4.8-4.1 2.2-6 3.1-1.9.9-4.5 2.7-5.7 4-3.9 4.3-5.9 3.2-10.2-5.5-2.2-4.3-4.7-8.1-5.6-8.5-3-1.1-8.4-.6-15.7 1.4-8.7 2.4-11.1 2.5-12.8.5-1-1.2-3-1.5-7.7-1.4-3.4.1-6.3.4-6.3.6 0 .6 5 10 15.5 29.3 6.2 11.4 10.2 19.8 10.3 21.9.4 5.9 6 24 10.4 33.7 1 2.2 1.8 4.8 1.8 5.7 0 1.1 2.4 2.9 6.5 4.9 3.5 1.8 13.2 7.9 21.4 13.6l15 10.3 1.6 5.6c2.2 7.3 3.3 8.8 22.1 28.1l16.1 16.5-1 3.6c-.6 2-2.2 4.9-3.6 6.6-6.2 7.1-8 14.9-4.7 20 .9 1.3 1.6 3.1 1.6 4 0 1.3 8.1 1.5 73.6 1.5h73.5l-2.1-2.9c-1.1-1.6-4.1-4.8-6.7-7-3.8-3.4-5.3-4.1-8.8-4.1-3 0-4.5-.5-4.9-1.6-1.8-4.7.3-47.9 2.9-59.1 2-8.7 1.9-12.5-.6-15.7-2.3-2.9-6.3-3.5-9.4-1.2-1.7 1.2-1.9 3-2.1 18.7-.2 15.2-2.3 36.1-3.7 37.5-.3.3-1.3-1.6-2.2-4.3-1-2.6-2.9-7.6-4.2-11.1l-2.5-6.3 1.7-10.2c2.7-16.7 6-29.3 7.6-28.8.8.2 5.9.6 11.3.9 9.7.5 9.9.4 9.3-1.7-.5-2-.1-2.1 4.9-2.1 5.8 0 5.9-.1 4.4-3.1-1-1.8-.7-1.9 6.2-1.9 9.6 0 11-.9 6.6-4.3l-3.3-2.7 3.2.3c2.6.2 3.3.7 3.8 3.2.7 3 .7 2.9 2.7-2.3 2.3-5.7 4.3-7 3.6-2.1-.3 2 0 3.3.9 3.6.7.3 1.3 1.5 1.3 2.7 0 2 .1 2 2-.4l2-2.5v2.3c0 1.2-.7 3.9-1.6 6-.8 2-2.4 7.4-3.4 12-1.5 6.7-1.6 8.1-.4 7.1 1.1-.9 1.4-.7 1.4 1.2v2.2l2.4-2.2 2.4-2.2-1.3 6.3c-.7 3.5-1.5 8.5-1.9 11.3-.6 4.5-.5 4.7.9 3 1.4-1.9 1.4-1.9 1.5 1v3l2.1-2.5 2-2.5-.6 6c-1.4 15.6-1.5 17.6-.4 16.9.6-.4 1.5 0 2 .7.8 1.2 1.1 1.2 1.9-.1.8-1.2 1-1.2.9.5 0 1.1-.4 4.1-.8 6.7-.7 4.2-.5 4.8 1.1 5.4 1.9.6 3.5-.3 9.5-5.1l3.1-2.6-1.9 7.6c-1.7 6.4-1.8 8.2-.8 11 .7 1.9 1.7 3.1 2.2 2.8.6-.4.8.5.5 2.2l-.6 2.8 2.7-3.3c1.4-1.9 3.1-4.1 3.8-4.9 1-1.4 1.2-1.1 1.3 1.7 0 2 .4 3.1 1 2.7 1.2-.8 1.3-1.1-.5 5.5-.8 3-1.5 5.6-1.5 5.7 0 .2 33.5.3 74.5.3H512V261.3l-5.1-9.9c-7.5-14.4-14.3-25.5-17.6-28.5-6.3-6-15.5-9.1-42.3-14.4-27-5.4-39-9-51.4-15.3-14.4-7.4-24.6-15.9-32-26.6-3.5-5-8.1-12.1-10.2-15.8-2.9-5.1-4-6.4-4.7-5.3-.4.8-1.4 1.5-2.1 1.5-.6 0-2 1.8-3 4s-3.3 5.2-5.3 6.7c-1.9 1.5-5.3 5.3-7.4 8.5-2.2 3.2-12.5 14.4-22.9 25-17.4 17.8-24.3 23.8-25.3 22-.3-.4-.8-3.6-1.1-7.1-.4-3.5-1.4-8.1-2.2-10.1-.9-2.1-1.4-5.5-1.2-7.6l.4-3.9 1.2 3c1 2.3 1.5 2.6 2.2 1.5.7-1.1 1-.8 1.5 1.3 1 3.9 2.1 3.3 3.1-1.6.8-3.6 1.3-4.2 3.2-4 1.4.2 2.1-.1 1.7-.7-.3-.6 0-1 .8-1s1.8.8 2.2 1.7c.5 1.4.9 1.1 2.3-1.7l1.6-3.4 1.2 4.5 1.1 4.4.8-7.4c.6-6.3.9-7.2 2-5.8.6.9 1.5 1.4 1.8 1 .4-.3 1.3-.1 2.1.6 1.8 1.5 2.6-.5 2.6-6.7l.1-4.7 2.9 3.5 3 3.5-2.5-5.8c-3-6.9-3-7-.6-5.7 2.3 1.2 7.4 1.4 6.9.2-.2-.4-1.4-2.8-2.8-5.4-2.6-5.2-2.3-6.6 1.1-4.8 2.2 1.2 2.1 1.1-.5-3.5-1.5-2.6-3.2-6-3.7-7.7l-.8-3 2.1 1.8c1.2 1.1 3 2.8 4 3.9 2 2.2-2.9-9.7-6.2-15-2.2-3.6-8.2-19.7-11.6-31.3-3.3-11.4-8.7-21.9-14.8-29-2.8-3.3-6.8-8.1-9-10.7-5.8-7-17-13.5-25.9-15-4-.6-4.8-1.6-6.7-9-.5-2.2-1.4-4.6-1.8-5.3-1-1.4-19.6-6.2-25.9-6.7-4.2-.2-4.6 0-13.8 8.7zm-10 108 1.6 3.3-2.1-2.4c-1.1-1.3-2-2.7-2-3.2 0-1.8 1-.8 2.5 2.3zm-72 82.5c1.1 2 4.1 6.2 6.7 9.1 3 3.5 5 6.8 5.4 9.1.3 2 1 5.3 1.4 7.3.4 2.1.4 3.8 0 3.8s-3.8-5.5-7.5-12.3c-3.8-6.7-7.9-14.1-9.3-16.5-2.2-3.9-2.3-4.2-.5-4.2 1.1 0 2.6 1.5 3.8 3.7zm17.1 39.6 2.2 6.8-5-5.1c-4.8-4.9-5-5.2-3.3-7.1 1-1 1.4-1.9.9-1.9-.5 0-.2-.5.6-1 1-.6 1.6-.5 1.9.3.2.7 1.4 4.3 2.7 8z'
    );
    ctx.clip(path);

    await wait();
  };

  const testTransform = async (ctx: CanvasRenderingContext2D) => {
    const canvas = ctx.canvas;

    let deg = 0;
    const gradient = ctx.createLinearGradient(0, 0, 0, 100);
    gradient.addColorStop(0, 'green');
    gradient.addColorStop(1, 'blue');

    while (deg < 361) {
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((deg * Math.PI) / 180);
      ctx.fillStyle = gradient;
      ctx.fillRect(-50, -50, 100, 100);
      ctx.restore();
      deg += 1;
      await wait(10);
    }

    await wait();

    deg = Infinity;

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    await wait(10);
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(deg);
    ctx.fillRect(-50, -50, 100, 100);
    ctx.restore();
    await wait(10);
  };

  const testImage = async (ctx: CanvasRenderingContext2D) => {};
  const testCompositing = async (ctx: CanvasRenderingContext2D) => {};

  const tests = [
    /*{
      name: 'Shapes',
      run: testShapes,
    },*/
    /*{
      name: 'Text',
      run: testText,
    },*/
    /*{
      name: 'Gradients',
      run: testGradients,
    },*/
    {
      name: 'Clip',
      run: testClip,
    },
    {
      name: 'Transform',
      run: testTransform,
    },
    {
      name: 'Image',
      run: testImage,
    },
    {
      name: 'Compositing',
      run: testCompositing,
    },
  ];

  const pause = () => {
    paused.current = !paused.current;
    console.log('paused', paused.current);
    setIsPaused(paused.current);
  };

  const runTests = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsRunning(true);

    for (const test of tests) {
      setCurrentTest(test.name);
      await test.run(ctx);
      await wait();
      reset(ctx);
    }

    setCurrentTest(null);
    setIsRunning(false);
  };

  const currentTestName = `Current test: ${currentTest || 'none'}`;
  return (
    <section className={styles.canvasContainer}>
      <h1>Canvas features</h1>
      <div>
        <div className={styles.buttons}>
          <Button text="Run" onClick={runTests} disabled={isRunning} />
          <Button text={!isPaused ? 'Pause' : 'Resume'} disabled={!isRunning} onClick={pause} />
        </div>
        <span>{currentTestName}</span>
        <canvas ref={canvasRef} width="600" height="600"></canvas>
      </div>
    </section>
  );
};
