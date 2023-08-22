import { useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';
import { Button } from '@/app/components/Button/Button';
import {
  bg,
  complexEmojiTextNotoFont,
  complexEmojiText,
  drawHeart,
  drawShape,
  emojiText,
  fillRect,
  hieroglyphsText,
  mathText,
  regularText,
  reset,
  strokeRect,
  blnsText,
  largeEmojisText,
  canvasLinearGradient,
  canvasRadialGradient,
  canvasConicGradient,
  canvasClipPath,
  ctxRotate,
  ctxRotateInfinity,
  differentFormats,
  ctxImageData,
  canvasCompositing,
} from '@/app/pages/js-tests/components/TestCanvas/utils.canvas';
import classNames from 'classnames';
import { Section } from '@/app/components/Section/Section';

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

  const testShapes = async (ctx: CanvasRenderingContext2D) => {
    bg(ctx);

    fillRect(ctx);
    //await wait();
    bg(ctx);

    strokeRect(ctx);
    //await wait();
    bg(ctx);

    drawHeart(ctx);
    //await wait();
    bg(ctx);

    drawShape(ctx);
    await wait();
  };

  const testText = async (ctx: CanvasRenderingContext2D) => {
    bg(ctx);

    ctx.font = '24px monospace';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';

    regularText(ctx);
    await wait(2000);

    hieroglyphsText(ctx);
    await wait(2000);

    mathText(ctx);
    await wait(2000);

    emojiText(ctx);
    await wait(2000);

    await complexEmojiText(ctx, wait);
    await complexEmojiTextNotoFont(ctx, wait);
    await blnsText(ctx, wait);
    await largeEmojisText(ctx, wait);
  };

  const testGradients = async (ctx: CanvasRenderingContext2D) => {
    await canvasLinearGradient(ctx, wait);
    await wait(2000);

    await canvasRadialGradient(ctx, wait);
    await wait(2000);

    await canvasConicGradient(ctx, wait);
    await wait(2000);
  };

  const testClip = async (ctx: CanvasRenderingContext2D) => {
    await canvasClipPath(ctx);
    await wait(2000);
  };

  const testTransform = async (ctx: CanvasRenderingContext2D) => {
    await ctxRotate(ctx, wait);
    await wait();

    await ctxRotateInfinity(ctx, wait);
    await wait();
  };

  const testImage = async (ctx: CanvasRenderingContext2D) => {
    await differentFormats(ctx, wait);
    await ctxImageData(ctx, wait);
    await wait();
  };

  const testCompositing = async (ctx: CanvasRenderingContext2D) => {
    await canvasCompositing(ctx, wait);
    await wait();
  };

  const tests = [
    {
      name: 'Shapes',
      run: testShapes,
    },
    {
      name: 'Text',
      run: testText,
    },
    {
      name: 'Gradients',
      run: testGradients,
    },
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
    setIsPaused(paused.current);
  };

  const runTests = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
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

  const handleRunTest = (testName: string) => async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsRunning(true);
    setCurrentTest(testName);

    const test = tests.find((t) => t.name === testName);
    if (!test) {
      setIsRunning(false);
      return;
    }

    await test.run(ctx);
    await wait();
    reset(ctx);

    setCurrentTest(null);
    setIsRunning(false);
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    });

    resizeObserver.observe(canvasRef.current!);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const currentTestName = `Current test: ${currentTest || 'none'}`;

  return (
    <Section className={styles.canvasContainer} title="Canvas features">
      <div>
        <div className={styles.buttons}>
          <Button text="Run" onClick={runTests} disabled={isRunning} />
          <Button text={!isPaused ? 'Pause' : 'Resume'} disabled={!isRunning} onClick={pause} />
        </div>
        <span>{currentTestName}</span>
        <div className={styles.canvasWrapper}>
          <canvas ref={canvasRef} />
          <div className={styles.buttonsWrapper}>
            {tests.map((test) => {
              return (
                <Button
                  className={classNames(styles.testButton, {
                    [styles.currentTest]: currentTest === test.name,
                  })}
                  width={120}
                  key={test.name}
                  text={test.name}
                  onClick={handleRunTest(test.name)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
};
